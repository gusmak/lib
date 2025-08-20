import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Constants } from 'Commons/Constant';
import { SortEnumType } from 'Commons/Enums';
import { useAppHelper } from 'Context';
import { PageManagement, QueryInput } from 'AWING';
import { Workflow } from './types';
import { PagingQueryInput, PagingType, SortInputType } from 'Features/types';

type WorkflowContainerProps = {
    getPaging: (queryInput: PagingQueryInput<Workflow>) => Promise<PagingType<Workflow>>;
    remove: (id: number) => Promise<void>;
};

const WorkflowContainer = (props: WorkflowContainerProps) => {
    const { getPaging, remove } = props;

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { confirm, snackbar } = useAppHelper();

    const [loadingPaging, setLoadingPaging] = React.useState(false);
    const [workflowData, setWorkflowData] = React.useState<PagingType<Workflow>>();

    const queryData = React.useCallback(
        (queryInput: QueryInput) => {
            setLoadingPaging(true);
            let sorts: SortInputType<Workflow>[] = [];
            queryInput.sortModel?.forEach((model) => {
                sorts.push({
                    [model.field]: model.sort === 'asc' ? SortEnumType.Asc : SortEnumType.Desc,
                });
            });
            if (sorts.length <= 0) sorts = [{ name: SortEnumType.Asc }];
            getPaging({
                where: {
                    ...(queryInput.searchString && {
                        name: { contains: queryInput.searchString.trim() },
                    }),
                },
                order: sorts,
                skip: queryInput.pageSize && queryInput.pageIndex ? queryInput.pageSize * queryInput.pageIndex : 0,
                take: queryInput.pageSize ?? Constants.PAGE_SIZE_DEFAULT,
            })
                .then((data) => {
                    setLoadingPaging(false);
                    setWorkflowData(data);
                })
                .catch(() => {
                    setLoadingPaging(false);
                });
        },
        [getPaging]
    );

    const handleWorkflowDelete = async (id: number) => {
        await remove(id);
    };

    return (
        <PageManagement
            title={t('Workflow.Title')}
            onChangeQueryInput={queryData}
            columns={[
                {
                    field: 'id',
                    headerName: 'ID',
                    width: '100px',
                },
                {
                    field: 'name',
                    headerName: t('Workflow.Name'),
                    TableCellProps: {
                        sx: { wordBreak: 'break-word' },
                    },
                },
                {
                    field: 'objectTypeCode',
                    headerName: t('Workflow.ObjectTypeCode'),
                },
                {
                    field: 'stateFieldName',
                    headerName: t('Workflow.StateFieldName'),
                },
            ]}
            confirmDelete={confirm}
            loading={loadingPaging}
            getRowId={(row) => row.id}
            onDelete={(id) => handleWorkflowDelete(Number(id))}
            rows={workflowData?.items || []}
            totalOfRows={workflowData?.totalCount || 0}
            showNotificationSuccess={() => snackbar('success')}
            onCreateButtonClick={() => navigate(Constants.CREATE_PATH)}
            onRowClick={(id) => navigate(`${Constants.EDIT_PATH}/${id}`)}
        />
    );
};
export default WorkflowContainer;
