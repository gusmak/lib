import { CSSProperties, ReactElement } from 'react';
import type { ValueBase, MenuOption } from 'AWING/interface';
import { BaseTextFieldProps } from '@mui/material/TextField';
import { Moment } from 'moment';

export interface AdvancedSearchFieldDefinition<
    AdvancedSearchFieldName extends string,
    OptionValue extends ValueBase,
    Option extends MenuOption<OptionValue>,
> extends BaseTextFieldProps {
    fieldName: AdvancedSearchFieldName;
    icon?: ReactElement;
    label?: string;
    type: 'select' | 'date-range' | 'autocomplete' | 'directory' | 'text';
    isShowCalendarInfo?: boolean;
    options?: Option[];
    loading?: boolean;
    width?: number;
    rootId?: string | number;
    isOutsideRange?: (day: Moment) => boolean;
    isDayBlocked?: (day: Moment | null) => boolean;
}

export type DateRangeValue = [Moment | null, Moment | null];

export type OptionBase = { text: string; value: ValueBase };

export type AdvancedSearchFieldType = 'select' | 'date-range' | 'autocomplete' | 'directory' | 'text';

export type ASTextField = Omit<BaseTextFieldProps, 'onChange'>;

export type ASDateRangeField = {
    type: 'date-range';
    isShowCalendarInfo?: boolean;
    isOutsideRange?: (day: Moment) => boolean;
    isDayBlocked?: (day: Moment | null) => boolean;
    value?: [string | Date | null, string | Date | null];
    dateLabel?: string;
};

export type ASSelectField = {
    type: 'select';
    options: OptionBase[];
    value?: ValueBase;
};

export type ASAutocompleteField = {
    type: 'autocomplete';
    options?: MenuOption<ValueBase>[];
    value?: MenuOption<ValueBase>;
};

export type ASDirectoryField = {
    type: 'directory';
    rootId?: number | string;
    value?: ValueBase;
    options?: MenuOption<ValueBase>[];
};

export type FieldDefinitions = ASTextField | ASDateRangeField | ASSelectField | ASAutocompleteField | ASDirectoryField;

/* Danh sách fields  */
export type BaseField<FieldName> = {
    fieldName: FieldName;
    type: AdvancedSearchFieldType;
    label?: string;
    icon?: ReactElement;
    style?: CSSProperties;
};
export type AdvancedSearchField<FieldName = string> = BaseField<FieldName> & FieldDefinitions;

/* Value base with type */
export type Value<FieldName extends string, FieldValue extends FieldDefinitions['value']> = {
    fieldName: FieldName;
    value: FieldValue;
    label?: string;
};

/* Own Props */
export type AdvancedSearchProps<FieldName extends string = string> = {
    expanded: boolean;
    fields: AdvancedSearchField<FieldName>[];
    defaultValue?: Record<FieldName, { value: unknown; label?: string }>;
    value?: Record<FieldName, { value: unknown; label?: string }>;
    onChangeValue?: (newValue?: Record<FieldName, { value: unknown; label?: string }>) => void;
    onClear?: () => void;
    rootStyle?: React.CSSProperties;
};
