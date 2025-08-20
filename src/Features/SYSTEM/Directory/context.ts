import { createContext, useContext, useMemo } from 'react';
import type { CurrentWorkspace } from '../types';
import type { DirectoryServices } from './Services';
import { ObjectTypeCode } from 'Features/types';

export type DirectoryContextType = {
    /* Folder gốc của từng workspce */
    parentDirectoryId?: number;
    /** currentWorkspace pass from SchemaComponent props */
    currentWorkspace?: CurrentWorkspace;

    objectTypeCodes?: ObjectTypeCode[];

    /** All Service */
    services?: DirectoryServices;
};

/** Context for all Directory feature  */
export const DirectoryContext = createContext<DirectoryContextType>({});

/** Get Context of DirectoryContext */
export const useGetDirectoryContext = () => {
    const context = useContext(DirectoryContext);
    const props = useMemo(() => context, [context]);
    return props;
};
