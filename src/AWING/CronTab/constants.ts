export const CronTabType = {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
    ADVANCED: 'ADVANCED',
};

export const DayIntervalType = {
    ONE_PER_DAY: '0',
    EVERY_3_HOURS: '180',
    EVERY_2_HOURS: '120',
    EVERY_HOUR: '60',
    EVERY_30_MINUTES: '30',
    EVERY_15_MINUTES: '15',
};

export const WeekDays = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
};

export const DEFAULT_SCHEDULE_PERMISSION = {
    scheduleType: false,
    scheduleSummary: false,
    scheduleIntervalDaysOfWeek: false,
    scheduleIntervalDaysOfMonth: false,
    scheduleIntervalFromTime: false,
    scheduleIntervalEndTime: false,
    scheduleStartDate: false,
    scheduleIntervalInMinutes: false,
    scheduleToDate: false,
    scheduleExpression: false,
};
export const DEFAULT_SCHEDULE_FREE_PERMISSION = {
    scheduleType: true,
    scheduleSummary: true,
    scheduleIntervalDaysOfWeek: true,
    scheduleIntervalDaysOfMonth: true,
    scheduleIntervalFromTime: true,
    scheduleIntervalEndTime: true,
    scheduleStartDate: true,
    scheduleIntervalInMinutes: true,
    scheduleToDate: true,
    scheduleExpression: true,
};

export const DEFAULT_DAYINTERVAL_PERMISSION = {
    from: false,
    end: false,
    to: false,
    summary: false,
};
