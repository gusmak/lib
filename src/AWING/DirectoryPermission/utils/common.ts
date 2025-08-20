import { concat, uniqBy, includes } from 'lodash';
import type {
    Directory,
    DirectoryPermission,
    DirectoryPermissionWorkflowMatrix,
    WorkflowState,
    ObjectDefinition,
    ObjectTypeCode,
    PermissionView,
} from '../types';
import { Constants, DEFAULT_DIRECTORY_TYPE, OBJECT_TYPE_CODE_ALL, OBJECT_TYPE_CODE_NONE } from '../constants';

export const permissionComputed = (permissions: DirectoryPermission[], currentPermission: DirectoryPermission) => {
    return permissions
        .filter((x) => x.authenValue === currentPermission.authenValue)
        .reduce((acc: number, cur) => acc | (cur.permission || 0), 0);
};

/** Lấy toàn bộ ObjectTypeCode thông qua các field  */
export const getObjectTypeCodes = (fields: ObjectDefinition[]): ObjectTypeCode[] => {
    const arr: string[] = [];
    fields.forEach((field: ObjectDefinition) => {
        if (field?.objectTypeCode && !includes(arr, field.objectTypeCode)) {
            arr.push(field.objectTypeCode);
        }
    });

    return arr.map((o) => {
        return {
            key: o,
            value: o.replace(/([A-Z])/g, ' $1').trim(),
        };
    });
};

/** Lấy danh sách permission theo current Tab */
export const getListPermissionsByTabValue = (directory?: Directory, workflowStateTab?: string, objectTypeCodeTab?: string) => {
    if (!directory) return [];
    let directoryTemp = Object.assign({}, directory);

    const workflow = directory?.workflow;

    if (workflow?.id) {
        /* Nếu có workflow state thì thêm các Matrix */
        const workflowStates = directory?.workflow?.workflowStates ?? [];

        directoryTemp.explicitWorkflowMatrixPermissions = addMoreMatrixChilds(
            directory?.explicitWorkflowMatrixPermissions ?? [],
            workflowStates
        );
        directoryTemp.inheritedWorkflowMatrixPermissions = addMoreMatrixChilds(
            directory.inheritedWorkflowMatrixPermissions || [],
            workflowStates
        );
    }

    const { permissionViews: userPermissionViews } = getPermissionsByAuthenType(
        directoryTemp,
        !!(workflow?.id && workflow?.workflowStates?.length),
        Constants.AUTHEN_TYPE['USER'],
        objectTypeCodeTab,
        workflowStateTab
    );

    const { permissionViews: groupPermissionViews } = getPermissionsByAuthenType(
        directoryTemp,
        !!(workflow?.id && workflow?.workflowStates?.length),
        Constants.AUTHEN_TYPE['GROUP'],
        objectTypeCodeTab,
        workflowStateTab
    );

    const { permissionViews: rolePermissionViews } = getPermissionsByAuthenType(
        directoryTemp,
        !!(workflow?.id && workflow?.workflowStates?.length),
        Constants.AUTHEN_TYPE['ROLE'],
        objectTypeCodeTab,
        workflowStateTab
    );

    return concat(userPermissionViews, groupPermissionViews, rolePermissionViews);
};

const addMoreMatrixChilds = (matrixPermissions: DirectoryPermissionWorkflowMatrix[], workflowStates: WorkflowState[]) => {
    const result: DirectoryPermissionWorkflowMatrix[] = [];

    matrixPermissions.forEach((p) => {
        result.push(p);
        if (p.workflowMatrix?.stateStart) {
            const childs = workflowStates.filter((s) => p.workflowMatrix?.stateStart && s.id?.includes(p.workflowMatrix.stateStart));

            childs.forEach((c) => {
                if (
                    !result.find((r) => {
                        return r.workflowMatrix?.stateStart === c.id;
                    })
                ) {
                    result.push({
                        ...p,
                        workflowMatrix: {
                            ...p.workflowMatrix,
                            stateStart: c.id,
                            stateStartNavigation: {
                                id: c.id,
                                name: c.name,
                            },
                        },
                    });
                }
            });
        }
    });

    return result;
};

const getPermissionsByAuthenType = (
    permissions: Directory,
    hasWorkflow: boolean,
    authenType: string,
    objectTypeCodeTab?: string,
    workflowStateTab?: string
) => {
    const inheritedPermissions = permissions.inheritedPermissions?.filter((x) => x.authenType === authenType) || [];
    const explicitPermissions = permissions.explicitPermissions?.filter((x) => x.authenType === authenType) || [];

    /** Hợp nhất 2 mảng lại và trả về mảng mới */
    let currentPermissions: DirectoryPermission[] = inheritedPermissions.concat(explicitPermissions);

    /** Lấy tất cả permission có p.objectTypeCode === objectTypeCodeTab */
    currentPermissions = currentPermissions.filter((p) => {
        if (objectTypeCodeTab === DEFAULT_DIRECTORY_TYPE) {
            return !p.objectTypeCode || p.objectTypeCode === OBJECT_TYPE_CODE_NONE;
        } else if(objectTypeCodeTab === OBJECT_TYPE_CODE_ALL) {
            return true;
        } else return p.objectTypeCode === objectTypeCodeTab;
    });

    if (hasWorkflow) {
        /** Lấy tất cả permission có workflowState.id === workflowStateTab */
        currentPermissions = currentPermissions.filter((p) => p.workflowState?.id === workflowStateTab);
    }

    /** uniqBy trả về mảng trùng lặp */
    const permissionViews: PermissionView[] = uniqBy(currentPermissions, 'authenValue').map((p) => {
        const inheritedWorkflowMatrix: DirectoryPermissionWorkflowMatrix[] = permissions.inheritedWorkflowMatrixPermissions ?? [];
        const explicitWorkflowMatrix: DirectoryPermissionWorkflowMatrix[] = permissions.explicitWorkflowMatrixPermissions ?? [];

        const matrices = hasWorkflow
            ? uniqBy(
                  inheritedWorkflowMatrix
                      .concat(explicitWorkflowMatrix)
                      .filter((m) => m?.authenValue === p.authenValue && m?.workflowMatrix?.stateStart === workflowStateTab),
                  'workflowMatrixId'
              )
                  .map((m) => m?.workflowMatrix) // Lấy ra các matrix
                  .filter((i) => i !== undefined) // Lọc ra các giá trị không undefined
            : undefined;

        return {
            authenValue: p.authenValue,
            authenType: p.authenType,
            name: p?.authenName,
            permission: permissionComputed(currentPermissions, p),
            canDelete: !!permissions.explicitPermissions?.find((i) => i.authenValue === p.authenValue),
            matrices,
        };
    });

    return { currentPermissions, permissionViews };
};

/** Get authen type: 'ROLE' | 'USER' | 'GROUP' */
export const getAuthenType = (authenType?: string) => {
    if (authenType) {
        switch (authenType) {
            case Constants.AUTHEN_TYPE['USER']:
                return Constants.AUTHEN_TYPE['USER'];
            case Constants.AUTHEN_TYPE['GROUP']:
                return Constants.AUTHEN_TYPE['GROUP'];
            case Constants.AUTHEN_TYPE['ROLE']:
                return Constants.AUTHEN_TYPE['ROLE'];
        }
    }

    return undefined;
};
