import { formatNumber, roundDecimalNumber, WMAPEcalculator } from '../number';

describe('formatNumber', () => {
    it('should format numbers correctly', () => {
        expect(formatNumber(1234.567)).toBe('1,234.57'); // Assuming 'en-US'
        expect(formatNumber(0)).toBe('0');
        expect(formatNumber(undefined)).toBe('');
        expect(formatNumber('1234')).toBe('1,234');
    });
    it('should handle invalid inputs', () => {
        expect(formatNumber(NaN)).toBe('');
        expect(formatNumber(null as any)).toBe('0');
    });
});

describe('roundDecimalNumber', () => {
    it('should round and format numbers correctly', () => {
        expect(roundDecimalNumber(1234.56789)).toBe('1,234.56789');
        expect(roundDecimalNumber(1000000)).toBe('1,000,000');
        expect(roundDecimalNumber(0.1234567)).toBe('0.123457');
    });
    it('should return null for invalid inputs', () => {
        expect(roundDecimalNumber('abc')).toBeNull();
        expect(roundDecimalNumber(undefined)).toBeNull();
    });
});

describe('WMAPEcalculator', () => {
    it('should calculate WMAPE correctly', () => {
        const data = [
            { estimate: 100, reality: 120 },
            { estimate: 200, reality: 180 },
        ];
        expect(WMAPEcalculator(data)).toBeCloseTo(13.33, 2); // Example result
    });
    it('should handle empty data arrays', () => {
        expect(WMAPEcalculator([])).toBe(0);
    });
    it('should return "∞" for zero denominators with non-zero numerators', () => {
        const data = [
            { estimate: 10, reality: 0 },
            { estimate: -10, reality: 0 },
        ];
        expect(WMAPEcalculator(data)).toBe('∞');
    });
});
