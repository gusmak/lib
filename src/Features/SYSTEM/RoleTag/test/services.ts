import { RoleTagServices, Role, RoleTag } from 'Features/SYSTEM/RoleTag';

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
        name: 'RoleTag 01',
        workspaceId: 2,
    },
    {
        id: 2,
        description: 'demo role 2',
        name: 'RoleTag 02',
        workspaceId: 2,
    },
];

export const services: RoleTagServices = {
    getRoles: (_p) => {
        return Promise.resolve({
            roles: initRoles,
            total: initRoles.length,
        });
    },
    getRoleTags: () => {
        return Promise.resolve({
            roleTags: initRoleTags,
            total: initRoleTags.length,
        });
    },
    createRoleTag: (_p) => {
        return Promise.resolve();
    },
    updateRoleTag: (_p) => {
        return Promise.resolve();
    },
    deleteRoleTag: (_p) => {
        return Promise.resolve();
    },
    getRoleTagById: (p) => {
        const role = initRoleTags.find((r) => r.id === p.id);
        return Promise.resolve(role ?? {});
    },
};
