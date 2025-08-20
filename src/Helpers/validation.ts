/**
 * Đảm bảo dữ liệu được kiểm tra tính hợp lệ trước khi xử lý hoặc gửi đi.
 * Được sử dụng nhiều trong xử lý form, API, hoặc đầu vào từ người dùng.
 */

/**
 *  check string list ap input
 *
 * @param {string} stringListAP
 * @returns {boolean}
 */

//Hàm này chỉ dùng bên ACM khi nào ai import hàm này move sang ACM nhé
export function checkValidStringListAP(stringListAP = '') {
    let isValid = true;
    const listAP = stringListAP.split('\n');
    listAP.every((ap) => {
        const [macAp, nameAp] = ap.split(' ');
        const regexMacAddress = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/g;
        // eslint-disable-next-line eqeqeq
        const isValidMacAddress = macAp == (macAp.match(regexMacAddress) as any);
        if (!isValidMacAddress || !nameAp || listAP.filter((item) => item.includes(macAp)).length > 1) {
            isValid = false;
        }
        return isValid;
    });
    return !isValid;
}

export function checkValidMacAddress(string = '') {
    const regexMacAddress = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/g;
    return regexMacAddress.test(string);
}

export function checkValidUrl(url: string | undefined) {
    var pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    if (!url || url.length > 1000 || url.trim().length <= 0 || !pattern.test(url)) return false;
    return true;
}

export function validateNumber(value: string | number = '') {
    var numberRex = new RegExp('^[0-9]+$');
    if (numberRex.test(String(value))) {
        return true;
    }
    return false;
}
