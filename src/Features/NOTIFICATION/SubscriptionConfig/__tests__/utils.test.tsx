import { CronTabValue } from 'AWING/CronTab';
import { CronTabType } from 'AWING/CronTab/constants';
import moment from 'moment';
import { Detail } from '../../components/ConfigNotification/type';
import { ScheduleType } from '../enums';
import { convertScheduleSettings, compareChangedFieldsDeep } from '../utils'; // Adjust the import as necessary

describe('convertScheduleSettings', () => {
    it('should return empty object when scheduleSettings is undefined', () => {
        expect(convertScheduleSettings(undefined)).toEqual({});
    });

    it('should handle ADVANCED schedule type correctly', () => {
        const scheduleSettings: CronTabValue | undefined = {
            type: ScheduleType.Advanced,
            cronExpression: '0 0 * * *',
        };

        const result = convertScheduleSettings(scheduleSettings);

        expect(result).toEqual({
            scheduleType: CronTabType.ADVANCED,
            scheduleExpression: '0 0 * * *',
        });
    });

    it('should handle WEEKLY schedule type correctly', () => {
        const scheduleSettings: CronTabValue | undefined = {
            type: ScheduleType.Weekly,
            daysOfWeek: [1, 3], // 1 for Monday, 3 for Wednesday
        };

        const result = convertScheduleSettings(scheduleSettings);

        expect(result).toEqual({
            scheduleType: CronTabType.WEEKLY,
            scheduleIntervalDaysOfWeek: '1,3',
            scheduleIntervalEndTime: undefined,
            scheduleIntervalFromTime: undefined,
            scheduleIntervalInMinutes: NaN,
        });
    });

    it('should handle MONTHLY schedule type correctly', () => {
        const scheduleSettings: CronTabValue | undefined = {
            type: ScheduleType.Monthly,
            daysOfMonth: [1, 15, 30],
        };

        const result = convertScheduleSettings(scheduleSettings);

        expect(result).toEqual({
            scheduleType: CronTabType.MONTHLY,
            scheduleIntervalDaysOfMonth: '1,15,30',
            scheduleIntervalEndTime: undefined,
            scheduleIntervalFromTime: undefined,
            scheduleIntervalInMinutes: NaN,
        });
    });

    it('should handle non-ADVANCED schedule type correctly', () => {
        const scheduleSettings: CronTabValue | undefined = {
            type: ScheduleType.Daily,
            dayInterval: { type: '30', from: moment(), to: moment() },
        };

        const result = convertScheduleSettings(scheduleSettings);

        expect(result).toEqual({
            scheduleType: CronTabType.DAILY,
            scheduleIntervalEndTime: moment().format('HH:mm:ss'),
            scheduleIntervalFromTime: moment().format('HH:mm:ss'),
            scheduleIntervalInMinutes: 30,
        });
    });
});
