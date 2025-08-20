import { atom } from 'jotai';
import type { Workspace, CurrentUser } from './Types';

/* Danh sách các workspace yêu thích */
export const favoriteWorkspacesState = atom<Workspace[]>([]);

/* Danh sách toàn bộ workspace theo quyền user */
export const allWorkSpaceState = atom<Workspace[]>([]);

/* Thông tin User */
export const currentUserState = atom<CurrentUser>({
    id: -1,
});
