import { uniqBy } from 'lodash';
import { CurrentAuthenPermission } from '../AddOrEdit';
import { AuthenType, Directory, DirectoryPermission, DirectoryPermissionWorkflowMatrix, PermissionView } from '../types';
import { toExpandPermissions } from './permission';

export const getWorkflowStateIds = (permission: DirectoryPermission[], schemaId?: number | null) => {
    return permission
        .filter((x) => {
            return x.schemaId === schemaId;
        })
        .map((p) => p.workflowStateId!);
};

/** Lấy danh sách permission từ directory */
export const getDirectoryPermission = (directory: Directory) => {
    return {
        ep: directory.explicitPermissions ?? [],
        ip: directory.inheritedPermissions ?? [],
        ewp: directory.explicitWorkflowMatrixPermissions ?? [],
        iwp: directory.inheritedWorkflowMatrixPermissions ?? [],
    };
};

export const getPermissionBySchemaId = (directoryPermissions: DirectoryPermission[]) => {
    return uniqBy(directoryPermissions, 'schemaId').map((unq) => {
        const permissions = directoryPermissions
            .filter((x) => {
                return x.schemaId === unq.schemaId || (!x.schemaId && !unq.schemaId);
            })
            .map((p) => p.permission);

        return {
            schemaId: unq.schemaId || null,
            permissions: toExpandPermissions(permissions.filter((x) => x !== undefined)),
            workflowStateIds: getWorkflowStateIds(directoryPermissions, unq.schemaId),
        };
    });
};

export const filterPermissionByType = (
    directorypermissions: (Object & {
        authenType?: string;
        authenValue?: number;
    })[],
    other: Object & {
        authenType: string;
        authenValue: number;
    }
) => directorypermissions.filter((p) => p.authenType === other.authenType && p.authenValue === other.authenValue);

export const getPermissionUpdate = (
    currentPermission: CurrentAuthenPermission,
    authenType: string, // [authenType, authenValue]
    authenValue: number,
    directory: Directory,
    currentEditPermission: Partial<PermissionView>
) => {
    const currentType = currentEditPermission?.authenType ?? authenType;
    const permissionPicked: CurrentAuthenPermission = {
        ...currentPermission,
        authenValue: authenValue,
        name: currentEditPermission?.name ?? '',
        authenType: currentType as AuthenType,
    };

    const { ep, ewp, ip, iwp } = getDirectoryPermission(directory);

    /** Lọc ra các quyền theo type và value */
    const explicit: DirectoryPermission[] = filterPermissionByType(ep, permissionPicked);
    const inherit: DirectoryPermission[] = filterPermissionByType(ip, permissionPicked);
    const explicitMatrices: DirectoryPermissionWorkflowMatrix[] = filterPermissionByType(ewp, permissionPicked);
    const inheritedMatrices: DirectoryPermissionWorkflowMatrix[] = filterPermissionByType(iwp, permissionPicked);

    /** Tính toán và gán lại quyền cho directory */
    permissionPicked.explicitPermissions = getPermissionBySchemaId(explicit);
    permissionPicked.inheritedPermissions = getPermissionBySchemaId(inherit);
    permissionPicked.explicitMatrixPermissions = explicitMatrices.map((m) => m.workflowMatrixId!);
    permissionPicked.inheritedMatrixPermissions = inheritedMatrices.map((m) => m.workflowMatrixId!);

    return permissionPicked;
};
