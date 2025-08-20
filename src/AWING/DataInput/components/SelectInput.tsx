import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';
import i18next from 'translate/i18n';
import { MenuOption } from 'AWING/interface';
import { arrayIsNotEmptyValid, notNullValid } from 'AWING/ultis';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface SelectFieldSingle<T> extends Omit<BaseFieldDefinition<T>, 'onChange'> {
    multiple?: false;
    onChange?: (newValue: string | number, valid?: boolean) => void;
}

export interface SelectFieldMultiple<T> extends Omit<BaseFieldDefinition<T[]>, 'onChange'> {
    multiple?: true;
    onChange?: (newValue: (string | number)[], valid?: boolean) => void;
}

export type SelectFieldDefinition<T extends string | number = string | number> = {
    type: FIELD_TYPE.SELECT;
    options: Array<MenuOption<T>>;
    row?: Partial<T>;
    onDisabledSelectItem?: (value: T, row?: Partial<T>) => boolean;
} & (SelectFieldSingle<T> | SelectFieldMultiple<T>);

function SelectInput<T extends string | number>(fieldDefinition: SelectFieldDefinition<T>) {
    const { t } = useTranslation(undefined, { i18n: i18next });
    const {
        name,
        multiple = false,
        value,
        onChange,
        error,
        disableHelperText,
        helperText,
        options = [],
        row,
        onDisabledSelectItem,
        required,
        onValidateCustom,
        ...other
    } = fieldDefinition;

    const onValidate = (val: any): boolean => {
        const newValue = val as any;

        if (onValidateCustom) {
            return onValidateCustom(newValue);
        }
        if (multiple) return arrayIsNotEmptyValid(newValue);
        else {
            return notNullValid(val);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value as any;

        if (multiple) {
            onChange && onChange(newValue, onValidate(newValue));
        } else {
            onChange && onChange(newValue, onValidate(newValue));
        }
    };

    return (
        <TextField
            required={required}
            id={name?.toString()}
            name={name?.toString()}
            fullWidth
            select
            variant="standard"
            value={value ?? []}
            onChange={handleChange}
            error={error}
            helperText={!disableHelperText && error ? (helperText ?? t('Common.InvalidData')) : ''}
            slotProps={{
                select: {
                    multiple: multiple,
                    onChange: (event) => {
                        if (multiple) {
                            const { onChange } = fieldDefinition as SelectFieldDefinition<T> & SelectFieldMultiple<T>;
                            const newValue = event.target.value as (string | number)[];
                            onChange && onChange(newValue, onValidate(newValue));
                        } else {
                            const { onChange } = fieldDefinition as SelectFieldDefinition<T> & SelectFieldSingle<T>;
                            const newValue = event.target.value as string | number;
                            onChange && onChange(newValue, onValidate(newValue));
                        }
                    },
                },
            }}
            {...other}
        >
            {!required && (
                <MenuItem value="">
                    <em>{t('Common.None')}</em>
                </MenuItem>
            )}
            {options.map((item, index) => (
                <MenuItem
                    key={`${name?.toString()}-opt-${index}`}
                    value={item.value}
                    disabled={item.disabled || (onDisabledSelectItem && onDisabledSelectItem(item.value, row))}
                    {...(item.level && {
                        sx: { pl: (item.level || 0) * 2 },
                    })}
                >
                    {item.label ?? item.text}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default SelectInput;
