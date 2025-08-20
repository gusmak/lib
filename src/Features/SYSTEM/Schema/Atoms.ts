import { atom } from 'jotai';
import { ObjectTypeCode } from 'Features/types';
import type { ObjectDefinition, Schema, CurrentSchemaDetail } from './types';

// Schema atoms with reset capability
export const fullFieldsState = atom<ObjectDefinition[]>([]);

export const objectTypeCodesState = atom<ObjectTypeCode[]>([]);

export const rootSchemasState = atom<Schema[]>([]);

export const nameState = atom<string>('');

export const rootSchemaObjectsState = atom<Schema[]>([]);

export const selectedRootSchemaState = atom<Schema>({} as Schema);

export const objectTypeCodeState = atom<string>('');

export const schemaState = atom<Schema>({} as Schema);

export const currentSchemaDetailsState = atom<CurrentSchemaDetail[]>([]);

export const confirmExitState = atom<boolean>(false);

// Reset atom for resetting multiple atoms at once
export const resetAllState = atom(
    null, // read operation returns null
    (_get, set) => {
        set(nameState, '');
        set(schemaState, {} as Schema);
        set(currentSchemaDetailsState, []);
        set(objectTypeCodeState, '');
        set(selectedRootSchemaState, {} as Schema);
        set(rootSchemaObjectsState, []);
        set(confirmExitState, false);
    }
);
