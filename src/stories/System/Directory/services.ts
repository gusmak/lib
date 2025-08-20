import { DirectoryServices, Directory } from 'Features/SYSTEM/Directory';
import { Schema } from 'AWING/DirectoryPermission/types';
import { CurrentWorkspace } from 'Features/SYSTEM/types';

export const currentWorkspace: CurrentWorkspace = {
    customerId: 10,
    customerType: 'Customer Type 10',
    description: 'Description 10',
    id: 10,
    isJoinNetwork: true,
    name: 'Workspace 10',
    type: 'ACM',
    url: 'Url 5',
    defaultSchemas: [
        {
            id: 1,
            name: 'Default Schema',
            objectTypeCode: 'Campaign',
            workspaceId: 0,
            schemaObjectDefinitions: [
                {
                    id: 2,
                    isReadOnly: false,
                    objectDefinitionId: 2,
                    schemaId: 1,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        id: 2,
                        isPrimaryKey: true,
                        objectTypeCode: 'Campaign',
                    },
                },
                {
                    id: 3,
                    isReadOnly: true,
                    objectDefinitionId: 3,
                    schemaId: 1,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        id: 3,
                        objectTypeCode: 'Campaign',
                    },
                },
            ],
        },
    ],
};

export const initDirectories: Directory[] = [
    {
        directoryPath: '.0.10.',
        id: 10,
        isFile: false,
        isSystem: true,
        level: 1,
        name: 'ACM',
        objectId: 10,
        objectTypeCode: 'directory',
        order: 0,
        parentObjectId: 0,
    },
    {
        directoryPath: '.0.10.21.',
        id: 1005,
        isFile: false,
        isSystem: true,
        level: 2,
        name: 'SHARE',
        objectId: 21,
        objectTypeCode: 'share',
        order: 0,
        parentObjectId: 10,
    },
    {
        directoryPath: '.0.10.21.1006.',
        id: 1006,
        isFile: false,
        isSystem: true,
        level: 3,
        name: 'Cấu hình chia sẻ 1',
        objectId: 1006,
        objectTypeCode: 'directory',
        order: 0,
        parentObjectId: 21,
    },
    {
        directoryPath: '.0.10.21.1006.27.',
        id: 1143,
        isFile: true,
        isSystem: false,
        level: 4,
        name: 'Nhóm địa điểm',
        objectId: 27,
        objectTypeCode: 'menu',
        order: 0,
        parentObjectId: 1006,
    },
];

export const initSchemas: Schema[] = [
    {
        id: 19,
        name: '111',
        objectTypeCode: 'Campaign',
        workspaceId: 10,
        schemaObjectDefinitions: [
            {
                id: 44,
                isReadOnly: true,
                objectDefinitionId: 2,
                schemaId: 19,
                objectDefinition: {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    id: 2,
                    isPrimaryKey: true,
                    objectTypeCode: 'Campaign',
                },
            },
        ],
    },
    {
        id: 18,
        name: 'test Campaign lần 2',
        objectTypeCode: 'Campaign',
        workspaceId: 10,
        schemaObjectDefinitions: [
            {
                id: 43,
                isReadOnly: false,
                objectDefinitionId: 2,
                schemaId: 18,
                objectDefinition: {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    id: 2,
                    isPrimaryKey: true,
                    objectTypeCode: 'Campaign',
                },
            },
        ],
    },
    {
        id: 17,
        name: 'Test lần 2',
        objectTypeCode: 'Place',
        workspaceId: 10,
        schemaObjectDefinitions: [
            {
                id: 40,
                isReadOnly: false,
                objectDefinitionId: 6,
                schemaId: 17,
                objectDefinition: {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    id: 6,
                    isPrimaryKey: true,
                    objectTypeCode: 'Place',
                },
            },
            {
                id: 41,
                isReadOnly: false,
                objectDefinitionId: 8,
                schemaId: 17,
                objectDefinition: {
                    fieldName: 'field1',
                    fieldPath: '.field1.',
                    id: 8,

                    objectTypeCode: 'Place',
                },
            },
            {
                id: 42,
                isReadOnly: false,
                objectDefinitionId: 13,
                schemaId: 17,
                objectDefinition: {
                    fieldName: 'idOfRoot',
                    fieldPath: '.root1.idOfRoot.',
                    id: 13,

                    objectTypeCode: 'Place',
                },
            },
        ],
    },
    {
        id: 15,
        name: 'Test schema place',
        objectTypeCode: 'Place',
        workspaceId: 10,
        schemaObjectDefinitions: [
            {
                id: 36,
                isReadOnly: false,
                objectDefinitionId: 6,
                schemaId: 15,
                objectDefinition: {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    id: 6,
                    isPrimaryKey: true,
                    objectTypeCode: 'Place',
                },
            },
            {
                id: 37,
                isReadOnly: false,
                objectDefinitionId: 13,
                schemaId: 15,
                objectDefinition: {
                    fieldName: 'idOfRoot',
                    fieldPath: '.root1.idOfRoot.',
                    id: 13,

                    objectTypeCode: 'Place',
                },
            },
            {
                id: 38,
                isReadOnly: false,
                objectDefinitionId: 7,
                schemaId: 15,
                objectDefinition: {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 7,

                    objectTypeCode: 'Place',
                },
            },
        ],
    },
    {
        id: 13,
        name: '05/03/2024 - 12/03/2024',
        objectTypeCode: 'Campaign',
        workspaceId: 10,
        schemaObjectDefinitions: [
            {
                id: 31,
                isReadOnly: false,
                objectDefinitionId: 2,
                schemaId: 13,
                objectDefinition: {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    id: 2,
                    isPrimaryKey: true,
                    objectTypeCode: 'Campaign',
                },
            },
            {
                id: 32,
                isReadOnly: true,
                objectDefinitionId: 3,
                schemaId: 13,
                objectDefinition: {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 3,

                    objectTypeCode: 'Campaign',
                },
            },
        ],
    },
    {
        id: 11,
        name: 'Demo Schema 02',
        objectTypeCode: 'Campaign',
        workspaceId: 10,
        schemaObjectDefinitions: [
            {
                id: 25,
                isReadOnly: false,
                objectDefinitionId: 2,
                schemaId: 11,
                objectDefinition: {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    id: 2,
                    isPrimaryKey: true,
                    objectTypeCode: 'Campaign',
                },
            },
            {
                id: 26,
                isReadOnly: true,
                objectDefinitionId: 3,
                schemaId: 11,
                objectDefinition: {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 3,

                    objectTypeCode: 'Campaign',
                },
            },
        ],
    },
];

export const services: DirectoryServices = {
    getDirectories: (_p) => {
        return Promise.resolve({
            items: initDirectories,
            total: initDirectories.length,
        });
    },

    addDirectoryPermission: (_p) => Promise.resolve(),
    deleteDirectoryPermission: (_p) => Promise.resolve(),
    getObjectDefinitions: (_p) => Promise.resolve({ items: [], total: 0 }),
    createDirectory: (_p) => Promise.resolve(),
    updateDirectory: (_p) => Promise.resolve(),
    deleteDirectory: (_p) => Promise.resolve(),
    getDirectoryById: (_p) =>
        Promise.resolve({
            id: 1,
            name: '',
            directoryPath: '',
            isSystem: false,
            level: 1,
            order: 1,
            parentObjectId: 1,
        }),

    getSchemas: (p) =>
        Promise.resolve({
            items: initSchemas,
            total: initSchemas.length,
        }),

    getGroups: () => Promise.resolve({ items: [], total: 0 }),
    getRoles: () => Promise.resolve({ items: [], total: 0 }),
    getUsers: () => Promise.resolve({ items: [], total: 0 }),
    createSchema: (_p) => Promise.resolve(),
    getSchemaById: (_p) => Promise.resolve({}),
};
