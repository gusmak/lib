import { RoleServices, Role, RoleTag } from 'Features/SYSTEM/Role';

export const initRoles: Role[] = [
    {
        id: 1,
        description: 'demo role 1',
        name: 'Role 1',
        roleTags: [
            {
                id: 1,
                description: 'demo role tag 1',
                name: 'Role Tag 1',
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
                description: 'demo role tag 2',
                name: 'Role Tag 2',
                workspaceId: 2,
            },
        ],
        workspaceId: 2,
    },
];

export const initRoleTags: RoleTag[] = [
    {
        id: 1,
        description: 'demo role tag 1',
        name: 'Role Tag 1',
        workspaceId: 2,
    },
    {
        id: 2,
        description: 'demo role tag 2',
        name: 'Role Tag 2',
        workspaceId: 2,
    },
];

export const services: RoleServices = {
    getRoles: (p) => {
        return Promise.resolve({
            roles: initRoles,
            total: initRoles.length,
        });
    },
    createRole: (p) => {
        return Promise.resolve();
    },
    updateRole: (p) => {
        return Promise.resolve();
    },
    deleteRole: (p) => {
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
