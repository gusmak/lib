import { RoleTagServices, Role, RoleTag } from 'Features/SYSTEM/RoleTag';

export const initRoles: Role[] = [
    {
        id: 1,
        description: 'demo role 1',
        name: 'Role 1',
        roleTags: [
            {
                id: 1,
                description: 'demo role 1',
                name: 'Role 1',
                workspaceId: 2,
            },
        ],
        workspaceId: 2,
    },
    {
        id: 2,
        description: 'demo role 2',
        name: 'Role 2',
        roleTags: [
            {
                id: 1,
                description: 'demo role 1',
                name: 'Role 1',
                workspaceId: 2,
            },
        ],
        workspaceId: 2,
    },
];

export const initRoleTags: RoleTag[] = [
    {
        id: 1,
        description: 'demo roletag 1',
        name: 'RoleTag 1',
        workspaceId: 2,
    },
    {
        id: 2,
        description: 'demo roletag 2',
        name: 'RoleTag 2',
        workspaceId: 2,
    },
];

export const services: RoleTagServices = {
    getRoles: (p) => {
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
    createRoleTag: (p) => {
        return Promise.resolve();
    },
    updateRoleTag: (p) => {
        return Promise.resolve();
    },
    deleteRoleTag: (p) => {
        return Promise.resolve();
    },
    getRoleTagById: (p) => {
        const role = initRoles.find((r) => r.id === p.id);
        return Promise.resolve(role ?? {});
    },
};
