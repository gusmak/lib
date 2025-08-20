import { TFunction } from 'i18next';
import moment from 'moment';

const configInitialDate = (t: TFunction<'translation', undefined>, isFutureDate: boolean) => {
    const today = moment();

    const initDatePast = [
        {
            text: t('DatePicker.ToDay'),
            start: today,
            end: today,
        },
        {
            text: t('DatePicker.Yesterday'),
            start: moment().subtract(1, 'days'),
            end: moment().subtract(1, 'days'),
        },
        {
            text: t('DatePicker.LastSevenDay'),
            start: moment().subtract(6, 'days'),
            end: today,
        },
        {
            text: t('DatePicker.LastThirtyDay'),
            start: moment().subtract(29, 'days'),
            end: today,
        },
        {
            text: t('DatePicker.ThisMonth'),
            start: moment().startOf('month'),
            end: moment().endOf('month'),
        },
        {
            text: t('DatePicker.LastMonth'),
            start: moment().subtract(1, 'month').startOf('month'),
            end: moment().subtract(1, 'month').endOf('month'),
        },
    ];

    const initDateFuture = [
        {
            text: t('DatePicker.ToDay'),
            start: today,
            end: today,
        },
        {
            text: t('DatePicker.Tomorrow'),
            start: moment(),
            end: moment().add(1, 'days'),
        },
        {
            text: t('DatePicker.NextSevenDay'),
            start: today,
            end: moment().add(6, 'days'),
        },
        {
            text: t('DatePicker.NextThirtyDay'),
            start: today,
            end: moment().add(29, 'days'),
        },
        {
            text: t('DatePicker.NextMonth'),
            start: moment().add(1, 'month').startOf('month'),
            end: moment().add(1, 'month').endOf('month'),
        },
    ];

    const initDate = isFutureDate ? initDateFuture : initDatePast;

    return initDate;
};

export default configInitialDate;
