import { ChangeEvent, ReactNode, useState } from 'react';
import { isString, isUndefined, toString } from 'lodash';
import { useAtom, useAtomValue } from 'jotai';
import { KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { CircularProgress } from 'AWING';
import { initializeAtoms } from '../Atoms';
import NoDataTable from '../components/NoDataTable';
import Pagination from '../components/Pagination';
import { initPage, ParentGroupKeyRoot } from '../Constants';
import { getParentGroupKey } from '../utils';
import type { IPages, OnFilter, Row, RootFilter } from '../Types';

export type OwnProps<FieldName> = {
    row: Row;
    level: number;
    stt?: number;
    parentGroupKey?: number | string;
    onFilter?: OnFilter<FieldName>;
    onRowClick?: (row: Row) => void;
};

function RowAdvance<FieldName extends string>(props: OwnProps<FieldName>) {
    const { row, level = 0, stt, parentGroupKey, onFilter, onRowClick } = props;
    const atoms = initializeAtoms<FieldName>();

    /* Atom */
    const cells = useAtomValue(atoms.cells);
    const groupFields = useAtomValue(atoms.groupFields);
    const fieldNames = useAtomValue(atoms.fieldNames);
    const [rootFilters, setRootFilters] = useAtom(atoms.rootFilters);

    /* State */
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState<IPages>(initPage);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [children, setChildren] = useState<Record<string | 'groupKeyId', ReactNode>[]>([]);

    const handleToggle = async () => {
        setLoading(true);
        if (!open && isString(row.groupKeyId)) {
            let newFilters: RootFilter<FieldName>[] = [];
            if (parentGroupKey === ParentGroupKeyRoot) {
                /* Nếu level 0, trả về current row */
                newFilters = [{ key: groupFields[level], value: row.groupKeyId }];
            } else {
                /* Nếu level > 0, trả về current row và các parents của row */
                const currentRowFilter = { key: groupFields[level], value: row.groupKeyId, parentGroupKey };
                const allFilters = getParentGroupKey(rootFilters, currentRowFilter);
                newFilters = [...allFilters, currentRowFilter];
            }

            /** nếu chưa có trong mảng filter thì thêm vào */
            if (!rootFilters.find((r) => r.value === row.groupKeyId))
                setRootFilters([...rootFilters, { key: groupFields[level], value: row.groupKeyId }]);
            // Call api
            if (onFilter) {
                const crGroupFields = groupFields[level + 1];
                await onFilter(page, crGroupFields ?? '', newFilters)
                    .then((res) => {
                        setChildren(res.items);
                        setTotalCount(res.totalCount);
                        setLoading(false);
                    })
                    .catch(() => {
                        setChildren([]);
                        setTotalCount(0);
                        setLoading(false);
                    });
            }
        } else {
            setRootFilters(rootFilters.filter((o) => o.key !== groupFields[level]));
        }
        setOpen(!open);
    };

    const handleChangePage = (newPage: number) => {
        setPage({ ...page, pageIndex: newPage });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setPage({
            ...page,
            pageSize: parseInt(event.target.value),
            pageIndex: 0,
        });
    };

    const handleRowClick = () => {
        onRowClick && !!isUndefined(row.groupKeyId) && onRowClick(row);
    };

    return (
        <>
            <TableRow
                sx={{ '& > *': { borderBottom: 'unset', cursor: !isUndefined(row.groupKeyId) ? 'auto' : 'pointer' } }}
                onClick={handleRowClick}
            >
                <TableCell
                    className="stt-collapse"
                    align="right"
                    colSpan={level + 1}
                    sx={{ width: '1.5rem', paddingTop: '0.8rem', paddingBottom: '0.8rem' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {!isUndefined(row.groupKeyId) && isString(row.groupKeyId) && (
                            <IconButton
                                id={row.groupKeyId}
                                aria-label="expand row"
                                size="small"
                                onClick={handleToggle}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                }}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        )}
                        <Typography variant="subtitle2">{stt}</Typography>
                    </div>
                </TableCell>
                {cells.map((cell, index) => {
                    return fieldNames.includes(cell.fieldName) && !isUndefined(row[cell.fieldName]) ? (
                        <TableCell
                            key={index}
                            className={cell.fieldName}
                            sx={{
                                width: cell?.colWidth,
                                paddingTop: '0.8rem',
                                paddingBottom: '0.8rem',
                            }}
                            align={cell?.align || (cell?.isnumeric ? 'right' : 'left') || 'left'}
                        >
                            {row[cell.fieldName]}
                        </TableCell>
                    ) : null;
                })}
            </TableRow>
            {open ? (
                <>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {children?.length ? (
                                <>
                                    {children.map((childRow, index) => (
                                        <RowAdvance
                                            parentGroupKey={toString(row?.groupKeyId)}
                                            key={index}
                                            stt={page?.pageSize * page?.pageIndex + index + 1}
                                            level={level + 1}
                                            row={childRow}
                                            onRowClick={onRowClick}
                                        />
                                    ))}
                                </>
                            ) : (
                                <NoDataTable colSpan={cells.length + 1} />
                            )}

                            <Pagination
                                pageIndex={page?.pageIndex}
                                pageSize={page?.pageSize}
                                total={totalCount}
                                colSpan={cells.length + 1}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </>
            ) : null}
        </>
    );
}

export default RowAdvance;
