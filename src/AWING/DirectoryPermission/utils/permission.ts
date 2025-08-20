import { uniq } from 'lodash';
import { Constants } from '../constants';
import { AuthenInput, AuthenPermission, ExplicitPermission, PermissionInput, WorkflowState } from '../types';
import { CurrentAuthenPermission } from '../AddOrEdit/types';
import { convertDataToAdd } from '.';

export const getPermissionCompare = (permissions: number[], code: number, newPermissions: number[]) => {
    if (permissions.some((x) => (x & code) === code)) {
        if (permissions.indexOf(code) < 0) newPermissions.push(code);
    }
};

export const toExpandPermissions = (permissions: number[]) => {
    let newPermissions = [...permissions];

    /** Phép toán AND bit */
    const isP = (p: number) => permissions.some((x) => (x & p) === p);

    const { FULL_CONTROL, MODIFY, WRITE, READ_AND_EXECUTE, READ, LIST_FOLDER_CONTENTS } = Constants.PERMISSION_CODE;

    if (isP(FULL_CONTROL)) {
        newPermissions = [FULL_CONTROL, MODIFY, WRITE, READ_AND_EXECUTE, READ, LIST_FOLDER_CONTENTS];
    } else if (isP(MODIFY)) {
        newPermissions = [MODIFY, WRITE, READ_AND_EXECUTE, READ, LIST_FOLDER_CONTENTS];
    } else if (isP(WRITE)) {
        newPermissions = [WRITE];
        getPermissionCompare(permissions, READ_AND_EXECUTE, newPermissions);
        getPermissionCompare(permissions, READ, newPermissions);
        getPermissionCompare(permissions, LIST_FOLDER_CONTENTS, newPermissions);
    } else if (isP(READ_AND_EXECUTE)) {
        newPermissions = [READ_AND_EXECUTE, READ, LIST_FOLDER_CONTENTS];
        getPermissionCompare(permissions, WRITE, newPermissions);
    } else {
        getPermissionCompare(permissions, READ, newPermissions);
        getPermissionCompare(permissions, LIST_FOLDER_CONTENTS, newPermissions);
    }

    return newPermissions;
};

export const getNewPermissions = (oldPermissions: ExplicitPermission[], permissionCode: number, schemaId: number | null) => {
    const newPermissions: ExplicitPermission[] = Object.assign([], oldPermissions);
    const index = newPermissions.findIndex((expPermission: ExplicitPermission) => expPermission.schemaId === schemaId);
    let newExplicitPermissions = newPermissions[index]?.permissions;

    const { FULL_CONTROL, MODIFY, READ_AND_EXECUTE, READ, WRITE, LIST_FOLDER_CONTENTS } = Constants.PERMISSION_CODE;

    let permissionIndex = newExplicitPermissions.indexOf(permissionCode);
    switch (permissionCode) {
        case FULL_CONTROL:
            if (permissionIndex === -1)
                newExplicitPermissions = [FULL_CONTROL, MODIFY, READ_AND_EXECUTE, READ, WRITE, LIST_FOLDER_CONTENTS];
            else newExplicitPermissions = newExplicitPermissions.filter((p) => p !== permissionCode);
            break;
        case MODIFY:
            if (permissionIndex === -1) newExplicitPermissions = [MODIFY, READ_AND_EXECUTE, READ, WRITE, LIST_FOLDER_CONTENTS];
            else newExplicitPermissions = newExplicitPermissions.filter((p) => p !== FULL_CONTROL && p !== permissionCode);
            break;
        case READ_AND_EXECUTE:
            if (permissionIndex === -1) {
                let writePermission = newExplicitPermissions.find((permisison) => permisison === WRITE);

                newExplicitPermissions = writePermission
                    ? [READ_AND_EXECUTE, READ, WRITE, LIST_FOLDER_CONTENTS]
                    : [READ_AND_EXECUTE, READ, LIST_FOLDER_CONTENTS];
            } else {
                newExplicitPermissions = newExplicitPermissions.filter(
                    (permisison) => permisison !== FULL_CONTROL && permisison !== MODIFY && permisison !== permissionCode
                );
            }
            break;
        case READ:
        case LIST_FOLDER_CONTENTS:
            if (permissionIndex === -1) newExplicitPermissions.push(permissionCode);
            else
                newExplicitPermissions = newExplicitPermissions.filter(
                    (permisison) =>
                        permisison !== FULL_CONTROL &&
                        permisison !== MODIFY &&
                        permisison !== READ_AND_EXECUTE &&
                        permisison !== permissionCode
                );
            break;
        case WRITE:
            if (permissionIndex === -1) {
                newExplicitPermissions.push(permissionCode);
            } else
                newExplicitPermissions = newExplicitPermissions.filter(
                    (permisison) => permisison !== FULL_CONTROL && permisison !== MODIFY && permisison !== permissionCode
                );
            break;
        default:
            break;
    }
    newPermissions[index].permissions = newExplicitPermissions;

    return newPermissions;
};

export const getNewPermissionStates = (
    oldPermissions: ExplicitPermission[],
    stateId: string,
    schemaId: number | null,
    states: WorkflowState[]
) => {
    let newPermissions: ExplicitPermission[] = Object.assign([], oldPermissions);
    const index = newPermissions.findIndex((x) => x.schemaId === schemaId);
    let newExplicitStateIds = (newPermissions[index]?.workflowStateIds || []).filter((x) => x);
    if (newExplicitStateIds?.includes(stateId)) {
        //Case unchecked
        newExplicitStateIds = newExplicitStateIds.filter((x) => x !== stateId && !stateId.includes(x) && !x.includes(stateId));
    } else {
        //Case checked
        const childs = states.filter((s) => s.id && s.id?.includes(stateId)).map((s) => s.id!);
        newExplicitStateIds.push(...childs.filter((i) => i !== undefined), stateId);
        newExplicitStateIds = uniq(newExplicitStateIds);
        // Check parent
        const currentState = states.find((s) => s.id === stateId);
        let parent = states.find((p) => p.id === currentState?.parentId);
        while (parent) {
            const crParent = parent;
            const crNewExplicitStateIds = newExplicitStateIds;
            const isFullStates = states.filter((s) => s.parentId === crParent.id).every((s) => crNewExplicitStateIds.includes(s.id ?? '1'));
            if (isFullStates) {
                newExplicitStateIds.push(parent.id ?? '-1');
                newExplicitStateIds = uniq(newExplicitStateIds);
            }
            parent = states.find((p) => p.id === crParent?.parentId);
        }
    }
    if (newPermissions[index]?.workflowStateIds !== undefined) newPermissions[index].workflowStateIds = newExplicitStateIds;

    return newPermissions;
};

export const removeSchema = (oldPermissions: ExplicitPermission[], schemaId: number | null | string) => {
    const newPermissions = oldPermissions.slice();
    const result = newPermissions.filter((p: ExplicitPermission) => {
        if (schemaId === null || schemaId === '') {
            return !!p.schemaId || p.schemaId === 0;
        } else {
            return p.schemaId !== schemaId;
        }
    });
    return result;
};

export const getPermissionByAuthen = (permissions: { authenType?: string; authenValue?: number | string }[], authen: string[]) => {
    const authenType = authen[0];
    const authenValue = Number(authen[1]);
    return permissions.filter((p) => p.authenType === authenType && p.authenValue === authenValue);
};

export const getAuthenPermissionInput = (
    authens: AuthenPermission[],
    explicitPermissions: ExplicitPermission[],
    currentPermission?: CurrentAuthenPermission
) => {
    const params: {
        authens: AuthenInput[];
        permissions: PermissionInput[];
    } = {
        permissions: convertDataToAdd(explicitPermissions),
        authens: currentPermission?.authenValue
            ? [
                  {
                      authenType: currentPermission.authenType,
                      authenValue: currentPermission.authenValue,
                  },
              ]
            : authens.map((item) => ({
                  authenValue: item.authenValue,
                  authenType: item.authenType,
              })),
    };

    return params;
};
