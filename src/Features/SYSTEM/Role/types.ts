import { SortInputType } from 'Features/types';
import { RoleTag as IRoleTag } from '../RoleTag';

export type Role = {
    description?: string;
    id?: number;
    name?: string;
    roleTags?: Array<RoleTag>;
    workspaceId?: number;
};

export type RoleTag = IRoleTag;

export type SortInput = SortInputType<Role>;

export type RoleTagOptions = {
    value: RoleTag['id'];
    text: RoleTag['name'];
};

export type RoleInput = {
    description?: string;
    name?: string;
    roleTagIds?: Array<number>;
};
