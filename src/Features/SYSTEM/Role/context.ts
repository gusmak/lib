import { createContext, useContext, useMemo } from 'react';
import { RoleTagOptions } from './types';
import { RoleServices } from './Services';

/** Role Context */
export const RoleContext = createContext<{
    services?: RoleServices;
    roleTagOptions?: RoleTagOptions[];
    setRoleTagOptions?: (options: RoleTagOptions[]) => void;
}>({});

export const useGetContext = () => {
    const context = useContext(RoleContext);
    const props = useMemo(() => context, [context]);
    return props;
};
