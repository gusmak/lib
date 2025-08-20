import { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { UnfoldMore as UnfoldMoreIcon, North as NorthIcon, South as SouthIcon } from '@mui/icons-material';
import { TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Paper } from '@mui/material';
import { DataGridSortType } from 'Commons/Enums';
import { initializeAtoms } from '../Atoms';
import { DATA_TRANSFER_DRAG_DROP, ParentGroupKeyRoot } from '../Constants';
import NoDataTable from '../components/NoDataTable';
import Pagination from '../components/Pagination';
import RowAdvance from './RowAdvance';
import type { Cell, OnFilter, Row } from '../Types';

export type TableContainerProps<FieldName> = {
    rows: Row[];
    totalCount: number;
    onFilter?: OnFilter<FieldName>;
    onRowClick?: (row: Row) => void;
};

function Container<FieldName extends string>(props: TableContainerProps<FieldName>) {
    const atoms = initializeAtoms<FieldName>();
    const { rows, totalCount, onFilter, onRowClick } = props;
    /* Atom */
    const cells = useAtomValue(atoms.cells);
    const [pageList, setPageList] = useAtom(atoms.pageList);
    const [groupFields, setGroupFields] = useAtom(atoms.groupFields);
    const setDragging = useSetAtom(atoms.dragging);

    /* State */
    const [hovered, setHovered] = useState<boolean>(false);
    const [sortType, setSortType] = useState<{ [key: string]: DataGridSortType }>({});

    useEffect(() => {
        const newObject = Object.create({});
        cells.forEach((cell) => {
            if (cell.onSort) newObject[cell.fieldName] = DataGridSortType.Ready;
        });
        setSortType(newObject);
    }, [cells]);

    const handleDragStart = (e: DragEvent<HTMLTableCellElement>) => {
        const headerId = e.currentTarget.id;
        const match = cells.findIndex((cell) => cell.fieldName === headerId && !cell.draggable);

        if (match !== -1) {
            e.preventDefault();
            return;
        }
        setDragging(true);
        e.dataTransfer?.setData(DATA_TRANSFER_DRAG_DROP, headerId);
    };

    const handleDragOver = (e: DragEvent<HTMLTableCellElement>) => {
        e.preventDefault();
    };

    const handleOnDrop = (e: DragEvent<HTMLTableCellElement>) => {
        e.preventDefault();
        setDragging(false);
        const dragNodeId = e.dataTransfer?.getData(DATA_TRANSFER_DRAG_DROP);

        setGroupFields(groupFields.filter((o) => o !== dragNodeId));
    };

    const handleChangePage = (newPage: number) => {
        setPageList({ ...pageList, pageIndex: newPage });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setPageList({
            ...pageList,
            pageSize: parseInt(event.target.value),
            pageIndex: 0,
        });
    };

    const handleCellClick = (cell: Cell<FieldName>) => {
        if (cell?.onSort) {
            let newSort = sortType[cell.fieldName];
            switch (sortType[cell.fieldName]) {
                case DataGridSortType.Asc:
                    newSort = DataGridSortType.Desc;
                    break;
                case DataGridSortType.Desc:
                    newSort = DataGridSortType.Ready;
                    break;
                case DataGridSortType.Ready:
                    newSort = DataGridSortType.Asc;
                    break;
            }

            const newObject = Object.create({});
            cells.forEach((c) => {
                if (c.onSort) {
                    if (c.fieldName !== cell.fieldName) newObject[cell.fieldName] = DataGridSortType.Ready;
                    else newObject[cell.fieldName] = newSort;
                }
            });
            setSortType(newObject);
            cell.onSort(cell.fieldName, newSort);
        }
    };

    return (
        <TableContainer component={Paper} sx={{ marginTop: '1rem', boxShadow: 'none' }}>
            <Table aria-label="Table-advance">
                <TableHead>
                    <TableRow>
                        <TableCell
                            key="stt-collapse"
                            className="stt-collapse"
                            sx={{ width: '25px', paddingTop: '0.8rem', paddingBottom: '0.8rem' }}
                        >
                            <span
                                style={{
                                    display: 'flex',
                                    justifyContent: 'right',
                                }}
                            >
                                <UnfoldMoreIcon /> #
                            </span>
                        </TableCell>
                        {cells.map((cell, index) => {
                            return (
                                <TableCell
                                    id={cell?.fieldName}
                                    key={cell?.fieldName ?? index}
                                    draggable
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleOnDrop}
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    className={cell?.fieldName}
                                    sx={{ width: cell?.colWidth, cursor: 'pointer', paddingTop: '0.8rem', paddingBottom: '0.8rem' }}
                                    onClick={() => handleCellClick(cell)}
                                    align={cell?.align || (cell?.isnumeric ? 'right' : 'left') || 'left'}
                                >
                                    {!!cell?.onSort && (
                                        <>
                                            <span style={{ opacity: sortType[cell.fieldName] === DataGridSortType.Ready ? 0.2 : 0 }}>
                                                {sortType[cell.fieldName] === DataGridSortType.Ready && (
                                                    <NorthIcon
                                                        sx={{
                                                            fontSize: '0.8rem',
                                                        }}
                                                    />
                                                )}
                                            </span>
                                            <span
                                                style={{
                                                    opacity: sortType[cell.fieldName] !== DataGridSortType.Ready && hovered ? 0.5 : 0,
                                                }}
                                            >
                                                {sortType[cell.fieldName] === DataGridSortType.Asc && (
                                                    <NorthIcon
                                                        sx={{
                                                            fontSize: '0.8rem',
                                                        }}
                                                    />
                                                )}
                                                {sortType[cell.fieldName] === DataGridSortType.Desc && (
                                                    <SouthIcon
                                                        sx={{
                                                            fontSize: '0.8rem',
                                                        }}
                                                    />
                                                )}
                                            </span>
                                        </>
                                    )}
                                    {cell?.label}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length ? (
                        <>
                            {rows.map((row, index) => {
                                return (
                                    <RowAdvance
                                        parentGroupKey={ParentGroupKeyRoot}
                                        key={index}
                                        stt={pageList?.pageSize * pageList?.pageIndex + index + 1}
                                        level={0}
                                        row={row}
                                        onFilter={onFilter}
                                        onRowClick={onRowClick}
                                    />
                                );
                            })}
                        </>
                    ) : (
                        <NoDataTable colSpan={cells.length + 1} />
                    )}

                    <Pagination
                        pageIndex={pageList?.pageIndex}
                        pageSize={pageList?.pageSize}
                        total={totalCount}
                        colSpan={cells.length + 1}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Container;
