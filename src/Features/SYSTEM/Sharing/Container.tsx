import { PageManagement } from 'AWING';
import { useAppHelper } from 'Context';
import { QueryInput } from 'Features/types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Constants } from '../constants';
import { Sharing } from './Types';
import { Constants as CommonConstants } from 'Commons/Constant';
import { useAtomValue, useSetAtom } from 'jotai';
import { SchemaObjectDefinition } from '../Schema';
import { resetAllWorkspaceSharingState, WorkspaceOptionsState, WorkspaceSchemaOptionsState } from './Atoms';
import useSharingProps from './Context';
import { each, get, size } from 'lodash';
export default function SharingContainer() {
    const {
        getSharings,
        deleteWorkspaceSharing,
        getSchemas,
        getWorkspaces,
        getWorkspaceById,
        isLoading,
        currentWorkspaceState,
        ObjectTypeCodeObj,
    } = useSharingProps();
    const currentWorkspace = useAtomValue(currentWorkspaceState);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { confirm, snackbar } = useAppHelper();
    const resetWorkspaceSharingState = useSetAtom(resetAllWorkspaceSharingState);
    const setWorkspaceOptions = useSetAtom(WorkspaceOptionsState);
    const setSchemaOptions = useSetAtom(WorkspaceSchemaOptionsState);
    const [sharingPaging, setSharingPaging] = useState<{ sharings: Sharing[]; total: number }>({
        sharings: [],
        total: 0,
    });

    useEffect(() => {
        getWorkspaces().then((workspaces) => {
            if (workspaces) {
                setWorkspaceOptions(workspaces.filter((workspace) => workspace.id !== currentWorkspace?.id));
            }
        });
        getSchemas().then(async (schemas) => {
            if (schemas) {
                const newOptions = schemas.map((schema) => ({
                    id: schema.id,
                    name: schema.name,
                    objectTypeCode: schema.objectTypeCode,
                    schemaObjectDefinitions: schema.schemaObjectDefinitions,
                    workspaceId: get(schema, 'workspaceId', -1) as number,
                }));

                if (currentWorkspace?.id) {
                    await getWorkspaceById({ id: currentWorkspace.id }).then((workspace) => {
                        const tmpSchemas = workspace.defaultSchemas;
                        if (size(tmpSchemas)) {
                            each(tmpSchemas, (schema) => {
                                newOptions.push({
                                    id: schema!.id,
                                    name: schema!.name,
                                    schemaObjectDefinitions: schema!
                                        .schemaObjectDefinitions as SchemaObjectDefinition[],
                                    objectTypeCode: schema!.objectTypeCode,
                                    workspaceId: schema!.workspaceId ?? -1,
                                });
                            });
                        }
                    });
                }
                setSchemaOptions(newOptions);
            }
        });
    }, []);
    const queryData = useCallback((queryInput: QueryInput) => {
        getSharings({
            GetPagingInWorkspaceRequestGqlInput: {
                objectTypeCode: (queryInput.advancedObject as { objectTypeCode?: string })?.objectTypeCode,
                pageIndex: queryInput.pageIndex,
                pageSize: queryInput.pageSize ?? CommonConstants.PAGE_SIZE_DEFAULT,
                search: queryInput.searchString,
                workspaceId: currentWorkspace?.id,
            },
        }).then((data) => setSharingPaging(data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Delete workspace sharing */
    const handleDelete = async (id: string) => {
        await deleteWorkspaceSharing({ id: Number(id) });
    };

    return (
        <PageManagement
            title={t('WorkspaceSharing.Title')}
            onChangeQueryInput={queryData}
            advancedSearchFields={[
                {
                    fieldName: 'objectTypeCode',
                    label: t('WorkspaceSharing.Label.ObjectType'),
                    type: 'autocomplete',
                    options: ObjectTypeCodeObj.map((p) => ({
                        value: p.value,
                        text: p.value,
                    })),
                },
            ]}
            columns={[
                {
                    field: 'id',
                    headerName: 'ID',
                    width: '100px',
                },
                {
                    field: 'name',
                    headerName: t('WorkspaceSharing.Label.Name'),
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                },
                {
                    field: 'objectFilter.objectType',
                    headerName: t('WorkspaceSharing.Label.ObjectType'),
                    valueGetter: (row) => row?.objectFilter?.objectTypeCode || '',
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                },
                {
                    field: 'objectFilter.name',
                    headerName: t('WorkspaceSharing.Label.Filter'),
                    valueGetter: (row) => row?.objectFilter?.name || '',
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                },
                {
                    field: 'totalTargetWorkspace',
                    headerName: t('WorkspaceSharing.Label.Workspace'),
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                },
            ]}
            loading={isLoading}
            confirmDelete={confirm}
            getRowId={(row) => String(row!.id)}
            rows={sharingPaging.sharings || []}
            totalOfRows={sharingPaging.total}
            showNotificationSuccess={() => snackbar('success')}
            onRowClick={(id) => {
                resetWorkspaceSharingState();
                navigate(`${Constants.EDIT_PATH}/${id}`);
            }}
            onCreateButtonClick={() => navigate(`${Constants.CREATE_PATH}`)}
            onDelete={(id) => handleDelete(id.toString())}
        />
    );
}
