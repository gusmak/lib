import { isUndefined } from 'lodash';
import compact from './compact';
import { isObject } from './IsObject';

const isNullOrUndefined = (value: unknown): value is null | undefined => value == null;
export default function get<T>(object: T, path?: string, defaultValue?: unknown): any {
    if (!path || !isObject(object)) {
        return defaultValue;
    }

    const result = compact(path.split(/[,[\].]+?/)).reduce(
        (result, key) => (isNullOrUndefined(result) ? result : result[key as keyof object]),
        object
    );

    return isUndefined(result) || result === object
        ? isUndefined(object[path as keyof T])
            ? defaultValue
            : object[path as keyof T]
        : result;
}
