import { useRef, useState, useEffect, useMemo, type MouseEvent } from 'react';
import { isSameDay, DayPickerRangeController } from 'react-dates';
import { START_DATE, END_DATE } from 'react-dates/constants';
import { useTranslation } from 'react-i18next';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { Popper, Paper, ClickAwayListener } from '@mui/material';

import configInitialDate from './configDate';
import 'moment/locale/vi';
import 'moment/locale/id';
import moment, { type Moment } from 'moment';
import { omit, get } from 'lodash';
import { useStyles, useFormatDateByLanguage } from './helper';
import { DateRangePickerOldProps } from './Types';
import InputMask from './InputMask';
// import { useMask } from '@react-input/mask';

const DateRangePickerWrapper = (props: DateRangePickerOldProps) => {
    const { i18n, t } = useTranslation();
    const classes = useStyles();

    const {
        value,
        error,
        helperText,
        autoFocus = false,
        autoFocusEndDate = false,
        initialStartDate = null,
        initialEndDate = null,
        callback = () => {},
        label = null,
        isShowCalendarInfo = false,
        variant,
        openDirection,
        isDayBlocked = () => false,
        handleValid = () => {},
        handleDateRangePopover = () => {},
        disableHelperText,
        isFutureDate = false,
        required = false,
        numberOfMonths = 2,
    } = props;

    let initialFocusedInput = null;
    if (autoFocus) {
        initialFocusedInput = START_DATE;
    } else if (autoFocusEndDate) {
        initialFocusedInput = END_DATE;
    }
    const [focusedInput, setFocusedInput] = useState(initialFocusedInput);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [isValid, setIsValid] = useState(true);
    const [inputValue, setInputValue] = useState(
        `${useFormatDateByLanguage(value ? value?.startDate : startDate, i18n)} - ${useFormatDateByLanguage(
            value ? value?.endDate : endDate,
            i18n
        )}`
    );

    let momentLanguage = useMemo(() => {
        return i18n?.language?.split('-')?.[0] || 'en';
    }, [i18n.language]);

    useEffect(() => {
        setInputValue(
            `${useFormatDateByLanguage(value ? value?.startDate : startDate, i18n)} - ${useFormatDateByLanguage(
                value ? value?.endDate : endDate,
                i18n
            )}`
        );
    }, [momentLanguage]);

    useEffect(() => {
        if (value !== undefined) {
            const inputUpdate = `${useFormatDateByLanguage(value ? value?.startDate : startDate, i18n)} - ${useFormatDateByLanguage(
                value ? value?.endDate : endDate,
                i18n
            )}`;

            if (inputUpdate != inputValue) {
                setInputValue(inputUpdate);
                const momentStartDate = moment(value ? value?.startDate : startDate, 'L', true);
                const momentEndDate = moment(value ? value?.endDate : endDate, 'L', true);
                if (momentStartDate.isValid() && momentEndDate.isValid() && momentEndDate.diff(momentStartDate) >= 0) {
                    setIsValid(true);
                } else setIsValid(false);
            }
        }
    }, [value]);

    useEffect(() => {
        moment.locale(momentLanguage);
        if ((value ? value?.startDate : startDate) !== null && moment(value ? value?.startDate : startDate).locale() !== momentLanguage) {
            setStartDate(moment(value ? value?.startDate : startDate).locale(momentLanguage));
        }
    }, [momentLanguage, i18n.language, value?.startDate]);

    useEffect(() => {
        handleValid(isValid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValid]);

    const onDatesChange = ({ startDate, endDate }: { startDate: Moment; endDate: Moment }) => {
        setStartDate(startDate);
        setEndDate(endDate);
        if (startDate && moment.isMoment(startDate)) {
            startDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        }
        if (endDate && moment.isMoment(endDate)) {
            endDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        }
        callback({
            startDate,
            endDate,
        });
        const momentStartDate = moment(startDate, 'L', true);
        const momentEndDate = moment(endDate, 'L', true);

        if (momentStartDate.isValid() && momentEndDate.isValid() && momentEndDate.diff(momentStartDate) >= 0) {
            setIsValid(true);
        } else setIsValid(false);

        setInputValue(`${useFormatDateByLanguage(startDate, i18n)} - ${useFormatDateByLanguage(endDate, i18n)}`);
    };

    const onFocusChange = (focusedInput: any) => {
        setFocusedInput(!focusedInput ? START_DATE : focusedInput);
    };

    const controlButtonClick = (daterange: any) => {
        onDatesChange(daterange);
        // setFocusedInput(null);
    };

    // const getDataSet = (moment: any) => {
    //     return moment.set({
    //         hour: 0,
    //         minute: 0,
    //         second: 0,
    //         millisecond: 0,
    //     });
    // };

    // const resetDate = () => {
    //     setStartDate(initialStartDate);
    //     setEndDate(initialEndDate);
    //     setInputValue(`${useFormatDateByLanguage(initialStartDate, i18n)} - ${useFormatDateByLanguage(initialEndDate, i18n)}`);
    //     callback({
    //         startDate: getDataSet(moment(initialStartDate, 'L')),
    //         endDate: getDataSet(moment(initialEndDate, 'L')),
    //     });
    // };

    // const handleChangeInput = (e: any) => {
    //     const fieldValue = e.target.value;

    //     setInputValue(fieldValue);
    //     const fieldValueArr = fieldValue?.split(' - ') || [];
    //     const year1900 = moment('1900-01-01');
    //     const momentStartDate = moment(fieldValueArr[0], 'L');
    //     const momentEndDate = moment(fieldValueArr[1], 'L');
    //     if (isFunction(isDayBlocked) && isDayBlocked(momentStartDate)) {
    //         setIsValid(true);
    //         resetDate();
    //         return;
    //     }

    //     if (isFunction(isDayBlocked) && isDayBlocked(momentEndDate)) {
    //         setIsValid(true);
    //         resetDate();
    //         return;
    //     }

    //     if (momentStartDate.isValid() && momentStartDate.diff(year1900) >= 0) {
    //         setStartDate(momentStartDate);
    //     }

    //     if (momentEndDate.isValid() && momentEndDate.diff(year1900) >= 0) {
    //         setEndDate(momentEndDate);
    //     }

    //     if (
    //         moment(fieldValueArr[0], 'L', true).isValid() &&
    //         moment(fieldValueArr[1], 'L', true).isValid() &&
    //         momentEndDate.diff(momentStartDate) >= 0
    //     ) {
    //         setIsValid(true);
    //         callback({
    //             startDate: getDataSet(momentStartDate),
    //             endDate: getDataSet(momentEndDate),
    //         });
    //     } else setIsValid(false);
    // };

    let nextProps: any = { ...props };

    const presets = configInitialDate(t, isFutureDate);

    const renderDatePresets = () => {
        return (
            <div className={classes.CustomDateRangePicker_panel}>
                {presets.map(({ text, start, end }) => {
                    const isSelected =
                        isSameDay(start, value ? value?.startDate : startDate) && isSameDay(end, value ? value?.endDate : endDate);
                    return (
                        <button
                            key={text}
                            className={`${classes.CustomDateRangePicker_button} ${
                                isSelected ? classes.CustomDateRangePicker_button__selected : ''
                            }`}
                            data-testid="date-range-picker-button-selected"
                            type="button"
                            onClick={() =>
                                controlButtonClick({
                                    startDate: start,
                                    endDate: end,
                                })
                            }
                        >
                            {text}
                        </button>
                    );
                })}
            </div>
        );
    };

    nextProps = omit(nextProps, [
        'helperText',
        'disableHelperText',
        'value',
        'autoFocus',
        'autoFocusEndDate',
        'initialStartDate',
        'initialEndDate',
        'presets',
        'callback',
        'label',
        'error',
        'isShowCalendarInfo',
        'isValid',
        'variant',
        'textFieldProps',
        'startDatePlaceholderText',
        'endDatePlaceholderText',
        'openDirection',
        'startDateId',
        'endDateId',
        'anchorDirection',
        'verticalSpacing',
        'className',
        'isDayBlocked',
        'handleValid',
        'handleDateRangePopover',
        'required',
    ]);

    const [anchorElPopover, setAnchorElPopover] = useState<null | HTMLDivElement>(null);
    const openPopper = Boolean(anchorElPopover);
    const id = openPopper ? 'datePicker-popper' : undefined;
    const popperRef = useRef(null);
    // const inputRef = useRef(null);
    // const inputRef = useMask({
    //     mask: '__/__/____ - __/__/____',
    //     replacement: { _: /\d/ },
    //     showMask: true,
    //     // modify: (value) => {
    //     //     // setInputValue('11/02/2025 - 25/02/2025');
    //     //     return {
    //     //         mask: '99/__/____ - __/__/____',
    //     //         replacement: { _: /\d/ },
    //     //     };
    //     // },
    //     // track: (data) => {
    //     //     return data.value;
    //     // },
    // });

    const handleClickInput = (event: MouseEvent<HTMLDivElement>) => {
        handleDateRangePopover(event.currentTarget);
        setAnchorElPopover(anchorElPopover ? null : event.currentTarget);
        setFocusedInput(!focusedInput ? START_DATE : focusedInput);
        setTimeout(() => {
            if (popperRef.current) {
                get(popperRef.current, 'update');
            }
        }, 250);
    };

    const handleClosePopover = () => {
        setAnchorElPopover(null);
        handleDateRangePopover(null);
    };

    const handleChanged = (value: any) => {
        // const maskedValue = event.target.value;
        // const unmaskedValue = unformat(maskedValue, { mask: '___-___', replacement: { _: /\d/ } });
        // const parts = formatToParts(maskedValue, { mask: '___-___', replacement: { _: /\d/ } });
        // const pattern = generatePattern('full-inexact', { mask: '___-___', replacement: { _: /\d/ } });
        // const isValid = RegExp(pattern).test(maskedValue);

        setInputValue(value);

        // if (onChange) {
        //     onChange({
        //         maskedValue,
        //         unmaskedValue,
        //         parts,
        //         isValid,
        //     });
        // }
    };

    return (
        <>
            {/* <InputMask
                mask="99/99/9999 - 99/99/9999"
                maskplaceholder={`${getFormatByLanguage(i18n)} - ${getFormatByLanguage(i18n)}`}
                value={inputValue}
                onChange={handleChangeInput}
                disabled={props.disabled}
            >
                {() => (
                    <TextField
                        data-testid="date-range-picker-inputmask"
                        required={required}
                        aria-describedby={id}
                        variant={variant}
                        label={label}
                        error={!isValid || error}
                        helperText={
                            !disableHelperText
                                ? error
                                    ? helperText || t('Common.InvalidData')
                                    : !isValid
                                    ? t('DatePicker.InvalidDateRange')
                                    : ''
                                : ''
                        }
                        {...omit(props.textFieldProps, ['readOnly'])}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <CalendarTodaySharp />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                readOnly: props.textFieldProps?.readOnly,
                            },
                        }}
                        disabled={props.disabled}
                        onClick={(e) => {
                            !props.textFieldProps?.readOnly && handleClickInput(e);
                        }}
                        inputRef={inputRef}
                    />
                )}
            </InputMask> */}
            <InputMask
                onChange={handleChanged}
                inputValue={inputValue}
                required={required}
                id={id}
                variant={variant}
                label={label}
                isValid={isValid}
                error={error}
                disableHelperText={disableHelperText}
                helperText={helperText}
                onClickInput={handleClickInput}
                textFieldProps={props?.textFieldProps}
            />
            {/* <input ref={inputRef} onChange={(handleInputMaskChanged)} value={inputValue} placeholder="99/99/9999 - 99/99/9999" name="dsadd" /> */}
            {/* <InputMask /> */}
            {/* <TextField
                data-testid="date-range-picker-inputmask"
                required={required}
                aria-describedby={id}
                variant={variant}
                label={label}
                error={!isValid || error}
                helperText={
                    !disableHelperText
                        ? error
                            ? helperText || t('Common.InvalidData')
                            : !isValid
                            ? t('DatePicker.InvalidDateRange')
                            : ''
                        : ''
                }
                {...omit(props.textFieldProps, ['readOnly'])}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <CalendarTodaySharp />
                                </IconButton>
                            </InputAdornment>
                        ),
                        readOnly: props.textFieldProps?.readOnly,
                        // component: ,
                    },
                }}
                disabled={props.disabled}
                onClick={(e) => {
                    !props.textFieldProps?.readOnly && handleClickInput(e);
                }}
                // inputRef={inputRef}
                // inputRef={inputRef}
            /> */}
            <Popper
                id={id}
                open={openPopper}
                anchorEl={anchorElPopover}
                style={{ zIndex: 30000 }}
                placement={openDirection === 'up' ? 'top-start' : 'bottom-start'}
                popperRef={popperRef}
                data-testid="date-range-picker-popper"
            >
                <ClickAwayListener onClickAway={handleClosePopover}>
                    <Paper elevation={8} className={classes.CustomPickerSelected}>
                        <DayPickerRangeController
                            {...nextProps}
                            calendarInfoPosition="before"
                            renderCalendarInfo={isShowCalendarInfo ? renderDatePresets : null}
                            onDatesChange={onDatesChange}
                            onFocusChange={onFocusChange}
                            focusedInput={focusedInput}
                            startDate={value ? value?.startDate : startDate}
                            endDate={value ? value?.endDate : endDate}
                            hideKeyboardShortcutsPanel={true}
                            numberOfMonths={numberOfMonths}
                            daySize={32}
                            transitionDuration={0}
                            isDayBlocked={(day: Moment) => {
                                if (value ? value?.startDate : startDate) {
                                    if (isDayBlocked(value ? value?.startDate : startDate)) setIsValid(false);
                                }
                                return isDayBlocked(day);
                            }}
                        />
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    );
};

export default DateRangePickerWrapper;
