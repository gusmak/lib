import { useTranslation } from 'react-i18next';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material';
import { Autocomplete, Checkbox, MenuItem, TextField } from '@mui/material';
import i18next from 'translate/i18n';
import { MenuOption } from 'AWING/interface';
import { arrayIsNotEmptyValid, notNullValid } from 'AWING/ultis';
import { Value } from 'AWING/DirectoryTree';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface AutocompleteFieldDefinition<T> extends BaseFieldDefinition<T> {
    type: FIELD_TYPE.AUTOCOMPLETE;
    options: Array<MenuOption<Value>>;
    loading?: boolean;
    disableClearable?: boolean;
    multiple?: boolean;
    isDirectory?: boolean;
}

export const AutocompleteInput = <T,>(fieldDefinition: AutocompleteFieldDefinition<T>) => {
    const { t } = useTranslation(undefined, { i18n: i18next });
    const {
        options,
        value,
        onChange,
        readOnly,
        error,
        disableHelperText,
        helperText,
        disableClearable,
        multiple = true,
        isDirectory = false,
        onValidateCustom,
        disabled,
        ...other
    } = fieldDefinition;

    const onValidate = (val: T | undefined): boolean => {
        if (!val) return false;
        if (onValidateCustom) {
            return onValidateCustom(val);
        }
        if (Array.isArray(val)) {
            return arrayIsNotEmptyValid(val);
        } else {
            return notNullValid(val);
        }
    };

    return (
        <Autocomplete
            disabled={disabled}
            multiple={multiple}
            options={options}
            getOptionLabel={(option) => String(option.label ?? option.text ?? '')}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            getOptionKey={(option) => String(option.value ?? '')}
            disableClearable={!!disableClearable}
            getOptionDisabled={(option) => Boolean(option?.disabled)}
            onChange={(_e, value) => {
                const newValue = Array.isArray(value) ? value.map((x) => x?.value) : value?.value;
                onChange && onChange(newValue as T, onValidate(newValue as T));
            }}
            value={
                multiple
                    ? options.filter((x) => Array.isArray(value) && value.includes(x.value))
                    : (options.find((x) => x.value === value) ?? null)
            }
            clearOnEscape
            fullWidth
            disableCloseOnSelect={multiple}
            readOnly={readOnly}
            renderInput={(params) => (
                <TextField
                    {...params}
                    {...other}
                    variant="standard"
                    error={error}
                    helperText={!disableHelperText && error ? (helperText ?? t('Common.InvalidData')) : ''}
                />
            )}
            {...(multiple && {
                renderOption: (props, option: MenuOption<Value>, { selected }) => (
                    <li {...props} key={option.value?.toString()}>
                        <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.label ?? option.text}
                    </li>
                ),
            })}
            {...(isDirectory && {
                renderOption: (props, option: MenuOption<Value>) => (
                    <MenuItem
                        {...props}
                        key={option.value?.toString()}
                        value={option?.value as string | number}
                        disabled={option?.disabled}
                        style={{
                            paddingLeft: (option?.level || 0) * 24 + 'px',
                        }}
                    >
                        {option?.label ?? option?.text}
                    </MenuItem>
                ),
            })}
        />
    );
};

export default AutocompleteInput;
