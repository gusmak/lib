import {
    getPermissionCompare,
    toExpandPermissions,
    getNewPermissions,
    getNewPermissionStates,
    removeSchema,
    getPermissionByAuthen,
    getAuthenPermissionInput,
} from '../permission';

describe('getPermissionCompare', () => {
    let newPermissions: number[];

    beforeEach(() => {
        newPermissions = [];
    });

    test('should add code to newPermissions when bitwise match exists and code not in original', () => {
        const permissions = [7]; // binary: 111
        const code = 4; // binary: 100

        getPermissionCompare(permissions, code, newPermissions);

        expect(newPermissions).toContain(code);
        expect(newPermissions.length).toBe(1);
    });

    test('should not add code when bitwise match exists but code already in original', () => {
        const permissions = [4, 7]; // contains both match and code
        const code = 4;

        getPermissionCompare(permissions, code, newPermissions);

        expect(newPermissions).not.toContain(code);
        expect(newPermissions.length).toBe(0);
    });

    test('should not add code when no bitwise match exists', () => {
        const permissions = [1, 2]; // binary: 001, 010
        const code = 4; // binary: 100

        getPermissionCompare(permissions, code, newPermissions);

        expect(newPermissions).not.toContain(code);
        expect(newPermissions.length).toBe(0);
    });

    test('should handle empty permissions array', () => {
        const permissions: number[] = [];
        const code = 4;

        getPermissionCompare(permissions, code, newPermissions);

        expect(newPermissions.length).toBe(0);
    });
});

describe('toExpandPermissions ', () => {
    test('should return correct permissions', () => {
        const permissions = [1, 2];
        const result = toExpandPermissions(permissions);

        expect(result).toEqual([1, 2]);
    });

    test('should return correct permissions', () => {
        const permissions = [1, 2, 3];
        const result = toExpandPermissions(permissions);

        expect(result).toEqual([3, 2, 1]);
    });

    test('should return correct permissions is [4]', () => {
        const result = toExpandPermissions([4]);

        expect(result).toEqual([4]);
    });

    test('should return correct permissions is [4, 3, 2, 1]', () => {
        const result = toExpandPermissions([4, 3, 2, 1]);

        expect(result).toEqual([4]);
    });

    test('should return correct permissions is [15]', () => {
        const result = toExpandPermissions([15]);

        expect(result).toEqual([15, 4, 3, 2, 1]);
    });

    test('should return correct permissions is [31]', () => {
        const result = toExpandPermissions([31]);

        expect(result).toEqual([31, 15, 4, 3, 2, 1]);
    });

    test('should return correct permissions is [31, 15]', () => {
        const result = toExpandPermissions([31, 15]);

        expect(result).toEqual([31, 15, 4, 3, 2, 1]);
    });
});

describe('getNewPermissions', () => {
    it('has default', () => {
        const result = getNewPermissions(
            [
                {
                    permissions: [],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ],
            -1,
            1
        );
        expect(result).toEqual([
            {
                permissions: [],
                schemaId: 1,
                workflowStateIds: ['.100.'],
            },
        ]);
    });

    describe('Full Control', () => {
        it('has not permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [1, 2, 3, 4],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                31,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [31, 15, 3, 2, 4, 1],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });

        it('has permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [1, 2, 3, 4, 31],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                31,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [1, 2, 3, 4],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });
    });

    describe('Modify', () => {
        it('has not permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [1, 2, 3, 4],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                15,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [15, 3, 2, 4, 1],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });

        it('has permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [1, 2, 3, 4, 15],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                15,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [1, 2, 3, 4],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });
    });

    describe('READ_AND_EXECUTE', () => {
        it('has not permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [1, 2],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                3,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [3, 2, 1],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });

        it('has permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [1, 2, 3],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                3,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [1, 2],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });
    });

    describe('READ and LIST_FOLDER_CONTENTS', () => {
        it('has not permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [1],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                2,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [1, 2],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });

        it('has permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [1, 2],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                2,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [1],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });
    });

    describe('WRITE', () => {
        it('has not permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [1],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                4,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [1, 4],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });

        it('has permissionIndex', () => {
            const result = getNewPermissions(
                [
                    {
                        permissions: [4],
                        schemaId: 1,
                        workflowStateIds: ['.100.'],
                    },
                ],
                4,
                1
            );
            expect(result).toEqual([
                {
                    permissions: [],
                    schemaId: 1,
                    workflowStateIds: ['.100.'],
                },
            ]);
        });
    });
});

describe('getNewPermissionStates', () => {
    it('should return empty', () => {
        const result = getNewPermissionStates([], '', null, []);

        expect(result).toEqual([]);
    });

    it('should return correct when stateId is included workflowStateIds', () => {
        const result = getNewPermissionStates(
            [
                {
                    permissions: [1, 2],
                    workflowStateIds: ['.100.', '.200.'],
                    schemaId: null,
                },
            ],
            '.100.',
            null,
            []
        );

        expect(result).toEqual([
            {
                permissions: [1, 2],
                schemaId: null,
                workflowStateIds: ['.200.'],
            },
        ]);
    });

    it('should return correct when stateId is not included workflowStateIds', () => {
        const result = getNewPermissionStates(
            [
                {
                    permissions: [1, 2],
                    workflowStateIds: ['.100.', '.200.'],
                    schemaId: null,
                },
            ],
            '.300.',
            null,
            [{ id: '.100.' }, { id: '.200.' }, { id: '.300.' }]
        );

        expect(result).toEqual([
            {
                permissions: [1, 2],
                schemaId: null,
                workflowStateIds: ['.100.', '.200.', '.300.'],
            },
        ]);
    });
});

describe('removeSchema', () => {
    it('should return empty', () => {
        const result = removeSchema([], null);

        expect(result).toEqual([]);
    });

    it('should return empty', () => {
        const result1 = removeSchema(
            [
                {
                    permissions: [1, 2, 3],
                    workflowStateIds: ['.100.'],
                    schemaId: null,
                },
            ],
            null
        );
        const result2 = removeSchema(
            [
                {
                    permissions: [1, 2, 3],
                    workflowStateIds: ['.100.'],
                    schemaId: undefined,
                },
            ],
            ''
        );

        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
    });

    it('should return correct', () => {
        const result1 = removeSchema(
            [
                {
                    permissions: [1, 2],
                    workflowStateIds: ['.100.'],
                    schemaId: 1,
                },
                {
                    permissions: [3],
                    workflowStateIds: ['.100.', '.200.'],
                    schemaId: 2,
                },
            ],
            2
        );

        expect(result1).toEqual([
            {
                permissions: [1, 2],
                schemaId: 1,
                workflowStateIds: ['.100.'],
            },
        ]);
    });
});

describe('getPermissionByAuthen ', () => {
    const authens = [
        {
            authenType: 'USER',
            authenValue: 1,
            name: 'user 1',
        },
        {
            authenType: 'USER',
            authenValue: 2,
            name: 'user 2',
        },
        {
            authenType: 'ROLE',
            authenValue: 1,
            name: 'role 1',
        },
    ];
    test('should return correct params with authens and permissions', () => {
        const result = getPermissionByAuthen(authens, ['USER', '1']);

        expect(result).toEqual([{ authenType: 'USER', authenValue: 1, name: 'user 1' }]);
    });
});

describe('getAuthenPermissionInput', () => {
    const authens = [
        {
            authenType: 'USER',
            authenValue: 1,
            name: 'user 1',
        },
        {
            authenType: 'USER',
            authenValue: 2,
            name: 'user 2',
        },
        {
            authenType: 'ROLE',
            authenValue: 1,
            name: 'role 1',
        },
    ];
    test('should return correct params with authens and permissions', () => {
        const explicitPermissions = [
            {
                permissions: [1, 2],
                schemaId: null,
                workflowStateIds: [],
            },
        ];

        const result = getAuthenPermissionInput(authens, explicitPermissions);

        expect(result).toEqual({
            authens: [
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
            permissions: [
                {
                    permission: 3,
                    schemaId: null,
                    workflowStateIds: [],
                },
            ],
        });
    });
});
