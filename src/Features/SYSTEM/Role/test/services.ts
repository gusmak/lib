import { RoleServices, Role, RoleTag } from 'Features/SYSTEM/Role';

export const initRoles: Role[] = [
    {
        id: 1,
        name: 'Role 01',
        description: 'Role Description 01',
    },
    {
        id: 2,
        name: 'Role 02',
        description: 'Role Description 02',
        roleTags: [
            {
                id: 1,
                name: 'RoleTag 01',
            },
            {
                id: 2,
                name: 'RoleTag 02',
            },
        ],
    },
];

export const initRoleTags: RoleTag[] = [
    {
        id: 1,
        description: 'demo role 1',
        name: 'Role 1',
        workspaceId: 2,
    },
    {
        id: 2,
        description: 'demo role 2',
        name: 'Role 2',
        workspaceId: 2,
    },
];

export const services: RoleServices = {
    getRoles: (_p) => {
        return Promise.resolve({
            roles: initRoles,
            total: initRoles.length,
        });
    },
    createRole: (_p) => {
        return Promise.resolve();
    },
    updateRole: (_p) => {
        return Promise.resolve();
    },
    deleteRole: (_p) => {
        return Promise.resolve();
    },
    getRoleTags: () => {
        return Promise.resolve({
            roleTags: initRoleTags,
            total: initRoleTags.length,
        });
    },
    getRoleById: (p) => {
        const role = initRoles.find((r) => r.id === p.id);
        return Promise.resolve(role ?? {});
    },
};
