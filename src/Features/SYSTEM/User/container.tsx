import { Button } from '@mui/material';
import { get, isUndefined, map } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageManagement from 'AWING/PageManagement';
import { Constants } from 'Commons/Constant';
import { useAppHelper } from 'Context';
import { Link, useNavigate } from 'react-router';
import { SortEnumType } from 'Commons/Enums';
import { QueryInput } from 'Features/types';
import { useContextUser } from './context';
import { SortInputGroup, User } from './types';

function UserContainer() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const { confirm, snackbar } = useAppHelper();
    const { services, setRoleTagOptions, setGroupsTagOptions } = useContextUser();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

    const queryData = React.useCallback(
        (queryInput: QueryInput) => {
            let sorts: SortInputGroup[] = [];
            queryInput.sortModel?.forEach((model) => {
                sorts.push({
                    [model.field === 'id' ? 'userId' : model.field]:
                        model.sort === 'asc' ? SortEnumType.Asc : SortEnumType.Desc,
                });
            });
            if (services) {
                services
                    .getUsers({
                        where: {
                            or: [
                                {
                                    name: {
                                        contains: queryInput.searchString?.trim(),
                                    },
                                },
                                {
                                    username: {
                                        contains: queryInput.searchString?.trim(),
                                    },
                                },
                            ],
                        },
                        order: sorts,
                        skip:
                            queryInput.pageSize && queryInput.pageIndex
                                ? queryInput.pageSize * queryInput.pageIndex
                                : 0,
                        take: queryInput.pageSize ?? Constants.PAGE_SIZE_DEFAULT,
                    })
                    .then((data) => {
                        const items = data?.users;
                        setLoading(false);

                        /** Lấy tất cả RoleTag */
                        services.getRoleTags().then((data) => {
                            const dataRoleTags = data?.roleTags;
                            if (setRoleTagOptions && dataRoleTags && dataRoleTags.length) {
                                setRoleTagOptions(
                                    map(dataRoleTags, (i) => ({
                                        value: i?.id ?? -1,
                                        text: i?.name ?? '',
                                    }))
                                );
                            }
                        });

                        /** Lấy tất cả GroupsTag */
                        services.getGroups().then((data) => {
                            const dataGroupTags = data?.groups;
                            if (setGroupsTagOptions && dataGroupTags && dataGroupTags.length) {
                                setGroupsTagOptions(
                                    map(dataGroupTags, (i) => ({
                                        value: i?.id ?? -1,
                                        text: i?.name ?? '',
                                    }))
                                );
                            }
                        });

                        if (items) {
                            setUsers(items ?? []);
                            setTotalCount(data?.total ?? 0);
                        }
                    });
            }
        },
        [services?.getUsers, services?.getRoleTags]
    );

    const handleDeleteUser = async (id: number) => {
        if (!isUndefined(id) && services) {
            return await services.deleteUser({
                id,
            });
        }
    };

    const handleNavigate = () => window.open(`${window.REACT_APP_ID_DOMAIN}/organization`, '_blank');

    return (
        <PageManagement
            title={t('User.Title')}
            onChangeQueryInput={queryData}
            columns={[
                {
                    field: 'id',
                    headerName: 'ID',
                    sortable: true,
                    width: 200,
                },
                {
                    field: 'username',
                    headerName: t('User.Username'),
                    sortable: true,
                },
                {
                    field: 'name',
                    headerName: t('User.Name'),
                    TableCellProps: { sx: { wordBreak: 'break-word' } },
                },
                {
                    field: 'description',
                    headerName: t('UserGroup.Description'),
                    TableCellProps: { sx: { wordBreak: 'break-word' } },
                },
            ]}
            loading={loading}
            rows={users}
            totalOfRows={get(totalCount, 0)}
            onCreateButtonClick={handleNavigate}
            customActions={
                <Button
                    component={Link}
                    to={Constants.ADD_EXISTED_USER}
                    variant="outlined"
                    size="medium"
                    sx={{ marginLeft: '16px', fontWeight: 'bold' }}
                >
                    {t('User.AddExistedUser')}
                </Button>
            }
            confirmDelete={confirm}
            getRowId={(row) => row.id ?? 0}
            onDelete={(id) => handleDeleteUser(Number(id))}
            showNotificationSuccess={() => snackbar('success')}
            onRowClick={(id) => navigate(`${Constants.EDIT_PATH}/${id}`)}
        />
    );
}
export default UserContainer;
