import { isValid, compareWorkflowState, addMoreChilds, convertDirectoryPermissionData } from '../convertDirectoryPermission';

describe('isValid', () => {
    it('should return undefined', () => {
        const result = isValid([], {}, '.100.');
        expect(result).toEqual(undefined);
    });

    it('should return undefined when stateId has undefined', () => {
        const result = isValid([], {
            authenValue: 1,
            schemaId: 1,
            permission: 1,
        });
        expect(result).toEqual(undefined);
    });

    it('should return corect', () => {
        const result = isValid(
            [
                {
                    authenValue: 1,
                    schemaId: 1,
                    permission: 1,
                    workflowState: {
                        id: '.100.',
                    },
                },
                {
                    authenValue: 2,
                    schemaId: 1,
                    permission: 3,
                },
            ],
            {
                authenValue: 1,
                schemaId: 1,
                permission: 1,
            },
            '.100.'
        );
        expect(result).toEqual({
            authenValue: 1,
            permission: 1,
            schemaId: 1,
            workflowState: {
                id: '.100.',
            },
        });
    });
});

describe('compareWorkflowState ', () => {
    it('should return empty array', () => {
        const result = compareWorkflowState([], [], { id: '.100.' });
        expect(result).toEqual([]);
    });

    it('should return correct', () => {
        const result = compareWorkflowState(
            [
                {
                    authenValue: 1,
                    schemaId: 1,
                    permission: 1,
                    workflowState: {
                        id: '.100.',
                    },
                },
                {
                    authenValue: 2,
                    schemaId: 1,
                    permission: 3,
                },
            ],
            [
                {
                    authenValue: 1,
                    schemaId: 1,
                    permission: 1,
                },
                {
                    authenValue: 2,
                    schemaId: 1,
                    permission: 3,
                },
            ],
            { id: '.100.' }
        );
        expect(result).toEqual([
            {
                authenValue: 2,
                permission: 3,
                schemaId: 1,
                workflowState: {
                    id: '.100.',
                },
                workflowStateId: '.100.',
            },
        ]);
    });
});

describe('addMoreChilds ', () => {
    it('should return empty array', () => {
        const result = addMoreChilds([], []);
        expect(result).toEqual([]);
    });

    it('should return correct empty', () => {
        const result = addMoreChilds(
            [
                {
                    authenValue: 1,
                    schemaId: 1,
                    permission: 1,
                },
                {
                    authenValue: 2,
                    schemaId: 1,
                    permission: 3,
                    workflowStateId: '.100.',
                },
            ],
            [
                {
                    id: '.200.',
                    name: 'default',
                },
            ]
        );
        expect(result).toEqual([]);
    });

    it('should return correct', () => {
        const result = addMoreChilds(
            [
                {
                    authenValue: 1,
                    schemaId: 1,
                    permission: 1,
                },
                {
                    authenValue: 2,
                    schemaId: 1,
                    permission: 3,
                    workflowStateId: '.100.',
                },
            ],
            [
                {
                    id: '.100.',
                    name: 'default',
                },
                {
                    id: '.200.',
                    name: 'default',
                },
            ]
        );
        expect(result).toEqual([
            {
                authenValue: 2,
                permission: 3,
                schemaId: 1,
                workflowState: {
                    id: '.100.',
                    name: 'default',
                },
                workflowStateId: '.100.',
            },
        ]);
    });
});

describe('convertDirectoryPermissionData ', () => {
    it('should return undefined when input is empty', () => {
        const result = convertDirectoryPermissionData();
        expect(result).toEqual(undefined);
    });

    it('should return correct permission empty', () => {
        const result = convertDirectoryPermissionData({});
        expect(result).toEqual({ explicitPermissions: [], inheritedPermissions: [] });
    });

    it('should return correct', () => {
        const result = convertDirectoryPermissionData({
            inheritedPermissions: [
                {
                    authenValue: 1,
                    schemaId: 1,
                    permission: 1,
                },
                {
                    authenValue: 2,
                    schemaId: 1,
                    permission: 3,
                },
            ],
            explicitPermissions: [
                {
                    authenValue: 1,
                    schemaId: 1,
                    permission: 1,
                },
                {
                    authenValue: 2,
                    schemaId: 1,
                    permission: 3,
                    workflowStateId: '.100.',
                },
            ],
        });
        expect(result).toEqual({
            explicitPermissions: [
                { authenValue: 1, permission: 1, schemaId: 1 },
                { authenValue: 2, permission: 3, schemaId: 1, workflowStateId: '.100.' },
            ],
            inheritedPermissions: [
                { authenValue: 1, permission: 1, schemaId: 1 },
                { authenValue: 2, permission: 3, schemaId: 1 },
            ],
        });
    });
});
