import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Chip, Stack } from '@mui/material';
import { includes } from 'lodash';
import { PageManagement } from 'AWING';
import { useAppHelper } from 'Context';
import { Constants as CommonConstants } from 'Commons/Constant';
import { SortEnumType } from 'Commons/Enums';
import { Constants } from '../constants';
import { useGetContext } from './context';
import type { RoleTag, SortInput } from './types';
import type { QueryInput } from 'Features/types';

const Container = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { confirm, snackbar } = useAppHelper();
    const { services, roleOptions, setRoleOptions } = useGetContext();
    /* State */
    const [loading, setLoading] = useState(true);
    const [roleTags, setRoleTags] = useState<RoleTag[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

    /** Query data table, with filter */
    const queryData = useCallback(
        (queryInput: QueryInput) => {
            let sorts: SortInput[] = [];
            queryInput.sortModel?.forEach((model) => {
                const temp: SortInput = {
                    [model.field]: model.sort === 'asc' ? SortEnumType.Asc : SortEnumType.Desc,
                };
                sorts.push(temp);
            });

            if (services)
                services
                    .getRoleTags({
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
                        const items = data?.roleTags;
                        setLoading(false);

                        if (items) {
                            setRoleTags(items);
                            setTotalCount(data.total);
                        }

                        /** Get all Role */
                        services.getRoles().then((data) => {
                            const items = data?.roles;
                            if (setRoleOptions && items && items.length) {
                                setRoleOptions(
                                    items.map((i) => ({
                                        value: i?.id ?? -1,
                                        text: i?.name ?? '',
                                        roleTagIds: i?.roleTags?.map((r) => r?.id ?? -1),
                                    }))
                                );
                            }
                        });
                    });
        },
        [services?.getRoleTags]
    );

    const handleDeleteRow = async (id: number) => {
        if (services)
            return await services.deleteRoleTag({
                id: id,
            });
    };

    return (
        <PageManagement
            title={t('RoleTag.Title')}
            onChangeQueryInput={queryData}
            columns={[
                {
                    field: 'id',
                    headerName: 'ID',
                    sortable: true,
                    width: '10%',
                },
                {
                    field: 'name',
                    headerName: t('RoleTag.Name'),
                    sortable: true,
                    width: '30%',
                },
                {
                    field: 'roles',
                    headerName: t('RoleTag.Roles'),
                    TableCellProps: { sx: { wordBreak: 'break-word' } },
                    valueGetter: (row) => {
                        return (
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {roleOptions
                                    ?.filter((r) => includes(r?.roleTagIds, row?.id))
                                    .map((i) => <Chip key={i.value} label={i.text} />)}
                            </Stack>
                        );
                    },
                },
            ]}
            loading={loading}
            rows={roleTags}
            totalOfRows={totalCount}
            onCreateButtonClick={() => navigate(Constants.CREATE_PATH)}
            confirmDelete={confirm}
            getRowId={(row) => row?.id ?? ''}
            onDelete={(id) => handleDeleteRow(Number(id))}
            showNotificationSuccess={() => snackbar('success')}
            onRowClick={(id) => navigate(`${Constants.EDIT_PATH}/${id}`)}
        />
    );
};

export default Container;
