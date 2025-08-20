import moment from 'moment';
import { TIMELINE_TYPE } from '../../Commons/Enums';
import {
    calculatorDirectoryIdRoot,
    convertDateTimeToTimestamp,
    convertTimeLine,
    convertTimelineToDateTime,
    convertTimestampToDateTime,
    dateTimeToString,
    dateToString,
    dateToStringDDMMYYYY,
    fillMissingDates,
    getStartOfDay,
    getToday,
    parseJSON,
    timestampToStringDDMMYYYY,
} from '../datetime';

// Mock i18next
jest.mock('../../translate/i18n', () => ({
    language: 'vi',
    t: (key: string) => key,
}));

describe('dateToString', () => {
    test('should format date correctly', () => {
        const testDate = new Date('2023-01-01');
        expect(dateToString(testDate)).toBe('01/01/2023');
    });

    test('should handle moment input', () => {
        const testMoment = moment('2023-01-01');
        expect(dateToString(testMoment)).toBe('01/01/2023');
    });

    test('should handle string input', () => {
        expect(dateToString('2023-01-01')).toBe('01/01/2023');
    });
});

describe('calculatorDirectoryIdRoot', () => {
    test('should find directory with minimum level', () => {
        const directories = [
            { directoryId: 1, level: 2 },
            { directoryId: 2, level: 1 },
            { directoryId: 3, level: 3 },
        ];
        expect(calculatorDirectoryIdRoot(directories)).toBe(2);
    });
});

describe('convertTimeLine', () => {
    test('should convert timeline number to formatted string', () => {
        expect(convertTimeLine(202301011200)).toBe('12h 01-01-2023');
        expect(convertTimeLine(20230101)).toBe('01-01-2023');
    });
});

describe('convertDateTimeToTimestamp', () => {
    test('should convert Date to Timestamp', () => {
        const date = new Date('2023-01-01');
        const result = convertDateTimeToTimestamp(date);
        expect(result).toHaveProperty('seconds');
        expect(result).toHaveProperty('nanos');
    });
});

describe('convertTimestampToDateTime', () => {
    test('should convert Timestamp to Date', () => {
        const timestamp = { seconds: 1672531200, nanos: 0 };
        const result = convertTimestampToDateTime(timestamp);
        expect(result).toBeInstanceOf(Date);
    });
});

describe('dateTimeToString', () => {
    test('should format datetime with given format', () => {
        const date = new Date('2023-01-01');
        expect(dateTimeToString(date, 'YYYY-MM-DD')).toBe('2023-01-01');
    });
});

describe('convertTimelineToDateTime', () => {
    test('should convert timeline string to Date with HOUR type', () => {
        const result = convertTimelineToDateTime('2023010112', TIMELINE_TYPE.HOUR);
        expect(result).toBeInstanceOf(Date);
        expect(result.getHours()).toBe(12);
    });

    test('should convert timeline string to Date with DAY type', () => {
        const result = convertTimelineToDateTime('20230101', TIMELINE_TYPE.DAY);
        expect(result).toBeInstanceOf(Date);
    });
});

describe('dateToStringDDMMYYYY', () => {
    test('should format date to DD/MM/YYYY', () => {
        const date = new Date('2023-01-01');
        expect(dateToStringDDMMYYYY(date)).toBe('01/01/2023');
    });

    test('should return null for null input', () => {
        expect(dateToStringDDMMYYYY(null)).toBeNull();
    });
});

describe('getStartOfDay', () => {
    test('should return start of day', () => {
        const date = new Date('2023-01-01T12:30:45');
        const result = getStartOfDay(date);
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
    });
});

describe('getToday', () => {
    test('should return today at start of day', () => {
        const result = getToday();
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
    });
});

describe('fillMissingDates', () => {
    test('should fill missing dates in range', () => {
        const data = [
            { x: '20230101', y: 1 },
            { x: '20230103', y: 3 },
        ];
        const result = fillMissingDates(data, '2023-01-01', '2023-01-03');
        expect(result).toHaveLength(3);
        expect(result.find((d) => d.x === '20230102')).toBeDefined();
    });

    test('should throw error if start date is after end date', () => {
        const data = [{ x: '20230101', y: 1 }];
        expect(() => fillMissingDates(data, '2023-01-03', '2023-01-01', 'YYYYMMDDHH')).toThrow();
    });

    test('only data', () => {
        const data = [{ x: '20230101', y: 1 }];
        const result = fillMissingDates(data);
    });
});

describe('parseJSON', () => {
    test('should parse valid JSON string', () => {
        expect(parseJSON('{"key":"value"}')).toEqual({ key: 'value' });
    });

    test('should handle invalid JSON', () => {
        const invalid = '{invalid}';
        expect(parseJSON(invalid)).toBe(invalid);
    });

    test('should return empty object for empty string', () => {
        expect(parseJSON('')).toEqual({});
    });
});

declare global {
    var dateToStringDDMMYYYY: jest.Mock;
}

describe('timestampToStringDDMMYYYY', () => {
    it('should return null if the input date is null or undefined', () => {
        // @ts-ignore
        expect(timestampToStringDDMMYYYY(null)).toBeNull();
        expect(timestampToStringDDMMYYYY(undefined)).toBeNull();
    });

    it('should convert timestamp to DD/MM/YYYY format correctly', () => {
        const mockTimestamp = { seconds: 1735583100 }; // Equivalent to 2024-12-30T15:45:00Z
        const mockDateToStringSpy = jest.fn(() => '30/12/2024');

        global.dateToStringDDMMYYYY = mockDateToStringSpy;
        const result = timestampToStringDDMMYYYY(mockTimestamp);
        expect(result).toBe('31/12/2024');
    });
});
