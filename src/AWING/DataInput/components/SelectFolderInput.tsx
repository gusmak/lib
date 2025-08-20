import { useTranslation } from 'react-i18next';
import i18next from 'translate/i18n';
import { MenuItem, TextField } from '@mui/material';
import type { MenuOption, ValueBase } from 'AWING/interface';
import { notNullValid } from 'AWING/ultis';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface SelectFolderFieldDefinition<T> extends BaseFieldDefinition<T> {
    type: FIELD_TYPE.SELECT_FOLDER;
    options?: Array<MenuOption<ValueBase>>;
}
export const SelectFolderInput = <T,>(fieldDefinition: SelectFolderFieldDefinition<T>) => {
    const { t } = useTranslation(undefined, { i18n: i18next });
    const {
        name,
        value,
        onChange,
        error,
        disableHelperText,
        helperText,
        options,
        required,
        onValidateCustom,
        ...other
    } = fieldDefinition;

    const onValidate = (val: T): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(val);
        }
        return notNullValid(val);
    };

    return (
        <TextField
            key={name}
            id={name}
            name={name}
            fullWidth
            select
            variant="standard"
            {...other}
            value={value ?? ''}
            onChange={(event) => onChange && onChange(event.target.value as T, onValidate(event.target.value as T))}
            error={error}
            helperText={error ? (helperText ?? t('Common.InvalidData')) : ''}
        >
            {!required && (
                <MenuItem value="">
                    <em>{t('Common.None')}</em>
                </MenuItem>
            )}
            {options &&
                options.map((item, index) => (
                    <MenuItem
                        key={`${name}-opt-${index}`}
                        value={item?.value as string | number}
                        disabled={item?.disabled}
                        style={{
                            paddingLeft: (item?.level || 0) * 24 + 'px',
                        }}
                    >
                        {item?.label ?? item?.text}
                    </MenuItem>
                ))}
        </TextField>
    );
};

export default SelectFolderInput;
