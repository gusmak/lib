import { permissionComputed, getObjectTypeCodes, getListPermissionsByTabValue, getAuthenType } from '../common';
import type { Directory, DirectoryPermission, DirectoryPermissionWorkflowMatrix } from '../../types';

describe('permissionComputed', () => {
    test('should return correct permission', () => {
        const result = permissionComputed(
            [
                {
                    schemaId: 1,
                    permission: undefined,
                    authenValue: 1,
                },
                {
                    schemaId: 1,
                    permission: 3,
                    authenValue: 1,
                },
                {
                    schemaId: null,
                    permission: 1,
                },
                {
                    schemaId: null,
                },
            ],
            {
                schemaId: 1,
                authenValue: 1,
            }
        );

        expect(result).toEqual(3);
    });

    test('should return correct permission', () => {
        const result = permissionComputed(
            [
                {
                    schemaId: 1,
                    permission: 2,
                    authenValue: 1,
                },
                {
                    schemaId: 1,
                    permission: 3,
                    authenValue: 1,
                },
                {
                    schemaId: null,
                    permission: 1,
                },
                {
                    schemaId: null,
                    permission: 4,
                },
            ],
            {
                schemaId: 1,
                permission: 3,
                authenValue: 1,
            }
        );

        expect(result).toEqual(3);
    });
});

describe('getObjectTypeCodes ', () => {
    test('should return correct object type codes', () => {
        const result = getObjectTypeCodes([
            { id: 1, objectTypeCode: 'Campaign', fieldName: 'id', fieldPath: '.id.' },
            { id: 2, objectTypeCode: 'Campaign', fieldName: 'name', fieldPath: '.name.' },
            { id: 3, objectTypeCode: 'Place', fieldName: 'name', fieldPath: '.name.' },
            { id: 4, objectTypeCode: 'MediaPlan', fieldName: 'name', fieldPath: '.name.' },
        ]);

        expect(result).toEqual([
            {
                key: 'Campaign',
                value: 'Campaign',
            },
            {
                key: 'Place',
                value: 'Place',
            },
            {
                key: 'MediaPlan',
                value: 'Media Plan',
            },
        ]);
    });
});

describe('getListPermissionsByTabValue', () => {
    const explicitPermissions: DirectoryPermission[] = [
        { authenValue: 1, authenType: 'USER', workflowState: { id: 'state1' }, permission: 1 },
    ];
    const inheritedPermissions: DirectoryPermission[] = [
        { authenValue: 2, authenType: 'USER', workflowState: { id: 'state2' }, permission: 2 },
    ];
    const mockDirectory: Directory = {
        id: 1,
        name: 'Test Directory',
        workflow: {
            id: 1,
            workflowStates: [
                { id: 'state1', name: 'State 1' },
                { id: 'state2', name: 'State 2' },
            ],
        },
        explicitPermissions: explicitPermissions,
        inheritedPermissions: inheritedPermissions,
        explicitWorkflowMatrixPermissions: [],
        inheritedWorkflowMatrixPermissions: [],
    };

    it('should return an empty array if directory is undefined', () => {
        const result = getListPermissionsByTabValue(undefined, 'state1');
        expect(result).toEqual([]);
    });

    it('should return permissions for the given tab value', () => {
        const result = getListPermissionsByTabValue(mockDirectory, 'state1');
        expect(result).toHaveLength(1);
        expect(result[0].authenValue).toBe(1);
    });

    it('should return permissions for all authen types', () => {
        const explicitPermissionsAuthenTypes: DirectoryPermission[] = [
            ...explicitPermissions,
            { authenValue: 1, authenType: 'GROUP', workflowState: { id: 'state1' }, permission: 1 },
            { authenValue: 1, authenType: 'ROLE', workflowState: { id: 'state1' }, permission: 1 },
        ];
        const directoryWithMultipleAuthenTypes: Directory = {
            ...mockDirectory,
            explicitPermissions: explicitPermissionsAuthenTypes,
        };

        const result = getListPermissionsByTabValue(directoryWithMultipleAuthenTypes, 'state1');
        expect(result).toHaveLength(3);
        expect(result.map((r) => r.authenType)).toEqual(['USER', 'GROUP', 'ROLE']);
    });

    it('should add more matrix childs if workflow state exists', () => {
        const explicitWorkflowMatrixPermissions: DirectoryPermissionWorkflowMatrix[] = [
            {
                authenValue: 1,
                workflowMatrix: { stateStart: 'state1', stateStartNavigation: { id: 'state1', name: 'State 1' } },
            },
        ];
        const directoryWithMatrix: Directory = {
            ...mockDirectory,
            explicitWorkflowMatrixPermissions: explicitWorkflowMatrixPermissions,
        };

        const result = getListPermissionsByTabValue(directoryWithMatrix, 'state1');
        expect(result).toHaveLength(1);
        expect(result[0].matrices).toHaveLength(1);
        expect(result[0].matrices?.[0].stateStart).toBe('state1');
    });
});

describe('getAuthenType', () => {
    test('should return undefined', () => {
        const result = getAuthenType();
        expect(result).toEqual(undefined);
    });

    test('should return undefined when has not case', () => {
        const result = getAuthenType('demo');
        expect(result).toEqual(undefined);
    });

    test('should return correct authen ROLE type', () => {
        const result = getAuthenType('ROLE');

        expect(result).toEqual('ROLE');
    });

    test('should return correct authen USER type', () => {
        const result = getAuthenType('USER');

        expect(result).toEqual('USER');
    });

    test('should return correct authen GROUP type', () => {
        const result = getAuthenType('GROUP');

        expect(result).toEqual('GROUP');
    });
});
