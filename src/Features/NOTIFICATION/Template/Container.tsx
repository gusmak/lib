import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { PageManagement, QueryInput } from 'AWING';
import { Constants } from 'Commons/Constant';
import { SortEnumType } from 'Commons/Enums';
import { useAppHelper } from 'Context';
import { useGetContext } from './context';
import type { SortInput, Template } from './types';
import { checkPermissionControl } from '../utils';

export default function TemplateManagement() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { confirm, snackbar } = useAppHelper();
    const { services, objectTypeCodes } = useGetContext();

    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

    const queryData = useCallback(
        async (queryInput: QueryInput) => {
            let sorts: SortInput[] = [];
            queryInput.sortModel?.forEach((model) => {
                sorts.push({
                    [model.field]: model.sort === 'asc' ? SortEnumType.Asc : SortEnumType.Desc,
                });
            });
            if (sorts.length <= 0) sorts = [{ id: SortEnumType.Desc }];
            await services
                ?.getTemplates({
                    where: {
                        name: { contains: queryInput.searchString?.trim() },
                    },
                    order: sorts,
                    skip: queryInput.pageSize && queryInput.pageIndex ? queryInput.pageSize * queryInput.pageIndex : 0,
                    take: queryInput.pageSize ?? Constants.PAGE_SIZE_DEFAULT,
                })
                .then((res) => {
                    setTemplates(res.items);
                    setTotalCount(res.totalCount);
                    setLoading(false);
                });
        },
        [services?.getTemplates]
    );

    const handleDelete = async (id: number) => {
        if (services && checkPermissionControl(templates, id)) {
            return await services.deleteNotificationTemplate({ id });
        } else {
            return Promise.reject(snackbar('error', t('Notification.NotPermissionDelete')));
        }
    };

    return (
        <PageManagement
            title={t('Template.Title')}
            onChangeQueryInput={queryData}
            loading={loading}
            columns={[
                {
                    field: 'id',
                    headerName: 'ID',
                    width: '100px',
                },
                {
                    field: 'name',
                    headerName: t('Template.Label.Name'),
                    type: 'text',
                    TableCellProps: {
                        sx: {
                            wordBreak: 'break-word',
                        },
                    },
                },
                {
                    field: 'objectType',
                    headerName: t('Template.Label.ObjectType'),
                    type: 'text',
                    valueGetter: (row) => objectTypeCodes?.find((x) => x.value === row?.objectType)?.value,
                },
                {
                    field: 'channelType',
                    headerName: t('Template.Label.Channel'),
                    type: 'text',
                },
                {
                    field: 'contentType',
                    headerName: t('Template.Label.ContentType'),
                    type: 'text',
                },
                {
                    field: 'configType',
                    headerName: t('Template.Label.ConfigType'),
                    type: 'text',
                    valueGetter: (row) =>
                        row?.configType === 'OBJECT_AND_CHANGED'
                            ? t('ConfigTypeCode.OBJECT_AND_CHANGED')
                            : t('ConfigTypeCode.OBJECT_ONLY'),
                },
            ]}
            rows={templates}
            totalOfRows={totalCount}
            getRowId={(row) => row?.id ?? -1}
            onCreateButtonClick={() => navigate(`${Constants.CREATE_PATH}`)}
            onRowClick={(id) => navigate(`${Constants.EDIT_PATH}/${id}`)}
            onDelete={(id) => handleDelete(Number(id))}
            confirmDelete={confirm}
            showNotificationSuccess={() => snackbar('success')}
        />
    );
}
