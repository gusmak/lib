import _ from 'lodash';
import {
    checkValid,
    getAllStringsBetweenBraces,
    getFilterConfigurations,
    getConfigCreating,
    getDifferentWorkspace,
    getDifferentFilter,
    isEmptyPayload,
    computedConfigIds,
    findAddedConfigIds,
    findRemovedConfigIds,
    isDisabledConfigTab,
    getLowerCase,
    workspaceCheckFilterValueConfigs,
    getDefaultValues,
    getWorkspacesConfigByFilter,
    isSchemaEmpty,
    getNewConfigs,
    getWorkspaceConfigChanged,
} from '../Utils';
import {
    ParamConfiguration,
    WorkspaceSharing,
    SharingWorkspace,
    ConfigResult,
    ConfigArrayEdit,
    WorkspaceSharingInputForm,
    SharingConfigParamType,
    ObjectDataInputOfSharingWorkspaceConfigInput,
} from '../Types';
import { WorkspaceOption } from '../Atoms';

jest.mock('utils/helpers', () => ({
    generateUUID: () => 'mocked-uuid',
}));

describe('WorkspaceSharing utils', () => {
    describe('checkValid', () => {
        it('should return true for valid WorkspaceSharing', () => {
            const cws: WorkspaceSharing = {
                name: 'Test',
                objectTypeCode: 'type',
                objectFilterId: 1,
                workspaceId: 1,
            };
            expect(checkValid(cws)).toBe(true);
        });

        it('should return false for invalid WorkspaceSharing', () => {
            const cws: WorkspaceSharing = {
                name: '',
                objectTypeCode: '',
                objectFilterId: -1,
                workspaceId: -1,
            };
            expect(checkValid(cws)).toBe(false);
        });
    });

    describe('getAllStringsBetweenBraces', () => {
        it('should return all strings between braces', () => {
            const input = 'any(o.MediaPlanApprovals, i.CustomerId = {CustomerId})';
            expect(getAllStringsBetweenBraces(input)).toEqual(['CustomerId']);
        });
    });

    describe('getFilterConfigurations', () => {
        it('should return filter configurations', () => {
            const valueArray: ConfigResult[] = [{ id: 1, paramName: 'param1', paramValue: 'value1' }];
            expect(getFilterConfigurations(valueArray)).toEqual([{ id: 1, paramName: 'param1', paramValue: 'value1' }]);
        });
    });

    describe('getConfigCreating', () => {
        it('should return new workspace configurations', () => {
            const sharingWorkspace: SharingWorkspace[] = [
                {
                    targetWorkspaceId: 1,
                    sharingWorkspaceConfigs: [
                        {
                            paramName: 'param1',
                            paramType: SharingConfigParamType.Filter,
                            paramValue: 'value1',
                            id: 0,
                        },
                    ],
                },
            ];
            expect(getConfigCreating(sharingWorkspace)).toEqual([
                {
                    value: {
                        targetWorkspaceId: 1,
                        sharingWorkspaceConfigs: [
                            { value: { id: 0, paramName: 'param1', paramType: SharingConfigParamType.Filter, paramValue: 'value1' } },
                        ],
                    },
                },
            ]);
        });
    });

    describe('getNewConfigs', () => {
        it('should return new configs with paramName, paramType, and paramValue', () => {
            const configs: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: 'value1',
                    id: 0,
                },
                {
                    paramName: 'param2',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: 'value2',
                    id: 0,
                },
            ];

            const expectedResult: ObjectDataInputOfSharingWorkspaceConfigInput[] = [
                { value: { id: 0, paramName: 'param1', paramType: SharingConfigParamType.Filter, paramValue: 'value1' } },
                { value: { id: 0, paramName: 'param2', paramType: SharingConfigParamType.Filter, paramValue: 'value2' } },
            ];

            expect(getNewConfigs(configs)).toEqual(expectedResult);
        });

        it('should return an empty array if configs is empty', () => {
            const configs: SharingWorkspace['sharingWorkspaceConfigs'] = [];

            const expectedResult: ObjectDataInputOfSharingWorkspaceConfigInput[] = [];

            expect(getNewConfigs(configs)).toEqual(expectedResult);
        });

        it('should handle configs with undefined paramValue', () => {
            const configs: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: undefined,
                    id: 0,
                },
            ];

            const expectedResult: ObjectDataInputOfSharingWorkspaceConfigInput[] = [
                { value: { id: 0, paramName: 'param1', paramType: SharingConfigParamType.Filter, paramValue: undefined } },
            ];

            expect(getNewConfigs(configs)).toEqual(expectedResult);
        });
    });

    describe('getWorkspaceConfigChanged', () => {
        it('should return changed configs when paramName or paramValue is different', () => {
            const oldWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    id: 1,
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: 'value1',
                },
            ];
            const newWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    id: 1,
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: 'value2',
                },
            ];

            const expectedResult = [
                {
                    id: 1,
                    value: {
                        paramName: 'param1',
                        paramValue: 'value2',
                    },
                },
            ];

            expect(getWorkspaceConfigChanged(oldWorkspaceConfig, newWorkspaceConfig)).toEqual(expectedResult);
        });

        it('should return new configs when they do not exist in oldWorkspaceConfig', () => {
            const oldWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [];
            const newWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    id: 1,
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: 'value1',
                },
            ];

            const expectedResult = [
                {
                    value: {
                        paramName: 'param1',
                        paramType: SharingConfigParamType.Filter,
                        paramValue: 'value1',
                    },
                },
            ];

            expect(getWorkspaceConfigChanged(oldWorkspaceConfig, newWorkspaceConfig)).toEqual(expectedResult);
        });

        it('should return deleted configs when they do not exist in newWorkspaceConfig', () => {
            const oldWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    id: 1,
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: 'value1',
                },
            ];
            const newWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [];

            const expectedResult = [
                {
                    id: 1,
                },
            ];

            expect(getWorkspaceConfigChanged(oldWorkspaceConfig, newWorkspaceConfig)).toEqual(expectedResult);
        });

        it('should return null when there are no changes', () => {
            const oldWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    id: 1,
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: 'value1',
                },
            ];
            const newWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    id: 1,
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: 'value1',
                },
            ];

            expect(getWorkspaceConfigChanged(oldWorkspaceConfig, newWorkspaceConfig)).toBeNull();
        });

        it('should handle configs with undefined paramValue', () => {
            const oldWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    id: 1,
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: undefined,
                },
            ];
            const newWorkspaceConfig: SharingWorkspace['sharingWorkspaceConfigs'] = [
                {
                    id: 1,
                    paramName: 'param1',
                    paramType: SharingConfigParamType.Filter,
                    paramValue: 'value1',
                },
            ];

            const expectedResult = [
                {
                    id: 1,
                    value: {
                        paramName: 'param1',
                        paramValue: 'value1',
                    },
                },
            ];

            expect(getWorkspaceConfigChanged(oldWorkspaceConfig, newWorkspaceConfig)).toEqual(expectedResult);
        });
    });

    describe('getDifferentWorkspace', () => {
        it('should return different workspace configurations', () => {
            const oldWorkspace: SharingWorkspace[] = [
                {
                    id: 1,
                    sharingWorkspaceConfigs: [
                        {
                            id: 1,
                            paramName: 'param1',
                            paramType: SharingConfigParamType.Filter,
                            paramValue: 'value1',
                        },
                    ],
                },
                {
                    id: 2,
                    sharingWorkspaceConfigs: [
                        {
                            id: 1,
                            paramName: 'param4',
                            paramType: SharingConfigParamType.Filter,
                            paramValue: 'value4',
                        },
                    ],
                },
            ];
            const newWorkspace: SharingWorkspace[] = [
                {
                    id: 1,
                    sharingWorkspaceConfigs: [
                        {
                            id: 1,
                            paramName: 'param1',
                            paramType: SharingConfigParamType.Filter,
                            paramValue: 'value2',
                        },
                    ],
                },
                {
                    id: Date.now(),
                    sharingWorkspaceConfigs: [
                        {
                            id: 1,
                            paramName: 'param2',
                            paramType: SharingConfigParamType.Schema,
                            paramValue: 'value3',
                        },
                    ],
                },
            ];
            expect(getDifferentWorkspace(oldWorkspace, newWorkspace)).toEqual([
                {
                    id: 1,
                    value: {
                        sharingWorkspaceConfigs: [{ id: 1, value: { paramName: 'param1', paramValue: 'value2' } }],
                    },
                },
                {
                    id: 2,
                },
            ]);
        });
    });

    describe('getDifferentFilter', () => {
        it('should return different filter configurations', () => {
            const configArrayEdit: ConfigArrayEdit = {
                FILTER: [
                    { id: 1, paramName: 'param1', paramValue: 'value1' },
                    { id: 2, paramName: 'param2', paramValue: 'value2' },
                ],
                DIRECTORY: [],
            };
            const filterConfiguration: ParamConfiguration[] = [
                { id: 1, paramName: 'param1', paramValue: 'value2' },
                { id: Date.now(), paramName: 'param2', paramValue: 'value3' },
            ];
            expect(getDifferentFilter(configArrayEdit, filterConfiguration)).toEqual([
                {
                    id: 1,
                    value: {
                        paramName: 'param1',
                        paramType: SharingConfigParamType.Filter,
                        paramValue: 'value2',
                    },
                },
                {
                    id: 0,
                    value: {
                        paramName: 'param2',
                        paramType: SharingConfigParamType.Filter,
                        paramValue: 'value3',
                    },
                },
                {
                    id: 2,
                },
            ]);
        });

        it('should return empty array filter configurations when configArrayEdit is undefined', () => {
            const configArrayEdit: ConfigArrayEdit = {
                FILTER: [{ id: 1, paramName: 'param1', paramValue: 'value1' }],
                DIRECTORY: [],
            };
            const filterConfiguration: ParamConfiguration[] = [{ id: 1, paramName: 'param1', paramValue: 'value2' }];
            expect(getDifferentFilter(configArrayEdit, filterConfiguration)).toEqual([
                {
                    id: 1,
                    value: {
                        paramName: 'param1',
                        paramType: SharingConfigParamType.Filter,
                        paramValue: 'value2',
                    },
                },
            ]);
        });
    });

    describe('isEmptyPayload', () => {
        it('should return true for empty payload', () => {
            expect(isEmptyPayload({})).toBe(true);
        });

        it('should return false for non-empty payload', () => {
            expect(isEmptyPayload({ key: 'value' })).toBe(false);
        });

        it('should return true for undefined payload', () => {
            expect(isEmptyPayload(undefined)).toBe(true);
        });

        it('should return true for array payload', () => {
            expect(isEmptyPayload([])).toBe(true);
        });
    });

    describe('computedConfigIds', () => {
        it('should return new and removed ids', () => {
            const origin = [{ id: 1 }];
            const modified = [{ id: 2 }];
            expect(computedConfigIds(origin, modified)).toEqual({
                newIds: [2],
                removedIds: [1],
            });
        });
    });

    describe('findAddedConfigIds', () => {
        it('should return added config ids', () => {
            const origin = [{ id: 1 }];
            const modified = [{ id: 2 }];
            expect(findAddedConfigIds(origin, modified)).toEqual([2]);
        });
    });

    describe('findRemovedConfigIds', () => {
        it('should return removed config ids', () => {
            const origin = [{ id: 1 }];
            const modified = [{ id: 2 }];
            expect(findRemovedConfigIds(origin, modified)).toEqual([1]);
        });
    });

    describe('isDisabledConfigTab', () => {
        it('should return true if objectTypeCode or objectFilterId is missing', () => {
            const sharing: WorkspaceSharingInputForm = {
                objectTypeCode: '',
                objectFilterId: undefined,
            };
            expect(isDisabledConfigTab(sharing)).toBe(true);
        });

        it('should return false if objectTypeCode and objectFilterId are present', () => {
            const sharing: WorkspaceSharingInputForm = {
                objectTypeCode: 'type',
                objectFilterId: 1,
            };
            expect(isDisabledConfigTab(sharing)).toBe(false);
        });
    });

    describe('getLowerCase', () => {
        it('should return lower case string', () => {
            expect(getLowerCase('STRING')).toBe('string');
        });

        it('should return lower case array of strings', () => {
            expect(getLowerCase(['STRING', 'ARRAY'])).toEqual(['string', 'array']);
        });
    });

    describe('workspaceCheckFilterValueConfigs', () => {
        it('should return check as false if any filter paramValue is empty', () => {
            const workspaces: SharingWorkspace[] = [
                {
                    sharingWorkspaceConfigs: [
                        {
                            paramType: SharingConfigParamType.Filter,
                            paramValue: '',
                            id: 0,
                            paramName: '',
                        },
                    ],
                    id: 0,
                    targetWorkspaceId: 0,
                },
            ];
            expect(workspaceCheckFilterValueConfigs(workspaces)).toEqual({ check: false, count: 1 });
        });

        it('should return check as true if all filter paramValues are valid', () => {
            const workspaces: SharingWorkspace[] = [
                {
                    sharingWorkspaceConfigs: [
                        {
                            paramType: SharingConfigParamType.Filter,
                            paramValue: 'value',
                            id: 0,
                            paramName: '',
                        },
                    ],
                    id: 0,
                },
            ];
            expect(workspaceCheckFilterValueConfigs(workspaces)).toEqual({ check: true, count: 0 });
        });
    });

    describe('getDefaultValues', () => {
        it('should return default values based on key', () => {
            const obj: WorkspaceOption & { suppliers?: { id: number }[] } = {
                id: 1,
                customerId: 2,
                supplierId: 3,
                suppliers: [
                    {
                        id: 3,
                    },
                ],
            };
            expect(getDefaultValues('workspaceId', obj)).toBe('1');
            expect(getDefaultValues('customerId', obj)).toBe('2');
            expect(getDefaultValues('supplierId', obj)).toBe('3');
        });

        it('should return undefined for unknown key', () => {
            const obj = undefined;
            expect(getDefaultValues('unknownKey', obj)).toBeUndefined();
        });
    });

    describe('getWorkspacesConfigByFilter', () => {
        it('should return workspaces config by filter', () => {
            const workspaces: SharingWorkspace[] = [
                {
                    targetWorkspaceId: 1,
                    sharingWorkspaceConfigs: [
                        {
                            id: 1,
                            paramName: 'param1',
                            paramType: SharingConfigParamType.Filter,
                            paramValue: 'value1',
                        },
                        {
                            id: 2,
                            paramName: 'param2',
                            paramType: SharingConfigParamType.Schema,
                            paramValue: 'value2',
                        },
                        {
                            id: 3,
                            paramName: 'param1',
                            paramType: SharingConfigParamType.Filter,
                            paramValue: 'value3',
                        },
                    ],
                },
            ];
            const workspaceOptions: WorkspaceOption[] = [
                {
                    id: 1,
                    customerId: 1,
                },
            ];
            const filterParams = ['param1', 'param2'];
            expect(getWorkspacesConfigByFilter(workspaces, workspaceOptions, filterParams)).toEqual([
                {
                    targetWorkspaceId: 1,
                    sharingWorkspaceConfigs: [
                        { id: 1, paramName: 'param1', paramType: 'FILTER', paramValue: 'value1' },
                        { id: 2, paramName: 'param2', paramType: 'SCHEMA', paramValue: 'value2' },
                        { id: 3, paramName: 'param1', paramType: 'FILTER', paramValue: 'value3' },
                        { id: Date.now(), paramName: 'param2', paramType: 'FILTER', paramValue: undefined },
                    ],
                },
            ]);
        });
    });

    describe('isSchemaEmpty', () => {
        it('should return true for empty schema', () => {
            expect(isSchemaEmpty(null)).toBe(true);
            expect(isSchemaEmpty(undefined)).toBe(true);
            expect(isSchemaEmpty('')).toBe(true);
            expect(isSchemaEmpty(-1)).toBe(true);
        });

        it('should return false for non-empty schema', () => {
            expect(isSchemaEmpty('schema')).toBe(false);
            expect(isSchemaEmpty(1)).toBe(false);
        });
    });
});
