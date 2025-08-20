/**
 * Chứa các hàm tiện ích hỗ trợ giao tiếp với API.
 * Tự động xử lý logic liên quan đến fetch, retry, timeout, hoặc các yêu cầu phức tạp.
 */
import type { Location, Params } from 'react-router';

/**
 * Get the value of a cookie
 * Source: https://vanillajstoolkit.com/helpers/getcookie/
 * @param name - The name of the cookie
 * @return The cookie value
 */
export function getCookie(name: string): string | undefined {
    if (typeof document !== 'undefined') {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts[1].split(';').shift();
        }
    }
    return undefined;
}

export function getQueryVariable(variable: string) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return '';
}

export function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
            //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

export const getRoutePath = (location: Location, params: Params): string => {
    const { pathname } = location;

    if (!Object.keys(params).length) {
        return pathname; // we don't need to replace anything
    }

    let path = pathname;
    Object.entries(params).forEach(([paramName, paramValue]) => {
        if (paramValue) {
            path = path.replace(paramValue, `:${paramName}`);
        }
    });
    return path;
};

export const offlinePaginate = (array: any, pageIndex: number, pageSize: number) =>
    [...array].slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
