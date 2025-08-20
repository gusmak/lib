import { BaseTextFieldProps } from '@mui/material';
import { ReactNode } from 'react';
import { AsyncAutocompleteFieldDefinition } from './components/AsyncAutocompleteInput';
import { AutocompleteFieldDefinition } from './components/AutocompleteInput';
import { LogicExpressionDefinition } from './components/LogicExpressionInput';
import { CheckBoxFieldDefinition } from './components/CheckBoxInput';
import { DateTimeFieldDefinition } from './components/DateTimeInput';
import { DateRangeFieldDefinition } from './components/DateRangeInput';
import { NumberFieldDefinition } from './components/NumberInput';
import { RadioFieldDefinition } from './components/RadioInput';
import { SelectFieldDefinition } from './components/SelectInput';
import { TextFieldDefinition } from './components/TextInput';
import { GeoFencingDefinition } from './components/GeoFencingInput';
import { MonacoEditorFieldDefinition } from './components/MonacoEditorInput';
import { SelectFolderFieldDefinition } from './components/SelectFolderInput';
import { MultipleHierarchicalDefinition } from './components/MultipleHierarchicalInput';
import { CustomFieldDefinition } from './components/CustomInput';

export interface BaseFieldDefinition<T> extends Omit<BaseTextFieldProps, 'value'> {
    gridSize?: number;
    defaultValue?: T;
    readOnly?: boolean;
    autoFormula?: string;
    value?: T | undefined;
    disableHelperText?: boolean;
    type?: string;
    label?: string;
    customeFieldChange?(fieldValue: any): Partial<T>;
    onChange?(newValue?: T | undefined, valid?: boolean | undefined): void;
    fieldName: string;
    onValidateCustom?(value?: T): boolean;
}

export interface BaseFieldRender {
    render(): ReactNode;
}

export type FieldDefinitionProps<T extends object = object> =
    | AsyncAutocompleteFieldDefinition<T[keyof T]>
    | AutocompleteFieldDefinition<T[keyof T]>
    | LogicExpressionDefinition
    | CheckBoxFieldDefinition
    | DateTimeFieldDefinition
    | DateRangeFieldDefinition
    | NumberFieldDefinition
    | RadioFieldDefinition
    | SelectFieldDefinition
    | TextFieldDefinition
    | GeoFencingDefinition
    | MonacoEditorFieldDefinition
    | SelectFolderFieldDefinition<T[keyof T]>
    | MultipleHierarchicalDefinition
    | CustomFieldDefinition;
