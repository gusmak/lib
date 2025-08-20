import { SchemaServices, Schema, ObjectDefinition } from 'Features/SYSTEM/Schema';
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
                        description: null,
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
                        description: null,
                        fieldName: 'name',
                        fieldPath: '.name.',
                        id: 3,
                        isPrimaryKey: null,
                        objectTypeCode: 'Campaign',
                    },
                },
            ],
        },
    ],
};

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
                    description: null,
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
                    description: null,
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
                    description: null,
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
                    description: null,
                    fieldName: 'field1',
                    fieldPath: '.field1.',
                    id: 8,
                    isPrimaryKey: null,
                    objectTypeCode: 'Place',
                },
            },
            {
                id: 42,
                isReadOnly: false,
                objectDefinitionId: 13,
                schemaId: 17,
                objectDefinition: {
                    description: null,
                    fieldName: 'idOfRoot',
                    fieldPath: '.root1.idOfRoot.',
                    id: 13,
                    isPrimaryKey: null,
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
                    description: null,
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
                    description: null,
                    fieldName: 'idOfRoot',
                    fieldPath: '.root1.idOfRoot.',
                    id: 13,
                    isPrimaryKey: null,
                    objectTypeCode: 'Place',
                },
            },
            {
                id: 38,
                isReadOnly: false,
                objectDefinitionId: 7,
                schemaId: 15,
                objectDefinition: {
                    description: null,
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 7,
                    isPrimaryKey: null,
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
                    description: null,
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
                    description: null,
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 3,
                    isPrimaryKey: null,
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
                    description: null,
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
                    description: null,
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 3,
                    isPrimaryKey: null,
                    objectTypeCode: 'Campaign',
                },
            },
        ],
    },
];

export const objectDefinitions: ObjectDefinition[] = [
    {
        description: null,
        fieldName: 'field1',
        fieldPath: '.field1.',
        id: 4,
        isPrimaryKey: null,
        objectTypeCode: 'Campaign',
    },
    {
        description: null,
        fieldName: 'field1',
        fieldPath: '.field1.',
        id: 8,
        isPrimaryKey: null,
        objectTypeCode: 'Place',
    },
    {
        description: null,
        fieldName: 'field2',
        fieldPath: '.field2.',
        id: 5,
        isPrimaryKey: null,
        objectTypeCode: 'Campaign',
    },
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
        fieldName: 'id',
        fieldPath: '.id.',
        id: 6,
        isPrimaryKey: true,
        objectTypeCode: 'Place',
    },
    {
        description: null,
        fieldName: 'name',
        fieldPath: '.name.',
        id: 3,
        isPrimaryKey: null,
        objectTypeCode: 'Campaign',
    },
    {
        description: null,
        fieldName: 'name',
        fieldPath: '.name.',
        id: 7,
        isPrimaryKey: null,
        objectTypeCode: 'Place',
    },
    {
        description: null,
        fieldName: 'root1',
        fieldPath: '.root1.',
        id: 9,
        isPrimaryKey: null,
        objectTypeCode: 'Campaign',
    },
    {
        description: null,
        fieldName: 'root1',
        fieldPath: '.root1.',
        id: 12,
        isPrimaryKey: null,
        objectTypeCode: 'Place',
    },
    {
        description: null,
        fieldName: 'idOfRoot',
        fieldPath: '.root1.idOfRoot.',
        id: 10,
        isPrimaryKey: null,
        objectTypeCode: 'Campaign',
    },
    {
        description: null,
        fieldName: 'idOfRoot',
        fieldPath: '.root1.idOfRoot.',
        id: 13,
        isPrimaryKey: null,
        objectTypeCode: 'Place',
    },
    {
        description: null,
        fieldName: 'nameOfRoot',
        fieldPath: '.root1.nameOfRoot.',
        id: 11,
        isPrimaryKey: null,
        objectTypeCode: 'Campaign',
    },
    {
        description: null,
        fieldName: 'nameOfRoot',
        fieldPath: '.root1.nameOfRoot.',
        id: 14,
        isPrimaryKey: null,
        objectTypeCode: 'Place',
    },
];

export const services: SchemaServices = {
    getSchemas: (_p) => {
        return Promise.resolve({
            items: initSchemas,
            total: initSchemas.length,
        });
    },
    createSchema: (_p) => {
        return Promise.resolve();
    },
    updateSchema: (_p) => {
        return Promise.resolve();
    },
    deleteSchema: (_p) => {
        return Promise.resolve();
    },
    getObjectDefinitions: (_p) => {
        return Promise.resolve({
            objectDefinitions,
            items: objectDefinitions,
            total: objectDefinitions.length,
        });
    },
    getSchemaById: (p) => {
        const schema = [...(currentWorkspace?.defaultSchemas ?? []), ...initSchemas].find((role) => role.id === p.id);
        return Promise.resolve(schema ?? {});
    },
};
