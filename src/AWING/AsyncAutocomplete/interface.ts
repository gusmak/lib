import { AutocompleteRenderOptionState, TextFieldProps } from '@mui/material';
import { HTMLAttributes, ReactNode } from 'react';

export type AsyncAutocompleteBaseProps<T> = {
    fetchData(searchString: string): Promise<T[]>;
    getOptionValue(val: T): string | number;
    getOptionLabel(val: T): string;
    readOnly?: boolean;
    TextFieldProps?: TextFieldProps;
    renderOption?: (props: HTMLAttributes<HTMLLIElement>, option: T, state: AutocompleteRenderOptionState) => ReactNode;
};

export type SingleSelectionAutocompleteProps<T> = AsyncAutocompleteBaseProps<T> & {
    multiple?: boolean;
    value?: T;
    onChange?(newValue?: T): void;
};

export type MultipleSelectionsAutocompleteProps<T> = AsyncAutocompleteBaseProps<T> & {
    multiple: boolean;
    value?: T[];
    onChange?(newValue?: T[]): void;
};

export type AsyncAutocompleteProps<T> = SingleSelectionAutocompleteProps<T> | MultipleSelectionsAutocompleteProps<T>;
