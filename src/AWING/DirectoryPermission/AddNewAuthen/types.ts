import { Authen, AuthenPermission, AuthenType } from '../types';

export type ContainerProps = {
    authenPermissions: AuthenPermission[];
    onTempPermissionsChange: (newTempPermissions: AuthenPermission[]) => void;
    drawerLevel?: number;
    onDrawerLevelChange?: (level: number) => void;
};

export type AuthenByKeys<T> = {
    [K in AuthenType]: T[];
};

export type SearchWrapperProps = {
    authenIds: {
        [K in AuthenType]: number[];
    };
    authens: {
        [K in AuthenType]: Authen[];
    };
    onAuthenIdsChange: (authenIds: number[], type: AuthenType) => void;
};
