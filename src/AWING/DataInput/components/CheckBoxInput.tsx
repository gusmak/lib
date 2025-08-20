import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { notNullValid } from 'AWING/ultis';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface CheckBoxFieldDefinition extends BaseFieldDefinition<boolean> {
    type: FIELD_TYPE.CHECKBOX;
    onValidate?(value?: boolean): boolean;
    defaultValue?: boolean;
}

export const CheckBoxInput = (fieldDefinition: CheckBoxFieldDefinition) => {
    const { name, value, onChange, readOnly, disabled, label, onValidateCustom } = fieldDefinition;

    const onValidate = (val: boolean): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(val);
        }
        return notNullValid(value);
    };

    // Đảm bảo giá trị checked luôn là boolean, nếu value là undefined hoặc null thì sẽ trả về false
    const isChecked = Boolean(value);

    return (
        <FormControl fullWidth>
            <FormControlLabel
                control={
                    <Checkbox
                        disabled={disabled ?? false}
                        id={name?.toString()}
                        name={name?.toString()}
                        checked={isChecked}
                        onChange={(event) =>
                            onChange && onChange(event.target.checked, onValidate(event.target.checked))
                        }
                        color="primary"
                        readOnly={readOnly}
                    />
                }
                label={label}
            />
        </FormControl>
    );
};

export default CheckBoxInput;
