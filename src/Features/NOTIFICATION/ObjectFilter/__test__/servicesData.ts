import { ObjectFilter, ObjectFilterServices } from 'Features/NOTIFICATION/ObjectFilter';

export const initObjectFilter: ObjectFilter[] = [
    {
        id: 246,
        name: 'AAA_HN_XaLa ',
        objectTypeCode: 'MEDIA_PLAN',
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
                        fieldName: 'objectTypeCode',
                        fieldPath: '.objectTypeCode.',
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
        name: 'WMP_6771_WMd',
        objectTypeCode: 'MEDIA_PLAN',
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
                        fieldName: 'objectTypeCode',
                        fieldPath: '.objectTypeCode.',
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
        objectTypeCode: 'MEDIA_PLAN',
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
                        fieldName: 'objectTypeCode',
                        fieldPath: '.objectTypeCode.',
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
        return Promise.resolve({ objectFilter: initObjectFilter[0] });
    },
    createObjectFilter(p) {
        return Promise.resolve();
    },
    updateObjectFilter(p) {
        return Promise.resolve();
    },
};
