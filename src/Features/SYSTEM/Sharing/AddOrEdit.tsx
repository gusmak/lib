import { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    isUndefined,
    toNumber,
    isString,
    size,
    get,
    filter,
    flatMap,
    each,
    union,
    cloneDeep,
    isEmpty,
    isNil,
} from 'lodash';
import { Box, Grid, Paper, Tab, Tabs } from '@mui/material';
import { TabContext } from '@mui/lab';

import { CircularProgress } from 'AWING';
import ClassicDrawer from 'Commons/Components/ClassicDrawer';
import { useParams } from 'react-router';

import type { WorkspaceSharingInputForm, SharingWorkspace, SharingInput } from './Types';
import {
    getAllStringsBetweenBraces,
    getConfigCreating,
    isDisabledConfigTab,
    getDifferentWorkspace,
    workspaceCheckFilterValueConfigs,
    getWorkspacesConfigByFilter,
    isSchemaEmpty,
} from './Utils';
import { DEFAULT_WORKSPACE_SHARING } from './Enums';
import { WorkspaceSchemaOptionsState, WorkspacesState, WorkspaceOptionsState, confirmExitState } from './Atoms';
import TargetWorkspace from './component/TargetWorkspace';
import WorkspaceSharingInfomation from './component/WorkspaceSharingInformation';
import useSharingProps from './Context';
import { useAtom, useAtomValue } from 'jotai';
import { sortByDirectoryPath } from 'AWING/DirectoryTree/helper';

export default function Create() {
    const {
        getSharingById: getWorkspaceSharingById,
        createWorkspaceSharing,
        updateWorkspaceSharing,
        getObjectFilters,
        getDirectories,
        isSubmitLoading,
        isLoading,
        currentWorkspaceState,
    } = useSharingProps();

    const currentWorkspace = useAtomValue(currentWorkspaceState);
    const { t } = useTranslation();
    const { id } = useParams<'id'>();
    const isCreate = isUndefined(id);
    const workspaceSharingId = !isCreate ? toNumber(id) : -1;

    const [schemas] = useAtom(WorkspaceSchemaOptionsState);
    const [workspaces, setWorkspaces] = useAtom(WorkspacesState);
    const [workspaceOptions] = useAtom(WorkspaceOptionsState);
    const [confirmExit, setConfirmExit] = useAtom(confirmExitState);

    const [tabValue, setTabValue] = useState('1');

    const [objectFilters, setObjectFilters] = useState<any[]>([]);

    const [filterParams, setFilterParams] = useState<string[]>([]);
    const [schemaParams, setSchemaParams] = useState<string[]>([]);

    const [workspaceSharing, setWorkspaceSharing] = useState<WorkspaceSharingInputForm>({});

    const [workspaceSharingInit, setWorkspaceSharingInit] =
        useState<WorkspaceSharingInputForm>(DEFAULT_WORKSPACE_SHARING);
    const [ownWorkspaces, setOwnWorkspaces] = useState<SharingWorkspace[]>([]);

    const [directoriesOptions, setDirectoriesOptions] = useState<
        {
            value: number;
            text: string;
            level: number;
        }[]
    >([]);

    const handleUpdateFormValid = useCallback(
        (obj: WorkspaceSharingInputForm, _formValid: boolean, key: string) => {
            !confirmExit && key && setConfirmExit(true);
            const currentSchemaId = obj.schemaId as string | number;

            obj &&
                setWorkspaceSharing((oldData) => {
                    let data = {};

                    if (currentSchemaId) {
                        data = {
                            ...oldData,
                            ...obj,
                            schemaId: currentSchemaId !== '' ? (currentSchemaId as number) : null,
                        };
                    } else {
                        data = {
                            ...oldData,
                            ...obj,
                        };
                    }

                    return {
                        ...data,
                    };
                });
        },
        [confirmExit]
    );

    const handleSubmit = async () => {
        if (isCreate) {
            const createResult: SharingInput = {
                name: workspaceSharing.name,
                key: workspaceSharing.key,
                folderSourceDirectoryId: workspaceSharing.folderSourceDirectoryId,
                objectFilterId: Number(workspaceSharing.objectFilterId),
                sharingWorkspaces: getConfigCreating(workspaces),
                schemaId:
                    (isString(workspaceSharing.schemaId) && workspaceSharing.schemaId === '') ||
                    isUndefined(workspaceSharing.schemaId)
                        ? undefined
                        : toNumber(workspaceSharing.schemaId),
            };

            return await createWorkspaceSharing({ input: createResult }).then(() => {
                setWorkspaces([]);
            });
        } else {
            const getInputUpdateWorkspaceSharing = (): SharingInput => {
                const getChangeField = (oldValue: any, newValue: any, key: string) =>
                    oldValue !== newValue
                        ? {
                              [key]: isSchemaEmpty(newValue) ? null : newValue,
                          }
                        : {};

                return {
                    ...getChangeField(workspaceSharingInit.name, workspaceSharing.name, 'name'),
                    ...getChangeField(
                        workspaceSharingInit.objectFilterId,
                        workspaceSharing.objectFilterId,
                        'objectFilterId'
                    ),
                    ...getChangeField(workspaceSharingInit.schemaId, workspaceSharing.schemaId, 'schemaId'),
                    ...getChangeField(workspaceSharingInit.key, workspaceSharing.key, 'key'),
                    ...getChangeField(
                        workspaceSharingInit.folderSourceDirectoryId,
                        workspaceSharing.folderSourceDirectoryId,
                        'folderSourceDirectoryId'
                    ),
                    sharingWorkspaces: getDifferentWorkspace(ownWorkspaces, workspaces),
                };
            };

            return await updateWorkspaceSharing({
                input: getInputUpdateWorkspaceSharing(),
                id: Number(workspaceSharingId),
            }).then(() => {
                setWorkspaces([]);
            });
        }
    };

    useEffect(() => {
        getObjectFilters().then((objectFilters) => {
            setObjectFilters(objectFilters || []);
        });
        getDirectories({
            where: {
                isFile: { eq: false },
            },
            workspaceId: currentWorkspace?.id,
        }).then((directories) => {
            const directoriesSorted = sortByDirectoryPath(directories.items || []);
            const directoriesOptions = directoriesSorted
                .map((item) => ({
                    value: item.id ?? 0,
                    text: item.name ?? '',
                    level: item.level ?? 0,
                }))
                .filter((item) => item.value !== currentWorkspace?.id);
            setDirectoriesOptions(directoriesOptions);
        });
    }, []);

    useEffect(() => {
        /** Get filter params */
        if (objectFilters) {
            const objectFilter = objectFilters.find((item) => item.id === workspaceSharing.objectFilterId);

            if (size(objectFilter)) {
                const filterParams: string[] = getAllStringsBetweenBraces(get(objectFilter, 'logicalExpression', ''));

                setFilterParams(filterParams);
            }
        }
    }, [objectFilters, workspaceSharing.objectFilterId]);

    useEffect(() => {
        /** Get schema params */
        if (schemas && size(schemas)) {
            const objectSchema = filter(schemas, (item) => get(item, 'id', undefined) === workspaceSharing.schemaId);

            const schemaDetails = flatMap(objectSchema, (i) => i.schemaObjectDefinitions);

            let params: string[] = [];

            each(schemaDetails, (i) => {
                if (i?.objectDefinition) {
                    const filterParams: string[] = getAllStringsBetweenBraces(get(i, 'objectDefinition.fieldPath', ''));

                    params = union(params, filterParams);
                }
            });

            setSchemaParams(params);
        }
    }, [schemas, workspaceSharing.schemaId]);

    useEffect(() => {
        /** Lấy thông tin của WorkspaceSharing cần sửa theo id */
        if (!isCreate) {
            getWorkspaceSharingById({ id: workspaceSharingId }).then((sharing) => {
                const w = cloneDeep(sharing);
                setOwnWorkspaces(get(w, 'sharingWorkspaces', []) as SharingWorkspace[]);
                setWorkspaceSharing({
                    id: w?.id,
                    name: w?.name,
                    objectTypeCode: w?.objectFilter?.objectTypeCode ?? '',
                    objectFilterId: w?.objectFilterId,
                    schemaId: w?.schemaId,
                    key: w?.key,
                    folderSourceDirectoryId: w?.folderSourceDirectoryId,
                });
                setWorkspaceSharingInit({
                    name: w?.name,
                    objectTypeCode: w?.objectFilter?.objectTypeCode ?? '',
                    objectFilterId: w?.objectFilterId,
                    schemaId: w?.schemaId,
                    key: w?.key,
                    folderSourceDirectoryId: w?.folderSourceDirectoryId,
                });
            });
        }
    }, []);

    const checkValidSubmit = useMemo(() => {
        if (id && Number(id) < 100) {
            return false;
        }

        const getChangeField = (oldValue: any, newValue: any) => (oldValue !== newValue ? true : false);

        let checkV = false;

        if (isCreate) {
            checkV =
                workspaceSharing?.objectTypeCode !== undefined &&
                workspaceSharing?.objectFilterId !== undefined &&
                !isEmpty(workspaceSharing.name) &&
                !isEmpty(workspaceSharing.key) &&
                !isNil(workspaceSharing.folderSourceDirectoryId);
        } else {
            checkV =
                getChangeField(workspaceSharingInit.name, workspaceSharing.name) ||
                getChangeField(workspaceSharingInit.objectFilterId, workspaceSharing.objectFilterId) ||
                getChangeField(workspaceSharingInit.schemaId, workspaceSharing.schemaId) ||
                getChangeField(workspaceSharingInit.key, workspaceSharing.key) ||
                getChangeField(
                    workspaceSharingInit.folderSourceDirectoryId,
                    workspaceSharing.folderSourceDirectoryId
                ) ||
                !!(ownWorkspaces.length !== workspaces.length) ||
                (confirmExit && !!getDifferentWorkspace(ownWorkspaces, workspaces).length);
        }

        return size(workspaces) && checkV && workspaceCheckFilterValueConfigs(workspaces as SharingWorkspace[]).check;
    }, [workspaceSharing, workspaces, ownWorkspaces]);

    const countConfigEmpty = useMemo(() => {
        return workspaceCheckFilterValueConfigs(workspaces as SharingWorkspace[]).count;
    }, [workspaces]);

    useEffect(() => {
        /** When filterParams changed */
        const currentWorkspaces = getWorkspacesConfigByFilter(workspaces, workspaceOptions, filterParams);

        setWorkspaces(currentWorkspaces as SharingWorkspace[]);
    }, [filterParams]);

    const handleCloseDrawer = () => {
        setWorkspaces([]);
    };

    return (
        <ClassicDrawer
            title={isCreate ? t('WorkspaceSharing.Label.Create') : t('WorkspaceSharing.Label.Edit')}
            onSubmit={handleSubmit}
            isLoadingButtonSubmit={isSubmitLoading}
            disableButtonSubmit={!checkValidSubmit}
            childrenWrapperStyle={{ padding: 0 }}
            confirmExit={confirmExit}
            onClose={handleCloseDrawer}
        >
            <Grid container sx={{ flexGrow: 1, p: 3 }}>
                <Grid size={{ xs: 12 }} component={Paper}>
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
                                <Tab
                                    value="1"
                                    label={t('WorkspaceSharing.Tab.Information')}
                                    style={{ fontWeight: 'bold' }}
                                />
                                <Tab
                                    value="2"
                                    label={`${t('WorkspaceSharing.Tab.Config')}${countConfigEmpty === 0 ? '' : ' (' + countConfigEmpty + '*)'}`}
                                    style={{ fontWeight: 'bold' }}
                                    disabled={isDisabledConfigTab(workspaceSharing)}
                                />
                            </Tabs>
                        </Box>

                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <div
                                    style={{
                                        display: tabValue === '1' ? 'block' : 'none',
                                    }}
                                >
                                    <WorkspaceSharingInfomation
                                        formData={workspaceSharing}
                                        onUpdateFormInfomation={handleUpdateFormValid}
                                        isCreate={isCreate}
                                        isSchemaRequired={false}
                                        objectFilters={objectFilters}
                                        directoriesOptions={directoriesOptions}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: tabValue === '2' ? 'block' : 'none',
                                        padding: '0 20px',
                                    }}
                                >
                                    <TargetWorkspace
                                        filterParams={filterParams}
                                        schemaParams={schemaParams}
                                        workspaceSharing={workspaceSharing}
                                        workspaces={ownWorkspaces}
                                    />
                                </div>
                            </>
                        )}
                    </TabContext>
                </Grid>
            </Grid>
        </ClassicDrawer>
    );
}
