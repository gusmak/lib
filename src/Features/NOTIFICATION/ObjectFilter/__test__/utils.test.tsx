import { checkPermissionControl, checkValid, getDifferentFieldsValue } from '../utils';

describe('checkPermissionControl ', () => {
    it('should return false', () => {
        expect(checkPermissionControl([{ id: 0 }], 0)).toBe(false);
        expect(
            checkPermissionControl(
                [
                    {
                        id: 1,
                        outputFieldPermission: {
                            objectDefinitionWithPermissions: [{ objectDefinition: { fieldName: undefined } }],
                        },
                    },
                ],
                1
            )
        ).toBe(false);
    });

    it('should return true', () => {
        expect(
            checkPermissionControl(
                [
                    {
                        id: 4,
                        outputFieldPermission: {
                            objectDefinitionWithPermissions: [
                                { objectDefinition: { fieldName: 'id' }, permission: 31 },
                            ],
                        },
                    },
                ],
                4
            )
        ).toBe(true);
    });
});

describe('checkValid', () => {
    it('should return false when all values are empty', () => {
        expect(
            checkValid({
                configType: '',
                logicalExpression: ' ',
                name: '',
                objectTypeCode: '',
            })
        ).toBe(false);
    });

    it('should return false when some values are empty', () => {
        expect(
            checkValid({
                configType: 'Place',
                logicalExpression: ' ',
                name: 'demo',
                objectTypeCode: '',
            })
        ).toBe(false);
    });

    it('should return false when some values are not exist', () => {
        expect(
            checkValid({
                configType: 'Place',
                logicalExpression: ' ',
                name: 'demo',
            })
        ).toBe(false);
    });

    it('should return false when some values are undefined', () => {
        expect(
            checkValid({
                configType: 'Place',
                logicalExpression: undefined,
                name: 'demo',
                objectTypeCode: 'Place',
            })
        ).toBe(false);
    });

    it('should return true when all values are not empty', () => {
        expect(
            checkValid({
                configType: 'OBJECT_AND_CHANGED',
                logicalExpression: 'o.id > 10',
                name: 'demo',
                objectTypeCode: 'Place',
            })
        ).toBe(true);
    });

    it('should return true when all values are not empty and have white space', () => {
        expect(
            checkValid({
                configType: 'OBJECT_AND_CHANGED',
                logicalExpression: 'o.id > 10',
                name: '    demo 1',
                objectTypeCode: 'Place     ',
            })
        ).toBe(true);
    });
});

describe('getDifferentFieldsValue', () => {
    it('should return empty object when all values are the same', () => {
        expect(
            getDifferentFieldsValue(
                {
                    configType: 'OBJECT_AND_CHANGED',
                    logicalExpression: 'o.id > 10',
                    name: 'demo',
                    objectTypeCode: 'Place',
                },
                {
                    configType: 'OBJECT_AND_CHANGED',
                    logicalExpression: 'o.id > 10',
                    name: 'demo',
                    objectTypeCode: 'Place',
                },
                [],
                []
            )
        ).toEqual({});
    });

    it('should return different fields', () => {
        expect(
            getDifferentFieldsValue(
                {
                    configType: 'OBJECT_AND_CHANGED',
                    logicalExpression: 'o.id > 10',
                    name: 'demo',
                    objectTypeCode: 'Place',
                },
                {
                    configType: 'OBJECT_AND_CHANGED',
                    logicalExpression: 'o.id > 10',
                    name: 'demo 1',
                    objectTypeCode: 'Place',
                },
                [],
                []
            )
        ).toEqual({ name: 'demo 1' });
    });
});
