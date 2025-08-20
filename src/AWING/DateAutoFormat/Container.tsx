import { useState } from 'react';
import moment, { Moment } from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { shortFormat, longFormat } from './Constants';
import type { DateAutoFormatProps } from './Types';
import { Dayjs } from 'dayjs';

export function DateAutoFormat(props: DateAutoFormatProps) {
    const { fieldDef, fieldValue, onChange, error } = props;
    const fieldDefClone = fieldDef;
    /* State */
    const [isFocus, setIsFocus] = useState(false);

    const handleChange = (date: Moment | Dayjs | null) => {
        onChange && onChange(date?.toDate());
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                key={fieldDefClone.fieldName}
                value={fieldValue ? moment(fieldValue) : null}
                onChange={handleChange}
                reduceAnimations={true}
                format={isFocus ? shortFormat : longFormat}
                slotProps={{
                    textField: {
                        id: fieldDef.fieldName,
                        fullWidth: true,
                        required: fieldDef?.required,
                        error: error,
                        helperText: error ? fieldDef?.helperText : '',
                        style: fieldDef?.style || { margin: '8px 0px' },
                        variant: 'standard',
                        label: fieldDef?.label,
                        onBlur: () => {
                            setIsFocus(false);
                        },
                        onFocus: () => {
                            setIsFocus(true);
                            setTimeout(() => {
                                document.getElementById(fieldDef.fieldName)?.focus();
                            }, 100);
                        },
                    },
                }}
                disabled={fieldDef?.disabled}
            />
        </LocalizationProvider>
    );
}

export default DateAutoFormat;
