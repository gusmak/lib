import { CronTabValue } from 'AWING/CronTab';
import { CronTabType } from 'AWING/CronTab/constants';
import { ScheduleType } from './enums';

export const convertScheduleSettings = (scheduleSettings: CronTabValue | undefined) => {
    if (!scheduleSettings) {
        return {};
    }
    const temp: {
        scheduleType?: ScheduleType;
        scheduleIntervalInMinutes?: number;
        scheduleIntervalFromTime?: string;
        scheduleIntervalEndTime?: string;
        scheduleExpression?: string;
        scheduleIntervalDaysOfWeek?: string;
        scheduleIntervalDaysOfMonth?: string;
    } = {};
    temp.scheduleType = scheduleSettings?.type;
    if (scheduleSettings?.type != CronTabType.ADVANCED) {
        temp.scheduleIntervalInMinutes = Number(scheduleSettings?.dayInterval?.type);
        temp.scheduleIntervalFromTime = scheduleSettings?.dayInterval?.from?.format('HH:mm:ss');
        temp.scheduleIntervalEndTime = scheduleSettings?.dayInterval?.to?.format('HH:mm:ss');
    } else {
        temp.scheduleExpression = scheduleSettings?.cronExpression;
    }
    if (scheduleSettings?.type == CronTabType.WEEKLY) {
        temp.scheduleIntervalDaysOfWeek = scheduleSettings?.daysOfWeek?.join(',');
    }
    if (scheduleSettings?.type == CronTabType.MONTHLY) {
        temp.scheduleIntervalDaysOfMonth = scheduleSettings?.daysOfMonth?.join(',');
    }
    return temp;
};

export const compareChangedFieldsDeep = <T extends Record<string, any>>(originalObj: T, changedObj: T): Record<string, any> => {
    const changes: Record<string, any> = {};

    function compareValues(original: any, changed: any, path: string = '') {
        if (typeof original === 'object' && typeof changed === 'object' && original !== null && changed !== null) {
            Object.keys(changed).forEach((key) => {
                const newPath = path ? `${path}.${key}` : key;
                compareValues(original[key], changed[key], newPath);
            });
        } else if (original !== changed) {
            changes[path] = changed;
        }
    }

    compareValues(originalObj, changedObj);
    return changes;
};
