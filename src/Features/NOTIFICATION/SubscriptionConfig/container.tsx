import { PageManagement } from 'AWING';
import { Constants } from 'Commons/Constant';
import { SortEnumType } from 'Commons/Enums';
import { useAppHelper } from 'Context';
import { type QueryInput } from 'Features/types';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useGetContext } from './context';
import { SubscriptionConfigSortInput, SubscriptionConfigsType } from './types';
import { checkPermissionControl } from '../utils';

const SubscriptionConfigContainer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { confirm, snackbar } = useAppHelper();
    const [data, setData] = useState<SubscriptionConfigsType[]>();
    const [total, setTotal] = useState<number>();
    const [loading, setLoading] = useState<boolean>(true);
    const { services } = useGetContext();

    const queryData = useCallback(
        (queryInput: QueryInput) => {
            let sorts: SubscriptionConfigSortInput[] = [];
            queryInput.sortModel?.forEach((model) => {
                sorts.push({
                    [model.field]: model.sort === 'asc' ? SortEnumType.Asc : SortEnumType.Desc,
                });
            });
            if (sorts.length <= 0) sorts = [{ id: SortEnumType.Desc }];
            if (services) {
                services
                    ?.getSubscriptionConfigs({
                        where: {
                            name: { contains: queryInput.searchString?.trim() },
                        },
                        order: sorts,
                        skip:
                            queryInput.pageSize && queryInput.pageIndex
                                ? queryInput.pageSize * queryInput.pageIndex
                                : 0,
                        take: queryInput.pageSize ?? Constants.PAGE_SIZE_DEFAULT,
                    })
                    .then((data) => {
                        const items = data?.items;
                        setLoading(false);

                        if (items) {
                            setData(items);
                            setTotal(data?.total ?? 0);
                        }
                    });
            }
        },
        [services?.getSubscriptionConfigs]
    );

    const handleDelete = async (id: number) => {
        if (services && checkPermissionControl(data, id)) {
            return await services?.deleteSubscriptionConfig({ id });
        } else {
            return Promise.reject(snackbar('error', t('Notification.NotPermissionDelete')));
        }
    };

    return (
        <PageManagement
            title={t('SubscriptionConfig.Title')}
            onChangeQueryInput={queryData}
            loading={loading}
            columns={[
                {
                    field: 'id',
                    headerName: 'ID',
                    sortable: true,
                    width: '100px',
                },
                {
                    field: 'name',
                    headerName: t('SubscriptionConfig.Name'),
                    type: 'text',
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                },
                {
                    field: 'objectType',
                    headerName: t('SubscriptionConfig.ObjectType'),
                    type: 'text',
                    valueGetter: (row) => t(`ObjectType.${row.objectType}`),
                },
                {
                    field: 'scheduleType',
                    headerName: t('SubscriptionConfig.ScheduleType'),
                    valueGetter: (row) => t(`CronTab.Type.${row?.scheduleType ?? ''}`),
                    type: 'text',
                },
                {
                    field: 'scheduleSummary',
                    headerName: t('SubscriptionConfig.ScheduleSummary'),
                    type: 'text',
                },
                {
                    field: 'status',
                    headerName: t('SubscriptionConfig.Status.Title'),
                    valueGetter: (row) => t(`SubscriptionConfig.Status.${row?.status}`),
                    type: 'text',
                },
            ]}
            rows={data?.map((x) => x ?? {}) ?? []}
            totalOfRows={total ?? 0}
            getRowId={(row) => row.id ?? 0}
            onCreateButtonClick={() => navigate(`${Constants.CREATE_PATH}`)}
            onRowClick={(id) => navigate(`${Constants.EDIT_PATH}/${id}`)}
            onDelete={(id) => handleDelete(Number(id))}
            confirmDelete={confirm}
            showNotificationSuccess={() => snackbar('success')}
        />
    );
};
export default SubscriptionConfigContainer;
