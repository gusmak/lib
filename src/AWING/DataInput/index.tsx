import { AsyncAutocompleteInput } from './components/AsyncAutocompleteInput';
import { AutocompleteInput } from './components/AutocompleteInput';
import { CheckBoxInput } from './components/CheckBoxInput';
import { DateRangeInput } from './components/DateRangeInput';
import { DateTimeInput } from './components/DateTimeInput';
import { GeoFencingInput } from './components/GeoFencingInput';
import { LogicExpressionInput } from './components/LogicExpressionInput';
import { MonacoEditorInput } from './components/MonacoEditorInput';
import { MonthTimeInput } from './components/MonthTimeInput';
import { MultipleHierarchicalInput } from './components/MultipleHierarchicalInput';
import { NumberInput } from './components/NumberInput';
import { RadioInput } from './components/RadioInput';
import { SelectFolderInput } from './components/SelectFolderInput';
import SelectInput from './components/SelectInput';
import { TextInput } from './components/TextInput';
import { CustomInput } from './components/CustomInput';
import { type FieldDefinitionProps } from './interfaces';
import { FIELD_TYPE } from './enums';

export default function InputFactory<T extends object>(fieldDefinition: FieldDefinitionProps<T>) {
    const { type } = fieldDefinition;

    switch (type) {
        case FIELD_TYPE.LOGIC_EXPRESSION: {
            return LogicExpressionInput(fieldDefinition);
        }
        case FIELD_TYPE.ASYNC_AUTOCOMPLETE: {
            return AsyncAutocompleteInput(fieldDefinition);
        }
        case FIELD_TYPE.AUTOCOMPLETE: {
            return AutocompleteInput(fieldDefinition);
        }
        case FIELD_TYPE.CHECKBOX: {
            return CheckBoxInput(fieldDefinition);
        }
        case FIELD_TYPE.MONTH: {
            return MonthTimeInput(fieldDefinition);
        }
        case FIELD_TYPE.DATE: {
            return DateTimeInput(fieldDefinition);
        }
        case FIELD_TYPE.DATE_RANGE: {
            return DateRangeInput(fieldDefinition);
        }
        case FIELD_TYPE.NUMBER: {
            return NumberInput(fieldDefinition);
        }
        case FIELD_TYPE.RADIO: {
            return RadioInput(fieldDefinition);
        }
        case FIELD_TYPE.TEXT: {
            return TextInput(fieldDefinition);
        }
        case FIELD_TYPE.EMAIL:
        case FIELD_TYPE.TEL:
        case FIELD_TYPE.URL:
        case FIELD_TYPE.PASSWORD:
        case FIELD_TYPE.TEXT_AREA: {
            return TextInput(fieldDefinition);
        }
        case FIELD_TYPE.SELECT: {
            return SelectInput(fieldDefinition);
        }
        case FIELD_TYPE.MULTIPLE_HIERARCHICAL: {
            return MultipleHierarchicalInput(fieldDefinition);
        }
        case FIELD_TYPE.GEO_FENCING: {
            return GeoFencingInput(fieldDefinition);
        }
        case FIELD_TYPE.SELECT_FOLDER: {
            return SelectFolderInput(fieldDefinition);
        }
        case FIELD_TYPE.MONACO_EDITOR: {
            return MonacoEditorInput(fieldDefinition);
        }
        case FIELD_TYPE.CUSTOM: {
            return CustomInput(fieldDefinition);
        }
        default:
            throw new Error('Invalid component type');
    }
}

export * from './interfaces';
export * from './enums';
