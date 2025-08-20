/**
 * Hỗ trợ xử lý chuỗi văn bản, từ việc định dạng, chuyển đổi cho đến kiểm tra tính hợp lệ.
 * Đảm bảo sự nhất quán và tái sử dụng các logic liên quan đến chuỗi.
 */

export function changeToAlias(str: string = '') {
    // Chuyển toàn bộ Tiếng Việt sang không dấu viết thường và các kí tự đặc biệt thành dấu "-"
    return str
        .trim()
        .normalize('NFD')
        .toLowerCase()
        .replace(/\s\s+/g, ' ')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/`|~|!|@|"|#|\||\$|%|\^|&|\*|\(|\)|\+|=|,|\.|\/|\?|>|<|'|"|:|;|_/gi, '')
        .replace(/ /g, '-')
        .replace(/-----/gi, '-')
        .replace(/----/gi, '-')
        .replace(/---/gi, '-')
        .replace(/--/gi, '-')
        .replace(/"-|-"|"/gi, '');
}

export const toCapitalize = (str: string, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
