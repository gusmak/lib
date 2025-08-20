import {
    Checkbox,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
} from '@mui/material';
import { debounce, get } from 'lodash';
import React, { useCallback } from 'react';
import NoData from '../../AWING/NoData';
import { Constants } from 'Commons/Constant';
import { formatNumber } from 'Helpers/number';
import { GridSortModel, RowActionDefinition, TableGridProps } from './interface';
import { SpanSortIndex, StyledTableRow } from './styles';

function TableDataGrid<T>({
    columns,
    rows,
    hideHeader = false,
    dynamicTableRowProps,
    spanningRows,
    spanningRowsPosition = 'bottom',
    getRowId,
    onRowClick,
    rowActions,
    sortModel,
    onSortModelChange,
    selected,
    onSelectedChange,
    selectionActions,
    pageIndex = Constants.PAGE_INDEX_DEFAULT,
    pageSize = Constants.PAGE_SIZE_DEFAULT,
}: TableGridProps<T>) {
    const createSortHandler = (fieldName: string) => (event: React.MouseEvent<unknown>) => {
        if (onSortModelChange) {
            if (event.ctrlKey || event.shiftKey) {
                let oldSortModel: GridSortModel[] = sortModel?.slice() ?? [];
                let newSortModel: GridSortModel[] = [];
                let sortIndex = oldSortModel.findIndex((x) => x.field === fieldName);
                if (sortIndex === -1) {
                    newSortModel = newSortModel.concat(oldSortModel, {
                        field: fieldName,
                        sort: 'asc',
                    });
                } else {
                    const currentSort = oldSortModel.find((x) => x.field === fieldName)?.sort;
                    if (currentSort === 'desc') {
                        newSortModel = oldSortModel.filter((x) => x.field !== fieldName);
                    } else if (sortIndex === 0) {
                        newSortModel = newSortModel.concat(
                            {
                                field: fieldName,
                                sort: 'desc',
                            },
                            oldSortModel.slice(1)
                        );
                    } else if (sortIndex === oldSortModel.length - 1) {
                        newSortModel = newSortModel.concat(oldSortModel.slice(0, -1), {
                            field: fieldName,
                            sort: 'desc',
                        });
                    } else if (sortIndex > 0) {
                        newSortModel = newSortModel.concat(
                            oldSortModel.slice(0, sortIndex),
                            {
                                field: fieldName,
                                sort: 'desc',
                            },
                            oldSortModel.slice(sortIndex + 1)
                        );
                    }
                }
                onSortModelChange(newSortModel);
            } else {
                const currentSort = sortModel?.find((x) => x.field === fieldName)?.sort;
                if (currentSort !== 'desc')
                    onSortModelChange([
                        {
                            field: fieldName,
                            sort: currentSort ? 'desc' : 'asc',
                        },
                    ]);
                else onSortModelChange([]);
            }
        }
    };

    const getId = (row: T) => {
        if (getRowId) {
            return getRowId(row);
        } else if ((row as object).hasOwnProperty('id')) {
            return (row as { id: string })['id'];
        } else {
            return undefined;
        }
    };

    const handleSelect = (id: string | number) => {
        if (selected && onSelectedChange) {
            if (selected.includes(id)) {
                onSelectedChange(selected.filter((x) => x !== id));
            } else {
                let newSelected = selected.slice();
                newSelected.push(id);
                onSelectedChange(newSelected);
            }
        }
    };

    const handleRowClick = (id: string | number, event: React.MouseEvent<HTMLTableRowElement>) => {
        if (selected && onSelectedChange && selected.length) {
            handleSelect(id);
        } else {
            if (onRowClick) onRowClick(id, event);
        }
    };
    const calcOrder = (index: number) => pageIndex * pageSize + 1 + index;
    const handleAction = useCallback(
        debounce((rowAction: RowActionDefinition<T>, id: string | number) => {
            rowAction.action(id);
        }, Constants.DEBOUNCE_TIME_300),
        []
    );

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table" style={{ tableLayout: 'fixed' }}>
                {!hideHeader && (
                    <TableHead>
                        <TableRow>
                            {selected && onSelectedChange && selected.length > 0 ? (
                                <TableCell colSpan={columns.length} style={{ padding: '4px' }}>
                                    {selectionActions &&
                                        selectionActions.map((actionDef, actIdx) => (
                                            <Tooltip key={actIdx} title={actionDef.tooltipTitle}>
                                                <IconButton
                                                    onClick={() => actionDef.action()}
                                                    style={{
                                                        marginLeft: '4px',
                                                        marginRight: '4px',
                                                    }}
                                                >
                                                    {actionDef.icon}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                </TableCell>
                            ) : (
                                columns.map((col) => (
                                    <TableCell
                                        key={col.field}
                                        sortDirection={sortModel?.find((x) => x.field === col.field)?.sort ?? false}
                                        style={{
                                            ...(col.width && {
                                                width: col.width,
                                            }),
                                            fontWeight: 'bold',
                                        }}
                                        {...col.TableCellProps}
                                    >
                                        {col.sortable ? (
                                            <TableSortLabel
                                                active={sortModel ? sortModel.some((x) => x.field === col.field) : false}
                                                direction={sortModel?.find((x) => x.field === col.field)?.sort ?? 'asc'}
                                                onClick={createSortHandler(col.field)}
                                            >
                                                {col.headerName}
                                                {sortModel && sortModel.length > 1 && sortModel.some((x) => x.field === col.field) && (
                                                    <SpanSortIndex>{1 + sortModel.findIndex((x) => x.field === col.field)}</SpanSortIndex>
                                                )}
                                            </TableSortLabel>
                                        ) : (
                                            col.headerName
                                        )}
                                    </TableCell>
                                ))
                            )}
                            {rowActions && rowActions.length > 0 && (
                                <TableCell
                                    style={{
                                        width: 48 * rowActions.length,
                                    }}
                                ></TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                )}
                <TableBody>
                    {spanningRowsPosition == 'top' && spanningRows}
                    {rows.map((row, idx) => {
                        let id = getId(row) ?? idx;
                        const dynamicRowPros = dynamicTableRowProps ? dynamicTableRowProps(row) : {};
                        return (
                            <StyledTableRow
                                data-row={id === idx ? 'sub-row' : 'row'}
                                data-name={'table-row-' + id}
                                key={id}
                                hover
                                {...((onRowClick || (selected && onSelectedChange && selected.length)) && {
                                    onClick: (e) => {
                                        // Kiểm tra xem có đang select text không
                                        const selection = window.getSelection()?.toString();
                                        if (!selection) {
                                            handleRowClick(id, e);
                                        }
                                    },
                                })}
                                {...(selected &&
                                    onSelectedChange && {
                                        role: 'checkbox',
                                        tabIndex: -1,
                                        selected: selected.includes(id),
                                    })}
                                style={{
                                    ...((onRowClick || (selected && onSelectedChange && selected.length)) && {
                                        cursor: 'pointer',
                                    }),
                                }}
                                {...dynamicRowPros}
                            >
                                {selected && onSelectedChange && (
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={selected.includes(id)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handleSelect(id)}
                                            inputProps={{
                                                'aria-labelledby': `enhanced-table-checkbox-${id}`,
                                            }}
                                        />
                                    </TableCell>
                                )}
                                {columns.map((col) => {
                                    let displayValue = col.valueGetter
                                        ? col.valueGetter(row, idx, calcOrder(idx))
                                        : col.type === 'number'
                                          ? formatNumber((row as any)[col.field])
                                          : get(row, col.field);
                                    const dynamicStyle = col.dynamicTableCellProps ? col.dynamicTableCellProps(row) : {};
                                    return (
                                        <TableCell key={col.field} {...col.TableCellProps} {...dynamicStyle}>
                                            {displayValue}
                                        </TableCell>
                                    );
                                })}
                                {rowActions && rowActions.length > 0 && (
                                    <TableCell padding="none" align="right">
                                        {rowActions.map((actionDef, actIdx) => {
                                            const isShouldHide = actionDef.isShouldHideActions && actionDef.isShouldHideActions(row);
                                            return (
                                                <Tooltip
                                                    key={`${id}-${actIdx}`}
                                                    open={isShouldHide ? false : undefined}
                                                    title={actionDef.tooltipTitle}
                                                >
                                                    <IconButton
                                                        onClick={(e) => {
                                                            if (!isShouldHide) {
                                                                e.stopPropagation();
                                                                handleAction(actionDef, id);
                                                            }
                                                        }}
                                                        style={{
                                                            marginLeft: '4px',
                                                            marginRight: '4px',
                                                            opacity: isShouldHide ? 0 : 1,
                                                        }}
                                                        sx={{
                                                            ...actionDef.sx,
                                                            borderRadius: '15%',
                                                        }}
                                                    >
                                                        {typeof actionDef.icon === 'function'
                                                            ? (() => {
                                                                  const iconElement = actionDef.icon({
                                                                      id: id.toString(),
                                                                      row,
                                                                      idx,
                                                                      order: calcOrder(idx),
                                                                  });
                                                                  return React.isValidElement(iconElement) ? iconElement : null;
                                                              })()
                                                            : actionDef.icon}
                                                    </IconButton>
                                                </Tooltip>
                                            );
                                        })}
                                    </TableCell>
                                )}
                            </StyledTableRow>
                        );
                    })}
                    {spanningRowsPosition == 'bottom' && spanningRows}
                </TableBody>
            </Table>
            {!rows.length && <NoData />}
        </TableContainer>
    );
}

export default TableDataGrid;
