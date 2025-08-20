import {
    getAuthenByType,
    getDiffereceAuthen,
    getNewAuthens,
    convertDataToAdd,
    getAuthenValueAndType,
    filterAuthensByName,
    authenHasDifference,
    formatAuthensInfo,
} from '../authen';

describe('getAuthenByType', () => {
    it('should return authen when type is valid', () => {
        const authens = [
            {
                authenType: 'USER',
                authenValue: 1,
                name: 'User 1',
            },
            {
                authenType: 'USER',
                authenValue: 2,
                name: 'User 2',
            },
            {
                authenType: 'ROLE',
                authenValue: 1,
                name: 'Role 1',
            },
        ];
        const result = getAuthenByType(authens, 'USER');
        expect(result).toEqual([1, 2]);
    });

    it('should return empty array when type is invalid', () => {
        const authens = [
            {
                authenType: 'USER',
                authenValue: 1,
                name: 'User 1',
            },
            {
                authenType: 'USER',
                authenValue: 2,
                name: 'User 2',
            },
        ];
        const result = getAuthenByType(authens, 'GROUP');
        expect(result).toEqual([]);
    });
});

describe('getDiffereceAuthen ', () => {
    it('should return difference authens when authens and authenPermission are valid', () => {
        const authens = [
            { id: 1, name: 'user 1', type: 'USER' },
            { id: 2, name: 'user 2', type: 'USER' },
        ];
        const authenPermission = [{ authenValue: 1, authenType: 'USER' }];
        const type = 'USER';
        const authenIds = [1, 2];
        const result = getDiffereceAuthen(authens, authenPermission, type, authenIds);
        expect(result).toEqual([{ id: 2, name: 'user 2', type: 'USER' }]);
    });
});

describe('getNewAuthens', () => {
    it('should return newAuthen when currentAuthens and authens are not equal', () => {
        const currentAuthens = [
            { id: 1, name: 'User1', type: 'USER' },
            { id: 2, name: 'User2', type: 'USER' },
        ];
        const authens = [
            { id: 1, name: 'User1', type: 'USER' },
            { id: 2, name: 'User2', type: 'USER' },
        ];
        const result = getNewAuthens(currentAuthens, authens);
        expect(result).toEqual([
            { authenValue: 1, authenType: 'USER', name: 'User1' },
            { authenValue: 2, authenType: 'USER', name: 'User2' },
        ]);
    });

    it('should return newAuthen when currentAuthens and authens are not equal', () => {
        const currentAuthens = [
            { id: 1, name: 'User1', type: 'USER' },
            { id: 2, name: 'User2', type: 'USER' },
        ];
        const authens = [
            { id: 1, name: 'User1', type: 'USER' },
            { id: 2, name: 'User2', type: 'GROUP' },
        ];
        const result = getNewAuthens(currentAuthens, authens);
        expect(result).toEqual([{ authenValue: 1, authenType: 'USER', name: 'User1' }]);
    });
});

describe('convertDataToAdd ', () => {
    it('should return authens and permissions when authens and explicitPermissions are valid', () => {
        const explicitPermissions = [
            {
                schemaId: 1,
                workflowStateIds: ['1', '2'],
                permissions: [1, 2],
            },
            {
                schemaId: undefined,
                workflowStateIds: [],
                permissions: [1, 2],
            },
        ];
        const result = convertDataToAdd(explicitPermissions);
        expect(result).toEqual([
            { permission: 3, schemaId: 1, workflowStateIds: ['1', '2'] },
            { permission: 3, schemaId: null, workflowStateIds: [] },
        ]);
    });
});

describe('getAuthenValueAndType', () => {
    it('should return authenValue = -1 and authenType = "" when authenRouterPath is invalid', () => {
        const authenRouterPath = 'type';
        const separation = '/';
        const result = getAuthenValueAndType(authenRouterPath, separation);
        expect(result).toEqual({ authenValue: -1, authenType: '' });
    });

    it('should return authenValue and authenType when authenRouterPath is valid', () => {
        const authenRouterPath = 'type/1';
        const separation = '/';
        const result = getAuthenValueAndType(authenRouterPath, separation);
        expect(result).toEqual({ authenValue: 1, authenType: 'type' });
    });
});

describe('filterAuthensByName', () => {
    it('should return empty array when searchKey is not empty', () => {
        const authens = [
            { id: 1, type: 'type1', name: 'name1' },
            { id: 2, type: 'type2', name: 'name2' },
        ];
        const searchKey = 'name3';
        const result = filterAuthensByName(authens, searchKey);
        expect(result).toEqual([]);
    });

    it('should return all authen when searchKey is empty', () => {
        const authens = [
            { id: 1, type: 'type1', name: 'name1' },
            { id: 2, type: 'type2', name: 'name2' },
        ];
        const searchKey = '';
        const result = filterAuthensByName(authens, searchKey);
        expect(result).toEqual(authens);
    });

    it('should return authen when searchKey is not empty', () => {
        const authens = [
            { id: 1, type: 'type1', name: 'name1' },
            { id: 2, type: 'type2', name: 'name2' },
        ];
        const searchKey = 'name2';
        const result = filterAuthensByName(authens, searchKey);
        expect(result).toEqual([authens[1]]);
    });
});

describe('authenHasDifference', () => {
    it('should return false when authen1 and authen2 are equal', () => {
        const authen1 = [
            { id: 1, type: 'User', name: 'User1' },
            { id: 2, type: 'User', name: 'User2' },
        ];
        const authen2 = [
            { id: 1, type: 'User', name: 'User1' },
            { id: 2, type: 'User', name: 'User2' },
        ];
        const result = authenHasDifference(authen1, authen2);
        expect(result).toBe(false);
    });

    it('should return true when authen1 and authen2 are not equal', () => {
        const authen1 = [
            { id: 1, type: 'User', name: 'User1' },
            { id: 2, type: 'User', name: 'User2' },
        ];
        const authen2 = [
            { id: 1, type: 'User', name: 'User1' },
            { id: 2, type: 'Group', name: 'Group1' },
        ];
        const result = authenHasDifference(authen1, authen2);
        expect(result).toBe(true);
    });
});

describe('formatAuthensInfo', () => {
    it('should return newAuthen when currentAuthens and authens are not equal', () => {
        const currentAuthens = [
            { id: 1, name: 'User1' },
            { id: 2, name: 'User2' },
        ];
        const result = formatAuthensInfo(currentAuthens, 'USER');
        expect(result).toEqual([
            { id: 1, name: 'User1', type: 'USER' },
            { id: 2, name: 'User2', type: 'USER' },
        ]);
    });

    it('should return newAuthen when name/username is undefined', () => {
        const currentAuthens = [{ id: 1 }, { id: 2, username: 'username2' }];
        const result = formatAuthensInfo(currentAuthens, 'USER');
        expect(result).toEqual([
            { id: 1, name: '', type: 'USER' },
            { id: 2, name: 'username2', type: 'USER' },
        ]);
    });
});
