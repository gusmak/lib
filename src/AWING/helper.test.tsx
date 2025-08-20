import {
    calculateValue,
    formatNumberWithLanguage,
    isOperator,
    isOperand,
    tokenize,
    getPrecedence,
    convertToPostfix,
    convertFormulaToBinaryTree,
    replaceFieldsValue,
    type BinaryTreeNode,
} from './helper';

describe('calculateValue', () => {
    test('should handle leaf nodes (numbers)', () => {
        const node: BinaryTreeNode = { value: '42' };
        expect(calculateValue(node)).toBe(42);
    });

    test('should left or right undefined', () => {
        const node1: BinaryTreeNode = { value: '+', left: { value: '12' } };
        const node2: BinaryTreeNode = { value: '-', right: { value: '22' } };
        expect(calculateValue(node1)).toBe(12);
        expect(calculateValue(node2)).toBe(-22);
    });

    test('should handle leaf nodes (numbers)', () => {
        const node: BinaryTreeNode = { value: '42' };
        expect(calculateValue(node)).toBe(42);
    });

    test('should handle basic addition', () => {
        const node: BinaryTreeNode = {
            value: '+',
            left: { value: '5' },
            right: { value: '3' },
        };
        expect(calculateValue(node)).toBe(8);
    });

    test('should handle basic subtraction', () => {
        const node: BinaryTreeNode = {
            value: '-',
            left: { value: '10' },
            right: { value: '4' },
        };
        expect(calculateValue(node)).toBe(6);
    });

    test('should handle basic multiplication', () => {
        const node: BinaryTreeNode = {
            value: '*',
            left: { value: '6' },
            right: { value: '7' },
        };
        expect(calculateValue(node)).toBe(42);
    });

    test('should handle basic division', () => {
        const node: BinaryTreeNode = {
            value: '/',
            left: { value: '15' },
            right: { value: '3' },
        };
        expect(calculateValue(node)).toBe(5);
    });

    test('should handle decimal rounding with ~ operator', () => {
        const node: BinaryTreeNode = {
            value: '~',
            left: { value: '3.14159' },
            right: { value: '2' },
        };
        expect(calculateValue(node)).toBe(3.14);
    });

    test('should handle round operation', () => {
        const node: BinaryTreeNode = {
            value: 'round',
            right: { value: '3.7' },
        };
        expect(calculateValue(node)).toBe(4);
    });

    test('should handle complex nested expressions', () => {
        const node: BinaryTreeNode = {
            value: '+',
            left: {
                value: '*',
                left: { value: '5' },
                right: { value: '2' },
            },
            right: {
                value: '/',
                left: { value: '10' },
                right: { value: '2' },
            },
        };
        expect(calculateValue(node)).toBe(15); // (5 * 2) + (10 / 2) = 10 + 5 = 15
    });

    test('should throw error for invalid operator', () => {
        const node: BinaryTreeNode = {
            value: '%',
            left: { value: '10' },
            right: { value: '2' },
        };
        expect(() => calculateValue(node)).toThrow('Invalid operator: %');
    });

    test('should handle zero values', () => {
        const node: BinaryTreeNode = {
            value: '+',
            left: { value: '0' },
            right: { value: '0' },
        };
        expect(calculateValue(node)).toBe(0);
    });

    test('should handle division by zero', () => {
        const node: BinaryTreeNode = {
            value: '/',
            left: { value: '10' },
            right: { value: '0' },
        };
        expect(calculateValue(node)).toBe(Infinity);
    });
});

describe('formatNumberWithLanguage', () => {
    it('should return the correct number in Vietnamese', () => {
        expect(formatNumberWithLanguage(1000000, 'vi')).toEqual('1.000.000');
    });

    it('should return the correct number in English', () => {
        expect(formatNumberWithLanguage(1000000, 'en')).toEqual('1,000,000');
    });

    it('should return an empty string for undefined', () => {
        expect(formatNumberWithLanguage(undefined)).toEqual('');
    });
});

describe('isOperator function', () => {
    // Test basic operators
    test('should return true for basic arithmetic operators', () => {
        expect(isOperator('+')).toBeTruthy();
        expect(isOperator('-')).toBeTruthy();
        expect(isOperator('*')).toBeTruthy();
        expect(isOperator('/')).toBeTruthy();
        expect(isOperator('~')).toBeTruthy();
    });

    // Test invalid operators
    test('should return false for invalid operators', () => {
        expect(isOperator('&')).toBeFalsy();
        expect(isOperator('^')).toBeFalsy();
        expect(isOperator('$')).toBeFalsy();
    });
});

describe('isOperand', () => {
    it('should return true for valid operands', () => {
        const operands = ['x', 'y', '123', 'var', '42'];
        operands.forEach((token) => {
            expect(isOperand(token)).toBe(true);
        });
    });

    it('should return false for operators', () => {
        const operators = ['+', '-', '*', '/'];
        operators.forEach((token) => {
            expect(isOperand(token)).toBe(false);
        });
    });

    it('should return false for parentheses', () => {
        expect(isOperand('(')).toBe(false);
        expect(isOperand(')')).toBe(false);
    });

    it('should return false for empty string', () => {
        expect(isOperand('')).toBe(false);
    });

    it('should handle special cases correctly', () => {
        expect(isOperand('+(')).toBe(true); // Not a valid operator or parenthesis
        expect(isOperand(')123')).toBe(true); // Operand-like token
    });
});

describe('tokenize', () => {
    it('should tokenize simple formulas with operators', () => {
        const formula = '3+5';
        const result = tokenize(formula);
        expect(result).toEqual(['3', '+', '5']);
    });

    it('should handle formulas with functions in listFunction', () => {
        const formula = 'round(3+5)';
        const result = tokenize(formula);
        expect(result).toEqual(['left', 'round', '(', '3', '+', '5', ')']);
    });

    it('should handle multiple functions in a formula', () => {
        const formula = 'round(round(3)+5)';
        const result = tokenize(formula);
        expect(result).toEqual(['left', 'round', '(', 'left', 'round', '(', '3', ')', '+', '5', ')']);
    });

    it('should tokenize formulas with different operators and spaces', () => {
        const formula = '3 * 5 - 2 / 1';
        const result = tokenize(formula);
        expect(result).toEqual(['3', '*', '5', '-', '2', '/', '1']);
    });

    it('should handle empty strings', () => {
        const formula = '';
        const result = tokenize(formula);
        expect(result).toEqual([]);
    });

    it('should ignore whitespace around tokens', () => {
        const formula = ' 3 + 5 ';
        const result = tokenize(formula);
        expect(result).toEqual(['3', '+', '5']);
    });

    it('should handle unexpected tokens not in listFunction', () => {
        const formula = 'custom(3+5)';
        const result = tokenize(formula);
        expect(result).toEqual(['custom', '(', '3', '+', '5', ')']);
    });

    it('should tokenize formulas with "~" operator', () => {
        const formula = '3~5';
        const result = tokenize(formula);
        expect(result).toEqual(['3', '~', '5']);
    });
});

describe('getPrecedence', () => {
    it('should return precedence 3 for functions in listFunction', () => {
        expect(getPrecedence('round')).toBe(3);
    });

    it('should return precedence 1 for "+" and "-" operators', () => {
        expect(getPrecedence('+')).toBe(1);
        expect(getPrecedence('-')).toBe(1);
    });

    it('should return precedence 2 for "*" and "/" operators', () => {
        expect(getPrecedence('*')).toBe(2);
        expect(getPrecedence('/')).toBe(2);
    });

    it('should return precedence 3 for "~" operator', () => {
        expect(getPrecedence('~')).toBe(3);
    });

    it('should return precedence 0 for unknown operators', () => {
        expect(getPrecedence('^')).toBe(0);
        expect(getPrecedence('(')).toBe(0);
        expect(getPrecedence(')')).toBe(0);
        expect(getPrecedence('random')).toBe(0);
    });

    it('should handle empty strings and null-like inputs', () => {
        expect(getPrecedence('')).toBe(0);
        expect(getPrecedence(' ')).toBe(0);
    });
});

describe('replaceFieldsValue', () => {
    it('should replace placeholders with field values', () => {
        const fields = [
            { fieldName: 'name', value: 'Alice' },
            { fieldName: 'age', value: '30' },
        ];
        const formula = 'Hello, {name}. You are {age} years old.';
        const result = replaceFieldsValue(fields, formula);
        expect(result).toBe('Hello, Alice. You are 30 years old.');
    });

    it('should replace placeholders with "notready" if value is undefined, null, or empty', () => {
        const fields = [
            { fieldName: 'name', value: '' },
            { fieldName: 'age', value: null },
            { fieldName: 'city', value: undefined },
        ];
        const formula = 'Name: {name}, Age: {age}, City: {city}';
        const result = replaceFieldsValue(fields, formula);
        expect(result).toBe('Name: notready, Age: notready, City: notready');
    });

    it('should handle formulas with no placeholders', () => {
        const fields = [{ fieldName: 'name', value: 'Alice' }];
        const formula = 'No placeholders here.';
        const result = replaceFieldsValue(fields, formula);
        expect(result).toBe('No placeholders here.');
    });

    it('should handle fields with no matching placeholders in formula', () => {
        const fields = [
            { fieldName: 'name', value: 'Alice' },
            { fieldName: 'age', value: '30' },
        ];
        const formula = 'Hello, world!';
        const result = replaceFieldsValue(fields, formula);
        expect(result).toBe('Hello, world!');
    });

    it('should replace multiple occurrences of the same placeholder', () => {
        const fields = [{ fieldName: 'name', value: 'Alice' }];
        const formula = '{name} is {name}.';
        const result = replaceFieldsValue(fields, formula);
        expect(result).toBe('Alice is Alice.');
    });

    it('should handle empty fields array', () => {
        const fields: any[] = [];
        const formula = 'Hello, {name}.';
        const result = replaceFieldsValue(fields, formula);
        expect(result).toBe('Hello, {name}.');
    });

    it('should handle empty formula', () => {
        const fields = [{ fieldName: 'name', value: 'Alice' }];
        const formula = '';
        const result = replaceFieldsValue(fields, formula);
        expect(result).toBe('');
    });
});

describe('convertToPostfix', () => {
    it('should convert a simple infix expression to postfix', () => {
        const result = convertToPostfix('3 + 5');
        expect(result).toEqual(['3', '5', '+']);
    });

    it('should handle expressions with multiple operators', () => {
        const result = convertToPostfix('3 + 5 * 2');
        expect(result).toEqual(['3', '5', '2', '*', '+']);
    });

    it('should respect parentheses in expressions', () => {
        const result = convertToPostfix('(3 + 5) * 2');
        expect(result).toEqual(['3', '5', '+', '2', '*']);
    });

    it('should handle complex expressions', () => {
        const result = convertToPostfix('3 + 5 * (2 - 1)');
        expect(result).toEqual(['3', '5', '2', '1', '-', '*', '+']);
    });

    it('should handle an empty input', () => {
        const result = convertToPostfix('');
        expect(result).toEqual([]);
    });
});

describe('convertFormulaToBinaryTree', () => {
    it('should create a binary tree for a simple expression', () => {
        const result = convertFormulaToBinaryTree('3 + 5');
        expect(result).toEqual({
            value: '+',
            left: { value: '3' },
            right: { value: '5' },
        });
    });

    it('should create a binary tree for a complex expression', () => {
        const result = convertFormulaToBinaryTree('3 + 5 * 2');
        expect(result).toEqual({
            value: '+',
            left: { value: '3' },
            right: {
                value: '*',
                left: { value: '5' },
                right: { value: '2' },
            },
        });
    });

    it('should return undefined for an empty formula', () => {
        const result = convertFormulaToBinaryTree('');
        expect(result).toBeUndefined();
    });

    it('should handle single operand expressions', () => {
        const result = convertFormulaToBinaryTree('42');
        expect(result).toEqual({ value: '42' });
    });
});
