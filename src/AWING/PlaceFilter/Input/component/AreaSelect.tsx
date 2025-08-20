import { FC } from 'react';
import AreaSelectField from '../AreaSelectField';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { IInputProps } from 'AWING/PlaceFilter/interface';

export const renderAreaSelect: FC<IInputProps<EnumFieldInputType.SELECT_AREA>> = ({ filterField, index, onChange }) => {
    return (
        <AreaSelectField
            initValue={filterField.value || []}
            onChange={(value) => {
                onChange(value, index);
            }}
            inputParameter={filterField.inputParameter}
            placeholders={filterField.placeHolders}
            label={filterField.label}
            value={filterField.value || []}
        />
    );
};
