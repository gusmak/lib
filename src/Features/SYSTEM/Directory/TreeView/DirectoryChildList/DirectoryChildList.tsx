import { MouseEvent, ChangeEvent } from 'react';
import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import { NoData, Pagination } from 'AWING';
import PaperTemplate from '../../components/PaperTemplate';
import DirectoryChildRow from './DirectoryChildRow';
import type { Directory } from '../../types';

export type OwnProps = {
    directoriesQuery: {
        items: Directory[];
        totalCount: number;
    };
    pageSize: number;
    pageIndex: number;
    handleChangePage: (event: MouseEvent<HTMLButtonElement> | null, newPageIndex: number) => void;
    handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
    deleteDirectory?: (directoryInfo: { id: number; parentObjectId?: number }) => void;
};

const DirectoryChildList = (props: OwnProps) => {
    const { directoriesQuery, pageSize, pageIndex, handleChangePage, handleChangeRowsPerPage, deleteDirectory } = props;

    return directoriesQuery && directoriesQuery.items && directoriesQuery.items.length > 0 ? (
        <>
            <PaperTemplate>
                <Table size="small">
                    <TableBody>
                        {directoriesQuery.items.map((dir, index: number) => (
                            <DirectoryChildRow key={index} directory={dir} deleteDirectory={deleteDirectory} />
                        ))}
                    </TableBody>
                </Table>
            </PaperTemplate>

            <Pagination
                count={directoriesQuery.totalCount ?? 0}
                rowsPerPage={pageSize}
                page={pageIndex}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    ) : (
        <PaperTemplate>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ padding: 0 }}>
                            <NoData />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </PaperTemplate>
    );
};

export default DirectoryChildList;
