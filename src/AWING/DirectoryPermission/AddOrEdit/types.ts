import { AuthenPermission, AuthenType, Directory, ExplicitPermission, PermissionView } from '../types';

export type AddOrEditProps = {
    listPermission?: PermissionView[];
    directoryPermission?: Directory;
    drawerLevel?: number;
    objectTypeCodeTab?: string;
    onDrawerLevelChange?: (level: number) => void;
    onUpdateDirectoryPermission?: () => void;
};

export type PageContentProps = {
    explicitMatrixPermissions: number[];
    inheritedMatrixPermissions: number[];
    onExplicitMatrixPermissionsChange: (newValue: number[]) => void;
    isCreate: boolean;
    disableSelectSchema: boolean;
    explicitPermissions: ExplicitPermission[];
    onExplicitPermissionsChange: (newExplicitPermissions: ExplicitPermission[]) => void;
    inheritedPermissions: ExplicitPermission[];
    authenPermissions: AuthenPermission[];
    isFile?: boolean;
    objectTypeCodeSelected?: string;
    onDeleteAuthen?: (authen: AuthenPermission) => void;
    onChangeObjectTypeCode?: (type: string) => void;
    onDrawerLevelChange?: (level: number) => void;
};

export type CurrentAuthenPermission = {
    name: string;
    authenType: AuthenType;
    authenValue: number;
    explicitPermissions: ExplicitPermission[];
    inheritedPermissions: ExplicitPermission[];
    explicitMatrixPermissions: number[];
    inheritedMatrixPermissions: number[];
};
