import moment, { Locale } from 'moment';
import { DateRange } from '../types';

export const identity = <T>(x: T) => x;

export const chunks = <T>(array: ReadonlyArray<T>, size: number): T[][] =>
    Array.from({ length: Math.ceil(array.length / size) }, (_v, i) => array.slice(i * size, i * size + size));

// eslint-disable-next-line
export const getDaysInMonth = (date: Date, _locale?: Locale) => {
    // Nếu cần locale, thêm: moment.locale(locale?.code)
    const startWeek = moment(date).startOf('month').startOf('week').toDate();
    const endWeek = moment(date).endOf('month').endOf('week').toDate();
    const days = [];
    const curr = moment(startWeek);

    while (curr.isBefore(endWeek)) {
        days.push(curr.toDate());
        curr.add(1, 'days');
    }
    return days;
};

export const isStartOfRange = ({ startDate }: DateRange, day: Date) => !!(startDate && moment(day).isSame(startDate, 'day'));

export const isEndOfRange = ({ endDate }: DateRange, day: Date) => !!(endDate && moment(day).isSame(endDate, 'day'));

export const inDateRange = ({ startDate, endDate }: DateRange, day: Date) =>
    !!(
        startDate &&
        endDate &&
        (moment(day).isBetween(startDate, endDate, 'day', '[]') ||
            moment(day).isSame(startDate, 'day') ||
            moment(day).isSame(endDate, 'day'))
    );

export const isRangeSameDay = ({ startDate, endDate }: DateRange) => {
    if (startDate && endDate) {
        return moment(startDate).isSame(endDate, 'day');
    }
    return false;
};

type Falsy = false | null | undefined | 0 | '';

export const parseOptionalDate = (date: Date | string | Falsy, defaultValue: Date) => {
    if (date) {
        const parsed = date instanceof Date ? moment(date) : moment(date);
        if (parsed.isValid()) return parsed.toDate();
    }
    return defaultValue;
};

export const getValidatedMonths = (range: DateRange, minDate: Date, maxDate: Date) => {
    const { startDate, endDate } = range;
    if (startDate && endDate) {
        const newStart = moment.max(moment(startDate), moment(minDate)).toDate();
        const newEnd = moment.min(moment(endDate), moment(maxDate)).toDate();

        const momentStart = moment(newStart);
        const momentEnd = moment(newEnd);

        return [newStart, momentStart.isSame(momentEnd, 'month') ? momentStart.add(1, 'months').toDate() : newEnd];
    }
    return [startDate, endDate];
};

export function formatDateRange(value?: { startDate: Date; endDate: Date }): string {
    if (!value || !value.startDate || !value.endDate) return '';

    const start = moment(value.startDate).format('DD/MM/YYYY');
    const end = moment(value.endDate).format('DD/MM/YYYY');

    return `${start} - ${end}`;
}
