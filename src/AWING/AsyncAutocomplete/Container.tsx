import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { AsyncAutocompleteProps } from './interface';

export default function AsyncAutocomplete<T>(props: AsyncAutocompleteProps<T>) {
    const { multiple, value = null, onChange, fetchData, getOptionValue, getOptionLabel, readOnly, TextFieldProps, renderOption } = props;

    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetch = useMemo(
        () =>
            debounce((input: string, callback: (results?: T[]) => void) => {
                setLoading(true);
                fetchData(input)
                    .then((response) => {
                        callback(response);
                    })
                    .finally(() => setLoading(false));
            }, 200),
        [fetchData]
    );

    useEffect(() => {
        let active = true;

        fetch(inputValue, (results?: T[]) => {
            if (active) {
                let newOptions: T[] = [];

                if (value) {
                    newOptions = Array.isArray(value) ? value : [value];
                }

                if (results) {
                    let vals = newOptions.map((x) => getOptionValue(x));
                    newOptions = [...newOptions, ...results.filter((x) => !vals.includes(getOptionValue(x)))];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [
        Array.isArray(value) ? value.map((x) => getOptionValue(x).toString()).join('.') : value ? getOptionValue(value) : undefined,
        inputValue,
        fetch,
    ]);

    return multiple ? (
        <Autocomplete
            multiple
            getOptionLabel={getOptionLabel}
            options={options}
            isOptionEqualToValue={(option, value) => getOptionValue(option) === getOptionValue(value)}
            autoComplete
            includeInputInList
            filterSelectedOptions
            readOnly={readOnly ?? false}
            value={(value as T[]) ?? []}
            onChange={(_event, newValue) => {
                setOptions(newValue ? [...newValue, ...options] : options);
                if (onChange) onChange(newValue as unknown as (T & T[]) | undefined);
            }}
            onInputChange={(_event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    // ts-ignore
                    {...params}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps?.endAdornment}
                                </Fragment>
                            ),
                        },
                    }}
                    {...TextFieldProps}
                />
            )}
            renderOption={
                renderOption ??
                ((props, option, { selected }) => (
                    <li {...props} key={getOptionValue(option)}>
                        <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {getOptionLabel(option)}
                    </li>
                ))
            }
        />
    ) : (
        <Autocomplete
            getOptionLabel={getOptionLabel}
            options={options}
            isOptionEqualToValue={(option, value) => getOptionValue(option) === getOptionValue(value)}
            autoComplete
            includeInputInList
            filterSelectedOptions
            readOnly={readOnly ?? false}
            value={value as T | null}
            onChange={(_event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                if (onChange) onChange((newValue as unknown as T & T[]) ?? undefined);
            }}
            onInputChange={(_event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps?.endAdornment}
                                </Fragment>
                            ),
                        },
                    }}
                    {...TextFieldProps}
                />
            )}
            renderOption={renderOption}
        />
    );
}
