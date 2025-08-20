import type { Directory, DirectoryPermissionInput } from './types';
import type { SchemaServices } from '../../Features/SYSTEM/Schema';
import type { User } from 'Features/SYSTEM/User/types';
import type { Group } from 'Features/SYSTEM/Group/types';
import type { Role } from 'Features/SYSTEM/Role/types';

/** Gọi đến Service Schema Feature */
export type CrSchemaServices = Pick<SchemaServices, 'getObjectDefinitions' | 'getSchemas' | 'getSchemaById' | 'createSchema'>;

/** File định nghĩa các API cần có của cả Component */
export type DirectoryPermissionServices = CrSchemaServices & {
    /** Get Directory
     * @params id - number - Id của Directory
     */
    getDirectoryById: (p?: { id: number }) => Promise<Directory>;

    /** Delete Directory */
    deleteDirectoryPermission: (p: { input: DirectoryPermissionInput }) => Promise<void>;

    /** Add Directory Permission */
    addDirectoryPermission: (p: { input: DirectoryPermissionInput }) => Promise<void>;

    /** User */
    getUsers: () => Promise<{ items: User[]; total: number }>;

    /** Role */
    getRoles: () => Promise<{ items: Role[]; total: number }>;

    /** Group */
    getGroups: () => Promise<{ items: Group[]; total: number }>;
};
