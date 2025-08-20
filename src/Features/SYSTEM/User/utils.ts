export function validateUsername(username: string) {
    // dài 6-50 ký tự, không chứa khoảng trắng hay ký tự đặc biệt. Chấp nhận dấu: . _ -
    return username !== undefined && /^[a-zA-Z0-9._-]{6,50}$/.test(username);
}

export function validatePassword(password: string) {
    // dài ít nhất 8 ký tự, chứa chữ viết hoa, viết thường, chữ số và ký tự đặc biệt
    return password !== undefined && /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password);
}

export function validateContainHtmlTag(input: string) {
    // not accept HTML tag
    if (input === undefined || input.trim() === '' || /<[^>]*>/.test(input)) return false;
    return true;
}

export const DEBOUNCE_TIME = 700;
