import { ReactNode, useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import { throttle } from 'lodash';
import {
    TextField,
    Autocomplete,
    CircularProgress,
    Checkbox,
    type TextFieldProps,
    type AutocompleteRenderOptionState,
} from '@mui/material';
import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, CheckBox as CheckBoxIcon } from '@mui/icons-material';
import type { ValueBase, MenuOption } from 'AWING/interface';

export interface AsynchronousAutocompleteProps<T extends ValueBase> {
    multiple?: boolean;
    loading?: boolean;
    options?: MenuOption<T>[];
    readOnly?: boolean;
    onSearch?(inputValue: string): void;
    value?: any;
    onChange?(value: any): void;
    renderOption?: (props: HTMLAttributes<HTMLLIElement>, option: MenuOption<T>, state: AutocompleteRenderOptionState) => ReactNode;
    TextFieldProps?: TextFieldProps;
}

function AsynchronousAutocomplete<T extends ValueBase>(props: AsynchronousAutocompleteProps<T>) {
    const { multiple, loading, options, onSearch, value, onChange, renderOption, readOnly, TextFieldProps } = props;
    const [selectedValue, setSelectedValue] = useState(value ?? (multiple ? [] : null));
    const [inputValue, setInputValue] = useState('');
    const fetch = useMemo(
        () =>
            throttle((input: string) => {
                if (onSearch) {
                    onSearch(input);
                }
            }, 200),
        [onSearch]
    );
    useEffect(() => fetch(inputValue), [inputValue, fetch]);
    let optionsRender = () => {
        let opts = options ?? [];
        if (value) {
            if (multiple) {
                if (!opts.some((x) => (value as MenuOption<T>[]).some((y) => y.value === x.value))) {
                    return [...(value as MenuOption<T>[]), ...opts];
                }
            } else {
                if (!opts.some((x) => x.value === value.value)) {
                    return [value as MenuOption<T>, ...opts];
                }
            }
        }
        return opts;
    };
    useEffect(() => {
        if (value) setSelectedValue(value);
    }, [value]);
    return (
        <Autocomplete
            id="asynchronous-autocomplete"
            multiple={multiple}
            fullWidth
            autoComplete
            includeInputInList
            readOnly={readOnly ?? false}
            value={selectedValue}
            onChange={(_e, newValue) => {
                if (onChange) onChange(newValue);
                setSelectedValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(_e, newInputValue) => setInputValue(newInputValue)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={(option: MenuOption<T>) => {
                return option.text;
            }}
            options={optionsRender()}
            getOptionDisabled={(option: MenuOption<T>) => option.disabled ?? false}
            renderOption={
                renderOption ??
                (multiple
                    ? (props, option, { selected }) => (
                          <li {...props} key={option.value as unknown as string | number}>
                              <Checkbox
                                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                              />
                              {option.label ?? option.text}
                          </li>
                      )
                    : (props, option) => (
                          <li {...props} key={option.value as unknown as string | number}>
                              {option.label ?? option.text}
                          </li>
                      ))
            }
            disableCloseOnSelect={multiple}
            loading={loading}
            disabled={TextFieldProps?.disabled}
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        variant="standard"
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            },
                        }}
                        {...TextFieldProps}
                    />
                );
            }}
        />
    );
}

export default AsynchronousAutocomplete;
