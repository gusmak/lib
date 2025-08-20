import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import { SharingWorkspace, WorkspaceSchemaOption } from './Types';
import { Workspace } from '../types';

export type WorkspaceOption = {
    id?: Workspace['id'];
    customerId?: number;
    supplierId?: number;
    type?: Workspace['type'];
};

export const WorkspaceOptionsState = atom<Workspace[]>([]);

export const WorkspaceSchemaOptionsState = atom<WorkspaceSchemaOption[]>([]);

export const WorkspacesState = atom<SharingWorkspace[]>([]);

export const confirmExitState = atomWithReset(false);

export const resetAllWorkspaceSharingState = atom(
    null, // read operation returns null
    (_get, set) => {
        set(confirmExitState, false);
    }
);
