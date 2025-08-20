import { useEffect, useMemo, useState } from 'react';
import { isEqual } from 'lodash';
import { TableCell, TableRow } from '@mui/material';
import { Constants } from 'Commons/Constant';
import CircularProgress from '../CircularProgress';
import NoData from '../NoData';
import Pagination from '../Pagination';
import GroupComponent from './component';
import DefaultRow from './CustomRow';
import { GroupTableProps, RowProps } from './interface';

export function GroupTable<T extends object>(props: GroupTableProps<T>) {
    const { headCells, filters, onGetData, customRow, onRowClicked } = props;

    const row = useMemo(() => customRow || DefaultRow, [customRow]);
    const [data, setData] = useState<T[]>([]);
    const [groupPageIndex, setGroupPageIndex] = useState(0);
    const [groupPageSize, setGroupPageSize] = useState(Constants.PAGE_SIZE_DEFAULT);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const groupKeys: string[] = headCells.filter((headCell) => headCell.isGrouping).map((headCell) => headCell.field);

    useEffect(() => {
        setGroupPageIndex(0);
    }, [headCells]);

    useEffect(() => {
        handleGetGroupData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(headCells), groupPageSize, groupPageIndex]);

    const handleGetGroupData = () => {
        setLoading(true);
        onGetData(filters, groupPageIndex, groupPageSize)
            .then((result) => {
                !isEqual(data, result.data) && setData(result.data);
                !isEqual(totalCount, result.totalCount) && setTotalCount(result.totalCount);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const handleChangePage = (newPage: number) => {
        setGroupPageIndex(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setGroupPageSize(parseInt(event.target.value));
        setGroupPageIndex(0);
    };
    return loading ? (
        <TableRow>
            <TableCell size="small" colSpan={headCells.length}>
                <CircularProgress />
            </TableCell>
        </TableRow>
    ) : (
        <>
            {filters.length < groupKeys.length ? (
                <>
                    {data.map((dt, index) => (
                        <GroupComponent
                            key={index}
                            headCells={headCells}
                            filters={[
                                ...filters,
                                {
                                    field: groupKeys[filters.length],
                                    value: dt[groupKeys[filters.length] as keyof T],
                                },
                            ]}
                            displayData={{
                                ...dt,
                                groupIndex: groupPageIndex * groupPageSize + index,
                            }}
                            onGetData={onGetData}
                            onRowClicked={onRowClicked}
                            customRow={row}
                        />
                    ))}
                </>
            ) : (
                <>
                    {data.map((dt, index) => {
                        const CustomRow = row as React.ComponentType<RowProps<T>>;
                        return (
                            <CustomRow
                                key={index}
                                info={{
                                    ...dt,
                                    rowIndex: groupPageIndex * groupPageSize + index,
                                }}
                                headCells={headCells}
                                onRowClicked={onRowClicked}
                            />
                        );
                    })}
                </>
            )}
            {data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={headCells.length + 1} padding="none" style={{ borderBottom: '1px solid #a3a3a345' }}>
                        <NoData />
                    </TableCell>
                </TableRow>
            ) : (
                <TableRow>
                    <TableCell
                        colSpan={headCells.length + 1}
                        padding="none"
                        style={{
                            borderBottom: '1px solid #a3a3a345',
                        }}
                    >
                        <Pagination
                            rowsPerPageOptions={Constants.DEFAULT_ROWS_PER_PAGE}
                            style={{
                                border: 'none',
                            }}
                            rowsPerPage={groupPageSize}
                            page={groupPageIndex}
                            count={totalCount}
                            onPageChange={(_e, page) => {
                                handleChangePage(page);
                            }}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

export default GroupTable;
