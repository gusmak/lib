import { Autocomplete, TextField } from '@mui/material';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { IInputProps } from 'AWING/PlaceFilter/interface';
import { FC } from 'react';

export const renderAutocomplete: FC<IInputProps<EnumFieldInputType.AUTO_COMPLETE>> = ({ filterField, index, onChange }) => {
    return (
        <Autocomplete
            size="small"
            fullWidth
            options={filterField?.inputParameter}
            onChange={(_e, newValue) => {
                onChange(newValue?.id || '', index);
            }}
            value={
                filterField?.inputParameter?.find((f) => {
                    return f?.id == filterField?.value;
                }) || null
            }
            getOptionLabel={(option) => option.name}
            // getOptionSelected={(option, value) => option?.id == value?.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={filterField?.label}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                        input: {
                            ...params.InputProps,
                            placeholder: filterField?.placeHolders?.[0] || filterField?.label,
                        },
                    }}
                />
            )}
        />
    );
};
