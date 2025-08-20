import { TableCell, TableRow } from '@mui/material';
import { RowProps } from './interface';

export default function CustomRow<T extends object>(props: RowProps<T>) {
    const { info, headCells, onRowClicked } = props;
    const groupKeys = headCells.filter((headCell) => headCell.isGrouping);
    return (
        <TableRow
            onClick={() => {
                onRowClicked && onRowClicked(info);
            }}
            style={{ cursor: onRowClicked ? 'pointer' : 'text' }}
        >
            <TableCell colSpan={groupKeys.length + 1} align={'right'} style={{ borderBottom: '1px solid #a3a3a345' }}>
                {info?.rowIndex + 1}
            </TableCell>
            {headCells.map(
                (headCell, index: number) =>
                    !headCell.isGrouping && (
                        <TableCell key={index} style={{ borderBottom: '1px solid #a3a3a345' }} align={headCell.numberic ? 'right' : 'left'}>
                            {headCell.getDisplay
                                ? headCell.getDisplay(info)
                                : info[headCell.field as keyof T] === 0
                                  ? info[headCell.field as keyof T]
                                  : info[headCell.field as keyof T] || 'N/A'}
                        </TableCell>
                    )
            )}
        </TableRow>
    );
}
