import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';
import { TableHeaderProps } from '../interface';

export default function TableHeader<T>(props: TableHeaderProps<T>) {
    const { selected, onSelectedChange, numOfRows, onSelectAll, includeDelete, columnDefinitions } = props;
    return (
        <TableHead>
            <TableRow>
                {selected && onSelectedChange && (
                    <TableCell
                        padding="checkbox"
                        sx={{
                            border: '1px solid rgb(224, 224, 224)',
                        }}
                    >
                        <Checkbox
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < numOfRows}
                            checked={selected.length > 0 && selected.length === numOfRows}
                            onChange={() => onSelectAll()}
                            slotProps={{
                                input: {
                                    'aria-label': 'select all desserts',
                                },
                            }}
                        />
                    </TableCell>
                )}
                {columnDefinitions.map((colDef, idx) => {
                    const { headerName, width, TableCellProps } = colDef;
                    return (
                        <TableCell
                            key={idx}
                            sx={{
                                border: '1px solid rgb(224, 224, 224)',
                                ...(width && {
                                    width: width,
                                }),
                            }}
                            {...TableCellProps}
                        >
                            {`${headerName}${colDef?.editFieldDefinition?.required ? '*' : ''}`}
                        </TableCell>
                    );
                })}
                {includeDelete === true && (
                    <TableCell
                        sx={{
                            width: 60,
                            border: '1px solid rgb(224, 224, 224)',
                        }}
                    />
                )}
            </TableRow>
        </TableHead>
    );
}
