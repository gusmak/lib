import { createContext, useContext, useMemo } from 'react';
import type { SchemaServices } from './Services';
import type { CurrentWorkspace } from '../types';

export type SchemaContextType = {
    /** currentWorkspace pass from SchemaComponent props */
    currentWorkspace?: CurrentWorkspace;

    /** All Service */
    services?: SchemaServices;
};

/** Context for all Schema feature  */
export const SchemaContext = createContext<SchemaContextType>({});

/** Get Context of SchemaContext */
export const useGetSchemaContext = () => {
    const context = useContext(SchemaContext);
    const props = useMemo(() => context, [context]);
    return props;
};
