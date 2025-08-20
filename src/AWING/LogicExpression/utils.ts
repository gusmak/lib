import { AcceptedType, FunctionStructure, ObjectStructure } from './types';

const commonOperators = ['=', '!='];
const booleanOperators = ['AND', 'OR', ...commonOperators, '&', '|'];
const numberOperators = [...commonOperators, '>', '<', '<=', '>=', '+', '-', '*', '/'];
const stringOperators = [...commonOperators, '+'];
const dateOperators = [...commonOperators, '>', '<', '<=', '>='];
const startOperators = ['!', '(', ')'];

const operators = [
    ...new Set([...commonOperators, ...booleanOperators, ...numberOperators, ...stringOperators, ...dateOperators, ...startOperators]),
];

export enum ErrorCodes {
    /** Biểu thức không hợp lệ */
    InvalidExpression = 'InvalidExpression',
    /** Thiếu dấu mở ngoặc */
    MissingOpenParenthesis = 'MissingOpenParenthesis',
    /** Thiếu dấu đóng ngoặc */
    MissingCloseParenthesis = 'MissingCloseParenthesis',
    /** Thiếu toán hạng */
    MissingOperand = 'MissingOperand',
    /** Thiếu toán tử */
    MissingOperator = 'MissingOperator',
    /** Toán hạng không đúng kiểu dữ liệu */
    InvalidOperandType = 'InvalidOperandType',
    /** Số lượng tham số trong hàm không hợp lệ */
    InvalidFunctionParameterCount = 'InvalidFunctionParameterCount',
    /** Kiểu dữ liệu của tham số không đúng */
    InvalidFunctionParameterType = 'InvalidFunctionParameterType',
    /** Cú pháp của đối tượng không đúng */
    InvalidObjectSyntax = 'InvalidObjectSyntax',
    /** Kết quả của biểu thức không phải boolean */
    InvalidResultType = 'InvalidResultType',
}

/**
 * Lấy danh sách đề xuất và tính hợp lệ của biểu thức
 * @param inputValue biểu thức đầu vào
 * @param objectStructures định nghĩa object
 * @param functionStructures định nghĩa hàm
 * @returns
 */
export const getSuggestionsAndValidaton = (
    inputValue: string,
    objectStructures: ObjectStructure[],
    functionStructures: FunctionStructure[]
): { suggestions: string[]; isValid: boolean; errorCode: string } => {
    let isValid = false;
    let suggestions: string[] = [];
    let errorCode = '';

    //Thay các phép toán 2 ký tự thành 1 ký tự vì khi không tính kết quả nên ý nghĩa vẫn tương đương
    let expr = inputValue
        .replace('AND', '&')
        .replace('&&', '&')
        .replace('||', '|')
        .replace('OR', '|')
        .replace("'", '\"')
        .replace('<=', '<')
        .replace('>=', '>')
        .replace('!=', '=');
    try {
        let exprType = getValueTypeOfExpression(expr, objectStructures, functionStructures);
        isValid = exprType === 'boolean';
        suggestions = getSuggestions(expr, exprType, objectStructures, functionStructures);
        if (!isValid) errorCode = ErrorCodes.InvalidResultType;
    } catch (error) {
        if (error instanceof Error) {
            errorCode = error.message;
            try {
                suggestions = getSuggestions(expr, undefined, objectStructures, functionStructures);
            } catch (e) {
                suggestions = [];
            }
        }
    }
    return {
        suggestions: suggestions,
        isValid: isValid,
        errorCode: errorCode,
    };
};

type OperandDTO = { operand: string; valueType: AcceptedType | ObjectStructure | ObjectStructure[] };

/**
 * Lấy type của biểu thức
 * @param expr
 * @param objectStructures
 * @param functionStructures
 * @returns
 */
const getValueTypeOfExpression = (
    expr: string,
    objectStructures: ObjectStructure[],
    functionStructures: FunctionStructure[]
): AcceptedType => {
    let postfixExpr = infixToPostfix(expr, objectStructures, functionStructures);
    let postfixStack = postfixEval(postfixExpr.postfixArray, postfixExpr.operands);

    if (postfixStack.length === 0) throw new Error(ErrorCodes.InvalidExpression);

    return postfixStack.pop()!;
};

/**
 * Chuyển biểu thức trung tố sang hậu tố
 * @param expr
 * @param objectStructures
 * @param functionStructures
 * @returns mảng biểu thức hậu tố và danh sách toán hạng
 */
const infixToPostfix = (expr: string, objectStructures: ObjectStructure[], functionStructures: FunctionStructure[]) => {
    let str = expr.replace('AND', '&').replace('&&', '&').replace('||', '|').replace('OR', '|').replace("'", '\"');
    const result: string[] = [];
    const operands: OperandDTO[] = [];
    const opStack: string[] = [];

    while (str.length > 0) {
        if (str[0] === ' ') {
            //neu gap khoang trang thi bo qua
            str = str.substring(1);
            continue;
        }
        const oper = takeOperandIfItStartInExpression(str, objectStructures, functionStructures);
        if (oper != null) {
            //Neu gap mot toan hang
            result.push(oper.operand);
            str = str.substring(oper.operand.length);
            operands.push(oper);
        } else if (str[0] === '(') {
            opStack.push('(');
            str = str.substring(1);
        } else if (str[0] === ')') {
            let topToken = opStack.pop();
            if (topToken === null) throw new Error(ErrorCodes.InvalidExpression);

            while (topToken != '(') {
                result.push(topToken!);
                if (!opStack.length) throw new Error(ErrorCodes.MissingOpenParenthesis);
                topToken = opStack.pop();
            }
            str = str.substring(1);
        } // neu gap mot toan tu
        else {
            const oper = str.startsWith('>=') || str.startsWith('<=') || str.startsWith('!=') ? str.substring(0, 2) : str[0];
            //neu ngan xep van con va do uu tien cua toan tu <= toan tu trong ngan xep thi lay ra ghi vao ket qua
            while (opStack.length && Precedence(opStack[opStack.length - 1]) >= Precedence(oper)) {
                result.push(opStack.pop()!);
            }
            opStack.push(oper); // push token vao ngan xep
            str = str.substring(oper.length);
        }
    }
    while (opStack.length) {
        //sau khi duyet xong chuoi, lan luot lay toan tu tu ngan xep ghi vao ket qua
        result.push(opStack.pop()!);
    }

    return {
        postfixArray: result,
        operands: operands,
    };
};

/**
 * Lấy toán hạng nếu toán hạng đó nằm ở đầu biểu thức
 * @param expr
 * @param objectStructures
 * @param functionStructures
 * @returns
 */
const takeOperandIfItStartInExpression = (
    expr: string,
    objectStructures: ObjectStructure[],
    functionStructures: FunctionStructure[]
): OperandDTO | undefined => {
    let firstLetter = expr[0];

    if (expr.startsWith('true')) return { operand: 'true', valueType: 'boolean' };

    if (expr.startsWith('false')) return { operand: 'false', valueType: 'boolean' };

    if (expr.startsWith('null')) return { operand: 'null', valueType: 'any' };

    const operandFuncString = takeOperandFromFunctionStructuresIfItStartInExpression(expr, objectStructures, functionStructures);
    if (operandFuncString != null) return operandFuncString;

    const operandFromObject = takeOperandFromObjectStructuresIfItStartInExpression(expr, objectStructures);
    if (operandFromObject != null) return operandFromObject;

    if (firstLetter === '"' || firstLetter === "'") {
        let val = '';
        let waitEndString = false;
        for (let c of expr) {
            val += c;
            if (c === firstLetter && (val.length === 0 || !val.endsWith('\\"'))) {
                if (waitEndString) break;
                else waitEndString = true;
            }
        }
        return { operand: val, valueType: 'string' };
    }
    if (/\d/.test(firstLetter)) {
        let val = '';
        for (let c of expr) {
            if (!(/\d/.test(c) || c === '.')) break;
            val += c;
        }
        return { operand: val, valueType: 'number' };
    }
    return undefined;
};

/**
 * Lấy toán hạng từ functionStructures nếu toán hạng đó bắt đầu ở trong biểu thức
 * @param expr
 * @param objectStructures
 * @param functionStructures
 * @returns
 */
const takeOperandFromFunctionStructuresIfItStartInExpression = (
    expr: string,
    objectStructures: ObjectStructure[],
    functionStructures: FunctionStructure[]
): OperandDTO | undefined => {
    for (let i = 0; i < functionStructures.length; i++) {
        const functionStructure = functionStructures[i];
        if (expr.startsWith(functionStructure.name)) {
            let end = -1;
            let operandFuncString = '';
            //Vòng lặp để lấy dấu đóng ngoặc chính xác
            while (true) {
                end = expr.indexOf(')', end + 1);
                if (end < 0) throw Error(ErrorCodes.InvalidObjectSyntax);

                operandFuncString = expr.substring(0, end + 1);
                const startFuncCount = (operandFuncString.match(/\(/g) || []).length; //operandFuncString.Count(x => x == '(');
                const endFuncCount = (operandFuncString.match(/\)/g) || []).length;
                if (startFuncCount == endFuncCount) break;
            }

            //Kiểm tra tính hợp lệ của tham số trong dấu ngoặc
            let paramString = operandFuncString.substring(functionStructure.name.length + 1, operandFuncString.length - 1);
            let args = splitArguments(paramString);
            //Đếm số tham số bắt buộc (tham số không bắt buộc sẽ có đuôi ? và nằm ở sau các tham số bắt buộc)
            let requiredParamCount = functionStructure.parameters.length;
            for (let j = functionStructure.parameters.length - 1; j >= 0; j--) {
                if (functionStructure.parameters[j].endsWith('?')) requiredParamCount--;
                else break;
            }

            if (args.length < requiredParamCount || args.length > functionStructure.parameters.length)
                throw new Error(ErrorCodes.InvalidFunctionParameterCount);

            //Kiểm tra kiểu dữ liệu của các tham số
            for (let j = 0; j < args.length; j++) {
                let functionParam = functionStructure.parameters[j];
                if (functionParam === 'any') continue;

                if (functionParam.startsWith('condition')) {
                    let conditionIndex = parseInt(functionParam.substring(10, 11));
                    if (
                        conditionIndex < 0 ||
                        conditionIndex == j ||
                        conditionIndex >= args.length ||
                        !functionStructure.parameters[conditionIndex].startsWith('array')
                    )
                        throw new Error(ErrorCodes.InvalidFunctionParameterCount);

                    let itemOperand = takeOperandFromObjectStructuresIfItStartInExpression(args[conditionIndex], objectStructures);
                    if (itemOperand == null || args[conditionIndex] !== itemOperand.operand || !Array.isArray(itemOperand.valueType))
                        throw new Error(ErrorCodes.InvalidFunctionParameterCount);

                    let conditionResultType = getValueTypeOfExpression(
                        args[j],
                        objectStructures.concat([{ i: itemOperand.valueType[0] }]),
                        functionStructures
                    );

                    if (conditionResultType == 'boolean') continue;
                } else {
                    let paramType = getValueTypeOfExpression(args[j], objectStructures, functionStructures);
                    //Nếu tham số là any hoặc kiểu dữ liệu của tham số đúng
                    if (checkParamType(functionParam, paramType, args[j])) continue;
                }

                throw new Error(ErrorCodes.InvalidFunctionParameterType);
            }

            return {
                operand: operandFuncString,
                valueType: functionStructure.returnType,
            };
        }
    }
    return undefined;
};

/**
 * Phân tách các đối số trong hàm
 * @param args
 * @returns
 */
const splitArguments = (args: string): string[] => {
    const result: string[] = [];
    let balance = 0;
    let currentArg = '';

    for (let char of args) {
        if (char === ',' && balance === 0) {
            // Khi gặp dấu phẩy mà không nằm trong ngoặc, kết thúc một đối số
            result.push(currentArg.trim());
            currentArg = '';
        } else {
            if (char === '(') balance++;
            else if (char === ')') balance--;
            currentArg += char;
        }
    }

    // Thêm đối số cuối cùng
    if (currentArg.trim()) {
        result.push(currentArg.trim());
    }

    return result;
};

/**
 * Kiểm tra xem typeActual có phù hợp với typeExpected hay không
 */
const checkParamType = (
    funcType: AcceptedType | `condition(${number})` | `condition(${number})?`,
    paramType: AcceptedType,
    paramValue: string
): boolean => {
    if (funcType == paramType || funcType + '?' == paramType || (funcType.endsWith('?') && paramValue === 'null')) return true;

    if (funcType.startsWith('array') && paramType.startsWith('array')) return true;

    if (funcType.startsWith('enum') && paramType.startsWith('enum')) return true;

    return false;
};

/**
 * Lấy toán hạng từ objectStructures nếu toán hạng đó bắt đầu ở trong biểu thức
 * @param expr
 * @param objectStructures
 * @returns
 */
const takeOperandFromObjectStructuresIfItStartInExpression = (
    expr: string,
    objectStructures: ObjectStructure[]
): OperandDTO | undefined => {
    const listObjectName = objectStructures.map((x) => Object.keys(x)[0]);
    if (listObjectName.length === 0) return undefined;

    let firstLetter = expr[0];
    if (listObjectName.includes(firstLetter)) {
        let objectLink = firstLetter;
        for (let i = 1; i < expr.length; i++) {
            if (operators.includes(expr[i])) {
                break;
            }
            objectLink += expr[i];
        }

        const fieldNames = objectLink.trim().split('.');
        let objectStructure: ObjectStructure | AcceptedType | Array<ObjectStructure> = objectStructures.find(
            (x) => Object.keys(x)[0] === fieldNames[0]
        )!;
        for (let i = 0; i < fieldNames.length; i++) {
            let fieldName = fieldNames[i];
            if (Array.isArray(objectStructure)) {
                if (!/\d/.test(fieldName)) throw new Error(ErrorCodes.InvalidObjectSyntax);

                objectStructure = objectStructure[0];
                continue;
            }

            if (typeof objectStructure === 'object') {
                //Nếu object không có property là fieldName
                if (!Object.keys(objectStructure).includes(fieldName)) throw new Error(ErrorCodes.InvalidObjectSyntax);

                objectStructure = objectStructure[fieldName];
                continue;
            } else throw new Error(ErrorCodes.InvalidObjectSyntax);
        }

        return {
            operand: objectLink.trim(),
            valueType: objectStructure,
        };
    }
    return undefined;
};

/**
 * Tìm loại giá trị của biểu thức
 * @param postfixArray biểu thức hậu tố
 * @param operands toán hạng và type của nó
 */
const postfixEval = (postfixExpr: string[], operands: OperandDTO[]): AcceptedType[] => {
    var operandStack: AcceptedType[] = [];
    for (let i = 0; i < postfixExpr.length; i++) {
        let token = postfixExpr[i];
        const tokenOperand = operands.find((x) => x.operand === token);
        if (tokenOperand) {
            let oper = Array.isArray(tokenOperand.valueType)
                ? 'array'
                : typeof tokenOperand.valueType === 'object'
                  ? 'object'
                  : tokenOperand.valueType;
            operandStack.push(oper);
        } else {
            if (token == '!') {
                let operand = operandStack.pop();
                if (operand != 'boolean') throw new Error(ErrorCodes.InvalidOperandType);
                operandStack.push('boolean');
            } else {
                if (operandStack.length < 2) throw new Error(ErrorCodes.MissingOperand);

                var operand2 = operandStack.pop();
                var operand1 = operandStack.pop();

                operandStack.push(GetTypeByCalculation(token, operand1!, operand2!));
            }
        }
    }
    return operandStack;
};

/**
 * Lấy kiểu dữ liệu của phép toán dựa trên 2 toán hạng và toán tử
 * @param token toán tử
 * @param operand1
 * @param operand2
 * @returns Kiểu dữ liệu kết quả phép toán
 */
function GetTypeByCalculation(token: string, operand1: AcceptedType, operand2: AcceptedType): AcceptedType {
    if (token === '=' || token === '!=') {
        if (operand1 === operand2 || operand1 === 'any' || operand2 === 'any') return 'boolean';
    }
    if (token === '+') {
        if (operand1 === 'string' || operand2 === 'string') return 'string';
        if (operand1 === 'number' && operand2 === 'number') return 'number';
    }
    if (token === '-' || token === '*' || token === '/') {
        if (operand1 === 'number' && operand2 === 'number') return 'number';
    }
    if (token === '>' || token === '<' || token === '<=' || token === '>=') {
        if ((operand1 === 'number' && operand2 === 'number') || (operand1 === 'date' && operand2 === 'date')) return 'boolean';
    }
    if (token === '&' || token === '|' || token === '&&' || token === '||') {
        if (operand1 === 'boolean' && operand2 === 'boolean') return 'boolean';
    }
    throw new Error(ErrorCodes.InvalidOperandType);
}

/**
 * Lấy độ ưu tiên của toán tử
 * @param expr
 * @param x
 * @returns
 */
const Precedence = (x: string) => {
    if (x === '(') return 1;
    if (x === '&' || x === '|') return 2;
    if (x === '>' || x === '<' || x === '=' || x === '!=' || x === '<=' || x === '>=') return 3;
    if (x === '+' || x === '-') return 4;
    if (x === '*' || x === '/') return 5;
    if (x === '!') return 6;
    return 7;
};

/**
 * Lấy danh sách đề xuất cho phần biểu thức tiếp theo
 * @param inputValue
 * @param inputCurrentType
 * @param objectStructures
 * @param functionStructures
 * @returns
 */
const getSuggestions = (
    inputValue: string,
    inputCurrentType: AcceptedType | undefined,
    objectStructures: ObjectStructure[],
    functionStructures: FunctionStructure[]
): string[] => {
    let lastOperand = getLastOperand(inputValue, objectStructures, functionStructures);
    let lastOperandType = lastOperand.type;

    let suggestions = lastOperand.nextIsOperand
        ? paginateObjectStructures(
              objectStructures,
              functionStructures,
              10,
              lastOperand.incompleteOperand + (inputValue.endsWith(' ') ? ' ' : ''),
              lastOperandType
          )
        : getOperatorSuggestionsByType(lastOperandType);

    if (inputCurrentType && !lastOperand.nextIsOperand && lastOperandType !== inputCurrentType) {
        let currentTypeSuggestions = getOperatorSuggestionsByType(inputCurrentType);
        suggestions = [...currentTypeSuggestions, ...suggestions.filter((x) => !currentTypeSuggestions.includes(x))];
    }

    // Thêm dấu cách nếu chưa có
    if (
        inputValue.length > 0 &&
        !inputValue.endsWith(' ') &&
        !inputValue.endsWith('(') &&
        (!lastOperand.nextIsOperand || lastOperand.incompleteOperand === '')
    ) {
        suggestions = suggestions.map((x) => ' ' + x);
    }

    return suggestions;
};

/**
 * Lấy ra toán hạng nằm ở cuối biểu thức
 * @param inputExpression
 * @param objectStructures
 * @param functionStructures
 * @returns
 */
function getLastOperand(
    inputExpression: string,
    objectStructures: ObjectStructure[],
    functionStructures: FunctionStructure[]
): { type: AcceptedType; incompleteOperand: string; nextIsOperand: boolean } {
    const expression = inputExpression.trim();
    let result: { type: AcceptedType; incompleteOperand: string; nextIsOperand: boolean } = {
        type: 'any',
        incompleteOperand: '',
        nextIsOperand: false,
    };

    if (expression === '') {
        result.nextIsOperand = true;
        return result;
    }

    // Kiểm tra ký tự cuối cùng của biểu thức
    let token = expression[expression.length - 1];

    // Nếu ký tự cuối cùng là dấu nháy đơn hoặc nháy kép
    if ((token === '"' || token === "'") && expression.length > 1 && expression[expression.length - 2] !== '\\') {
        //Lấy toàn bộ string
        let i = expression.length - 2;
        while (i >= 0 && expression[i] !== token && (i > 0 || expression[i - 1] !== '\\')) {
            i--;
        }

        if (i < 0) {
            return result;
        } else {
            result.incompleteOperand = '';
            result.type = 'string';
            result.nextIsOperand = false;
            return result;
        }
    }

    if (token === ')') {
        let balance = 1;
        let i = expression.length - 1;
        while (balance > 0 && i >= 0) {
            i--;
            if (expression[i] === ')') balance++;
            if (expression[i] === '(') balance--;
            if (balance === 0) {
                // Nếu trước dấu mở ngoặc là một hàm
                if (i > 0 && expression[i - 1].match(/\w/)) {
                    i--;
                    let funcName = '';
                    while (i >= 0 && expression[i].match(/\w/)) {
                        funcName = expression[i] + funcName;
                        i--;
                    }
                    let func = functionStructures.find((x) => x.name === funcName);
                    if (func) {
                        result.type = func.returnType;
                        result.nextIsOperand = false;
                        result.incompleteOperand = '';
                    }
                } else {
                    result.incompleteOperand = expression.substring(i);
                    let type = getValueTypeValidOfExpression(result.incompleteOperand, objectStructures, functionStructures);
                    if (type != null) {
                        result.type = type;
                        result.nextIsOperand = false;
                        result.incompleteOperand = '';
                    }
                }
                break;
            }
        }
        return result;
    }

    //Nếu ký tự cuối cùng là dấu mở ngoặc
    if (token === '(') {
        // Nếu trước dấu mở ngoặc là một hàm
        if (expression.length > 1 && expression[expression.length - 2].match(/\w/)) {
            let i = expression.length - 2;
            let funcName = '';
            while (i >= 0 && expression[i].match(/\w/)) {
                funcName = expression[i] + funcName;
                i--;
            }
            result.nextIsOperand = true;
            let func = functionStructures.find((x) => x.name === funcName);
            // Lấy kiểu dữ liệu của parameter đầu tiên
            if (func) {
                if (func.parameters.length > 0)
                    result.type = func.parameters[0].startsWith('condition') ? 'any' : (func.parameters[0] as AcceptedType);
                else result.nextIsOperand = false;
            }
        }
        result.incompleteOperand = '';
        return result;
    }

    // Nếu ký tự cuối cùng là toán tử
    if (operators.includes(token)) {
        result.incompleteOperand = '';
        let restOfExpression = expression.substring(0, expression.length - 1);
        let lastOperand = getLastOperand(restOfExpression, objectStructures, functionStructures);
        // Nếu ký tự cuối cùng là toán tử và trước đó vẫn là toán tử
        if (lastOperand.nextIsOperand) {
            result.type = 'any';
            result.nextIsOperand = false;
            return result;
        } else {
            result.type = lastOperand.type;
            result.nextIsOperand = true;
            return result;
        }
    }

    if (token.match(/\w/) || token === '.') {
        let i = expression.length - 2;
        let name = '';
        while (i >= 0 && (expression[i].match(/\w/) || expression[i] === '.')) {
            name = expression[i] + name;
            i--;
        }

        let currentType = getValueTypeValidOfExpression(expression.substring(i + 1), objectStructures, functionStructures);
        if (currentType && currentType !== 'object') {
            result.type = currentType;
            result.nextIsOperand = false;
            result.incompleteOperand = '';
        } else {
            let lastOperand = getLastOperand(expression.substring(0, i + 1), objectStructures, functionStructures);
            result.type = lastOperand.type;
            result.incompleteOperand = expression.substring(i + 1);
            result.nextIsOperand = true;
        }

        return result;
    }

    return result;
}

function getValueTypeValidOfExpression(
    expr: string,
    objectStructures: ObjectStructure[],
    functionStructures: FunctionStructure[]
): AcceptedType | null {
    try {
        return getValueTypeOfExpression(expr, objectStructures, functionStructures);
    } catch (error) {
        return null;
    }
}

/**
 * Trải phẳng object và chỉ lấy pageSize phần tử có phần đầu khớp với phần đuôi của inputValue
 * @param objectStructures
 * @param functionStructures
 * @param pageSize
 * @param startsWith
 * @param inputType
 * @returns
 */
function paginateObjectStructures(
    objectStructures: ObjectStructure[],
    functionStructures: FunctionStructure[],
    pageSize: number,
    startsWith: string,
    inputType: AcceptedType
): string[] {
    const keys: string[] = [];

    objectStructures.forEach((object) => {
        keys.push(...collectKeys(object, '', inputType, startsWith));
    });

    functionStructures
        .filter((x) => compareType(x.returnType, inputType))
        .forEach((func) => {
            let part = func.name + (func.parameters.length ? '(' : '()');
            if (part.startsWith(startsWith)) {
                keys.push(part.substring(startsWith.length));
            }
        });

    return keys.slice(0, pageSize);
}

/**
 * Hàm đệ quy để lấy danh sách key của object
 * @param object
 * @param prefix
 * @param inputType
 * @param startsWith
 * @returns
 */
function collectKeys(object: ObjectStructure, prefix: string, inputType: AcceptedType, startsWith: string) {
    let result: string[] = [];
    for (const key in object) {
        const value = object[key];
        const currentPath = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
            if (compareType(value, inputType) && currentPath.startsWith(startsWith)) {
                result.push(currentPath.substring(startsWith.length));
            }
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                result.push(...collectKeys(item, `${currentPath}.${index}`, inputType, startsWith));
            });
        } else if (typeof value === 'object') {
            result.push(...collectKeys(value, currentPath, inputType, startsWith));
        }
    }
    return result;
}

/**
 * so sánh 2 kiểu dữ liệu
 * @param type1
 * @param type2
 * @returns
 */
const compareType = (type1: AcceptedType, type2: AcceptedType): boolean => {
    return type1 === type2 || type1 === 'any' || type2 === 'any' || type1 === `${type2}?` || type2 === `${type1}?`;
};

/**
 * Lấy danh sách toán tử đề xuất dựa trên kiểu dữ liệu của toán hạng
 * @param inputCurrentType
 * @returns
 */
const getOperatorSuggestionsByType = (inputCurrentType: AcceptedType | undefined): string[] => {
    switch (inputCurrentType) {
        case 'boolean':
        case 'boolean?':
            return booleanOperators;
        case 'number':
        case 'number?':
            return numberOperators;
        case 'string':
        case 'string?':
            return stringOperators;
        case 'date':
        case 'date?':
            return dateOperators;
        case 'any':
        case undefined:
            return [];
        default:
            return commonOperators;
    }
};
