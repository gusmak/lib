import { PermissionView } from '../../types';

export type OwnProps = {
    permission: PermissionView;
    index: number;
    onEdit: (authenValue: PermissionView['authenValue'], authenType: PermissionView['authenType']) => void;
    onDelete: (permission: PermissionView) => void;
};
