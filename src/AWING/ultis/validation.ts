import { every } from 'lodash';
import moment from 'moment';
import i18n from '../../translate/i18n';

export function arrayIsNotEmptyValid<T>(value: T[] | null | undefined) {
    return value !== undefined && value !== null && value.length > 0;
}

export function positiveNumberNotNullValid(value: number | null | undefined) {
    return Boolean(value && !Number.isNaN(value) && value > 0);
}

export function numberPercentageNotNullValid(value: number | null | undefined) {
    return value !== undefined && value !== null && value >= 0 && value <= 100;
}

export function numberNotNullValid(value: number | null | undefined) {
    return value !== undefined && value !== null && !Number.isNaN(value);
}

export function stringNotNullValid(value: string | null | undefined) {
    return value !== undefined && value !== null && value.trim().length > 0;
}

export function stringNullableValid(value: string | null | undefined) {
    return value === undefined || value === null || value.length > 0;
}

export function notNullValid<T>(value: T | null | undefined) {
    return value !== undefined && value !== null;
}

export function dateValid(value: Date | null | undefined) {
    if (value instanceof Date) return Boolean(value?.getFullYear() > 1000 && moment(value).isValid());
    return false;
}

export function dateRangeValid(value: (Date | null | undefined)[] | null | undefined) {
    return (
        value !== undefined &&
        value !== null &&
        value.length === 2 &&
        dateValid(moment(value[0]).toDate()) &&
        dateValid(moment(value[1]).toDate()) &&
        value[0] !== undefined &&
        value[0] !== null &&
        value[1] !== undefined &&
        value[1] !== null &&
        value[0] <= value[1]
    );
}

export function emailValid(email: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

export function numberOnlyValid(value: string | null | undefined) {
    const re = /^\d+$/;
    return value === undefined && value === null && re.test(value);
}

export function urlValid(value: string | null | undefined) {
    try {
        if (value === undefined || value === null) return false;
        else {
            new URL(value);
            return true;
        }
    } catch (err) {
        return false;
    }
}

export function colorValid(value: string | null | undefined) {
    const re = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return value !== undefined && value !== null && re.test('#' + value);
}

export function passwordValid(value: string | null | undefined) {
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return value === undefined && value === null && re.test(value);
}
export function containsOnlyDigits(str: string) {
    // Kiểm tra xem mỗi ký tự trong chuỗi có phải là số từ 0 đến 9 hay không
    return every(str, (char) => /^[0-9]$/.test(char));
}

/**
 * Validates a text string based on specified criteria.
 *
 * @param str - The text string to be validated.
 * @param length - The maximum length of the text string. Default is 50.
 * @param required - validField required.
 * @param pattern - The regular expression pattern to match against the text string. Default is /^[a-zA-Z0-9\/\-_.()\[\] ]+$/g.
 * @param invertRegex - The inverted regular expression pattern to match against the text string. Default is undefined.
 * @returns An object containing the validation result and a message describing any validation errors.
 */
export const textValidation = (
    str: string,
    length: number = 50,
    required: boolean = true,
    // pattern: RegExp | false = /^[a-zA-Z0-9đĐ\/\-_.()\[\] \u0080-\uFFFF]+$/g,
    // Mặc định field text là truyền tất cả các ký tự, nếu cần thì truyền vào regex để loại bỏ ký tự không mong muốn
    pattern: RegExp | false = false,
    invertRegex?: RegExp | false
): { valid: boolean; message: string } => {
    const validRes: { valid: boolean; message: string[] } = {
        valid: true,
        message: [],
    };
    const validNull = stringNotNullValid(str);
    if (!validNull && required) {
        validRes.valid = false;
        validRes.message.push(i18n.t('Common.Required'));
    }

    if (str && pattern && !pattern.test(str)) {
        validRes.valid = false;
        if (invertRegex !== false) {
            const invertedRegex =
                invertRegex ||
                new RegExp(`[^${pattern.source.replace(/[*+?^${}|]/g, '')}]`.replace(/\[\[|\]\]/g, ']'), 'g');
            validRes.message.push(
                `${i18n.t('Common.InvalidChars')}: ${Array.from(new Set(str.match(invertedRegex))).join(' ')}`
            );
        }
    }
    const byteSize = new Blob([str]).size;
    if (byteSize > length) {
        validRes.valid = false;
        validRes.message.push(`${i18n.t('Common.InvalidLength')}: ${byteSize} / ${length}`);
    }
    return {
        valid: validRes.valid,
        message: validRes.message.join(', '),
    };
};
