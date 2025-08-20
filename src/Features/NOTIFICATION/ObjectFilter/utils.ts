import { EnumTypeConvert } from 'Features/types';
import { ObjectFilter } from './types';

interface ObjectFilterInput {
    [key: string]: string | number | undefined;
}

export const checkValid = (currentObjectFilterInput: ObjectFilter) => {
    return Object.values(currentObjectFilterInput).every((value) => value !== undefined && `${value}`.trim() !== '');
};

export const getDifferentFieldsValue = (
    oldObjectFilter: ObjectFilter,
    newObjectFilter: ObjectFilterInput,
    objectTyeCodes: EnumTypeConvert[],
    objectConfigTypes: EnumTypeConvert[]
) => {
    const differentField: ObjectFilterInput = {};

    Object.entries(newObjectFilter).forEach(([key, value]) => {
        if (oldObjectFilter[key as keyof typeof oldObjectFilter] !== value) {
            /** dạng enum thì lưu key */
            if (key === 'objectTypeCode') {
                const ob = objectTyeCodes.find((i) => i.value === value);
                differentField[key as keyof typeof newObjectFilter] = ob?.value;
            } else if (key === 'configType') {
                const ob = objectConfigTypes.find((i) => i.value === value);
                differentField[key as keyof typeof newObjectFilter] = ob?.value;
            } else differentField[key as keyof typeof newObjectFilter] = value;
        }
    });

    return differentField;
};
