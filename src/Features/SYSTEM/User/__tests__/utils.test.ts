import { validatePassword } from '../utils';

describe('validatePassword', () => {
    test('should return true for valid passwords', () => {
        expect(validatePassword('Password123!')).toBe(true);
        expect(validatePassword('Test@1234')).toBe(true);
        expect(validatePassword('Complex$Password123')).toBe(true);
        expect(validatePassword('Abcd@123')).toBe(true);
    });

    test('should return false for undefined password', () => {
        expect(validatePassword(undefined as any)).toBe(false);
    });

    test('should return false for passwords shorter than 8 characters', () => {
        expect(validatePassword('Abc@123')).toBe(false);
        expect(validatePassword('A1@b')).toBe(false);
    });

    test('should return false for passwords without uppercase letters', () => {
        expect(validatePassword('password123!')).toBe(false);
        expect(validatePassword('test@1234')).toBe(false);
    });

    test('should return false for passwords without lowercase letters', () => {
        expect(validatePassword('PASSWORD123!')).toBe(false);
        expect(validatePassword('TEST@1234')).toBe(false);
    });

    test('should return false for passwords without numbers', () => {
        expect(validatePassword('Password@#!')).toBe(false);
        expect(validatePassword('TestPassword!')).toBe(false);
    });

    test('should return false for passwords without special characters', () => {
        expect(validatePassword('Password123')).toBe(false);
        expect(validatePassword('TestPass123')).toBe(false);
    });

    test('should return false for empty string', () => {
        expect(validatePassword('')).toBe(false);
    });

    test('should return false for passwords with only numbers', () => {
        expect(validatePassword('12345678')).toBe(false);
    });

    test('should return false for passwords with only letters', () => {
        expect(validatePassword('PasswordTest')).toBe(false);
    });
});
