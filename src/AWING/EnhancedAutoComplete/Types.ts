import { CSSProperties } from 'react';
import type { ValueBase, MenuOption } from 'AWING/interface';
import { BaseTextFieldProps } from '@mui/material';

export interface EnhancedAutoCompleteProps<Value extends ValueBase, Option extends MenuOption<Value>> {
    value?: Option;
    field: BaseTextFieldProps & {
        label?: string;
        text?: string;
        options?: Option[];
        loading?: boolean;
    };
    onChangeValue(val: Option): void;
    labelStyle?: CSSProperties;
    popperStyle?: CSSProperties;
}
