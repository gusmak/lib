import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { each, cloneDeep, isFunction, every, flatMap, isEmpty, size, map, find } from 'lodash';
import { Grid, Paper } from '@mui/material';
import ClassicDrawer, { CloseAction } from 'Commons/Components/ClassicDrawer';
import { WorkspaceOptionsState } from '../Atoms';
import { SharingConfigParamType, type Configuration, type ParamConfiguration } from '../Types';
import AddOrEditConfig from './AddOrEditConfig';
import { getDefaultValues } from '../Utils';
import { useAtom } from 'jotai';

export type ConfigByID = {
    id: number;
    filter: Configuration[];
    schema: Configuration[];
};

type WorkspaceSharingConfigProps = {
    workspaces?: any;
    filter?: string[];
    schema?: string[];
    parentFolderConfigurations?: ParamConfiguration[];

    onChangeMultiConfigurations?: (
        configs: {
            workspaceId: number;
            configurations: Configuration[];
        }[]
    ) => void;
};

export default function AllWorkspaceConfig(props: WorkspaceSharingConfigProps) {
    const { workspaces, filter, schema, onChangeMultiConfigurations } = props;

    const { t } = useTranslation();

    const [confirmExit, setConfirmExit] = useState(false);

    const [workspacesSelected, setWorkspacesSelected] = useState<number[]>([]);
    const [workspaceOptions] = useAtom(WorkspaceOptionsState);

    const [configurationsByWorkspaceId, setConfigurationsByWorkspaceId] = useState<ConfigByID[]>([]);
    /** Computed all workpace */
    const choseWorkspace = useMemo(() => {
        const restWorkspaces = workspaceOptions.filter((w) => {
            return !find(workspaces, (ws) => ws.targetWorkspaceId === w.id);
        });

        const options = map(restWorkspaces, (w) => ({
            id: w.id,
            customerId: w.customerId,
            name: w.name,
        }));

        setWorkspacesSelected(map(options, (o) => o.id).filter((id) => id !== undefined));

        return options;
    }, []);

    useEffect(() => {
        const newConfigurations: ConfigByID[] = [];
        each(workspacesSelected, (id) => {
            const currentWorkspace = find(workspaceOptions, (w) => w.id === id);

            if (currentWorkspace) {
                const crFilter = map(cloneDeep(filter), (i) => ({
                    id: Date.now(),
                    paramName: i,
                    paramValue: getDefaultValues(i, currentWorkspace),
                    paramType: SharingConfigParamType.Filter,
                })) as Configuration[];

                const crSchema = map(schema, (i) => ({
                    id: Date.now(),
                    paramName: i,
                    paramValue: undefined,
                    paramType: SharingConfigParamType.Schema,
                })) as Configuration[];

                newConfigurations.push({
                    id: id,
                    filter: crFilter,
                    schema: crSchema,
                });
            }
        });

        setConfigurationsByWorkspaceId(newConfigurations);
    }, [workspaces, filter, schema, workspaceOptions]);

    const handleSubmit = () => {
        size(configurationsByWorkspaceId) &&
            isFunction(onChangeMultiConfigurations) &&
            onChangeMultiConfigurations(
                map(configurationsByWorkspaceId, (c) => {
                    return {
                        workspaceId: c.id,
                        configurations: [...c.filter, ...c.schema],
                    };
                })
            );

        return Promise.resolve(CloseAction.Close);
    };

    const isFilterValid = useMemo(() => {
        return size(filter) === 0 || (size(filter) && every(flatMap(configurationsByWorkspaceId, 'filter'), (f) => !isEmpty(f.paramValue)));
    }, [filter, configurationsByWorkspaceId]);

    const readyForSubmit = useMemo(() => {
        return size(workspacesSelected) && isFilterValid;
    }, [workspacesSelected, isFilterValid]);

    /** Change configuration */
    const handleChangeConfigurations = (id: number, config: ParamConfiguration[], type: `${SharingConfigParamType}`) => {
        setConfirmExit(true);
        const newConfigs = map(configurationsByWorkspaceId, (c) =>
            c.id === id
                ? {
                      ...c,
                      [type.toLowerCase()]: config,
                  }
                : c
        );
        setConfigurationsByWorkspaceId(newConfigs);
    };

    const handleClearWorkspace = (id: number) => {
        setConfirmExit(true);
        setWorkspacesSelected((prev) => prev.filter((w) => w !== id));
        setConfigurationsByWorkspaceId((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <ClassicDrawer
            title={t('WorkspaceSharing.Workspace.AddALL')}
            onSubmit={handleSubmit}
            isLoadingButtonSubmit={true}
            disableButtonSubmit={!readyForSubmit}
            childrenWrapperStyle={{ padding: 0 }}
            confirmExit={confirmExit}
        >
            <Grid container sx={{ flexGrow: 1, p: 3 }}>
                <Grid size={{ xs: 12 }} component={Paper}>
                    {map(workspacesSelected, (id) => {
                        const crConfig = find(configurationsByWorkspaceId, (f) => f.id === id);

                        return crConfig ? (
                            <AddOrEditConfig
                                configuration={crConfig}
                                isCreate={true}
                                workspaceOptions={choseWorkspace}
                                schema={schema}
                                selectedId={id}
                                onClearWorkspace={handleClearWorkspace}
                                onChangeConfigurations={(config: ParamConfiguration[], type: `${SharingConfigParamType}`) =>
                                    handleChangeConfigurations(id, config, type)
                                }
                            />
                        ) : null;
                    })}
                </Grid>
            </Grid>
        </ClassicDrawer>
    );
}
