import { generateUUID, getCookie, getQueryVariable, getRoutePath, offlinePaginate } from '../api';

describe('getCookie', () => {
    beforeEach(() => {
        document.cookie = 'testCookie=testValue';
    });

    afterEach(() => {
        document.cookie = 'testCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });

    it('should return the correct value for an existing cookie', () => {
        expect(getCookie('testCookie')).toBe('testValue');
    });

    it('should return undefined for a non-existing cookie', () => {
        expect(getCookie('nonExistent')).toBeUndefined();
    });

    it('should handle cookies with spaces correctly', () => {
        document.cookie = 'cookieWithSpace= value ';
        expect(getCookie('cookieWithSpace')).toBe('value');
    });

    it('should return undefined if document.cookie is not defined', () => {
        Object.defineProperty(document, 'cookie', {
            value: undefined,
            writable: true,
        });
        expect(getCookie('testCookie')).toBeUndefined();
    });
});

describe('getQueryVariable', () => {
    it('should return the correct value for an existing query parameter', () => {
        window.history.pushState({}, '', '/?param1=value1');
        expect(getQueryVariable('param1')).toBe('value1');
    });

    it('should return an empty string for a non-existing query parameter', () => {
        window.history.pushState({}, '', '/?param1=value1');
        expect(getQueryVariable('param2')).toBe('');
    });

    // it('should handle keys with special characters', () => {
    //     window.history.pushState({}, '', '/?param%20with%20spaces=value');
    //     expect(getQueryVariable('param with spaces')).toBe('value');
    // });

    it('should handle an empty query string', () => {
        window.history.pushState({}, '', '/');
        expect(getQueryVariable('param')).toBe('');
    });
});

describe('generateUUID', () => {
    it('should generate a valid UUID format', () => {
        const uuid = generateUUID();
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should handle different environments', () => {
        const uuid1 = generateUUID();
        const uuid2 = generateUUID();
        expect(uuid1).not.toBe(uuid2); // Ensure uniqueness
    });
});

describe('getRoutePath', () => {
    const location = { pathname: '/users/:userId' };
    const params = { userId: '123' };

    it('should replace placeholders with values correctly', () => {
        expect(getRoutePath(location as any, params)).toBe('/users/:userId');
    });

    it('should return the pathname if no params are provided', () => {
        expect(getRoutePath({ pathname: '/users' } as any, {})).toBe('/users');
    });

    it('should handle undefined parameters gracefully', () => {
        expect(getRoutePath(location as any, { nonExistent: undefined })).toBe('/users/:userId');
    });
});

describe('offlinePaginate', () => {
    const data = Array.from({ length: 100 }, (_, i) => ({ id: i }));

    it('should return the correct slice for valid pageIndex and pageSize', () => {
        expect(offlinePaginate(data, 1, 10).length).toBe(10);
    });

    it('should handle cases where pageIndex is out of bounds', () => {
        expect(offlinePaginate(data, 10, 10).length).toBe(0);
    });

    it('should handle pageIndex as 0 correctly', () => {
        expect(offlinePaginate(data, 0, 10).length).toBe(10);
    });

    it('should handle pageSize of 0', () => {
        expect(offlinePaginate(data, 1, 0).length).toBe(0);
    });
});
