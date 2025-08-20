import { useTranslation } from 'react-i18next';
import i18next from 'translate/i18n';
import { notNullValid } from 'AWING/ultis';
import AsyncAutocomplete from 'AWING/AsyncAutocomplete';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface AsyncAutocompleteFieldDefinition<T> extends BaseFieldDefinition<T> {
    type: FIELD_TYPE.ASYNC_AUTOCOMPLETE;
    fetchData(searchString: string): Promise<T[]>;
    getOptionValue(val: T): number | string;
    getOptionLabel(val: T): string;
}

export const AsyncAutocompleteInput = <T,>(fieldDefinition: AsyncAutocompleteFieldDefinition<T>) => {
    const { t } = useTranslation(undefined, { i18n: i18next });
    const {
        fetchData,
        getOptionLabel,
        getOptionValue,
        value,
        onChange,
        readOnly,
        error,
        disableHelperText,
        helperText,
        onValidateCustom,
        ...other
    } = fieldDefinition;

    const onValidate = (val: T | undefined): boolean => {
        if (!val) return false;
        if (onValidateCustom) {
            return onValidateCustom(val);
        }
        if (Array.isArray(val)) {
            return notNullValid(val);
        }
        return true;
    };

    return (
        <AsyncAutocomplete
            fetchData={fetchData}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            value={value}
            onChange={(value: T | undefined) => {
                onChange && onChange(value, onValidate(value));
            }}
            readOnly={readOnly}
            TextFieldProps={{
                variant: 'standard',
                error: error,
                helperText: !disableHelperText && error ? (helperText ?? t('Common.InvalidData')) : '',
                ...other,
            }}
        />
    );
};

export default AsyncAutocompleteInput;
