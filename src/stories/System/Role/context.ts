import { createContext, useContext, useMemo } from 'react';
import { RoleTagOptions } from '../../../Features/SYSTEM/Role';

export const RoleGroupOptionsContext = createContext<{
    roleGroupOptions: RoleTagOptions[];
    setRoleGroupOptions: (options: RoleTagOptions[]) => void;
}>({
    roleGroupOptions: [],
    setRoleGroupOptions: () => {},
});

export const useGetContext = () => {
    const context = useContext(RoleGroupOptionsContext);
    const props = useMemo(() => context, [context]);
    return props;
};
