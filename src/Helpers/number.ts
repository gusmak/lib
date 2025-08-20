/**
 * Xử lý các thao tác số học và toán học một cách tiện lợi.
 * Hỗ trợ các phép toán phức tạp hoặc tối ưu hóa các logic tính toán thường dùng.
 */

export function formatNumber(num: number | bigint | string | undefined) {
    let value = Number(Number(num).toFixed(2));
    if (value || value === 0) {
        return new Intl.NumberFormat(localStorage.getItem('i18nextLng') === 'vi' ? 'vi-VN' : 'en-US').format(value);
    } else return '';
}

export function roundDecimalNumber(number: any) {
    if (typeof number !== 'number') return null;
    let str = JSON.stringify(Math.round(number * 1000000) / 1000000);
    let signIndex = str.indexOf('.');
    if (signIndex === -1) {
        return str.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    } else {
        return str.slice(0, signIndex).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + str.slice(signIndex);
    }
}

export function WMAPEcalculator(data: any) {
    // data là array có dạng [{estimate: number, reality: number},...]
    if (data.length > 0) {
        const numerator = data.reduce((acc: any, item: any) => Math.abs(item.reality - item.estimate) + acc, 0);
        const dinominator = data.reduce((acc: any, item: any) => item.reality + acc, 0);
        return dinominator === 0 ? (numerator === 0 ? 0 : '∞') : (numerator * 100) / dinominator;
    } else {
        return 0;
    }
}
