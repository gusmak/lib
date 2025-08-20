import { type DirectoryAddOrEditServices } from 'AWING/DirectoryForm';
import { type DirectoryPermissionServices } from 'AWING/DirectoryPermission';
import type { PagingQueryInput } from 'Features/types';
import type { Directory } from './types';

export type DirectoryServices = DirectoryAddOrEditServices &
    DirectoryPermissionServices & {
        /** Get Directories
         * @params PagingQueryInput<Directory> - Không truyền param sẽ lấy tất cả
         */
        getDirectories: (
            params?: PagingQueryInput<Directory> & {
                parentDirectoryId?: number;
                workspaceId?: number;
                depthFromRoot?: number;
            }
        ) => Promise<{ items: Directory[]; total: number }>;

        /** Delete Directory */
        deleteDirectory: (params: { id: number }) => Promise<void>;
    };
