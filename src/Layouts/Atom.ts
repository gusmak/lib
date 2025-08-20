import { atom } from 'jotai';
import type { Workspace, MenuPermission } from './Types';

/* Danh sách các workspace yêu thích */
export const currentWorkspaceState = atom<Workspace>({});

export const menuPermissionsState = atom<MenuPermission[]>([]);

export const totalDefaultFavoriteWorkspaceState = atom<number>(0);

export const workspaceIdsState = atom<number[]>([]);
