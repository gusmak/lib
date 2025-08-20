import { useTranslation } from 'react-i18next';
import i18next from 'translate/i18n';
import NumberFormat from 'AWING/NumberFormat';
import { numberNotNullValid } from 'AWING/ultis';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface NumberFieldDefinition extends BaseFieldDefinition<number> {
    type: FIELD_TYPE.NUMBER;
    defaultValue?: number;
    autoFormula?: string;
    min?: number;
    max?: number;
}

export const NumberInput = (fieldDefinition: NumberFieldDefinition) => {
    const { t } = useTranslation(undefined, { i18n: i18next });
    const { name, value, onChange, error, disableHelperText, helperText, min, max, onValidateCustom, ...other } =
        fieldDefinition;

    const onValidate = (val: number | string | undefined): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(Number(val));
        }
        return (
            (min === undefined || Number(val) >= min) &&
            (max === undefined || Number(val) <= max) &&
            numberNotNullValid(Number(val))
        );
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value ? Number(event.target.value) : undefined;
        onChange && onChange(newValue, onValidate(newValue));
    };

    return (
        <NumberFormat
            id={name?.toString()}
            name={name?.toString()}
            fullWidth
            variant="standard"
            value={value ?? ''}
            onChange={handleChange}
            error={error}
            helperText={!disableHelperText && error ? (helperText ?? t('Common.InvalidData')) : ''}
            {...other}
        />
    );
};

export default NumberInput;
