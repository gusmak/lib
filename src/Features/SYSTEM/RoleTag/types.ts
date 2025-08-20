import type { SortInputType } from 'Features/types';
import { type Role as IRole } from '../Role';

export type RoleTag = {
    description?: string;
    id?: number;
    name?: string;
    workspaceId?: number;
};

export type Role = IRole;

export type RoleOptions = {
    value: number;
    text: string;
    roleTagIds?: number[];
};

export type SortInput = SortInputType<RoleTag>;

export type RoleTagInput = {
    description?: string;
    id?: number;
    name?: string;
    roleIds?: number[];
    sagaTransactionId?: number;
    workspaceId?: number;
};
