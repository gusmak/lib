import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _, { isUndefined, map } from 'lodash';
import { Constants } from 'Commons/Constant';
import { useAppHelper } from 'Context';
import { useNavigate } from 'react-router';
import { PageManagement } from 'AWING';
import { SortEnumType } from 'Commons/Enums';
import { useContextGroup } from './context';
import { Group, SortInputGroup } from './types';
import { type QueryInput } from 'Features/types';

const UserGroupContainer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { confirm, snackbar } = useAppHelper();
    const { services, setRoleTagOptions } = useContextGroup();
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState<Group[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

    const queryData = useCallback(
        (queryInput: QueryInput) => {
            let sorts: SortInputGroup[] = [];

            queryInput.sortModel?.forEach((model) => {
                const temp: SortInputGroup = {
                    [model.field]: model.sort === 'asc' ? SortEnumType.Asc : SortEnumType.Desc,
                };
                sorts.push(temp);
            });

            if (services) {
                services
                    .getGroups({
                        where: {
                            ...(queryInput.searchString && {
                                or: [
                                    {
                                        name: {
                                            contains: queryInput.searchString.trim(),
                                        },
                                    },
                                    {
                                        description: {
                                            contains: queryInput.searchString,
                                        },
                                    },
                                ],
                            }),
                        },
                        order: sorts,
                        skip:
                            queryInput.pageSize && queryInput.pageIndex
                                ? queryInput.pageSize * queryInput.pageIndex
                                : 0,
                        take: queryInput.pageSize ?? Constants.PAGE_SIZE_DEFAULT,
                    })
                    .then((data) => {
                        const items = data?.groups;
                        setLoading(false);

                        /** Lấy tất cả RoleTag */
                        services.getRoleTags().then((data) => {
                            const items = data?.roleTags;
                            if (setRoleTagOptions && items && items.length) {
                                setRoleTagOptions(
                                    map(items, (i) => ({
                                        value: i?.id ?? -1,
                                        text: i?.name ?? '',
                                    }))
                                );
                            }
                        });
                        if (items) {
                            setGroups(items ?? []);
                            setTotalCount(data.total);
                        }
                    });
            }
        },
        [services?.getGroups, services?.getRoleTags]
    );

    const onUserGroupDelete = async (id: number) => {
        if (!isUndefined(id) && services) {
            return await services
                .deleteGroup({
                    id,
                })
                .then(() => snackbar('success'))
                .catch(() => snackbar('error'));
        }
    };

    return (
        <PageManagement
            title={t('UserGroup.Title')}
            onChangeQueryInput={queryData}
            confirmDelete={confirm}
            columns={[
                {
                    field: 'id',
                    headerName: 'ID',
                    sortable: true,
                    width: '100px',
                },
                {
                    field: 'name',
                    headerName: t('UserGroup.Name'),
                    sortable: true,
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                    valueGetter: (row) => {
                        return (
                            <>
                                {row?.isSystem && (
                                    <span
                                        style={{
                                            backgroundColor: '#c49f47',
                                            color: '#ffffff',
                                            fontSize: '13px',
                                            marginLeft: '4px',
                                            padding: '1px 4px',
                                            borderRadius: '2px',
                                        }}
                                    >
                                        System
                                    </span>
                                )}
                                <span style={{ marginLeft: '8px' }}>{row?.name}</span>
                            </>
                        );
                    },
                },
                {
                    field: 'description',
                    headerName: t('UserGroup.Description'),
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                },
                {
                    field: 'totalUser',
                    headerName: t('UserGroup.TotalUser'),
                    TableCellProps: {
                        align: 'right',
                    },
                    valueGetter: (row) => {
                        return row?.users?.length ?? 0;
                    },
                },
            ]}
            loading={loading}
            getRowId={(row) => row?.id ?? ''}
            onDelete={(id) => onUserGroupDelete(Number(id))}
            rows={groups}
            showNotificationSuccess={() => snackbar('success')}
            totalOfRows={totalCount}
            onCreateButtonClick={() => navigate(Constants.CREATE_PATH)}
            onRowClick={(id) => navigate(`${Constants.EDIT_PATH}/${id}`)}
        />
    );
};
export default UserGroupContainer;
