import { MomentInput, Moment } from 'moment';
import { TextFieldProps } from '@mui/material';

export interface DateRangePickerOldProps {
    required?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    autoFocusEndDate?: boolean;
    initialStartDate?: Moment | null;
    initialEndDate?: Moment | null;
    callback: (newValue: { startDate: MomentInput; endDate: MomentInput }) => void;
    label?: string;
    isShowCalendarInfo?: boolean;
    isFutureDate?: boolean;
    variant?: TextFieldProps['variant'];
    className?: any;
    value?: { startDate: Moment; endDate: Moment };
    error?: boolean;
    helperText?: string;
    disableHelperText?: boolean;
    textFieldProps?: any;
    openDirection?: 'up' | 'down';
    numberOfMonths?: number;
    isDayBlocked?: (day: Moment | null) => boolean;
    isOutsideRange?: (day: Moment) => boolean;
    handleValid?: (valid: boolean) => void;
    handleDateRangePopover?: (currentTarget: any) => void;
}
