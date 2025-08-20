import { AuthenType, ExplicitPermission, Schema } from '../types';
import { CurrentAuthenPermission } from './types';

export const getDefaultExplicitPermissions = (rootSchemas: Schema[]): ExplicitPermission[] => {
    return [
        {
            schemaId: rootSchemas.length ? rootSchemas[0].id : null,
            permissions: [],
            workflowStateIds: [],
        },
    ];
};

export const getDefaultCurrentPermission = (authenTypeDefault: AuthenType): CurrentAuthenPermission => ({
    name: '',
    authenType: authenTypeDefault,
    authenValue: -1,
    explicitPermissions: [],
    inheritedPermissions: [],
    explicitMatrixPermissions: [],
    inheritedMatrixPermissions: [],
});
