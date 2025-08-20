import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import i18next from 'translate/i18n';
import { dateValid } from 'AWING/ultis';
import { DateTimeFieldDefinition } from './DateTimeInput';

export const MonthTimeInput = (fieldDefinition: DateTimeFieldDefinition) => {
    const { t } = useTranslation(undefined, { i18n: i18next });
    const {
        label,
        value,
        onChange,
        disabled,
        readOnly,
        error,
        disableHelperText,
        helperText,
        required,
        onValidateCustom,
    } = fieldDefinition;

    const onValidate = (val: Date | undefined): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(val);
        }
        return dateValid(val);
    };

    return (
        <DatePicker
            views={['month', 'year']}
            label={label}
            value={moment(value, 'MM-YYYY')}
            disabled={disabled}
            onChange={(date) => onChange && onChange(date?.toDate(), onValidate(date?.toDate()))}
            readOnly={readOnly}
            slotProps={{
                textField: {
                    required: required,
                    fullWidth: true,
                    variant: 'standard',
                    error: error,
                    helperText: !disableHelperText && error ? (helperText ?? t('Common.InvalidData')) : '',
                },
            }}
        />
    );
};

export default MonthTimeInput;
