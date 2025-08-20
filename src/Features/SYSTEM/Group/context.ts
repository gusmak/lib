import { createContext, useContext, useMemo } from 'react';
import { RoleTagOptions } from './types';
import { GroupServices } from './Services';

/** Role Context */
export const GroupContext = createContext<{
    services?: GroupServices;
    roleTagOptions?: RoleTagOptions[];
    setRoleTagOptions?: (options: RoleTagOptions[]) => void;
}>({});

export const useContextGroup = () => {
    const context = useContext(GroupContext);
    const props = useMemo(() => context, [context]);
    return props;
};
