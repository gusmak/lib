const isDateObject = (value: unknown): value is Date => value instanceof Date;

const isNullOrUndefined = (value: unknown): value is null | undefined => value == null;

export const isObjectType = (value: unknown): value is object => typeof value === 'object';

export const isObject = <T extends object>(value: unknown): value is T =>
    !isNullOrUndefined(value) && !Array.isArray(value) && isObjectType(value) && !isDateObject(value);
