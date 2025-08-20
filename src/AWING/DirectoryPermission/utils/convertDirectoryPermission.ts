import { DEFAULT_DIRECTORY_TYPE, DEFAULT_WORKFLOW_STATE, OBJECT_TYPE_CODE_ALL, OBJECT_TYPE_CODE_NONE } from '../constants';
import { Directory, DirectoryPermission, WorkflowState } from '../types';

/** Kiểm tra điều kiện và trùng lặp */
export const isValid = (currentDirectoryPermissions: DirectoryPermission[], directoryPermission: DirectoryPermission, stateId?: string) => {
    return currentDirectoryPermissions.find((r) => {
        return (
            directoryPermission.authenValue === r.authenValue &&
            stateId &&
            r.workflowState?.id !== null &&
            r.workflowState?.id === stateId &&
            directoryPermission.schemaId === r.schemaId &&
            directoryPermission.permission === r.permission
        );
    });
};

/** Lặp toàn bộ state và trả về phần tử thỏa mãn điều kiện */
export const compareWorkflowState = (
    currentDirectoryPermissions: DirectoryPermission[],
    states: DirectoryPermission[],
    currentWorkflowState?: WorkflowState
) => {
    const result: DirectoryPermission[] = [];
    states.forEach((p) => {
        if (!isValid(currentDirectoryPermissions, p, currentWorkflowState?.id)) {
            result.push({
                ...p,
                workflowState: currentWorkflowState,
                workflowStateId: currentWorkflowState?.id,
            });
        }
    });

    return result;
};

/** get permission by workflowStates */
export const addMoreChilds = (
    permissions?: Directory['explicitPermissions'],
    workflowStates?: (WorkflowState & { parentId?: string | null })[]
) => {
    if (!permissions) return [];

    /** Nếu có danh sách permission, nhưng không có workflowStates, trả về toàn bộ permission */
    if (!workflowStates?.length) return permissions;

    const result: DirectoryPermission[] = [];
    // const perOfNullState = permissions?.filter((p) => p.workflowStateId === null);

    workflowStates.forEach((s) => {
        if (s.name === DEFAULT_WORKFLOW_STATE) {
            permissions?.forEach((p) => {
                if (!isValid(result, p, s.id)) {
                    result.push({
                        ...p,
                        workflowState: s,
                    });
                }
            });
        } else {
            const perOfState = permissions?.filter((p) => p.workflowStateId !== null && p.workflowStateId === s.id);
            const allOfState = permissions?.filter((p) => p.workflowStateId === '1.1.');

            if (allOfState?.length) result.push(...compareWorkflowState(result, allOfState, s));
            if (perOfState?.length) result.push(...compareWorkflowState(result, perOfState, s));
            // if (perOfNullState?.length) result.push(...compareWorkflowState(result, perOfNullState, s));
        }
    });

    return result;
};

export const getAllObjectTypeCodeByDirectory = (directory?: Directory) => {
    let objectTypeCodes: string[] = [];

    const getObjectTypeCode = (ps?: DirectoryPermission[]) => {
        ps?.forEach((p) => {
            const objectTypeCode = p.objectTypeCode || OBJECT_TYPE_CODE_ALL;
            if (!objectTypeCodes.includes(objectTypeCode)) objectTypeCodes.push(objectTypeCode);
        });
    };

    getObjectTypeCode(directory?.explicitPermissions);
    getObjectTypeCode(directory?.inheritedPermissions);

    if (!!directory?.isFile && directory?.objectTypeCode) {
        objectTypeCodes = [directory.objectTypeCode];
    }

    if (objectTypeCodes.includes(OBJECT_TYPE_CODE_NONE)) {
        // Move OBJECT_TYPE_CODE_NONE to the first position
        objectTypeCodes = [OBJECT_TYPE_CODE_NONE, ...objectTypeCodes.filter((o) => o !== OBJECT_TYPE_CODE_NONE)];
    }

    if (objectTypeCodes.includes(OBJECT_TYPE_CODE_ALL)) {
        // Move OBJECT_TYPE_CODE_ALL to the first position
        objectTypeCodes = [OBJECT_TYPE_CODE_ALL, ...objectTypeCodes.filter((o) => o !== OBJECT_TYPE_CODE_ALL)];
    }

    return objectTypeCodes.map((code) => ({ key: code, value: code === OBJECT_TYPE_CODE_NONE ? DEFAULT_DIRECTORY_TYPE : code }));
};

/** Computed data of diectory permision */
export const convertDirectoryPermissionData = (directoryPermission?: Directory) => {
    if (!directoryPermission) return;
    const workflowStates = directoryPermission.workflow?.workflowStates;

    const result: Directory = {
        ...directoryPermission,
        explicitPermissions: addMoreChilds(directoryPermission?.explicitPermissions, workflowStates),
        inheritedPermissions: addMoreChilds(directoryPermission?.inheritedPermissions, workflowStates),
    };

    return result;
};
