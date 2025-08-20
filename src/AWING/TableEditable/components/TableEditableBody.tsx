import { uniqBy } from 'lodash';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Checkbox, IconButton, TableBody, TableCell, TableRow, Tooltip, tooltipClasses, type TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { TableEditableBodyProps } from '../interface';
import TableCellEditable from './TableCellEditable';

const StyleTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} arrow classes={{ popper: className }} />)(
    () => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: '#bbbbbb',
            maxWidth: 450,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f5',
            maxWidth: 900,
            boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
        },
    })
);

export default function TableEditableBody<T>(props: TableEditableBodyProps<T>) {
    const {
        items,
        getId,
        selected,
        onSelectedChange,
        onSelect,
        columnDefinitions,
        dataValidation,
        includeDelete,
        spanningRows,
        onChange,
        onDelete,
        mergeRowsBy,
    } = props;

    const convertToMergeAbleItems = (keyValue: string) => {
        const result: Array<Partial<T>> = [];
        const temp = [...items.map((item, index) => ({ ...item, originalIndex: index }))];
        uniqBy(temp, keyValue).map((t) => {
            const childs = temp.filter((item) => item[keyValue as keyof Partial<T>] === t[keyValue as keyof Partial<T>]);
            result.push(...childs);
        });
        return result;
    };

    const convertItems = mergeRowsBy ? convertToMergeAbleItems(mergeRowsBy) : items;

    return (
        <TableBody>
            {convertItems.map((row, index) => {
                const rowIdx = (row as T & { originalIndex?: number }).originalIndex ?? index;
                const id = getId(row) ?? rowIdx;

                return (
                    <TableRow key={rowIdx}>
                        {selected && onSelectedChange && (
                            <TableCell
                                padding="checkbox"
                                sx={{
                                    border: '1px solid rgb(224, 224, 224)',
                                }}
                            >
                                <Checkbox
                                    color="primary"
                                    checked={selected.includes(Number(id))}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => onSelect(Number(id))}
                                    slotProps={{
                                        input: {
                                            'aria-braillelabel': `enhanced-table-checkbox-${id}`,
                                        },
                                    }}
                                />
                            </TableCell>
                        )}
                        {columnDefinitions.map((colDef, idx) => {
                            if (colDef.contentGetter) {
                                const content = colDef.contentGetter(row, rowIdx);
                                const fieldName = colDef.fieldName ?? '';
                                const isMergeColumn = fieldName === mergeRowsBy;
                                const isDisplay = isMergeColumn
                                    ? index == 0 || convertItems[index - 1][fieldName as keyof Partial<T>] !== row[fieldName as keyof T]
                                    : true;
                                const numOfRowSpan = isMergeColumn
                                    ? convertItems.filter((c) => c[fieldName as keyof Partial<T>] === row[fieldName as keyof Partial<T>])
                                          .length
                                    : 1;

                                return (
                                    isDisplay && (
                                        <TableCell
                                            key={idx}
                                            sx={{
                                                border: '1px solid rgb(224, 224, 224)',
                                            }}
                                            {...colDef.TableCellProps}
                                            rowSpan={numOfRowSpan}
                                        >
                                            {colDef.isTooltip ? (
                                                <StyleTooltip
                                                    title={(colDef.getTitleTooltip && colDef.getTitleTooltip(content as T[keyof T])) || ''}
                                                    placement="top-start"
                                                >
                                                    <div>{content}</div>
                                                </StyleTooltip>
                                            ) : (
                                                colDef.contentGetter(row, rowIdx)
                                            )}
                                        </TableCell>
                                    )
                                );
                            }

                            if (colDef.editFieldDefinition) {
                                const { fieldName } = colDef.editFieldDefinition;
                                const isMergeColumn = fieldName === mergeRowsBy;
                                const isDisplay = isMergeColumn
                                    ? index == 0 || convertItems[index - 1][fieldName as keyof T] !== row[fieldName as keyof T]
                                    : true;
                                const numOfRowSpan = isMergeColumn
                                    ? convertItems.filter((c) => c[fieldName as keyof T] === row[fieldName as keyof T]).length
                                    : 1;
                                const error =
                                    dataValidation?.[rowIdx]?.[fieldName as keyof T] !== undefined &&
                                    !dataValidation?.[rowIdx]?.[fieldName as keyof T];

                                return (
                                    isDisplay && (
                                        <TableCellEditable
                                            key={idx}
                                            cellDefinition={{
                                                ...colDef.editFieldDefinition,
                                                row,
                                                TableCellProps: colDef.TableCellProps,
                                                isTooltip: colDef.isTooltip,
                                                getTitleTooltip: colDef.getTitleTooltip,
                                                error: error,
                                                value: row[fieldName as keyof T],
                                                onChange: (newValue: any, valid: any) => {
                                                    let indexes = [rowIdx];
                                                    if (isMergeColumn) {
                                                        indexes = convertItems
                                                            .filter((c) => c[fieldName as keyof T] === row[fieldName as keyof T])
                                                            .map((c) => (c as T & { originalIndex?: number })?.originalIndex ?? 0);
                                                    }
                                                    onChange(indexes, fieldName as keyof T, newValue as T[keyof T], valid as boolean);
                                                },
                                                type: colDef.editFieldDefinition.type as any,
                                                fieldName: colDef.editFieldDefinition.fieldName || '',
                                            } as any}
                                            numOfRowSpan={numOfRowSpan}
                                        />
                                    )
                                );
                            }
                        })}

                        {includeDelete === true && (
                            <TableCell
                                align="center"
                                sx={{
                                    p: 0,
                                    border: '1px solid rgb(224, 224, 224)',
                                }}
                            >
                                <IconButton aria-label="delete" onClick={() => onDelete(rowIdx)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        )}
                    </TableRow>
                );
            })}
            {spanningRows?.map((row) => row)}
        </TableBody>
    );
}
