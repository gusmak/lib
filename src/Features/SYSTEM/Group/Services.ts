import type { Group, GroupInput } from './types';
import type { PagingQueryInput } from 'Features/types';
import type { RoleTag } from './types';
import { User } from '../User/types';

export type GroupServices = {
    /** Get RoleTags
     * @param p - PagingQueryInput<RoleTag> - Không truyền param sẽ lấy tất cả RoleTag
     */
    getRoleTags: (p?: PagingQueryInput<RoleTag>) => Promise<{ roleTags: RoleTag[]; total: number }>;

    /** Get Users
     * @param p - PagingQueryInput<Users> - Không truyền param sẽ lấy tất cả Users
     */
    getUsers: (p?: PagingQueryInput<User>) => Promise<{ users: User[]; total: number }>;

    /** Get Groups
     * @param p - PagingQueryInput<Group> - Không truyền param sẽ lấy tất cả Group
     */
    getGroups: (p?: PagingQueryInput<Group>) => Promise<{ groups: Group[]; total: number }>;

    /** Delete Group by ID */
    deleteGroup: (p: { id: number }) => Promise<void>;

    getGroupById: (p: { id: number }) => Promise<Group>;

    /** Create new Group */
    createGroup: (p: { input: GroupInput }) => Promise<void>;

    /** Update Group by ID */
    updateGroup: (p: { input: GroupInput; id: number }) => Promise<void>;

    /** Loading khi lấy dữ liệu */
    isLoading: boolean;

    /** Loading khi submit dữ liệu */
    isSubmitLoading: boolean;
};
