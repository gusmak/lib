import { difference } from 'lodash';
import { ExplicitPermission } from '../types';

export const getNewExplicitPermissions = (explicitPermissions: ExplicitPermission[], selectedSchemaIds: (number | null)[]) => {
    let newExplicitPermissions = explicitPermissions.slice();
    const add = difference(
        selectedSchemaIds,
        newExplicitPermissions.map((e) => e.schemaId)
    );

    const remove = difference(
        newExplicitPermissions.map((e) => e.schemaId),
        selectedSchemaIds
    );

    add.filter((i) => i !== undefined).map((id) => {
        newExplicitPermissions.push({
            schemaId: id,
            permissions: [],
            workflowStateIds: [],
        });
        return id;
    });
    remove.filter((i) => i !== undefined);

    newExplicitPermissions = newExplicitPermissions.filter((e) => {
        // schemaId chỉ tồn tại giá trị  > 0 hoặc null, gán -1 nếu schemaId là undefined
        return !remove.includes(e.schemaId);
    });

    return newExplicitPermissions;
};
