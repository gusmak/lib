import { atom } from 'jotai';
import { Schema } from 'Features/SYSTEM/Schema';
import type { ObjectDefinition, Workflow, ObjectTypeCode } from './types';

export type RoleGroupTree = {
    id?: string;
    label: string;
    children?: RoleGroupTree[];
};

export const RoleOptionsState = atom<{ value: string; text: string }[]>([]);

export const RoleTreeOptionsState = atom<RoleGroupTree[]>([]);

export const RoleSelected = atom<string[]>([]);

export const fullFieldsState = atom<ObjectDefinition[]>([]);

export const rootSchemasState = atom<Schema[]>([]);

export const schemasState = atom<Schema[]>([]);

export const workflowStates = atom<Workflow>();

/** ObjetTypeCode - VD: "Media", "Campaigns"  */
export const objectTypeCodesState = atom<ObjectTypeCode[]>([]);

// Write-only atom to handle resetting multiple atoms
export const resetAllState = atom(null, (_get, set) => {
    set(fullFieldsState, []);
    set(rootSchemasState, []);
    set(objectTypeCodesState, []);
    set(workflowStates, undefined);
});
export const currentObjectTypeCodesState = atom<ObjectTypeCode[]>([]);
