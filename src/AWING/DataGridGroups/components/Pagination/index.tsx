import { type MouseEvent, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell, TablePagination, TableRow } from '@mui/material';
import { TablePaginationActions } from 'AWING/Pagination';

export type PaginationProps = {
    total: number;
    pageSize: number;
    pageIndex: number;
    className?: string;
    colSpan?: number;
    classes?: Record<string, Object>;
    handleChangePage?: (page: number) => void;
    handleChangeRowsPerPage?: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
};

const EnhancedPagination = (props: PaginationProps) => {
    const { t } = useTranslation();
    const { total, pageSize, pageIndex, classes, className = '', colSpan, handleChangePage, handleChangeRowsPerPage } = props;

    return (
        <TableRow>
            <TableCell align="right" padding="none" colSpan={colSpan}>
                <TablePagination
                    className={`${classes?.root} ${className}`}
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={total}
                    rowsPerPage={pageSize}
                    page={pageIndex}
                    ActionsComponent={TablePaginationActions}
                    labelRowsPerPage={t('Paging.RowPerPage')}
                    onPageChange={(_e: MouseEvent | null, newPage: number) => handleChangePage && handleChangePage(newPage)}
                    onRowsPerPageChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                        handleChangeRowsPerPage && handleChangeRowsPerPage(e)
                    }
                    slotProps={{
                        select: {
                            inputProps: {
                                'aria-label': t('Paging.RowPerPage'),
                            },
                            native: true,
                        },
                    }}
                />
            </TableCell>
        </TableRow>
    );
};

export default EnhancedPagination;
