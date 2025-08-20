import { getSuggestionsAndValidaton, ErrorCodes } from './utils';
import { FunctionStructure, ObjectStructure } from './types';

describe('getSuggestionsAndValidaton', () => {
    const objectStructures: ObjectStructure[] = [
        { a: 'number' },
        { b: 'boolean' },
        { c: 'string' },
        {
            o: {
                name: 'string',
                age: 'number',
                year: 'date',
                cards: [
                    {
                        brand: 'string',
                    },
                ],
            },
        },
    ];

    const functionStructures: FunctionStructure[] = [
        { name: 'func1', parameters: ['number'], returnType: 'boolean' },
        { name: 'func2', parameters: ['string', 'boolean'], returnType: 'string' },
        { name: 'func3', parameters: ['number?', 'string', 'date?'], returnType: 'boolean' },
        { name: 'isNull', parameters: ['any'], returnType: 'boolean' },
        { name: 'now', parameters: [], returnType: 'date' },
        { name: 'any', parameters: ['array(any)', 'condition(0)?'], returnType: 'boolean' },
    ];

    it('should return correct isValid, suggestions, errorCode', () => {
        const expected = [
            {
                expr: '',
                isValid: false,
                suggestions: ['a', 'b', 'c', 'o.name', 'o.age', 'o.year', 'o.cards.0.brand', 'func1(', 'func2(', 'func3('],
                errorCode: ErrorCodes.InvalidExpression,
            },
            { expr: 'hihohafodh', isValid: false, suggestions: [], errorCode: ErrorCodes.InvalidObjectSyntax },
            {
                expr: '((1+1)',
                isValid: false,
                suggestions: [' =', ' !=', ' >', ' <', ' <=', ' >=', ' +', ' -', ' *', ' /'],
                errorCode: ErrorCodes.MissingOperand,
            },
            {
                expr: '(1+1)=2',
                isValid: true,
                suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |', ' >', ' <', ' <=', ' >=', ' +', ' -', ' *', ' /'],
                errorCode: '',
            },
            { expr: 'true AND false', isValid: true, suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |'], errorCode: '' },
            { expr: 'true = false', isValid: true, suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |'], errorCode: '' },
            { expr: '3 = null', isValid: true, suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |'], errorCode: '' },
            {
                expr: 'true AND',
                isValid: false,
                suggestions: [' b', ' func1(', ' func3(', ' isNull(', ' any('],
                errorCode: ErrorCodes.MissingOperand,
            },
            { expr: 'func1(123)', isValid: true, suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |'], errorCode: '' },
            {
                expr: 'func1("string")',
                isValid: false,
                suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |'],
                errorCode: ErrorCodes.InvalidFunctionParameterType,
            },
            {
                expr: 'a > 10',
                isValid: true,
                suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |', ' >', ' <', ' <=', ' >=', ' +', ' -', ' *', ' /'],
                errorCode: '',
            },
            { expr: 'a < "string"', isValid: false, suggestions: [' =', ' !=', ' +'], errorCode: ErrorCodes.InvalidOperandType },
            {
                expr: 'o.year <= now()',
                isValid: true,
                suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |', ' >', ' <', ' <=', ' >='],
                errorCode: '',
            },
            { expr: 'o.year <= "o.year"', isValid: false, suggestions: [' =', ' !=', ' +'], errorCode: ErrorCodes.InvalidOperandType },
            { expr: '"sa" + "di" ', isValid: false, suggestions: ['=', '!=', '+'], errorCode: ErrorCodes.InvalidResultType },
            { expr: '"sa" + "di" = "a.aoi" ', isValid: true, suggestions: ['AND', 'OR', '=', '!=', '&', '|', '+'], errorCode: '' },
            { expr: 'func2("", true) = "i" ', isValid: true, suggestions: ['AND', 'OR', '=', '!=', '&', '|', '+'], errorCode: '' },
            {
                expr: '3 != 3',
                isValid: true,
                suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |', ' >', ' <', ' <=', ' >=', ' +', ' -', ' *', ' /'],
                errorCode: '',
            },
            {
                expr: 'func2("", func1(4)) = "i"',
                isValid: true,
                suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |', ' +'],
                errorCode: '',
            },
            {
                expr: 'func2("sa" + "di", func1(4) OR false) != "di"',
                isValid: true,
                suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |', ' +'],
                errorCode: '',
            },
            { expr: '!isNull(1+1) ', isValid: true, suggestions: ['AND', 'OR', '=', '!=', '&', '|'], errorCode: '' },
            { expr: 'isNull(isNull(now()))', isValid: true, suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |'], errorCode: '' },
            { expr: 'o.name<>\\"ád\\"', isValid: false, suggestions: [], errorCode: ErrorCodes.MissingOperand },
            {
                expr: '2*(3/3 - o.age) + 5*((4-3)+2+(5+(2*4)))/2 = 40 ',
                isValid: true,
                suggestions: ['AND', 'OR', '=', '!=', '&', '|', '>', '<', '<=', '>=', '+', '-', '*', '/'],
                errorCode: '',
            },
            { expr: '!"o.name<>\"ád\""', isValid: false, suggestions: [' =', ' !=', ' +'], errorCode: ErrorCodes.MissingOperand },
            { expr: 'o.cards.0.brand ', isValid: false, suggestions: ['=', '!=', '+'], errorCode: ErrorCodes.InvalidResultType },
            { expr: 'o.cards.0.brand = "di"', isValid: true, suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |', ' +'], errorCode: '' },
            { expr: 'o.cards.brand = "di" ', isValid: false, suggestions: ['=', '!=', '+'], errorCode: ErrorCodes.InvalidObjectSyntax },
            { expr: 'func3(null, "doi") ', isValid: true, suggestions: ['AND', 'OR', '=', '!=', '&', '|'], errorCode: '' },
            {
                expr: 'func3(null) ',
                isValid: false,
                suggestions: ['AND', 'OR', '=', '!=', '&', '|'],
                errorCode: ErrorCodes.InvalidFunctionParameterCount,
            },
            { expr: 'o.name.hu', isValid: false, suggestions: [], errorCode: ErrorCodes.InvalidObjectSyntax },
            { expr: 'o.nam', isValid: false, suggestions: ['e'], errorCode: ErrorCodes.InvalidObjectSyntax },
            { expr: '3 = o.nam', isValid: false, suggestions: [], errorCode: ErrorCodes.InvalidObjectSyntax },
            { expr: 'true = func1(', isValid: false, suggestions: ['a', 'o.age'], errorCode: ErrorCodes.InvalidObjectSyntax },
            { expr: 'now(', isValid: false, suggestions: [], errorCode: ErrorCodes.InvalidObjectSyntax },
            { expr: 'any(o.cards)', isValid: true, suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |'], errorCode: '' },
            { expr: 'any(o.cards, i.brand = "a")', isValid: true, suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |'], errorCode: '' },
            {
                expr: 'any(o.cards, i.brand)',
                isValid: false,
                suggestions: [' AND', ' OR', ' =', ' !=', ' &', ' |'],
                errorCode: ErrorCodes.InvalidFunctionParameterType,
            },
        ];

        expected.forEach((element) => {
            const result = getSuggestionsAndValidaton(element.expr, objectStructures, functionStructures);
            expect(result.isValid).toEqual(element.isValid);
            expect(result.suggestions).toEqual(element.suggestions);
            expect(result.errorCode).toEqual(element.errorCode);
        });
    });
});
