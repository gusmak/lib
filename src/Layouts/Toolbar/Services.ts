import { Workspace } from 'Features/SYSTEM/types';
import { NotificationService } from 'Features/COMMON/Notifications/Services';
import { CurrentUser } from './Types';

export type ToolbarServices = NotificationService & {
    /* Lấy toàn bộ workspace theo quyền user  */
    getAllWorkSpaceByUserPermission: (p: { userId: number }) => Promise<{ items: Workspace[]; totalCount: number }>;
    /* Lấy thông tin workspace  */
    getWorkspaceById?: (p: { id: number }) => Promise<Workspace>;
    /* Lấy danh sách các workspace yêu thích */
    getFavoriteWorkspaces: (p: {
        totalDefaultFavoriteWorkspace: number;
        workspaceIds: number[];
    }) => Promise<{ items: Workspace[]; totalCount: number }>;
    /* Lấy thông tin user */
    getCurrentUser: () => Promise<CurrentUser>;
    /* Logout */
    onLogout: () => Promise<void>;
    /* callback when workspace changed */
    onChangeWorkspace?: () => Promise<void>;
};
