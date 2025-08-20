import { cloneDeep } from 'lodash';

export const generateId = () => {
    const d = typeof performance === 'undefined' ? Date.now() : performance.now() * 1000;

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16 + d) % 16 | 0;

        // eslint-disable-next-line eqeqeq
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};
/**
 * Hàm sử dụng Proxy và Trap trong js `es6`, khi set data cho một key trong object,
 *
 * hàm handle sẽ call hàm watch trong set
 * @version 0.0.1
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
 */
export function createState<T extends Record<string, any>>(stateObj: { watch: (o: T, p: string) => void; data: T }) {
    const createDataProxyHandler = (path?: string) => ({
        get: (obj: Record<string, any>, key: string): Record<string, any> => {
            const fullPath = path ? path + '.' + String(key) : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                return new Proxy(obj[key], createDataProxyHandler(fullPath));
            } else {
                return obj[key];
            }
        },
        set(obj: Record<string, any>, key: string, value: any) {
            const fullPath = path ? path + '.' + String(key) : key;

            obj[key] = value;
            if (stateObj.watch) {
                stateObj.watch(cloneDeep(stateObj.data), fullPath);
            }

            return true;
        },
    });

    const data = stateObj.data || {};
    const handler = {
        set: (_: never, key: string, value: any) => {
            if (key in data) {
                return createDataProxyHandler().set(data, key, value);
            }
            data[key as keyof T] = value;
            return true;
        },
        get: (_: never, key: string) => {
            if (key in data) {
                return createDataProxyHandler().get(data, key);
            }
            return data[key];
        },
    };

    return new Proxy<T>(stateObj.data, handler);
}
