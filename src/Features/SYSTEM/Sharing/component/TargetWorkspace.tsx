import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, Link, useNavigate } from 'react-router';
import { remove, cloneDeep, map, find, size } from 'lodash';
import { Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import { Button, IconButton, Tooltip } from '@mui/material';
import { Page, SearchBox, DataGrid, type SearchType, type GridSortModel } from 'AWING';
import { Constants as CommonConstants } from 'Commons/Constant';
import { Constants } from '../../constants';
import { WorkspaceOptionsState, WorkspacesState, confirmExitState } from '../Atoms';
import { workspaceCheckFilterValueConfigs } from '../Utils';
import WorkspaceSharingConfig from './WorkspaceSharingConfig';
import AllWorkspaceConfig from './AllWorkspaceConfig';
import { offlinePaginate } from 'Helpers/api';
import type { QueryInput } from 'Features/types';
import type { Configuration, ConfigurationParams, SharingWorkspace, SharingWorkspaceConfig, WorkspaceSharingInputForm } from '../Types';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

export type TargetWorkspaceProps = {
    configurationParams?: ConfigurationParams;
    filterParams?: string[];
    schemaParams?: string[];
    workspaces: SharingWorkspace[];
    workspaceSharing: WorkspaceSharingInputForm;
};

const ConfigCreatePath = `${Constants.WORKSPACE_SHARING_CONFIG_PATH}${Constants.CREATE_PATH}`;
const ConfigCreateAllPath = `${Constants.WORKSPACE_SHARING_CONFIG_PATH}${Constants.CREATE_ALL_PATH}`;
const ConfigEditPath = `${Constants.WORKSPACE_SHARING_CONFIG_PATH}${Constants.EDIT_PATH}`;

export default function TargetWorkspace(props: TargetWorkspaceProps) {
    const { filterParams, schemaParams, workspaceSharing } = props;
    const navigate = useNavigate();

    const { t } = useTranslation();
    const workspaceOptions = useAtomValue(WorkspaceOptionsState);
    const [workspaces, setWorkspaces] = useAtom(WorkspacesState);
    const setConfirmExit = useSetAtom(confirmExitState);

    const [sortModels, setSortModels] = useState<GridSortModel[]>([]);
    const [queryInput, setQueryInput] = useState<QueryInput>({
        pageIndex: 0,
        pageSize: CommonConstants.PAGE_SIZE_DEFAULT,
    });

    // State riêng để lưu trữ danh sách workspaces đã lọc tránh ảnh hưởng đến danh sách workspaces gốc
    const [filteredWorkspaces, setFilteredWorkspaces] = useState<SharingWorkspace[]>([]);

    useEffect(() => {
        const newWorkspaces = cloneDeep(props.workspaces) as SharingWorkspace[];

        setWorkspaces(newWorkspaces);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.workspaces]);

    const handleRowEdit = (id: string | number) => {
        // if (size(props?.configurationParams?.filter) || size(props?.configurationParams?.schema))
        navigate(`${ConfigEditPath}/${id}`);
    };

    const handleCreate = () => {
        navigate(`${ConfigCreatePath}`);
    };

    const handleAddAll = () => {
        navigate(`${ConfigCreateAllPath}`);
    };

    const handleDeleted = (id: number) => {
        setConfirmExit(true);
        setWorkspaces((prev) => {
            const newWorkspaces = cloneDeep(prev);
            remove(newWorkspaces, (w) => w.id === id);
            return newWorkspaces;
        });
    };

    /** Add or Edit workspace */
    const handleChangeConfigurations = (config: { id: number | string; workspaceId?: number; configurations: Configuration[] }) => {
        const newWorkspaces = cloneDeep(workspaces);

        const isExist = find(workspaces, (w) => `${w.id}` === `${config.id}`);

        if (isExist) {
            map(newWorkspaces, (w) => {
                if (`${w.id}` === `${config.id}`) {
                    w.sharingWorkspaceConfigs = config.configurations as SharingWorkspaceConfig[];
                }
            });
        } else {
            const newWorkspaceAdded = find(workspaceOptions, (w) => w.id === config.workspaceId);

            if (newWorkspaceAdded) {
                newWorkspaces.push({
                    __typename: 'SharingWorkspace',
                    id: 0 - Date.now(),
                    targetWorkspaceId: config.workspaceId,
                    targetWorkspace: {
                        id: newWorkspaceAdded.customerId,
                        name: newWorkspaceAdded.name,
                    } as unknown as SharingWorkspace['targetWorkspace'],
                    sharingWorkspaceConfigs: config.configurations as SharingWorkspace['sharingWorkspaceConfigs'],
                });
            }
        }

        setWorkspaces(newWorkspaces);
        navigate(`${ConfigEditPath}`);
    };

    /** Add multiple workspace */
    const handleChangeMultiConfigurations = (
        configs: {
            workspaceId: number;
            configurations: Configuration[];
        }[]
    ) => {
        const newWorkspaces = cloneDeep(workspaces);

        map(configs, (c) => {
            const newWorkspaceAdded = find(workspaceOptions, (w) => w.id === c.workspaceId);

            if (newWorkspaceAdded) {
                newWorkspaces.push({
                    __typename: 'SharingWorkspace',
                    id: Date.now(),
                    targetWorkspaceId: c.workspaceId,
                    targetWorkspace: {
                        id: newWorkspaceAdded.customerId,
                        name: newWorkspaceAdded.name,
                    } as unknown as SharingWorkspace['targetWorkspace'],
                    sharingWorkspaceConfigs: c.configurations as SharingWorkspace['sharingWorkspaceConfigs'],
                });
            }
        });

        setWorkspaces(newWorkspaces);
        navigate(`${ConfigEditPath}`);
    };

    // useEffect để filter dữ liệu theo từ khóa tìm kiếm từ queryInput.searchString
    useEffect(() => {
        if (queryInput.searchString) {
            //TODO: Check lại sau
            // const newWorkspaces = workspaces.filter((w) =>
            //     w.targetWorkspace?.name?.toLowerCase().includes((queryInput.searchString || '').toLowerCase())
            // )
            // setFilteredWorkspaces(newWorkspaces)
        } else {
            setFilteredWorkspaces(workspaces);
        }
    }, [queryInput, workspaces]);

    return (
        <>
            <Page
                caption={t('WorkspaceSharing.TargetWorkspaceTitle')}
                actions={
                    <>
                        <SearchBox
                            onSearch={function (_searchType: SearchType, searchString: string): void {
                                setQueryInput((prev) => ({
                                    ...prev,
                                    pageIndex: 0,
                                    pageSize: CommonConstants.PAGE_SIZE_DEFAULT,
                                    searchString,
                                }));
                            }}
                            placeholderInput={t('Common.SearchPlaceholder')}
                        />
                        <Button
                            data-testid="create-workspace"
                            disabled={
                                size(workspaceOptions) === size(workspaces) ||
                                (!workspaceSharing?.objectFilterId && !workspaceSharing?.schemaId)
                            }
                            component={Link}
                            variant="outlined"
                            color="secondary"
                            sx={(theme) => ({
                                backgroundColor: theme.palette.action.hover,
                                '&:hover': {
                                    backgroundColor: theme.palette.secondary.main,
                                    border: '1px solid lightgray',
                                },
                                color: theme.palette.text.primary,
                                border: '1px solid lightgray',
                                marginLeft: (theme) => theme.spacing(2),
                            })}
                            onClick={handleCreate}
                            to={ConfigCreatePath}
                        >
                            {t('WorkspaceSharing.Workspace.Create')}
                        </Button>
                        <Button
                            data-testid="add-all-workspace"
                            disabled={
                                size(workspaceOptions) === size(workspaces) ||
                                (!workspaceSharing?.objectFilterId && !workspaceSharing?.schemaId)
                            }
                            component={Link}
                            variant="outlined"
                            color="secondary"
                            sx={(theme) => ({
                                backgroundColor: theme.palette.action.hover,
                                '&:hover': {
                                    backgroundColor: theme.palette.secondary.main,
                                    border: '1px solid lightgray',
                                },
                                color: theme.palette.text.primary,
                                border: '1px solid lightgray',
                                marginLeft: (theme) => theme.spacing(2),
                            })}
                            onClick={handleAddAll}
                            to={ConfigCreateAllPath}
                        >
                            {t('WorkspaceSharing.Workspace.AddALL')}
                        </Button>
                    </>
                }
            >
                <DataGrid
                    columns={[
                        {
                            field: 'stt',
                            headerName: 'STT',
                            width: '100px',
                            valueGetter: (_row, _idx, stt) => stt,
                        },
                        {
                            field: 'targetWorkspace.name',
                            headerName: t('WorkspaceSharing.Label.Workspace'),
                            TableCellProps: {
                                sx: {
                                    wordBreak: 'break-word',
                                },
                            },
                            valueGetter: (row) => (
                                <span>
                                    {row.targetWorkspace?.name}
                                    {!workspaceCheckFilterValueConfigs([row]).check ? (
                                        <Tooltip title={t('WorkspaceSharing.Label.EmptyParamVale').toString()}>
                                            <IconButton
                                                size="small"
                                                color="warning"
                                                sx={{
                                                    padding: '0 15px',
                                                    height: '18px',
                                                }}
                                            >
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ) : null}
                                </span>
                            ),
                        },
                    ]}
                    rows={offlinePaginate(filteredWorkspaces, queryInput.pageIndex!, queryInput.pageSize!)}
                    sortModel={sortModels}
                    pageSize={queryInput.pageSize}
                    pageIndex={queryInput.pageIndex}
                    totalOfRows={size(filteredWorkspaces) || 0}
                    onSortModelChange={setSortModels}
                    getRowId={(row) => row.id}
                    onPageIndexChange={(pageIndex) => {
                        setQueryInput((prev) => ({ ...prev, pageIndex }));
                    }}
                    onPageSizeChange={(pageSize) => {
                        setQueryInput((prev) => ({
                            ...prev,
                            pageSize,
                            pageIndex: 0,
                        }));
                    }}
                    rowActions={[
                        {
                            icon: <DeleteIcon />,
                            tooltipTitle: t('Common.Delete'),
                            action: handleDeleted,
                        },
                    ]}
                    onRowClick={(id) => handleRowEdit(id)}
                />
            </Page>

            <Routes>
                <Route
                    key={ConfigEditPath + '/:configId'}
                    path={ConfigEditPath + '/:configId'}
                    element={
                        <WorkspaceSharingConfig
                            filter={filterParams}
                            schema={schemaParams}
                            workspaces={workspaces}
                            onChangeConfigurations={handleChangeConfigurations}
                        />
                    }
                />
                <Route
                    key={ConfigCreatePath}
                    path={ConfigCreatePath}
                    element={
                        <WorkspaceSharingConfig
                            filter={filterParams}
                            schema={schemaParams}
                            workspaces={workspaces}
                            onChangeConfigurations={handleChangeConfigurations}
                        />
                    }
                />
                <Route
                    key={ConfigCreateAllPath}
                    path={ConfigCreateAllPath}
                    element={
                        <AllWorkspaceConfig
                            filter={filterParams}
                            schema={schemaParams}
                            workspaces={workspaces}
                            onChangeMultiConfigurations={handleChangeMultiConfigurations}
                        />
                    }
                />
            </Routes>
        </>
    );
}
