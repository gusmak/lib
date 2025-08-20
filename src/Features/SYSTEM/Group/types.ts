import { SortInputType } from 'Features/types';
import { RoleTag as IRoleTag } from '../RoleTag';

export type Group = {
    description?: string;
    id: number;
    name?: string;
    users?: {
        id: number;
        username?: string;
        name?: string;
    }[];
    roleAuthens?: RoleAuthens[];
    workspaceId?: number;
    isSystem?: boolean;
};

export type SortInputGroup = SortInputType<Group>;

export type GroupInput = {
    description?: string;
    id?: number;
    name?: string;
    roleAuthens?: {
        id?: number;
        value?: {
            id?: number;
            roleId?: number;
        };
    }[];
    workspaceId?: number;
    userIds?: number[];
};

export type RoleTag = IRoleTag;

// export type SortInput = SortInputType<Group>;

export type RoleTagOptions = {
    value: RoleTag['id'];
    text: RoleTag['name'];
};

export type RoleAuthens = {
    id: number;
    roleId?: number;
    role?: {
        name?: string;
    };
};
