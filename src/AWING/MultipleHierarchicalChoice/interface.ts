import { AutocompleteProps, TextFieldVariants } from '@mui/material';
import { IOption } from '../interface';

export interface IMultipleHierarchicalChoiceInput {
    parentUnitCode: string;
    name: string;
    code: string;
    type?: number;
}

export interface IMultipleHierarchicalChoiceProps {
    label?: string;
    placeholder?: string;
    options: IMultipleHierarchicalChoiceInput[];
    onChange: (value: IMultipleHierarchicalChoiceInput[][]) => void;
    variant?: TextFieldVariants;
    error?: boolean;
    helperText?: string;
    parentTitle?: string;
    value?: IMultipleHierarchicalChoiceInput[][];
    defaultValue?: IMultipleHierarchicalChoiceInput[][];
    minLevel?: number;
    maxSelected?: number;
    endAdornmentOptions?: 'use-logic-operator' | IOption[];
    endAdornmentValue?: string;
    onEndAdornmentValueChange?: (operator: string) => void;
    disabled?: boolean;
}

type Multiple = boolean | undefined;
type DisableClearable = boolean | undefined;
type FreeSolo = boolean | undefined;
type ChipComponent = React.ElementType;
export interface MultipleHierarChicalChoiceComponentProps
    extends Omit<AutocompleteProps<IMultipleHierarchicalChoiceInput, Multiple, DisableClearable, FreeSolo, ChipComponent>, 'renderInput'> {
    label: string;
    currentChoice: IMultipleHierarchicalChoiceInput[];
    placeholder?: string;
    selected: IMultipleHierarchicalChoiceInput[][];
    variant?: TextFieldVariants;
    error?: boolean;
    helperText?: string;
    parentTitle?: string;
    operators?: IOption[];
    operator?: string;
    onOperatorChange?: (operator: string) => void;
}
