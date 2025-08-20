import { PageManagement, type QueryInput } from 'AWING';
import { Constants as ConstantsBase } from 'Commons/Constant';
import { SortEnumType } from 'Commons/Enums';
import { useAppHelper } from 'Context';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { checkPermissionControl } from '../utils';
import { Constants } from './Constants';
import { useGetContext } from './context';
import type { ObjectFilter, SortInput } from './types';

const ObjectFilterContainer = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { confirm, snackbar } = useAppHelper();
    const { services } = useGetContext();

    const [loading, setLoading] = useState(true);
    const [objectFilters, setObjectFilters] = useState<ObjectFilter[]>([]);
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
            services
                ?.getObjectFilters({
                    where: {
                        name: { contains: queryInput.searchString?.trim() },
                    },
                    order: sorts,
                    skip: queryInput.pageSize && queryInput.pageIndex ? queryInput.pageSize * queryInput.pageIndex : 0,
                    take: queryInput.pageSize ?? ConstantsBase.PAGE_SIZE_DEFAULT,
                })
                .then((data) => {
                    setLoading(false);
                    setObjectFilters(data?.items);
                    setTotalCount(data?.totalCount ?? 0);
                });
        },
        [services?.getObjectFilters]
    );

    const handleDelete = async (id: number) => {
        if (services && checkPermissionControl(objectFilters, id)) {
            return await services.deleteObjectFilter({ id: id });
        } else {
            return Promise.reject(snackbar('error', t('Notification.NotPermissionDelete')));
        }
    };

    return (
        <PageManagement
            title={t('Filter.Title')}
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
                    headerName: t('Filter.Name'),
                    type: 'text',
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                },
                {
                    field: 'objectTypeCode',
                    headerName: t('Filter.ObjectType'),
                    type: 'text',
                    valueGetter: (row) => row.objectTypeCode,
                },
                {
                    field: 'configType',
                    headerName: t('Filter.ConfigType'),
                    type: 'text',
                    valueGetter: (row) =>
                        row.configType === 'OBJECT_AND_CHANGED'
                            ? t('NotificationConfig.ObjectAndChanged')
                            : t('NotificationConfig.ObjectOnly'),
                },
            ]}
            rows={objectFilters}
            totalOfRows={totalCount}
            getRowId={(row) => row?.id ?? ''}
            onCreateButtonClick={() => navigate(Constants.CREATE_PATH)}
            onRowClick={(id) => navigate(`${Constants.EDIT_PATH}/${id}`)}
            onDelete={(id) => handleDelete(Number(id))}
            confirmDelete={confirm}
            showNotificationSuccess={() => snackbar('success')}
        />
    );
};
export default ObjectFilterContainer;
