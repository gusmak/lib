import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers';
import { dateValid } from 'AWING/ultis';
import i18next from 'translate/i18n';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface DateTimeFieldDefinition extends BaseFieldDefinition<Date> {
    type: FIELD_TYPE.DATE | FIELD_TYPE.MONTH;
    defaultValue?: Date;
}

export const DateTimeInput = (fieldDefinition: DateTimeFieldDefinition) => {
    const { t } = useTranslation(undefined, { i18n: i18next });
    const {
        label,
        value,
        defaultValue,
        onChange,
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
            defaultValue={defaultValue ? moment(defaultValue) : null}
            label={label}
            value={value ? moment(value) : null}
            onChange={(date) => onChange && onChange(date?.toDate(), onValidate(date?.toDate()))}
            slotProps={{
                textField: {
                    required: required,
                    fullWidth: true,
                    variant: 'standard',
                    error: error,
                    helperText: !disableHelperText && error ? (helperText ?? t('Common.InvalidData')) : '',
                },
            }}
            readOnly={readOnly}
        />
    );
};

export default DateTimeInput;
