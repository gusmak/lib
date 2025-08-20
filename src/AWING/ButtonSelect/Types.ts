import { ButtonProps } from '@mui/material/Button';
import { MenuOption } from '../interface';
import { type ValueBase } from 'AWING/interface';

export interface ButtonSelectProps<Value extends ValueBase> extends ButtonProps {
    options: MenuOption<Value>[];
    elementId?: string;
    value?: Value;
    onChangeSelected?: (value: Value) => void;
}
