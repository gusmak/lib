import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { createElement as _c, FC } from 'react';
import { renderAreaSelect } from './AreaSelect';
import { renderAutocomplete } from './AutocompleteInput';
import { renderGeoFencing } from './GeoFencing';
import { renderMultipleHierarchicalChoice } from './MultipleHierarchicalChoiceInput';
import { renderMultiSelect } from './MultiSelect';
import { renderSelectInput } from './SelectInput';
import { renderTextInput } from './TextInput';

import { IInputProps } from 'AWING/PlaceFilter/interface';

const inputFields: { [K in EnumFieldInputType]: FC<IInputProps<K>> } = {
    [EnumFieldInputType.TEXT]: renderTextInput,
    [EnumFieldInputType.SELECT]: renderSelectInput,
    [EnumFieldInputType.SELECT_AREA]: renderAreaSelect,
    [EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE]: renderMultipleHierarchicalChoice,
    [EnumFieldInputType.GEO_FENCING]: renderGeoFencing,
    [EnumFieldInputType.AUTO_COMPLETE]: renderAutocomplete,
    [EnumFieldInputType.MULTIPLE_SELECT]: renderMultiSelect,
};
const inputFactory = <T extends EnumFieldInputType>(props: IInputProps<T>) => _c(inputFields[props.filterField.type], props);
export default inputFactory;
