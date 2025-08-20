import type { Directory, DirectoryInput } from './types';

export type DirectoryAddOrEditServices = {
    /** Get Directory by ID */
    getDirectoryById: (p: { id: number }) => Promise<Directory>;

    /** Creat new Schema */
    createDirectory: (p: { input: DirectoryInput }) => Promise<void>;

    /** Update new Schema */
    updateDirectory: (p: { input: DirectoryInput; id: number }) => Promise<void>;
};
