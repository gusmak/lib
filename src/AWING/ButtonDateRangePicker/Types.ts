import { ButtonProps, TextFieldProps } from '@mui/material';
import { OptionsDateRangePickerProps } from 'AWING/DateRangePicker';
import { Moment } from 'moment';

export interface ButtonDateRangePickerProps extends ButtonProps {
    dateValue: [Moment | null, Moment | null];
    onChangeDate?: (value: ButtonDateRangePickerProps['dateValue']) => void;
    isOutsideRange?: (date: Moment) => boolean;
    isDayBlocked?: (day: Moment | null) => boolean;
    isShowCalendarInfo?: boolean;
    textFieldProps?: Pick<TextFieldProps, 'size' | 'fullWidth' | 'classes' | 'className'>;
    options?: OptionsDateRangePickerProps;
}
