import { createContext, useContext, useMemo } from 'react';
import type { CurrentWorkspace } from 'Features/SYSTEM/types';
import type { DirectoryPermissionServices } from './Services';
import type { EnumTypeConvert } from 'Features/types';

/** Định nghĩa các context của Component */
export type DirectoryPermissionContextType = {
    currentWorkspace?: CurrentWorkspace;

    objectTypeCodes?: EnumTypeConvert[];
    /** All Service */
    services?: DirectoryPermissionServices;

    onCloseDrawer?: () => void;
};

/** Context for all DirectoryPermission feature  */
export const DirectoryPermissionContext = createContext<DirectoryPermissionContextType>({});

/** Get Context of DirectoryPermissionContext */
export const useGetDirectoryContext = () => {
    const context = useContext(DirectoryPermissionContext);
    const props = useMemo(() => context, [context]);
    return props;
};
