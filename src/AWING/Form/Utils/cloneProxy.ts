import { isObject } from 'lodash';

export default function cloneProxy<T extends any>(obj: T): T | T[] {
    if (!isObject(obj)) return obj;
    if (Array.isArray(obj)) {
        return obj.map((item: any) => cloneProxy(item));
    }
    //creates a new object that inherits from the prototype of the original object
    const clone = Object.create(Object.getPrototypeOf(obj));
    const properties = Object.getOwnPropertyDescriptors(obj);

    for (const prop in properties) {
        if (properties[prop].hasOwnProperty('value')) {
            clone[prop] = properties[prop].value;
        } else {
            clone[prop] = properties[prop];
        }
    }

    return clone;
}
