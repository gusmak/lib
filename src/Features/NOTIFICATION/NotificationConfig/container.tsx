import { PageManagement } from 'AWING';
import { Constants } from 'Commons/Constant';
import { SortEnumType } from 'Commons/Enums';
import { useAppHelper } from 'Context';
import { type QueryInput } from 'Features/types';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useGetContext } from './context';
import { NotificationConfigType, SortInput } from './types';
import { checkPermissionControl } from '../utils';

function NotificationConfigContainer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { confirm, snackbar } = useAppHelper();
    const { services } = useGetContext();
    const [notificationConfigs, setNotificationConfigs] = useState<NotificationConfigType[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState<number>(0);

    const queryData = useCallback(
        (queryInput: QueryInput) => {
            let sorts: SortInput[] = [];
            queryInput.sortModel?.forEach((model) => {
                sorts.push({
                    [model.field]: model.sort === 'asc' ? SortEnumType.Asc : SortEnumType.Desc,
                });
            });
            if (sorts.length <= 0) sorts = [{ id: SortEnumType.Desc }];

            if (services) {
                services
                    ?.getNotificationConfigs({
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
                            setNotificationConfigs(items);
                            setTotalCount(data?.total ?? 0);
                        }
                    });
            }
        },
        [services?.getNotificationConfigs]
    );

    const handleDelete = async (id: number) => {
        if (services && checkPermissionControl(notificationConfigs, id)) {
            return await services?.deleteNotificationConfig({ id });
        } else {
            return Promise.reject(snackbar('error', t('Notification.NotPermissionDelete')));
        }
    };

    return (
        <PageManagement
            title={t('NotificationConfig.Title')}
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
                    headerName: t('NotificationConfig.Name'),
                    type: 'text',
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                },
                //Todo: Sau khi sửa API xong sẻ chuyển objectType sang BaseObjectType
                {
                    field: 'baseObjectType',
                    headerName: t('NotificationConfig.ObjectType'),
                    type: 'text',
                    valueGetter: (row) => t(`ObjectType.${row.baseObjectType}`),
                },
                {
                    field: 'transactionType',
                    headerName: t('NotificationConfig.Type'),
                    type: 'text',
                    valueGetter: (row) => t(`NotificationConfig.${row.transactionType}`),
                },
                {
                    field: 'status',
                    headerName: t('NotificationConfig.Status.Title'),
                    valueGetter: (row) => t(`NotificationConfig.Status.${row.status}`),
                    type: 'text',
                },
            ]}
            rows={notificationConfigs ?? []}
            totalOfRows={totalCount}
            getRowId={(row) => row.id ?? ''}
            onCreateButtonClick={() => navigate(`${Constants.CREATE_PATH}`)}
            onRowClick={(id) => navigate(`${Constants.EDIT_PATH}/${id}`)}
            onDelete={(id) => handleDelete(Number(id))}
            confirmDelete={confirm}
            showNotificationSuccess={() => snackbar('success')}
        />
    );
}
export default NotificationConfigContainer;
