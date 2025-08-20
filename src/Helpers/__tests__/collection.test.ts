import moment from 'moment';
import {
    convertArrayToObject,
    convertDataSetPattern,
    updateObjectFields,
    formatChartNumber,
    setObject,
    nameExportStandard,
} from '../collection';
import { AnalyticDataProviderModel } from 'Commons/Types';

// Mock i18next
jest.mock('../../translate/i18n', () => ({
    t: (key: string) => key,
}));

describe('convertArrayToObject', () => {
    test('should convert array to object using specified key', () => {
        const input = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
        ];
        const result = convertArrayToObject(input, 'id');
        expect(result).toEqual({
            '1': { id: 1, name: 'John' },
            '2': { id: 2, name: 'Jane' },
        });
    });

    test('should return undefined for null input', () => {
        expect(convertArrayToObject(null, 'id')).toBeUndefined();
    });

    test('should handle empty array', () => {
        expect(convertArrayToObject([], 'id')).toEqual({});
    });
});

describe('convertDataSetPattern', () => {
    const mockData = [
        { ctr: 1, click: 10, view: 100 },
        { ctr: 2, click: 20, view: 200 },
    ] as AnalyticDataProviderModel[];

    test('should convert data to correct chart format', () => {
        const result = convertDataSetPattern(mockData);
        expect(result).toHaveLength(3);
        expect(result[0].data).toEqual([1, 2]);
        expect(result[1].data).toEqual([10, 20]);
        expect(result[2].data).toEqual([100, 200]);
    });

    test('should handle empty array', () => {
        const result = convertDataSetPattern([]);
        expect(result[0].data).toEqual([]);
        expect(result[1].data).toEqual([]);
        expect(result[2].data).toEqual([]);
    });
});

describe('updateObjectFields', () => {
    test('should update simple fields', () => {
        const original = { name: 'John', age: 30 };
        const changes = { age: 31 };
        const result = updateObjectFields(original, changes);
        expect(result).toEqual({ name: 'John', age: 31 });
    });

    test('should update nested fields', () => {
        const original = { user: { name: 'John', details: { age: 30 } } };
        const changes = { user: { details: { age: 31 } } };
        const result = updateObjectFields(original, changes);
        expect(result.user.details.age).toBe(31);
    });
});

describe('formatChartNumber', () => {
    test('should format numbers correctly', () => {
        expect(formatChartNumber(1000, 'en')).toBe('1,000');
        expect(formatChartNumber(null, 'en')).toBe('0');
        expect(formatChartNumber('-', 'en')).toBe('-');
    });
});

describe('setObject', () => {
    test('should set nested object value', () => {
        const obj = { a: { b: { c: 1 } } };
        setObject<typeof obj>(obj, ['a'], { b: { c: 2 } });
        expect(obj.a.b.c).toBe(2);
    });
});

describe('nameExportStandard', () => {
    test('should generate correct export name', () => {
        const currentDate = moment().format('YYYY-MM-DD');
        expect(nameExportStandard('feature', 'object', 'subtitle')).toBe(`AWING_FEATURE_OBJECT_SUBTITLE_${currentDate}`);
    });

    test('should handle missing parameters', () => {
        const currentDate = moment().format('YYYY-MM-DD');
        expect(nameExportStandard('feature')).toBe(`AWING_FEATURE_${currentDate}`);
    });
});
