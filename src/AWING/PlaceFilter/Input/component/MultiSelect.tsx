import MultipleChoice from 'AWING/MultipleChoice';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { IInputProps } from 'AWING/PlaceFilter/interface';
import { FC } from 'react';

export const renderMultiSelect: FC<IInputProps<EnumFieldInputType.MULTIPLE_SELECT>> = ({ filterField, index, onChange }) => {
    return (
        <MultipleChoice
            label={filterField.label}
            placeholder={filterField.placeHolders?.[0] || ''}
            options={filterField.inputParameter}
            onChange={(value) => {
                onChange(value, index);
            }}
            onEndAdornmentValueChange={(newOperator: string) => {
                onChange(newOperator, index, true);
            }}
            value={filterField.value}
            endAdornmentOptions={filterField?.endAdornmentOptions}
            endAdornmentValue={filterField?.endAdornmentValue}
        />
    );
};
