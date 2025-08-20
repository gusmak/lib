import { createContext, useContext, useMemo } from 'react';
import { RoleTagOptions } from './types';
import { UserServices } from './Services';

export const UserContext = createContext<{
    services?: UserServices;
    roleTagOptions?: RoleTagOptions[];
    setRoleTagOptions?: (options: RoleTagOptions[]) => void;
    groupsTagOptions?: RoleTagOptions[];
    setGroupsTagOptions?: (options: RoleTagOptions[]) => void;
}>({});

export const useContextUser = () => {
    const context = useContext(UserContext);
    const props = useMemo(() => context, [context]);
    return props;
};
