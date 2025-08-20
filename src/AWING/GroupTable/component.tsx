import { useState } from 'react';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { TableCell, TableRow } from '@mui/material';
import GroupContainer from './GroupTable';
import { GroupComponentProps } from './interface';

export default function GroupComponent<T extends object>(props: GroupComponentProps<T>) {
    const { headCells, filters, displayData, onGetData, onRowClicked, customRow } = props;
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
    const groupBys = headCells.filter((headCell) => headCell.isGrouping);
    const isShouldGrayBackground = groupBys.length > 2 ? filters.length < 3 : filters.length < 2;
    return (
        <>
            <TableRow
                key={`group-header-filters.length-${filters.length}`}
                style={{
                    background: isShouldGrayBackground ? '#F9F9F9' : '',
                }}
                onClick={handleOpen}
            >
                <TableCell
                    colSpan={filters.length}
                    align="right"
                    width="54px"
                    style={{
                        borderBottom: '1px solid #a3a3a345',
                        cursor: 'pointer',
                        position: 'relative',
                        padding: '8px',
                    }}
                >
                    {open ? <ArrowDropUp style={{ marginRight: '32px' }} /> : <ArrowDropDown style={{ marginRight: '32px' }} />}
                    <span
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                        }}
                    >
                        {displayData.groupIndex + 1}
                    </span>
                </TableCell>
                {headCells.map((headCell, ind) => {
                    if (ind > filters.length - 2) {
                        if (displayData[headCell.field as keyof T] !== undefined) {
                            return (
                                <TableCell
                                    key={ind}
                                    align={headCell.numberic ? 'right' : 'left'}
                                    style={{
                                        borderBottom: '1px solid #a3a3a345',
                                        cursor: 'pointer',
                                        fontWeight: headCell.isDisplayTotal ? 'bold' : undefined,
                                    }}
                                >
                                    {headCell.getDisplay ? headCell.getDisplay(displayData) : displayData[headCell.field as keyof T]}
                                </TableCell>
                            );
                        } else {
                            return (
                                <TableCell
                                    key={ind}
                                    style={{
                                        borderBottom: '1px solid #a3a3a345',
                                        cursor: 'pointer',
                                    }}
                                />
                            );
                        }
                    }
                })}
            </TableRow>
            {open && (
                <GroupContainer
                    headCells={headCells}
                    filters={filters}
                    onGetData={onGetData}
                    onRowClicked={onRowClicked}
                    customRow={customRow}
                />
            )}
        </>
    );
}
