import { getNewExplicitPermissions } from '../schema';

describe('getNewExplicitPermissions', () => {
    it('should return corect', () => {
        const explicitPermissions = [
            { schemaId: 1, permissions: [1, 2], workflowStateIds: [] },
            { schemaId: 2, permissions: [3], workflowStateIds: [] },
        ];
        const selectedSchemaIds = [1, 2, null];
        const result = getNewExplicitPermissions(explicitPermissions, selectedSchemaIds);

        expect(result).toEqual([
            {
                permissions: [1, 2],
                schemaId: 1,
                workflowStateIds: [],
            },
            {
                permissions: [3],
                schemaId: 2,
                workflowStateIds: [],
            },
            {
                permissions: [],
                schemaId: null,
                workflowStateIds: [],
            },
        ]);
    });
});
