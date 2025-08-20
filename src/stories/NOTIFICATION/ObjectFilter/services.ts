import { ObjectFilter, ObjectFilterServices } from 'Features/NOTIFICATION/ObjectFilter';

export const initObjectFilter: ObjectFilter[] = [
    {
        id: 246,
        name: 'HN_XaLa ',
        objectTypeCode: 'CAMPAIGN',
        logicalExpression: 'any(o.BillCustomer.Brands) = false ',
        configType: 'OBJECT_AND_CHANGED',
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectType',
                        fieldPath: '.objectType.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'logicalExpression',
                        fieldPath: '.logicalExpression.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'configType',
                        fieldPath: '.configType.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
            ],
        },
    },
    {
        id: 245,
        name: 'Demo Menu',
        objectTypeCode: 'MENU',
        logicalExpression: 'any(o.BillCustomer.Brands) = false ',
        configType: 'OBJECT_AND_CHANGED',
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectType',
                        fieldPath: '.objectType.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'logicalExpression',
                        fieldPath: '.logicalExpression.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'configType',
                        fieldPath: '.configType.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
            ],
        },
    },
    {
        id: 244,
        name: 'Sub-Campaign',
        objectTypeCode: 'CAMPAIGN',
        logicalExpression: 'c.BillCustomer.Brands.0.CustomerId = o.BillCustomer.Id ',
        configType: 'OBJECT_AND_CHANGED',
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectType',
                        fieldPath: '.objectType.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'logicalExpression',
                        fieldPath: '.logicalExpression.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'configType',
                        fieldPath: '.configType.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
            ],
        },
    },
];

export const services: ObjectFilterServices = {
    getObjectFilters: (p) => {
        return Promise.resolve({
            items: initObjectFilter,
            totalCount: initObjectFilter.length,
        });
    },
    deleteObjectFilter: (p) => {
        return Promise.resolve();
    },
    getObjectFilterById: (p) => {
        return Promise.resolve({ objectFilter: initObjectFilter.find((x) => x.id === p.id) });
    },
    createObjectFilter(p) {
        return Promise.resolve();
    },
    updateObjectFilter(p) {
        return Promise.resolve();
    },
};
