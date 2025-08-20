import moment, { Moment } from 'moment';
import { dateRangeValid } from 'AWING/ultis';
import { DateRangePicker } from 'AWING/index';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface DateRangeFieldDefinition extends BaseFieldDefinition<[Date, Date]> {
    type: FIELD_TYPE.DATE_RANGE;
    defaultValue?: [Date, Date];
    isDayBlocked?(day: Moment | null): boolean;
    isOutsideRange?(day: Moment): boolean;
}

export const DateRangeInput = (fieldDefinition: DateRangeFieldDefinition) => {
    const {
        label,
        value,
        onChange,
        error,
        disableHelperText,
        helperText,
        isDayBlocked,
        isOutsideRange,
        onValidateCustom,
        defaultValue,
        ...other
    } = fieldDefinition;

    const onValidate = (val?: [Date, Date] | undefined): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(val);
        }
        return dateRangeValid(val);
    };

    return (
        <DateRangePicker
            variant="standard"
            textFieldProps={{
                fullWidth: true,
                style: { margin: '8px 0px' },
                ...other,
            }}
            value={
                value
                    ? {
                          startDate: value[0],
                          endDate: value[1],
                      }
                    : undefined
            }
            onChange={(dateRange) => {
                const newValue = [dateRange.startDate, dateRange.endDate];
                onChange &&
                    onChange(
                        [moment(newValue[0]).toDate(), moment(newValue[1]).toDate()],
                        onValidate([moment(newValue[0]).toDate(), moment(newValue[1]).toDate()])
                    );
            }}
            label={label ? label?.toString() : ''}
        />
    );
};

export default DateRangeInput;
