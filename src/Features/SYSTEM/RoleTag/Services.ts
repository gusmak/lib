import type { PagingQueryInput } from 'Features/types';
import type { RoleTag, Role, RoleTagInput } from './types';

export type RoleTagServices = {
    /** Get Roles
     * @param p - PagingQueryInput<Role> - Không truyền param sẽ lấy tất cả Role
     */
    getRoles: (p?: PagingQueryInput<Role>) => Promise<{ roles: Role[]; total: number }>;

    /** Get RoleTags
     * @param p - PagingQueryInput<RoleTag> - Không truyền param sẽ lấy tất cả RoleTag
     */
    getRoleTags: (p?: PagingQueryInput<RoleTag>) => Promise<{ roleTags: RoleTag[]; total: number }>;

    /** Delete RoleTag by ID */
    deleteRoleTag: (p: { id: number }) => Promise<void>;

    getRoleTagById: (p: { id: number }) => Promise<RoleTag>;

    /** Create new RoleTag */
    createRoleTag: (p: { input: RoleTagInput }) => Promise<void>;

    /** Update RoleTag by ID */
    updateRoleTag: (p: { input: RoleTagInput; id: number }) => Promise<void>;
};
