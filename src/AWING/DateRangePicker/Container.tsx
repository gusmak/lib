import { RefObject, useEffect, useState } from 'react';
import DateRangeField from './DateRangeField';
import { Moment } from 'moment';
import { PickerModal } from './PickerModal';
import type { TextFieldProps } from '@mui/material';
import { DateRange, OptionsDateRangePickerProps } from './types';

export interface DateRangePickerProps {
    label?: string;
    value?: {
        startDate: Date;
        endDate: Date;
    };
    onChange: (dateRange: DateRange) => void;
    textFieldProps?: Pick<TextFieldProps, 'size' | 'fullWidth' | 'classes' | 'className' | 'sx'>;
    options?: OptionsDateRangePickerProps;
    variant?: 'standard' | 'outlined' | 'filled';
}

export default function DateRangePicker(props: DateRangePickerProps) {
    const { value, onChange, label, variant = 'outlined' } = props;
    // state + handlers for the Modal
    const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
    const [valueDateRange, setValueDateRange] = useState<DateRange>(
        value ?? {
            startDate: undefined,
            endDate: undefined,
        }
    );

    useEffect(() => {
        value ?? {
            startDate: undefined,
            endDate: undefined,
        };
    }, [value]);

    const handleClick = (event: RefObject<HTMLInputElement | null>) => {
        setAnchorEl(event.current);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    const handleDateChange = (start: Moment, end: Moment) => {
        setValueDateRange({ startDate: start.toDate(), endDate: end.toDate() });
    };

    const onChangePicker = (dateRange: DateRange) => {
        setValueDateRange(dateRange);
    };

    useEffect(() => {
        if (valueDateRange.startDate && valueDateRange.endDate && onChange) {
            onChange(valueDateRange);
            handleClose();
        }
    }, [valueDateRange]);

    return (
        <div>
            <DateRangeField
                valueDateRangePicker={
                    valueDateRange.startDate && valueDateRange.endDate
                        ? {
                              startDate: valueDateRange.startDate,
                              endDate: valueDateRange.endDate,
                          }
                        : undefined
                }
                textFieldProps={props.textFieldProps}
                value={value}
                label={label}
                onChange={handleDateChange}
                onClickDateRange={handleClick}
                variant={variant}
            />
            <PickerModal
                initialDateRange={valueDateRange}
                onChange={onChangePicker}
                // customProps={{
                //     // onSubmit: (range: DateRange) =>
                //     //     handleSetDateRangeOnSubmit(range),
                //     onCloseCallback: handleClose
                // }}
                minDate={props.options?.minDate}
                maxDate={props.options?.maxDate}
                hideDefaultRanges={props.options?.hideDefaultRanges}
                hideOutsideMonthDays={props.options?.hideOutsideMonthDays}
                modalProps={{
                    open,
                    anchorEl,
                    onClose: handleClose,
                    slotProps: {
                        paper: {
                            sx: {
                                boxShadow: 'rgba(0, 0, 0, 0.21) 0px 0px 4px',
                            },
                        },
                    },
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                }}
            />
        </div>
    );
}
