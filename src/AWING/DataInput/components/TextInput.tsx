import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import i18next from 'translate/i18n';
import { emailValid, notNullValid, numberOnlyValid, passwordValid, textValidation, urlValid } from 'AWING/ultis';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface TextFieldDefinition extends BaseFieldDefinition<string> {
    // type: 'text' | 'email' | 'tel' | 'text-area' | 'url' | 'password';
    type:
        | FIELD_TYPE.TEXT
        | FIELD_TYPE.EMAIL
        | FIELD_TYPE.TEL
        | FIELD_TYPE.TEXT_AREA
        | FIELD_TYPE.URL
        | FIELD_TYPE.PASSWORD;
    /**
     * Độ dài byte, Mặc định là 50, đơn vị tính: 5*10^n (n >= 1)
     *
     * VD: 'Giáp' là 5 byte
     */
    length?: number;
    /**
     * Định dạng regex cho hàm textValid
     */
    pattern?: RegExp | false;
    /**
     *
     * @param value
     * @param length - Độ dài byte, only type text và text-area
     * @param pattern - Định dạng regex, only type text và text-area
     */
    onValidate?(value?: string, length?: number, pattern?: RegExp | false): boolean;
    defaultValue?: string;
    autoFormula?: string; // ví dụ: {field1} + {field2}
}

export const TextInput = (fieldDefinition: TextFieldDefinition) => {
    const { t } = useTranslation(undefined, { i18n: i18next });
    const {
        name,
        value,
        onChange,
        error,
        disableHelperText,
        helperText,
        type,
        length,
        pattern,
        onValidateCustom,
        ...other
    } = fieldDefinition;

    const [errorText, setErrorText] = useState(t('Common.InvalidData'));

    const onValidate = (val: string | undefined): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(val ?? '');
        }
        if (type === FIELD_TYPE.EMAIL) {
            return emailValid(val ?? '');
        } else if (type === FIELD_TYPE.TEL) {
            return numberOnlyValid(val);
        } else if (type === FIELD_TYPE.URL) {
            return urlValid(val);
        } else if (type === FIELD_TYPE.PASSWORD) {
            return passwordValid(val);
        } else if (type === FIELD_TYPE.TEXT || type === FIELD_TYPE.TEXT_AREA) {
            const { valid, message } = textValidation(val ?? '', length, Boolean(fieldDefinition.required), pattern);
            setErrorText(message);
            return valid;
        } else {
            return notNullValid(val);
        }
    };

    return (
        <TextField
            id={name?.toString()}
            name={name?.toString()}
            type={'text'}
            fullWidth
            variant="standard"
            multiline={type === FIELD_TYPE.TEXT_AREA}
            error={error}
            helperText={!disableHelperText && (error ? (helperText ?? errorText) : helperText)}
            value={value ?? ''}
            onChange={(event) => onChange && onChange(event.target.value, onValidate(event.target.value))}
            {...other}
        />
    );
};

export default TextInput;
