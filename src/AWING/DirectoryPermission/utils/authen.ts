import { differenceWith } from 'lodash';
import { Authen, AuthenPermission, AuthenType, ExplicitPermission, PermissionInput } from '../types';

export const getAuthenByType = (authenPermissions: AuthenPermission[], type: string) => {
    return authenPermissions.filter((a) => a.authenType === type).map((item) => item.authenValue);
};

/** Lấy ra danh sách id khác nhau của authen */
export const getDiffereceAuthen = (authens: Authen[], authenPermission: AuthenPermission[], type: AuthenType, authenIds: number[]) => {
    return differenceWith(
        authens.filter((i) => i.type === type && authenIds.includes(i.id)),
        authenPermission,
        (a: Authen, b: AuthenPermission) => a.id === b.authenValue && b.authenType === type
    );
};

export const filterAuthenIncludeIdByType = (authens: Authen[], authenIds: number[], type: AuthenType) => {
    return authens.filter((i) => i.type === type && authenIds.includes(i.id));
};

/** Get New Authens */
export const getNewAuthens = (currentAuthens: Authen[], authens: Authen[]) => {
    const newAuthen: AuthenPermission[] = [];

    currentAuthens.forEach((authen) => {
        const cr = authens.find((i) => i.id === authen.id && i.type === authen.type);

        if (cr) {
            newAuthen.push({
                authenValue: cr.id,
                authenType: cr.type,
                name: cr.name,
            });
        }
    });

    return newAuthen;
};

/** Convert authen */
export const convertDataToAdd = (explicitPermissions: ExplicitPermission[]): PermissionInput[] => {
    const permissions = explicitPermissions.map((p) => ({
        schemaId: p.schemaId ?? null,
        workflowStateIds: p.workflowStateIds.filter((id) => id !== null && id !== undefined),
        permission: p.permissions.reduce((acc: number, cur: number) => acc | cur, 0),
    }));

    return permissions;
};

/** Lấy ra type và value của Authen từ router path */
export const getAuthenValueAndType = (authenRouterPath: string, separation: string): { authenType: string; authenValue: number } => {
    const authen = authenRouterPath.split(separation);

    return authen.length === 2 ? { authenType: authen[0], authenValue: Number(authen[1]) } : { authenValue: -1, authenType: '' };
};

/** Tìm kiếm Authens với searchKey */
export const filterAuthensByName = (authens: Authen[], searchKey: string) => {
    if (searchKey !== '') {
        /** Chuyển đổi tất cả thành chữ thường, sau đó mới so sánh */
        return authens.filter((item) => item.name?.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1);
    }

    return authens;
};

/** Kiểm tra xem danh sách authen có thay đổi không */
export const authenHasDifference = (authens: Authen[], newAuthens: Authen[]) => {
    return authens.length !== newAuthens.length || authens.some((a) => !newAuthens.some((na) => na.type === a.type && na.name === a.name));
};

/** Định dạng lại thông tin authen theo type */
export const formatAuthensInfo = (authens: Partial<Authen>[], type: Authen['type']) => {
    const temp: Authen[] = [];
    authens.forEach((i) => {
        i.id &&
            temp.push({
                id: i.id,
                name: i.name ?? i.username ?? '',
                type,
            });
    });
    return temp;
};
