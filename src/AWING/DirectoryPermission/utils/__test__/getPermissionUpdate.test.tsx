import { CurrentAuthenPermission } from '../../AddOrEdit';
import {
    getWorkflowStateIds,
    getDirectoryPermission,
    getPermissionBySchemaId,
    filterPermissionByType,
    getPermissionUpdate,
} from '../getPermissionUpdate';

describe('getWorkflowStateIds', () => {
    it('should return correct workflow state ids', () => {
        const result = getWorkflowStateIds(
            [
                {
                    schemaId: 1,
                    workflowStateId: '.100.',
                },
                {
                    schemaId: null,
                },
            ],
            1
        );
        expect(result).toEqual(['.100.']);
    });
});

describe('getDirectoryPermission ', () => {
    it('should return correct directory permissions when directory is empty', () => {
        const result = getDirectoryPermission({});
        expect(result).toEqual({
            ep: [],
            ip: [],
            ewp: [],
            iwp: [],
        });
    });

    it('should return correct directory permissions', () => {
        const result = getDirectoryPermission({
            explicitPermissions: [],
            inheritedPermissions: [],
            explicitWorkflowMatrixPermissions: [],
            inheritedWorkflowMatrixPermissions: [],
        });
        expect(result).toEqual({
            ep: [],
            ip: [],
            ewp: [],
            iwp: [],
        });
    });
});

describe('getPermissionBySchemaId ', () => {
    it('should return correct permission by schema id', () => {
        const result = getPermissionBySchemaId([
            {
                schemaId: 1,
                permission: 1,
                workflowStateId: '.100.',
            },
            {
                schemaId: 1,
                permission: 2,
                workflowStateId: '.100.',
            },
            {
                schemaId: null,
                permission: 1,
                workflowStateId: '.100.',
            },
        ]);
        expect(result).toEqual([
            {
                permissions: [1, 2],
                schemaId: 1,
                workflowStateIds: ['.100.', '.100.'],
            },
            {
                permissions: [1],
                schemaId: null,
                workflowStateIds: ['.100.'],
            },
        ]);
    });
});

describe('filterPermissionByType ', () => {
    it('should return correct permission by type', () => {
        const result = filterPermissionByType(
            [
                {
                    authenType: 'USER',
                    authenValue: 1,
                },
                {
                    authenType: 'USER',
                    authenValue: 2,
                },
                {
                    authenType: 'ROLE',
                    authenValue: 1,
                },
            ],
            {
                authenType: 'USER',
                authenValue: 1,
            }
        );
        expect(result).toEqual([
            {
                authenType: 'USER',
                authenValue: 1,
            },
        ]);
    });
});

describe('getPermissionUpdate', () => {
    it('should return correct params with authens and permissions', () => {
        const curentAuthenPermission: CurrentAuthenPermission = {
            name: 'user 1',
            authenType: 'USER',
            authenValue: 1,
            explicitPermissions: [
                {
                    permissions: [1, 2],
                    schemaId: null,
                    workflowStateIds: [],
                },
            ],
            inheritedPermissions: [
                {
                    permissions: [],
                    schemaId: null,
                    workflowStateIds: [],
                },
            ],
            explicitMatrixPermissions: [],
            inheritedMatrixPermissions: [],
        };
        const result = getPermissionUpdate(
            curentAuthenPermission,
            'USER',
            1,
            {
                explicitPermissions: [],
                inheritedPermissions: [],
                explicitWorkflowMatrixPermissions: [],
                inheritedWorkflowMatrixPermissions: [],
            },
            {
                name: 'user 1',
                authenType: 'USER',
            }
        );

        expect(result).toEqual({
            authenType: 'USER',
            authenValue: 1,
            explicitMatrixPermissions: [],
            explicitPermissions: [],
            inheritedMatrixPermissions: [],
            inheritedPermissions: [],
            name: 'user 1',
        });
    });

    it('should return correct params with authens and permissions', () => {
        const curentAuthenPermission: CurrentAuthenPermission = {
            name: 'user 1',
            authenType: 'USER',
            authenValue: 1,
            explicitPermissions: [
                {
                    permissions: [1, 2],
                    schemaId: null,
                    workflowStateIds: [],
                },
            ],
            inheritedPermissions: [
                {
                    permissions: [],
                    schemaId: null,
                    workflowStateIds: [],
                },
            ],
            explicitMatrixPermissions: [1],
            inheritedMatrixPermissions: [1],
        };
        const result = getPermissionUpdate(
            curentAuthenPermission,
            'USER',
            1,
            {
                explicitPermissions: [],
                inheritedPermissions: [],
                explicitWorkflowMatrixPermissions: [
                    {
                        authenType: 'USER',
                        authenValue: 1,
                        workflowMatrixId: 1,
                    },
                ],
                inheritedWorkflowMatrixPermissions: [
                    {
                        authenType: 'USER',
                        authenValue: 1,
                        workflowMatrixId: 1,
                    },
                ],
            },
            {}
        );

        expect(result).toEqual({
            authenType: 'USER',
            authenValue: 1,
            explicitMatrixPermissions: [1],
            explicitPermissions: [],
            inheritedMatrixPermissions: [1],
            inheritedPermissions: [],
            name: '',
        });
    });
});
