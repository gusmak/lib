import moment, { LocaleSpecifier } from 'moment';
import { DefinedRange } from '../types';

export const getDefaultRanges = (date: Date, locale?: LocaleSpecifier): DefinedRange[] => {
    const momentDate = moment(date);
    if (locale) {
        momentDate.locale(locale);
    }

    return [
        {
            label: 'Today',
            startDate: momentDate.toDate(),
            endDate: momentDate.toDate(),
        },
        {
            label: 'Yesterday',
            startDate: momentDate.clone().subtract(1, 'day').toDate(),
            endDate: momentDate.clone().subtract(1, 'day').toDate(),
        },
        {
            label: 'This Week',
            startDate: momentDate.clone().startOf('week').toDate(),
            endDate: momentDate.clone().endOf('week').toDate(),
        },
        {
            label: 'Last Week',
            startDate: momentDate.clone().subtract(1, 'week').startOf('week').toDate(),
            endDate: momentDate.clone().subtract(1, 'week').endOf('week').toDate(),
        },
        {
            label: 'Last 7 Days',
            startDate: momentDate.clone().subtract(7, 'days').toDate(),
            endDate: momentDate.toDate(),
        },
        {
            label: 'This Month',
            startDate: momentDate.clone().startOf('month').toDate(),
            endDate: momentDate.clone().endOf('month').toDate(),
        },
        {
            label: 'Last Month',
            startDate: momentDate.clone().subtract(1, 'month').startOf('month').toDate(),
            endDate: momentDate.clone().subtract(1, 'month').endOf('month').toDate(),
        },
        {
            label: 'This Year',
            startDate: momentDate.clone().startOf('year').toDate(),
            endDate: momentDate.clone().endOf('year').toDate(),
        },
        {
            label: 'Last Year',
            startDate: momentDate.clone().subtract(1, 'year').startOf('year').toDate(),
            endDate: momentDate.clone().subtract(1, 'year').endOf('year').toDate(),
        },
    ];
};
