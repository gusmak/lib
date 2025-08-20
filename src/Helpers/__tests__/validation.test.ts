import { checkValidMacAddress, checkValidStringListAP, checkValidUrl, validateNumber } from '../validation';

describe('checkValidStringListAP', () => {
    test('should return false for valid string list', () => {
        const input = '00:11:22:33:44:55 AP1\nAA:BB:CC:DD:EE:FF AP2';
        expect(checkValidStringListAP(input)).toBe(false);
    });

    test('should return true for invalid MAC address format', () => {
        const input = 'invalid-mac AP1';
        expect(checkValidStringListAP(input)).toBe(true);
    });

    test('should return true for duplicate MAC addresses', () => {
        const input = '00:11:22:33:44:55 AP1\n00:11:22:33:44:55 AP2';
        expect(checkValidStringListAP(input)).toBe(true);
    });

    test('should return true for missing MAC address or AP name', () => {
        const input = '00:11:22:33:44:55 \nAP1';
        expect(checkValidStringListAP(input)).toBe(true);
    });
});

describe('checkValidMacAddress', () => {
    test('should return true for valid MAC address', () => {
        expect(checkValidMacAddress('00:11:22:33:44:55')).toBe(true);
    });

    test('should return false for valid MAC address with dot separators', () => {
        expect(checkValidMacAddress('0000.1111.2222')).toBe(false);
    });

    test('should return false for invalid MAC address', () => {
        expect(checkValidMacAddress('invalid-mac')).toBe(false);
    });
});

describe('checkValidUrl', () => {
    test('should return true for valid URL', () => {
        expect(checkValidUrl('https://www.example.com')).toBe(true);
    });

    test('should return false for empty URL', () => {
        expect(checkValidUrl('')).toBe(false);
    });

    test('should return false for URL exceeding 1000 characters', () => {
        const longUrl = 'http://' + 'a'.repeat(1001);
        expect(checkValidUrl(longUrl)).toBe(false);
    });

    test('should return false for invalid URL format', () => {
        expect(checkValidUrl('invalid-url')).toBe(false);
    });
});

describe('validateNumber', () => {
    test('should return true for valid numbers', () => {
        expect(validateNumber(123)).toBe(true);
    });

    test('should return true for valid string numbers', () => {
        expect(validateNumber('456')).toBe(true);
    });

    test('should return false for non-numeric values', () => {
        expect(validateNumber('abc')).toBe(false);
    });

    test('should return false for empty value', () => {
        expect(validateNumber('')).toBe(false);
    });
});
