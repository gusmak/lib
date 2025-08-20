import {
    countEnableFields,
    getObjectTypeCodes,
    getParentNames,
    convertToDisplayData,
    getFieldChilds,
    getRootSchema,
    getChilds,
    addChilds,
    convertToTreeData,
    addFieldChildsToRestFields,
    recursionFields,
    getCurrentSchemaFields,
    getCurrentSchemaFieldsWithChecked,
    getSchemaInput,
} from '../utils';
import { ConvertObjectDefinition } from '../types';

const data: ConvertObjectDefinition[] = [
    {
        fieldName: 'id',
        fieldPath: '.id.',
        fieldType: '',
        id: 29,
        objectTypeCode: 'MediaPlan',
    },
    {
        fieldName: 'name',
        fieldPath: '.name.',
        fieldType: '',
        id: 1,
        objectTypeCode: 'MediaPlan',
    },
    {
        fieldName: 'mediaPlanAcceptances',
        fieldPath: '.mediaPlanAcceptances.',
        fieldType: '',
        id: 60,
        isEnable: true,
        isReadOnly: undefined,
        objectTypeCode: 'MediaPlan',
        childs: [
            {
                fieldName: 'customerId',
                fieldPath: '.mediaPlanAcceptances.{customerId}.',
                fieldType: '',
                id: 61,
                isEnable: true,
                isReadOnly: undefined,
                objectTypeCode: 'MediaPlan',
            },
        ],
    },
];

describe('getObjectTypeCodes', () => {
    it('get all object type codes', () => {
        const result = getObjectTypeCodes(data);

        expect(result).toEqual([
            {
                key: 'MediaPlan',
                value: 'Media Plan',
            },
        ]);
    });
});

describe('countEnableFields', () => {
    it('count all field recursion', () => {
        const result = countEnableFields(data);

        expect(result).toBe(4);
    });
});

describe('getParentNames', () => {
    it('get parent names', () => {
        const result = getParentNames('.mediaPlanAcceptances.{customerId}.');

        expect(result).toEqual(['mediaPlanAcceptances']);
    });
});

describe('convertToDisplayData', () => {
    it('convert to display data return empty', () => {
        const result = convertToDisplayData();

        expect(result).toEqual([]);
    });

    it('convert to display data not has rootSchema ', () => {
        const result = convertToDisplayData([
            {
                fieldName: 'id',
                fieldPath: '.id.',
                fieldType: '',
                id: 29,
                objectTypeCode: 'MediaPlan',
            },
            {
                fieldName: 'name',
                fieldPath: '.name.',
                fieldType: '',
                id: 1,
                objectTypeCode: 'MediaPlan',
            },
        ]);

        expect(result).toEqual([
            {
                fieldName: 'id',
                fieldPath: '.id.',
                fieldType: '',
                id: 29,
                isEnable: true,
                isReadOnly: undefined,
                objectTypeCode: 'MediaPlan',
            },
            {
                fieldName: 'name',
                fieldPath: '.name.',
                fieldType: '',
                id: 1,
                isEnable: true,
                isReadOnly: undefined,
                objectTypeCode: 'MediaPlan',
            },
        ]);
    });

    it('convert to display data', () => {
        const result = convertToDisplayData(
            [
                {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    fieldType: '',
                    id: 29,
                    objectTypeCode: 'MediaPlan',
                },
                {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    fieldType: '',
                    id: 1,
                    objectTypeCode: 'MediaPlan',
                },
                {
                    fieldName: 'mediaPlanAcceptances',
                    fieldPath: '.mediaPlanAcceptances.',
                    fieldType: '',
                    id: 12,
                    objectTypeCode: 'MediaPlan',
                },
                {
                    fieldName: '{customerId}',
                    fieldPath: '.mediaPlanAcceptances.{customerId}.',
                    fieldType: '',
                    id: 13,
                    objectTypeCode: 'MediaPlan',
                },
            ],
            {
                id: 1,
                name: 'name',
                objectTypeCode: 'MediaPlan',
                schemaObjectDefinitions: [
                    {
                        id: 1,
                        isReadOnly: true,
                        objectDefinition: {
                            fieldName: 'id',
                            fieldPath: '.id.',
                            fieldType: '',
                            id: 29,
                            objectTypeCode: 'MediaPlan',
                        },
                    },
                    {
                        id: 2,
                        isReadOnly: true,
                        objectDefinition: {
                            fieldName: 'mediaPlanAcceptances',
                            fieldPath: '.mediaPlanAcceptances.',
                            fieldType: '',
                            id: 12,
                            objectTypeCode: 'MediaPlan',
                        },
                    },
                    {
                        id: 3,
                        isReadOnly: true,
                        objectDefinition: {
                            fieldName: 'customerId',
                            fieldPath: '.mediaPlanAcceptances.{customerId}.',
                            fieldType: '',
                            id: 13,
                            objectTypeCode: 'MediaPlan',
                        },
                    },
                    {
                        id: 3,
                        isReadOnly: false,
                    },
                ],
            }
        );

        expect(result).toEqual([
            {
                fieldName: 'id',
                fieldPath: '.id.',
                fieldType: '',
                id: 29,
                isEnable: true,
                isReadOnly: true,
                objectTypeCode: 'MediaPlan',
            },
            {
                fieldName: 'mediaPlanAcceptances',
                fieldPath: '.mediaPlanAcceptances.',
                fieldType: '',
                id: 12,
                isEnable: true,
                isReadOnly: true,
                objectTypeCode: 'MediaPlan',
            },
            {
                fieldName: '{customerId}',
                fieldPath: '.mediaPlanAcceptances.{customerId}.',
                fieldType: '',
                id: 13,
                isEnable: true,
                isReadOnly: true,
                objectTypeCode: 'MediaPlan',
            },
        ]);
    });
});

describe('getFieldChilds ', () => {
    it('get field childs', () => {
        const result = getFieldChilds({
            fieldName: 'mediaPlanAcceptances',
            fieldPath: '.mediaPlanAcceptances.',
            fieldType: '',
            id: 60,
            isEnable: true,
            isReadOnly: undefined,
            objectTypeCode: 'MediaPlan',
            childs: [
                {
                    fieldName: 'customerId',
                    fieldPath: '.mediaPlanAcceptances.{customerId}.',
                    fieldType: '',
                    id: 61,
                    isEnable: true,
                    isReadOnly: undefined,
                    objectTypeCode: 'MediaPlan',
                },
            ],
        });

        expect(result).toEqual([
            {
                isReadOnly: false,
                objectDefinition: {
                    fieldName: 'customerId',
                    fieldPath: '.mediaPlanAcceptances.{customerId}.',
                    fieldType: '',
                    id: 61,
                    isEnable: true,
                    isReadOnly: undefined,
                    objectTypeCode: 'MediaPlan',
                },
                objectDefinitionId: 61,
            },
        ]);
    });

    it('get field childs not has childs', () => {
        const result = getFieldChilds({
            fieldName: 'mediaPlanAcceptances',
            fieldPath: '.mediaPlanAcceptances.',
            fieldType: '',
            id: 60,
            isEnable: true,
            isReadOnly: undefined,
            objectTypeCode: 'MediaPlan',
        });

        expect(result).toEqual([]);
    });
});

describe('getRootSchema', () => {
    it('rsult is undefined', () => {
        const result1 = getRootSchema();
        expect(result1).toEqual(undefined);
        const result2 = getRootSchema([]);
        expect(result2).toEqual(undefined);
        const result3 = getRootSchema(
            [
                {
                    id: 1,
                    name: 'Schema 01',
                    objectTypeCode: 'Campaign1',
                    workspaceId: 2,
                },
            ],
            {
                id: 1,
                name: 'Schema 02',
                objectTypeCode: 'Campaign2',
                workspaceId: 2,
            }
        );
        expect(result3).toEqual(undefined);
    });

    it('get', () => {
        const result = getRootSchema(
            [
                {
                    id: 1,
                    name: 'Schema 01',
                    objectTypeCode: 'Campaign1',
                    workspaceId: 2,
                },
                {
                    id: 2,
                    name: 'Schema 02',
                    objectTypeCode: 'Campaign2',
                    workspaceId: 2,
                    schemaObjectDefinitions: [
                        {
                            objectDefinitionId: 2,
                        },
                    ],
                },
                {
                    id: 3,
                    name: 'Schema 03',
                    objectTypeCode: 'Campaign3',
                    workspaceId: 2,
                    schemaObjectDefinitions: [],
                },
            ],
            {
                id: 2,
                name: 'Schema 02',
                objectTypeCode: 'Campaign2',
                workspaceId: 2,
                schemaObjectDefinitions: [
                    {
                        objectDefinitionId: 2,
                    },
                ],
            }
        );
        expect(result).toEqual({
            id: 2,
            name: 'Schema 02',
            objectTypeCode: 'Campaign2',
            workspaceId: 2,
            schemaObjectDefinitions: [
                {
                    objectDefinitionId: 2,
                },
            ],
        });
    });
});

describe('getChilds', () => {
    it('get childs', () => {
        const result = getChilds(
            [
                {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    fieldType: '',
                    id: 29,
                    objectTypeCode: 'MediaPlan',
                },
                {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    fieldType: '',
                    id: 1,
                    objectTypeCode: 'MediaPlan',
                },
                {
                    fieldName: 'mediaPlanAcceptances',
                    fieldPath: '.mediaPlanAcceptances.',
                    fieldType: '',
                    id: 12,
                    objectTypeCode: 'MediaPlan',
                },
                {
                    fieldName: '{customerId}',
                    fieldPath: '.mediaPlanAcceptances.{customerId}.',
                    fieldType: '',
                    id: 13,
                    objectTypeCode: 'MediaPlan',
                },
            ],
            {
                fieldName: 'mediaPlanAcceptances',
                fieldPath: '.mediaPlanAcceptances.',
                fieldType: '',
                id: 60,
                isEnable: true,
                isReadOnly: undefined,
                objectTypeCode: 'MediaPlan',
            }
        );

        expect(result).toEqual([
            {
                fieldName: '{customerId}',
                fieldPath: '.mediaPlanAcceptances.{customerId}.',
                fieldType: '',
                id: 13,
                objectTypeCode: 'MediaPlan',
            },
        ]);
    });
});

describe('addChilds', () => {
    it('add childs', () => {
        const result = addChilds(
            [
                {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    fieldType: '',
                    id: 29,
                    objectTypeCode: 'MediaPlan',
                },
                {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    fieldType: '',
                    id: 1,
                    objectTypeCode: 'MediaPlan',
                },
                {
                    fieldName: 'mediaPlanAcceptances',
                    fieldPath: '.mediaPlanAcceptances.',
                    fieldType: '',
                    id: 12,
                    objectTypeCode: 'MediaPlan',
                },
                {
                    fieldName: '{customerId}',
                    fieldPath: '.mediaPlanAcceptances.{customerId}.',
                    fieldType: '',
                    id: 13,
                    objectTypeCode: 'MediaPlan',
                },
            ],
            {
                fieldName: 'mediaPlanAcceptances',
                fieldPath: '.mediaPlanAcceptances.',
                fieldType: '',
                id: 60,
                isEnable: true,
                isReadOnly: undefined,
                objectTypeCode: 'MediaPlan',
            }
        );

        expect(result).toEqual({
            fieldName: 'mediaPlanAcceptances',
            fieldPath: '.mediaPlanAcceptances.',
            fieldType: '',
            id: 60,
            isEnable: true,
            isReadOnly: undefined,
            objectTypeCode: 'MediaPlan',
            childs: [
                {
                    fieldName: '{customerId}',
                    fieldPath: '.mediaPlanAcceptances.{customerId}.',
                    fieldType: '',
                    id: 13,
                    objectTypeCode: 'MediaPlan',
                },
            ],
        });
    });
});

describe('convertToTreeData ', () => {
    it('convert to tree data', () => {
        const result = convertToTreeData(data);

        expect(result).toEqual([
            {
                fieldName: 'id',
                fieldPath: '.id.',
                fieldType: '',
                id: 29,
                objectTypeCode: 'MediaPlan',
            },
            {
                fieldName: 'name',
                fieldPath: '.name.',
                fieldType: '',
                id: 1,
                objectTypeCode: 'MediaPlan',
            },
            {
                childs: [
                    {
                        fieldName: 'customerId',
                        fieldPath: '.mediaPlanAcceptances.{customerId}.',
                        fieldType: '',
                        id: 61,
                        isEnable: true,
                        isReadOnly: undefined,
                        objectTypeCode: 'MediaPlan',
                    },
                ],
                fieldName: 'mediaPlanAcceptances',
                fieldPath: '.mediaPlanAcceptances.',
                fieldType: '',
                id: 60,
                isEnable: true,
                isReadOnly: undefined,
                objectTypeCode: 'MediaPlan',
            },
        ]);
    });
});

describe('addFieldChildsToRestFields', () => {
    it('add field childs to rest fields', () => {
        const result = addFieldChildsToRestFields(
            [
                {
                    objectDefinitionId: 1,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        fieldType: '',
                        id: 29,
                        objectTypeCode: 'MediaPlan',
                    },
                    isReadOnly: true,
                },
                {
                    objectDefinitionId: 2,
                    objectDefinition: {
                        fieldName: 'mediaPlanAcceptances',
                        fieldPath: '.mediaPlanAcceptances.',
                        fieldType: '',
                        id: 12,
                        objectTypeCode: 'MediaPlan',
                        childs: [
                            {
                                fieldName: 'customerId',
                                fieldPath: '.mediaPlanAcceptances.{customerId}.',
                                fieldType: '',
                                id: 13,
                                objectTypeCode: 'MediaPlan',
                            },
                        ],
                    },
                    isReadOnly: true,
                },
                {
                    objectDefinitionId: 3,
                    objectDefinition: {
                        fieldName: 'customerId',
                        fieldPath: '.mediaPlanAcceptances.{customerId}.',
                        fieldType: '',
                        id: 13,
                        objectTypeCode: 'MediaPlan',
                    },
                    isReadOnly: true,
                },
            ],
            [
                {
                    id: 60,
                    isReadOnly: true,
                },
                {
                    id: 61,
                    isReadOnly: true,
                },
            ]
        );

        expect(result).toEqual(undefined);
    });
});

describe('recursionFields', () => {
    it('expect result', () => {
        const demo = [
            {
                id: 2,
                objectTypeCode: 'Campaign',
                fieldName: 'name',
                fieldPath: '.name.',
            },
            {
                id: 3,
                objectTypeCode: 'Campaign',
                fieldName: 'root',
                fieldPath: '.root.',
                childs: [{ id: 4, objectTypeCode: 'Campaign', fieldName: 'root1', fieldPath: '.root.root1.' }],
            },
        ];

        const schemas = [
            {
                id: 2,
                isReadOnly: true,
                objectDefinitionId: 2,
                objectDefinition: {},
            },
        ];

        const result = recursionFields(demo, schemas);
        expect(result).toEqual([
            {
                isReadOnly: true,
                objectDefinition: {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 2,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 2,
            },
            {
                isReadOnly: false,
                objectDefinition: {
                    fieldName: 'root1',
                    fieldPath: '.root.root1.',
                    id: 4,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 4,
            },
            {
                isReadOnly: false,
                objectDefinition: {
                    childs: [
                        {
                            fieldName: 'root1',
                            fieldPath: '.root.root1.',
                            id: 4,
                            objectTypeCode: 'Campaign',
                        },
                    ],
                    fieldName: 'root',
                    fieldPath: '.root.',
                    id: 3,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 3,
            },
        ]);
    });
});

describe('getCurrentSchemaFields', () => {
    it('expect result', () => {
        const result = getCurrentSchemaFields(
            [
                {
                    id: 1,
                    fieldName: 'id',
                    fieldPath: '.id.',
                    objectTypeCode: 'Campaign',
                },
                {
                    id: 1,
                    fieldName: 'name',
                    fieldPath: '.name.',
                    objectTypeCode: 'Campaign',
                },
            ],
            [
                {
                    objectDefinitionId: 1,
                    objectDefinition: {
                        id: 1,
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'Campaign',
                    },
                    isReadOnly: true,
                },
                {
                    objectDefinitionId: 1,
                    objectDefinition: {
                        id: 2,
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'Campaign',
                    },
                    isReadOnly: true,
                },
            ],
            {
                id: 1,
                fieldName: 'name',
                fieldPath: '.name.',
                objectTypeCode: 'Campaign',
            }
        );

        expect(result).toEqual([
            {
                isReadOnly: true,
                objectDefinition: {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 2,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 1,
            },
        ]);
    });
});

describe('getCurrentSchemaFieldsWithChecked', () => {
    it('expect result', () => {
        const result = getCurrentSchemaFieldsWithChecked(
            [
                {
                    id: 1,
                    fieldName: 'id',
                    fieldPath: '.id.',
                    objectTypeCode: 'Campaign',
                },
                {
                    id: 1,
                    fieldName: 'name',
                    fieldPath: '.name.',
                    objectTypeCode: 'Campaign',
                },
            ],
            [
                {
                    objectDefinitionId: 1,
                    objectDefinition: {
                        id: 1,
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'Campaign',
                    },
                    isReadOnly: true,
                },
                {
                    objectDefinitionId: 1,
                    objectDefinition: {
                        id: 2,
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'Campaign',
                    },
                    isReadOnly: true,
                },
            ],
            {
                id: 1,
                fieldName: 'name',
                fieldPath: '.name.',
                objectTypeCode: 'Campaign',
            }
        );

        expect(result).toEqual([
            {
                isReadOnly: true,
                objectDefinition: {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    id: 1,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 1,
            },
            {
                isReadOnly: true,
                objectDefinition: {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 2,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 1,
            },
        ]);
    });

    it('fieldInfo  has childs', () => {
        const result = getCurrentSchemaFieldsWithChecked(
            [
                {
                    id: 1,
                    fieldName: 'id',
                    fieldPath: '.id.',
                    objectTypeCode: 'Campaign',
                },
                {
                    id: 1,
                    fieldName: 'name',
                    fieldPath: '.name.',
                    objectTypeCode: 'Campaign',
                },
            ],
            [
                {
                    objectDefinitionId: 1,
                    objectDefinition: {
                        id: 1,
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'Campaign',
                    },
                    isReadOnly: true,
                },
                {
                    objectDefinitionId: 1,
                    objectDefinition: {
                        id: 2,
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'Campaign',
                    },
                    isReadOnly: true,
                },
            ],
            {
                id: 1,
                fieldName: 'name',
                fieldPath: '.name.',
                objectTypeCode: 'Campaign',
                childs: [
                    {
                        id: 11,
                        fieldName: 'path2',
                        fieldPath: '.name.path2.',
                        objectTypeCode: 'Campaign',
                    },
                    {
                        id: 12,
                        fieldName: 'path3',
                        fieldPath: '.name.path3.',
                        objectTypeCode: 'Campaign',
                    },
                ],
            }
        );

        expect(result).toEqual([
            {
                isReadOnly: true,
                objectDefinition: {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    id: 1,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 1,
            },
            {
                isReadOnly: true,
                objectDefinition: {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    id: 2,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 1,
            },
            {
                isReadOnly: false,
                objectDefinition: {
                    fieldName: 'path2',
                    fieldPath: '.name.path2.',
                    id: 11,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 11,
            },
            {
                isReadOnly: false,
                objectDefinition: {
                    fieldName: 'path3',
                    fieldPath: '.name.path3.',
                    id: 12,
                    objectTypeCode: 'Campaign',
                },
                objectDefinitionId: 12,
            },
        ]);
    });
});

describe('getSchemaInput', () => {
    it('result', () => {
        const result = getSchemaInput([], []);

        expect(result).toEqual([]);
    });
    it('result', () => {
        const result = getSchemaInput(
            [
                {
                    objectDefinitionId: 11,
                    objectDefinition: {
                        id: 2,
                        isPrimaryKey: true,
                    },
                    isReadOnly: !!false,
                    id: 1,
                },
                {
                    objectDefinitionId: 12,
                    objectDefinition: {
                        id: 3,
                    },
                    isReadOnly: !!false,
                    id: 2,
                },
            ],
            [
                {
                    objectDefinitionId: 12,
                    objectDefinition: {
                        id: 3,
                    },
                    isReadOnly: false,
                    id: 2,
                },
                {
                    objectDefinitionId: 15,
                    objectDefinition: {
                        id: 5,
                    },
                    isReadOnly: false,
                    id: 3,
                },
            ]
        );

        expect(result).toEqual([
            {
                value: {
                    isReadOnly: false,
                    objectDefinitionId: 11,
                },
            },
            {
                key: 3,
            },
        ]);
    });
});
