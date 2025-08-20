import { useCallback, useEffect, useState } from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { TabContext, TabPanel } from '@mui/lab';
import { Box, Paper, Tab, Tabs } from '@mui/material';
import { useParams } from 'react-router';
import { textValidation } from 'AWING/ultis/validation';
import CircularProgress from 'AWING/CircularProgress';
import ClassicDrawer from 'Commons/Components/ClassicDrawer';
import State from './component/State';
import Matrix from './component/Matrix';
import Information from './component/Information';
import { Workflow, WorkflowState, WorkflowMatrix, StateType } from './types';
import { ObjectInputType, ItemOfArrayInputType } from 'Features/types';

const TABS = {
    INFORMATION: '1',
    STATES: '2',
    MATRICES: '3',
};

type CreateOrEditProps = {
    getById: (id: number) => Promise<Workflow>;
    create: (workflow: ObjectInputType<Workflow>) => Promise<void>;
    update: (id: number, workflow: ObjectInputType<Workflow>) => Promise<void>;
    objectTypeCodeMap: { value: string; label: string }[];
};

const CreateOrEdit = (props: CreateOrEditProps) => {
    const { getById, create, update, objectTypeCodeMap } = props;

    const { t } = useTranslation();
    const { id } = useParams<'id'>();

    const [confirmExit, setConfirmExit] = useState(false);
    const [readyForSubmit, setReadyForSubmit] = useState(false);

    const [tabValue, setTabValue] = useState(TABS.INFORMATION);

    const [beforeMatrices, setBeforeMatrices] = useState<WorkflowMatrix[]>([]);
    const [beforeStates, setBeforeStates] = useState<WorkflowState[]>([]);

    const [workflowLoading, setWorkflowLoading] = useState(false);
    const [workflow, setWorkflow] = useState<StateType<Workflow>>({
        name: '',
        objectTypeCode: objectTypeCodeMap[0].value,
        stateFieldName: 'status',
        workflowMatrices: [],
        workflowStates: [],
    });

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const isCreate = id === undefined;
    const workflowId = !isCreate ? parseInt(id ?? '') : 0;

    useEffect(() => {
        if (!isCreate) {
            setWorkflowLoading(true);
            getById(workflowId).then((data) => {
                const w = _.cloneDeep(data);
                setBeforeMatrices(w?.workflowMatrices);
                setBeforeStates(w?.workflowStates);
                setWorkflow({
                    ...w,
                    workflowStates: convertWorkflowStates(w.workflowStates ?? []),
                });
                setWorkflowLoading(false);
            });
            setWorkflowLoading(false);
        }
    }, []);

    const getChilds = (workflowStates: WorkflowState[], state: WorkflowState) => {
        return workflowStates.filter((wState) => wState.level === (state.level ?? 0) + 1 && wState.parentId === state.id);
    };

    const addChilds = (workflowStates: WorkflowState[], state: WorkflowState) => {
        const result = state;
        const childs = getChilds(workflowStates, state);
        if (childs.length > 0) {
            const temp = childs.map((child) => addChilds(workflowStates, child));
            result.inverseParent = temp;
        }
        return result;
    };

    const convertWorkflowStates = (workflowStates: WorkflowState[]) => {
        if (workflowStates) {
            return workflowStates.filter((state) => state.level === 0).map((state) => addChilds(workflowStates, state));
        } else return workflowStates;
    };

    const checkValid = useCallback(
        (currentWorkflow: StateType<Workflow>) => {
            return (
                !!currentWorkflow.name &&
                textValidation(currentWorkflow.name, 200).valid &&
                (!currentWorkflow.description ||
                    currentWorkflow.description === '' ||
                    textValidation(currentWorkflow.description, 500).valid) &&
                !!currentWorkflow.objectTypeCode &&
                !!currentWorkflow.stateFieldName &&
                !!currentWorkflow.workflowStates &&
                currentWorkflow.workflowStates?.length > 0 &&
                !currentWorkflow.workflowStates.some(
                    (state) => state?.value === undefined || !state?.name || !textValidation(state?.name, 200).valid
                ) &&
                (isCreate || !currentWorkflow?.workflowMatrices?.find((matrix) => !matrix?.stateStart || !matrix?.stateEnd))
            );
        },
        [isCreate]
    );

    const handleUpdateFormValid = useCallback(
        (obj: StateType<Workflow>, _: boolean, key: string) => {
            !confirmExit && key && setConfirmExit(true);
            obj &&
                setWorkflow((oldData) => {
                    const data = { ...oldData, ...obj };
                    setReadyForSubmit(checkValid(data));
                    return {
                        ...data,
                    };
                });
        },
        [checkValid, confirmExit, isCreate]
    );

    const handleChangedStates = (workflowStates?: StateType<WorkflowState>[]) => {
        !confirmExit && setConfirmExit(true);
        setWorkflow((oldData) => {
            const newData = {
                ...oldData,
                workflowStates: workflowStates,
            };
            setReadyForSubmit(checkValid(newData));
            return newData;
        });
    };

    const handleChangedMatrices = (workflowMatrices?: StateType<WorkflowMatrix>[]) => {
        !confirmExit && setConfirmExit(true);
        setWorkflow((oldData) => {
            const newData = {
                ...oldData,
                workflowMatrices: workflowMatrices,
            };
            setReadyForSubmit(checkValid(newData));
            return newData;
        });
    };

    const handleSubmit = () => {
        setLoadingSubmit(true);
        let temp = convertWorkflow(isCreate, workflow);
        temp = convertToSubmit(temp, workflow);

        return (isCreate ? create({ ...temp }) : update(workflowId, { ...temp }))?.then(() => {
            setLoadingSubmit(false);
        });
    };

    const convertToSubmit = (workflowNew: ObjectInputType<Workflow>, workflowOld: StateType<Workflow>) => {
        const temp = Object.assign({}, workflowNew);
        temp.workflowMatrices =
            workflowOld.workflowMatrices?.map((matrix) => ({
                id: matrix.id,
                value: {
                    priority: Number(matrix.priority || 0),
                    stateStart: matrix.stateStart,
                    stateEnd: matrix.stateEnd,
                },
            })) ?? [];
        const deleteStates = beforeStates
            .filter((s) => !workflowNew.workflowStates?.find((t) => t.id === s.id))
            .map((d) => ({
                id: d.id,
            }));
        const deleteMatrices = beforeMatrices
            .filter((m) => !temp.workflowMatrices?.find((t) => t.id === m.id))
            .map((d) => ({
                id: d.id,
            }));
        temp.workflowStates = [...(temp.workflowStates ?? []), ...deleteStates];
        temp.workflowMatrices = [...temp.workflowMatrices, ...deleteMatrices];
        return temp;
    };

    return (
        <ClassicDrawer
            title={isCreate ? t('Workflow.Create') : t('Workflow.Edit')}
            onSubmit={handleSubmit}
            isLoadingButtonSubmit={loadingSubmit}
            confirmExit={confirmExit}
            childrenWrapperStyle={{ padding: 0 }}
            disableButtonSubmit={!(readyForSubmit && confirmExit)}
        >
            <Paper sx={{ m: 3 }}>
                {workflowLoading ? (
                    <CircularProgress />
                ) : (
                    <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={tabValue}
                                onChange={(_, newValue) => setTabValue(newValue)}
                                variant="scrollable"
                                scrollButtons
                                allowScrollButtonsMobile
                                aria-label="scrollable tabs"
                            >
                                <Tab label={t('Workflow.Tab.Information')} value={TABS.INFORMATION} />
                                <Tab label={t('Workflow.Tab.State')} value={TABS.STATES} />
                                {!isCreate && <Tab label={t('Workflow.Tab.Matrix')} value={TABS.MATRICES} />}
                            </Tabs>
                        </Box>
                        <TabPanel value={TABS.INFORMATION} sx={{ p: 0 }}>
                            <Information
                                formData={workflow}
                                onUpdateFormValid={handleUpdateFormValid}
                                objectTypeCodeMap={objectTypeCodeMap}
                            />
                        </TabPanel>
                        <TabPanel value={TABS.STATES} sx={{ p: 2 }}>
                            <State workflowStates={workflow.workflowStates ?? []} onChanged={handleChangedStates} />
                        </TabPanel>
                        {!isCreate && (
                            <TabPanel value={TABS.MATRICES} sx={{ p: 2 }}>
                                <Matrix
                                    workflowMatrices={workflow.workflowMatrices ?? []}
                                    selectableStates={beforeStates}
                                    onChanged={handleChangedMatrices}
                                />
                            </TabPanel>
                        )}
                    </TabContext>
                )}
            </Paper>
        </ClassicDrawer>
    );
};
export default CreateOrEdit;

export const convertWorkflow = (isCreate: boolean, workflow: StateType<Workflow>): ObjectInputType<Workflow> => {
    let { workflowMatrices, workflowStates, ...rest } = workflow;
    let temp: ObjectInputType<Workflow> = { ...rest };
    temp = _.omit(temp, ['id']);
    temp.workflowStates = reconvertWorkflowStates(isCreate, workflowStates ?? []);

    return temp;
};

const reconvertWorkflowStates = (isCreate: boolean, workflowStates: StateType<WorkflowState>[]): ItemOfArrayInputType<WorkflowState>[] => {
    if (!workflowStates) return [];
    const result: ItemOfArrayInputType<WorkflowState>[] = [];
    workflowStates.forEach((state: StateType<WorkflowState>) => {
        result.push(...getAllChilds(isCreate, state, ''));
    });
    return result;
};

const getAllChilds = (isCreate: boolean, state: StateType<WorkflowState>, parentId: string) => {
    let result: ItemOfArrayInputType<WorkflowState>[] = [];
    state.inverseParent?.forEach((child: StateType<WorkflowState>) => {
        const newState: ItemOfArrayInputType<WorkflowState> = {
            id: isCreate || !child.id ? `${parentId}${child.value}.` : child.id,
            value: {
                name: child.name,
                parentId: parentId,
                priority: Number(child.priority || 0),
                value: Number(child.value),
            },
        };
        result.push(newState);
        if (child.inverseParent) {
            result.push(...getAllChilds(isCreate, child, `${state.id}${child.value}.`));
        }
    });
    return result;
};
