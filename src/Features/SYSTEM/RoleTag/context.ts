import { createContext, useContext, useMemo } from 'react';
import { RoleOptions } from './types';
import { RoleTagServices } from './Services';

/** RoleTag Context */
export const RoleTagContext = createContext<{
    services?: RoleTagServices;
    roleOptions?: RoleOptions[];
    setRoleOptions?: (options: RoleOptions[]) => void;
}>({});

export const useGetContext = () => {
    const context = useContext(RoleTagContext);
    const props = useMemo(() => context, [context]);
    return props;
};
