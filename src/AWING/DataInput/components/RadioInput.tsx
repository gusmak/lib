import { ReactNode } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { MenuOption } from 'AWING/interface';
import { notNullValid } from 'AWING/ultis';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface RadioFieldDefinition extends BaseFieldDefinition<string> {
    options: Array<MenuOption<string>>;
    type: FIELD_TYPE.RADIO;
}

export function RadioInput(fieldDefinition: RadioFieldDefinition): ReactNode {
    const { name, value, onChange, options, required, label, onValidateCustom } = fieldDefinition;

    const onValidate = (value: string): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(value);
        }
        return notNullValid(value);
    };

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend" required={required}>
                {label}
            </FormLabel>
            <RadioGroup
                aria-label={name?.toString()}
                name={name?.toString()}
                value={value}
                onChange={(_event, value) => {
                    onChange && onChange(value, onValidate(value));
                }}
            >
                {options.map((item, index) => (
                    <FormControlLabel
                        key={`${name?.toString()}-opt-${index}`}
                        value={item.value}
                        control={<Radio />}
                        label={item.label ?? item.text}
                        disabled={item.disabled}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}

export default RadioInput;
