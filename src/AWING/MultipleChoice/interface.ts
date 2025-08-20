import { AutocompleteChangeDetails, TextFieldVariants } from '@mui/material';
import { IOption } from './interface';

export interface IMultipleChoiceComponentProps<Value = IOption> {
    label?: string;
    options: IOption[];
    placeholder?: string;
    popupOpen?: boolean;
    variant?: TextFieldVariants;
    error?: boolean;
    helperText?: string;
    operators?: IOption[];
    selected: IOption[];
    onChange: (event: React.SyntheticEvent, value: IOption[], reason: string, details?: AutocompleteChangeDetails<Value>) => void;
    onOpen: (e: React.SyntheticEvent) => void;
    onClose: (e: React.SyntheticEvent, reason: string) => void;
    operator?: string;
    onOperatorChange?: (operator: string) => void;
}

export interface IMultipleChoiceProps
    extends Omit<IMultipleChoiceComponentProps, 'selected' | 'onChange' | 'onOpen' | 'onClose' | 'operator' | 'onOperatorChange'> {
    operators?: IOption[];
    onChange: (values: IOption[]) => void;
    value?: IOption[];
    defaultValue?: IOption[];
    endAdornmentOptions?: 'use-logic-operator' | IOption[];
    endAdornmentValue?: string;
    onEndAdornmentValueChange?: (operator: string) => void;
}

export * from '../interface';
