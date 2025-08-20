import type { PagingQueryInput } from 'Features/types';
import type { Role, RoleTag, RoleInput } from './types';

export type RoleServices = {
    /** Get Roles
     * @param p - PagingQueryInput<Role> - Không truyền param sẽ lấy tất cả Role
     */
    getRoles: (p?: PagingQueryInput<Role>) => Promise<{ roles: Role[]; total: number }>;

    /** Get RoleTags
     * @param p - PagingQueryInput<RoleTag> - Không truyền param sẽ lấy tất cả RoleTag
     */
    getRoleTags: (p?: PagingQueryInput<RoleTag>) => Promise<{ roleTags: RoleTag[]; total: number }>;

    /** Delete Role by ID */
    deleteRole: (p: { id: number }) => Promise<void>;

    getRoleById: (p: { id: number }) => Promise<Role>;

    /** Create new Role */
    createRole: (p: { input: RoleInput }) => Promise<void>;

    /** Update Role by ID */
    updateRole: (p: { input: RoleInput; id: number }) => Promise<void>;
};
