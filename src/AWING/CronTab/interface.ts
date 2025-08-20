import { ScheduleType } from 'Features/NOTIFICATION/SubscriptionConfig/enums';
import { Moment } from 'moment';

export interface DayInterval {
    type: string;
    from?: Moment;
    to?: Moment;
}

export interface CronTabValue {
    type: ScheduleType;
    dayInterval?: DayInterval;
    daysOfWeek?: number[];
    daysOfMonth?: number[];
    cronExpression?: string;
}

export interface CronTabProps {
    initValue?: CronTabValue;
    value?: CronTabValue;
    onChange: (value: CronTabValue, isValid: boolean) => void;
    schedulePermissions: SchedulePermission;
}

export interface SchedulePermission {
    scheduleType: boolean;
    scheduleSummary: boolean;
    scheduleIntervalDaysOfWeek: boolean;
    scheduleIntervalDaysOfMonth: boolean;
    scheduleIntervalFromTime: boolean;
    scheduleIntervalEndTime: boolean;
    scheduleStartDate: boolean;
    scheduleIntervalInMinutes: boolean;
    scheduleToDate: boolean;
    scheduleExpression: boolean;
}

export interface DayIntervalPickerProps {
    dayInterval?: DayInterval;
    onChange: (newValue: DayInterval) => void;
    dayIntervalPermission: {
        from: boolean;
        end: boolean;
        to: boolean;
        summary: boolean;
    };
}
