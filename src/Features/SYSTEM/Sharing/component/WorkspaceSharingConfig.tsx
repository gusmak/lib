import { useEffect, useMemo, useState } from 'react';
import { isUndefined, includes, difference, find, map, isFunction, cloneDeep, size, every, isEmpty } from 'lodash';
import { Grid, Paper } from '@mui/material';
import Drawer, { CloseAction } from 'Commons/Components/ClassicDrawer';
import { useParams } from 'react-router';
import { SharingConfigParamType, WorkspaceExtension, type Configuration, type ParamConfiguration } from '../Types';
import { getDefaultValues } from '../Utils';
import { WorkspaceOptionsState } from '../Atoms';
import AddOrEditConfig from './AddOrEditConfig';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';

export type WorkspaceSharingConfigProps = {
    workspaces?: WorkspaceExtension[];
    filter?: string[];
    schema?: string[];
    parentFolderConfigurations?: ParamConfiguration[];
    workspaceSelectedId?: number;
    onChangeConfigurations: (config: { id: number | string; workspaceId: number; configurations: Configuration[] }) => void;
};

export default function WorkspaceSharingConfig(props: WorkspaceSharingConfigProps) {
    const { workspaces, filter, schema, workspaceSelectedId, onChangeConfigurations } = props;

    const { t } = useTranslation();
    const { configId } = useParams<'configId'>();
    const isCreate = isUndefined(configId);

    const [confirmExit, setConfirmExit] = useState(false);

    const [workspaceSelected, setWorkspaceSelected] = useState<number>(workspaceSelectedId || -1);
    const [workspaceOptions] = useAtom(WorkspaceOptionsState);

    const [configuration, setConfigurations] = useState<{
        filter: Configuration[];
        schema: Configuration[];
    }>({
        filter: [],
        schema: [],
    });

    useEffect(() => {
        if (configId) {
            /** Edit */
            const currentWorkspace = find(workspaces, (w) => {
                return `${w.id}` === `${configId}`;
            });

            if (!currentWorkspace) return;

            const currentWorkspaceByOption = find(workspaceOptions, (w) => {
                return `${w.id}` === `${currentWorkspace.targetWorkspaceId}`;
            });

            const pushedFilter: string[] = [];
            const pushedSchema: string[] = [];

            const crFilter = currentWorkspace?.sharingWorkspaceConfigs?.filter((i: any) => {
                if (i.paramType === SharingConfigParamType.Filter && includes(filter, i.paramName)) {
                    pushedFilter.push(i.paramName);
                    return true;
                }
                return false;
            });
            const crSchema = currentWorkspace?.sharingWorkspaceConfigs?.filter((i: any) => {
                if (i.paramType === SharingConfigParamType.Schema && includes(schema, i.paramName)) {
                    pushedSchema.push(i.paramName);
                    return true;
                }
                return false;
            });

            const restFilter = map(difference(filter, pushedFilter), (i) => ({
                id: Date.now(),
                paramName: i,
                paramValue: getDefaultValues(i, currentWorkspaceByOption),
                paramType: SharingConfigParamType.Filter,
            })) as Configuration[];

            const restSchema = map(difference(schema, pushedSchema), (i) => ({
                id: Date.now(),
                paramName: i,
                paramValue: undefined,
                paramType: SharingConfigParamType.Schema,
            })) as Configuration[];

            setConfigurations({
                filter: [...(crFilter || []), ...restFilter],
                schema: [...(crSchema || []), ...restSchema],
            });
        } else {
            const crFilter = map(filter, (i) => ({
                id: Date.now(),
                paramName: i,
                paramValue: undefined,
                paramType: SharingConfigParamType.Filter,
            })) as Configuration[];
            const crSchema = map(schema, (i) => ({
                id: Date.now(),
                paramName: i,
                paramValue: undefined,
                paramType: SharingConfigParamType.Schema,
            })) as Configuration[];

            setConfigurations({ filter: crFilter, schema: crSchema });
        }
    }, [workspaces, configId, filter, schema, workspaceOptions]);

    const choseWorkspace = useMemo(() => {
        if (isCreate) {
            const restWorkspaces = workspaceOptions?.filter((w) => {
                return !find(workspaces, (ws) => ws.targetWorkspaceId === w.id);
            });

            return map(restWorkspaces, (w) => ({
                id: w.id,
                name: w.name,
                customerId: w.customerId,
            }));
        }
        return map(workspaceOptions, (w) => ({
            id: w.id,
            customerId: w.customerId,
            name: w.name,
        }));
    }, [workspaces, isCreate, workspaceOptions]);

    const handleSubmit = () => {
        if (isCreate) {
            workspaceSelected !== -1 &&
                isFunction(onChangeConfigurations) &&
                onChangeConfigurations({
                    id: Date.now(),
                    workspaceId: workspaceSelected,
                    configurations: [
                        ...configuration.filter,
                        ...configuration.schema.filter((s) => s.paramValue !== undefined && s.paramValue !== '' && s.paramValue !== null),
                    ],
                });
        } else {
            const currentWorkspace = find(workspaces, (w) => {
                return `${w.id}` === `${configId}`;
            });

            isFunction(onChangeConfigurations) &&
                onChangeConfigurations({
                    id: configId,
                    workspaceId: currentWorkspace?.targetWorkspaceId || -1,
                    configurations: [
                        ...configuration.filter,
                        ...configuration.schema.filter((s) => s.paramValue !== undefined && s.paramValue !== '' && s.paramValue !== null),
                    ],
                });
        }

        return Promise.resolve(CloseAction.Close);
    };

    useEffect(() => {
        if (!workspaceSelected) return;

        const currentWorkspace = find(workspaceOptions, (w) => w.id === workspaceSelected);

        if (isCreate && currentWorkspace) {
            const crFilter = map(cloneDeep(configuration.filter), (i) => ({
                id: Date.now(),
                paramName: i.paramName,
                paramValue: getDefaultValues(i.paramName as string, currentWorkspace),
                paramType: SharingConfigParamType.Filter,
            })) as Configuration[];

            setConfigurations({
                schema: configuration.schema,
                filter: crFilter,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceSelected]);

    const handleChangeConfig = (config: ParamConfiguration[], type: `${SharingConfigParamType}`) => {
        setConfirmExit(true);

        if (type === SharingConfigParamType.Filter) {
            setConfigurations({
                ...configuration,
                filter: config,
            });
        }
        if (type === SharingConfigParamType.Schema) {
            setConfigurations({
                ...configuration,
                schema: config,
            });
        }
    };

    const handleChoseWorkspace = (workspaceId: number) => {
        setConfirmExit(true);
        setWorkspaceSelected(workspaceId);
    };

    const isFilterValid = useMemo(() => {
        return (
            size(configuration.filter) === 0 || (size(configuration.filter) && every(configuration.filter, (f) => !isEmpty(f.paramValue)))
        );
    }, [configuration.filter]);

    const readyForSubmit = useMemo(() => {
        return ((isCreate && workspaceSelected !== -1) || !isCreate) && isFilterValid;
    }, [isCreate, workspaceSelected, isFilterValid]);

    const editWorkspace = useMemo(() => {
        if (configId) {
            const s = find(workspaces, (w) => `${w.id}` === `${configId}`);

            if (s) return s.targetWorkspaceId;
        }
        return -1;
    }, [configId, workspaces]);

    return (
        <Drawer
            title={isCreate ? t('Common.Create') : t('Common.Edit')}
            onSubmit={handleSubmit}
            isLoadingButtonSubmit={true}
            disableButtonSubmit={!readyForSubmit || !confirmExit}
            childrenWrapperStyle={{ padding: 0 }}
            confirmExit={confirmExit}
        >
            <Grid container sx={{ flexGrow: 1, p: 3 }}>
                <Grid size={{ xs: 12 }} component={Paper}>
                    <AddOrEditConfig
                        configuration={configuration}
                        isCreate={isCreate}
                        workspaceOptions={choseWorkspace}
                        schema={schema}
                        selectedId={isCreate ? workspaceSelected : editWorkspace}
                        onChangeConfigurations={handleChangeConfig}
                        onChoseWorkspace={handleChoseWorkspace}
                    />
                </Grid>
            </Grid>
        </Drawer>
    );
}
