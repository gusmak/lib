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
};

export type SortInputGroup = SortInputType<Group>;

export type UserInput = {
    roleAuthens?: {
        roleAuthens?: {
            key?: number;
            value?: {
                groupId?: number;
                id?: number;
                roleId?: number;
                userId?: number;
            };
        }[];
    };
    userRequest: User;
    groupIds?: number[];
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

export type User = {
    description?: string;
    gender?: number;
    id?: number;
    image?: string;
    name?: string;
    roles?: number[];
    groups?: number[];
    roleAuthens?: Array<RoleAuthens>;
    username?: string;
};
