import MultipleHierarchicalChoice from 'AWING/MultipleHierarchicalChoice';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { IInputProps } from 'AWING/PlaceFilter/interface';
import { FC } from 'react';

export const renderMultipleHierarchicalChoice: FC<IInputProps<EnumFieldInputType.MULTIPLE_HIERARCHICAL_CHOICE>> = ({
    filterField,
    index,
    onChange,
}) => {
    return (
        <MultipleHierarchicalChoice
            onChange={(value) => {
                onChange(value, index);
            }}
            onEndAdornmentValueChange={(newOperator: string) => {
                onChange(newOperator, index, true);
            }}
            options={filterField?.inputParameter}
            placeholder={filterField.placeHolders?.[0] || ''}
            label={filterField.label}
            parentTitle={filterField?.parentTitle}
            defaultValue={filterField.value || []}
            value={filterField.value || []}
            minLevel={filterField?.minLevel}
            endAdornmentOptions={filterField?.endAdornmentOptions}
            endAdornmentValue={filterField?.endAdornmentValue}
        />
    );
};
