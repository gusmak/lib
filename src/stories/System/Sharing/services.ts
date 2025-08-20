import { ObjectDefinition, Schema } from 'Features/SYSTEM/Schema';
import { Sharing, SharingProps, WorkSpaceState } from 'Features/SYSTEM/Sharing/Types';
import { CurrentWorkspace, Workspace } from 'Features/SYSTEM/types';
import { atom } from 'jotai';

export const currentWorkspace: CurrentWorkspace = {
    customerId: 2,
    customerType: 'Customer Type 2',
    description: 'Description 2',
    id: 2,
    isJoinNetwork: false,
    name: 'Workspace 2',
    type: 'AXN',
    url: 'Url 2',
    defaultSchemas: [],
};
export const workspace: Workspace = {
    customerId: 2,
    customerType: 'Customer Type 2',
    description: 'Description 2',
    id: 2,
    isJoinNetwork: false,
    name: 'Workspace 2',
    type: 'AXN',
    url: 'Url 2',
};

export const initSharings: Sharing[] = [
    {
        id: 1,
        name: 'test01',
        objectFilterId: 1,
        objectFilter: {
            configType: 'OBJECT_AND_CHANGED',
            id: 1,
            logicalExpression: 'o.Status <= 400 AND c.Status = 500',
            name: 'Test',
            objectTypeCode: 'campaign',
        },
        schemaId: 1,
        totalTargetWorkspace: 0,
        workspaceId: 10,
        sharingWorkspaces: [
            {
                id: 1,
                targetWorkspaceId: 11,
                targetWorkspace: {
                    name: 'Name',
                },
                sharingWorkspaceConfigs: [],
                __typename: 'SharingWorkspace',
            },
        ],
    },
    {
        id: 2,
        name: 'test01',
        objectFilterId: 1,
        objectFilter: {
            configType: 'OBJECT_AND_CHANGED',
            id: 1,
            logicalExpression: 'o.Status <= 400 AND c.Status = 500',
            name: 'Test',
            objectTypeCode: 'campaign',
        },
        schemaId: 1,
        totalTargetWorkspace: 0,
        workspaceId: 10,
        sharingWorkspaces: [
            {
                id: 1,
                targetWorkspaceId: 11,
                targetWorkspace: {
                    name: 'Name',
                },
                sharingWorkspaceConfigs: [],
                __typename: 'SharingWorkspace',
            },
        ],
    },
    {
        id: 3,
        name: 'test02',
        objectFilterId: 1,
        objectFilter: {
            configType: 'OBJECT_AND_CHANGED',
            id: 1,
            logicalExpression: 'o.Status <= 400 AND c.Status = 500',
            name: 'Test',
            objectTypeCode: 'campaign',
        },
        schemaId: 1,
        totalTargetWorkspace: 0,
        workspaceId: 10,
        sharingWorkspaces: [
            {
                id: 1,
                targetWorkspaceId: 11,
                targetWorkspace: {
                    name: 'Name',
                },
                sharingWorkspaceConfigs: [],
                __typename: 'SharingWorkspace',
            },
        ],
    },
];

export const objectDefinitions: ObjectDefinition[] = [
    {
        description: null,
        fieldName: 'id',
        fieldPath: '.id.',
        id: 2,
        isPrimaryKey: true,
        objectTypeCode: 'Campaign',
    },
    {
        description: null,
        fieldName: 'name',
        fieldPath: '.name.',
        id: 3,
        isPrimaryKey: null,
        objectTypeCode: 'Campaign',
    },
];
export const initSchemas: Schema[] = [
    {
        id: 1,
        name: 'Schema 01',
        objectTypeCode: 'Campaign',
        workspaceId: 2,
    },
    {
        id: 2,
        name: 'Schema 02',
        objectTypeCode: 'Campaign',
        workspaceId: 2,
    },
    {
        id: 3,
        name: 'Schema 03',
        objectTypeCode: 'Campaign',
        workspaceId: 2,
        schemaObjectDefinitions: [],
    },
];
export const currentWorkspaceState = atom<WorkSpaceState>(currentWorkspace);
export const sharingProps: SharingProps = {
    getSharingById: ({}) => Promise.resolve(initSharings[0]),
    createWorkspaceSharing: (p: any) => {
        return Promise.resolve(initSharings[0]);
    },
    updateWorkspaceSharing: ({}) => Promise.resolve(),
    getSharings: () => Promise.resolve({ sharings: initSharings, total: initSharings.length }),
    getSchemas: () => Promise.resolve(initSharings),
    getWorkspaceById: () => Promise.resolve(workspace),
    getWorkspaces: () => Promise.resolve([workspace]),
    deleteWorkspaceSharing: () => Promise.resolve(),
    getObjectFilters: () => Promise.resolve([{ id: 1, objectType: 'menu', name: 'Demo Filter' }]),
    isLoading: false,
    isSubmitLoading: false,
    currentWorkspaceState: currentWorkspaceState,
};
