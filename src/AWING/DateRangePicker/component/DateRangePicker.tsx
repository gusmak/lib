import moment from 'moment';
import { useState } from 'react';
import { DateRange, DefinedRange, NavigationAction } from '../types';
import { getDefaultRanges } from './defaults';
import { Marker, MARKERS } from './Markers';
import Menu from './Menu';
import { getValidatedMonths, parseOptionalDate } from './utils';
import { ModalCustomProps } from '../types/utils';

interface DateRangePickerProps {
    open: boolean;
    initialDateRange?: DateRange;
    definedRanges?: DefinedRange[];
    minDate?: Date | string;
    maxDate?: Date | string;
    onChange: (dateRange: DateRange) => void;
    locale?: string | moment.LocaleSpecifier;
    customProps?: ModalCustomProps;
    hideOutsideMonthDays?: boolean;
    hideDefaultRanges?: boolean;
}

const DateRangePickerComponent: React.FunctionComponent<DateRangePickerProps> = (props: DateRangePickerProps) => {
    const today = new Date();

    const {
        open,
        onChange,
        initialDateRange,
        minDate,
        maxDate,
        definedRanges = getDefaultRanges(new Date(), props.locale),
        hideDefaultRanges = true,
        locale,
        customProps,
    } = props;

    // Nếu cần locale: moment.locale(locale?.code)
    const minDateValid = parseOptionalDate(minDate, moment(today).subtract(10, 'years').toDate());
    const maxDateValid = parseOptionalDate(maxDate, moment(today).add(10, 'years').toDate());
    const [intialFirstMonth, initialSecondMonth] = getValidatedMonths(initialDateRange || {}, minDateValid, maxDateValid);

    const [dateRange, setDateRange] = useState<DateRange>({
        ...initialDateRange,
    });
    const [hoverDay, setHoverDay] = useState<Date>();
    const [firstMonth, setFirstMonth] = useState<Date>(intialFirstMonth || today);
    const [secondMonth, setSecondMonth] = useState<Date>(initialSecondMonth || moment(firstMonth).add(1, 'months').toDate());

    const { startDate, endDate } = dateRange;

    // handlers
    const setFirstMonthValidated = (date: Date) => {
        if (moment(date).isBefore(secondMonth)) {
            setFirstMonth(date);
        }
    };

    const setSecondMonthValidated = (date: Date) => {
        if (moment(date).isAfter(firstMonth)) {
            setSecondMonth(date);
        }
    };

    const setDateRangeValidated = (range: DateRange) => {
        let { startDate: newStart, endDate: newEnd } = range;

        if (newStart && newEnd) {
            range.startDate = newStart = moment.max(moment(newStart), moment(minDateValid)).toDate();
            range.endDate = newEnd = moment.min(moment(newEnd), moment(maxDateValid)).toDate();

            setDateRange(range);
            onChange(range);

            setFirstMonth(newStart);
            setSecondMonth(moment(newStart).isSame(newEnd, 'month') ? moment(newStart).add(1, 'months').toDate() : newEnd);
        } else {
            const emptyRange = {};

            setDateRange(emptyRange);
            onChange(emptyRange);

            setFirstMonth(today);
            setSecondMonth(moment(firstMonth).add(1, 'months').toDate());
        }
    };

    const onDayClick = (day: Date) => {
        if (startDate && !endDate && !moment(day).isBefore(startDate)) {
            const newRange = { startDate, endDate: day };
            onChange(newRange);
            setDateRange(newRange);
        } else {
            setDateRange({ startDate: day, endDate: undefined });
        }
        setHoverDay(day);
    };

    const onMonthNavigate = (marker: Marker, action: NavigationAction) => {
        if (marker === MARKERS.FIRST_MONTH) {
            const firstNew = moment(firstMonth).add(action, 'months').toDate();
            if (moment(firstNew).isBefore(secondMonth)) setFirstMonth(firstNew);
        } else {
            const secondNew = moment(secondMonth).add(action, 'months').toDate();
            if (moment(firstMonth).isBefore(secondNew)) setSecondMonth(secondNew);
        }
    };

    const onDayHover = (date: Date) => {
        if (startDate && !endDate) {
            if (!hoverDay || !moment(date).isSame(hoverDay, 'day')) {
                setHoverDay(date);
            }
        }
    };

    // helpers
    const inHoverRange = (day: Date) =>
        !!(
            startDate &&
            !endDate &&
            hoverDay &&
            moment(hoverDay).isAfter(startDate) &&
            moment(day).isBetween(startDate, hoverDay, 'day', '[]')
        );

    const helpers = {
        inHoverRange,
    };

    const handlers = {
        onDayClick,
        onDayHover,
        onMonthNavigate,
    };

    return open ? (
        <Menu
            dateRange={dateRange}
            minDate={minDateValid}
            maxDate={maxDateValid}
            ranges={definedRanges}
            firstMonth={firstMonth}
            secondMonth={secondMonth}
            setFirstMonth={setFirstMonthValidated}
            setSecondMonth={setSecondMonthValidated}
            setDateRange={setDateRangeValidated}
            helpers={helpers}
            handlers={handlers}
            locale={locale}
            customProps={customProps}
            hideDefaultRanges={hideDefaultRanges}
        />
    ) : null;
};

export default DateRangePickerComponent;
