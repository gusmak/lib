import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { CircularProgress, NoData } from 'AWING';
import { BORDER_LIGHTGRAY } from '../constants';
import ViewPermission from './ViewPermission';
import TableHeader from './TableHeader';
import { type HeadCell } from './PermissionTable';
import { type PermissionView } from '../types';

export type OwnProps = {
    isLoading: boolean;
    headCells: HeadCell[];
    permissions: PermissionView[];
    openEditPermission: (authenValue: PermissionView['authenValue'], authenType: PermissionView['authenType']) => void;
    onDeletePermission: (authen: PermissionView) => void;
};

const PermissionManagement = (props: OwnProps) => {
    const { isLoading, headCells, permissions, openEditPermission, onDeletePermission } = props;

    return (
        <Table
            sx={() => ({
                display: 'block',
                border: BORDER_LIGHTGRAY,
                borderRadius: '0px 0px 4px 4px',
            })}
        >
            <TableHeader headCells={headCells} />
            <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell size="small" colSpan={headCells.length}>
                            <CircularProgress />
                        </TableCell>
                    </TableRow>
                ) : permissions.length ? (
                    permissions.map((p, index: number) => (
                        <ViewPermission
                            key={index}
                            permission={p}
                            index={index}
                            onEdit={openEditPermission}
                            onDelete={onDeletePermission}
                        />
                    ))
                ) : (
                    <TableRow>
                        <TableCell size="small" colSpan={headCells.length}>
                            <NoData />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default PermissionManagement;
