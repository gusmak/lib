import { useTranslation } from 'react-i18next';
import { Constants } from 'Commons/Constant';
import Pagination from '../Pagination';
import { DataGridProps } from './interface';
import TableDataGrid from './Table';

export function DataGrid<T>(props: DataGridProps<T>) {
    const { t } = useTranslation();
    const {
        rows,
        pageIndex = Constants.PAGE_INDEX_DEFAULT,
        pageSize = Constants.PAGE_SIZE_DEFAULT,
        totalOfRows = rows.length,
        rowsPerPageOptions = [10, 20, 30],
        onPageIndexChange,
        onPageSizeChange,
        ...propsDataGrid
    } = props;

    return (
        <>
            <TableDataGrid rows={rows} {...propsDataGrid} />
            {onPageIndexChange && onPageSizeChange && (
                <Pagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    colSpan={3}
                    count={totalOfRows}
                    rowsPerPage={pageSize}
                    page={pageIndex}
                    slotProps={{
                        select: {
                            native: true,
                        },
                    }}
                    labelRowsPerPage={t('Paging.RowPerPage')}
                    onPageChange={(_e, page) => onPageIndexChange(page)}
                    onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                />
            )}
        </>
    );
}

export default DataGrid;
export * from './interface';
