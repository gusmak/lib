import type { PagingQueryInput } from 'Features/types';
import type { UserInput, RoleTag, User, Group } from './types';

export type UserServices = {
    /** Get RoleTags
     * @param p - PagingQueryInput<RoleTag> - Không truyền param sẽ lấy tất cả RoleTag
     */
    getRoleTags: (p?: PagingQueryInput<RoleTag>) => Promise<{ roleTags: RoleTag[]; total: number }>;

    /** Get Users
     * @param p - PagingQueryInput<Users> - Không truyền param sẽ lấy tất cả Users
     */
    getUsers: (p?: PagingQueryInput<User>) => Promise<{ users: User[]; total: number }>;

    getGroups: () => Promise<{ groups: Group[]; total: number }>;

    getUserById: (p: { id: number }) => Promise<User>;

    /** Update Group by ID */
    updateUser: (p: { user: UserInput; id: number }) => Promise<void>;

    /** Delete User by ID */
    deleteUser: (p: { id: number }) => Promise<void>;

    addToWorkspace: (p: {
        username: string;
        roleAuthenInput: {
            roleAuthens?: {
                value?: {
                    roleId?: number;
                };
            }[];
        };
        groupIds: number[];
    }) => Promise<void>;

    checkUsernameExisted: (p: { username: string }) => Promise<boolean | undefined>;

    /** Loading khi lấy dữ liệu */
    isLoading: boolean;

    /** Loading khi submit dữ liệu */
    isSubmitLoading: boolean;
};
