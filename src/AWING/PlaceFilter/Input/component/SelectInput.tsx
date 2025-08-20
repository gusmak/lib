import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { IInputProps } from 'AWING/PlaceFilter/interface';
import { FC } from 'react';

export const renderSelectInput: FC<IInputProps<EnumFieldInputType.SELECT>> = ({ filterField, index, onChange }) => {
    return (
        <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>{filterField.label}</InputLabel>
            <Select
                onChange={(e) => {
                    onChange(e.target.value, index);
                }}
                value={filterField.value || ''}
                label={filterField.label}
                fullWidth
            >
                {filterField?.inputParameter.length > 0 &&
                    filterField?.inputParameter?.map((filterFieldItem, idx: number) => {
                        return (
                            <MenuItem key={idx} value={filterFieldItem.id}>
                                {filterFieldItem.name}
                            </MenuItem>
                        );
                    })}
            </Select>
        </FormControl>
    );
};
