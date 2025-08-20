import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Chip, Stack } from '@mui/material';
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useAppHelper } from 'Context';
import { PageManagement } from 'AWING';
import { Constants as CommonConstants } from 'Commons/Constant';
import { SortEnumType } from 'Commons/Enums';
import { type QueryInput } from 'Features/types';
import { Constants } from '../constants';
import { useGetContext } from './context';
import type { Role, SortInput } from './types';

function Container() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { confirm, snackbar } = useAppHelper();
    const { services, setRoleTagOptions } = useGetContext();

    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

    const queryData = useCallback(
        (queryInput: QueryInput) => {
            const sorts: SortInput[] = [];
            queryInput.sortModel?.forEach((model) => {
                const temp: SortInput = {
                    [model.field]: model.sort === 'asc' ? SortEnumType.Asc : SortEnumType.Desc,
                };
                sorts.push(temp);
            });

            /** Lấy danh sách Role theo điều kiện */
            if (services)
                services
                    .getRoles({
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
                        take: queryInput.pageSize ?? CommonConstants.PAGE_SIZE_DEFAULT,
                    })
                    .then((data) => {
                        const items = data?.roles;
                        setLoading(false);

                        if (items) {
                            setRoles(items ?? []);
                            setTotalCount(data.total);
                        }

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
                    });
        },
        [services?.getRoles, services?.getRoleTags]
    );

    const handleDeleteRow = async (id: number) => {
        if (services) {
            return await services.deleteRole({
                id,
            });
        }
    };

    return (
        <PageManagement
            title={t('Role.Title')}
            onChangeQueryInput={queryData}
            columns={[
                {
                    field: 'id',
                    headerName: 'ID',
                    sortable: true,
                    width: '30%',
                },
                {
                    field: 'name',
                    headerName: t('Role.Name'),
                    sortable: true,
                    width: '30%',
                },
                {
                    field: 'roleTagIds.name',
                    headerName: t('Role.RoleTags'),
                    TableCellProps: { sx: { wordBreak: 'break-word' } },
                    valueGetter: (params) => {
                        return (
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {params.roleTags?.map((i) => <Chip key={i.id} label={i?.name} />)}
                            </Stack>
                        );
                    },
                },
            ]}
            loading={loading}
            rows={roles}
            totalOfRows={totalCount}
            onCreateButtonClick={() => navigate(Constants.CREATE_PATH)}
            confirmDelete={confirm}
            getRowId={(row) => row?.id ?? ''}
            onDelete={(id) => handleDeleteRow(Number(id))}
            showNotificationSuccess={() => snackbar('success')}
            onRowClick={(id) => navigate(`${Constants.EDIT_PATH}/${id}`)}
        />
    );
}

export default Container;
