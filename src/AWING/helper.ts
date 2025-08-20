export function formatNumberWithLanguage(num: number | bigint | undefined, language?: string) {
    if (num || num === 0) {
        return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US').format(num);
    } else return '';
}

// #region Binary Tree
export type BinaryTreeNode = {
    value: string;
    left?: BinaryTreeNode;
    right?: BinaryTreeNode;
};
/** Calculate Value  */
export function calculateValue(binary: BinaryTreeNode): number {
    const temp = Object.assign({}, binary);
    if (!temp.left && !temp.right) {
        return Number(temp.value || 0);
    }

    const leftValue = temp.left ? calculateValue(temp.left) : 0;
    const rightValue = temp.right ? calculateValue(temp.right) : 0;
    switch (temp.value) {
        case '+':
            return leftValue + rightValue;
        case '-':
            return leftValue - rightValue;
        case '*':
            return leftValue * rightValue;
        case '/':
            return leftValue / rightValue;
        case '~':
            return Math.round(leftValue * Math.pow(10, rightValue)) / Math.pow(10, rightValue);
        case 'round':
            return Math.round(rightValue);
        default:
            throw new Error(`Invalid operator: ${binary.value}`);
    }
}
// #endregion

export function isOperator(token: string): boolean {
    return '+-*/~'.includes(token) || listFunction.includes(token);
}

export function isOperand(token: string): boolean {
    return !isOperator(token) && token !== '(' && token !== ')';
}

// #region tokenize
const listFunction = ['round'];
const mockLeftValue = 'left';
export function tokenize(formula: string): string[] {
    const result: string[] = [];
    formula
        .split(/([+\-*/()~])/)
        .filter((token) => token.trim().length > 0)
        .map((t) => {
            if (listFunction.includes(t?.trim())) {
                result.push(mockLeftValue, t?.trim());
            } else {
                result.push(t?.trim());
            }
        });
    return result;
}
// #endregion

export function getPrecedence(operator: string): number {
    if (listFunction.includes(operator)) return 3;
    switch (operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        case '~':
            return 3;
        default:
            return 0;
    }
}

export function convertToPostfix(infix: string): string[] {
    const stack: string[] = [];
    const postfix: string[] = [];

    for (const token of tokenize(infix)) {
        if (isOperand(token)) {
            postfix.push(token);
        } else if (isOperator(token)) {
            while (stack.length > 0 && getPrecedence(stack[stack.length - 1]) >= getPrecedence(token)) {
                postfix.push(stack.pop()!);
            }
            stack.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                postfix.push(stack.pop()!);
            }
            stack.pop(); // Pop the "("
        }
    }

    while (stack.length > 0) {
        postfix.push(stack.pop()!);
    }

    return postfix;
}

export function convertFormulaToBinaryTree(formula: string): BinaryTreeNode | undefined {
    const stack: BinaryTreeNode[] = [];
    const postfix = convertToPostfix(formula);

    for (const token of postfix) {
        if (isOperand(token)) {
            stack.push({ value: token });
        } else if (isOperator(token)) {
            const right = stack.pop();
            const left = stack.pop();
            stack.push({ value: token, left, right });
        }
    }

    return stack.pop();
}

export const replaceFieldsValue = (
    fields: {
        fieldName: string;
        value?: string | null;
    }[],
    formula: string
) => {
    let result = formula;
    fields.map((field) => {
        if (field.value !== undefined && field.value !== null && field.value !== '') {
            result = result.replaceAll(`{${field.fieldName}}`, field.value);
        } else {
            result = result.replaceAll(`{${field.fieldName}}`, 'notready');
        }
    });
    return result;
};
