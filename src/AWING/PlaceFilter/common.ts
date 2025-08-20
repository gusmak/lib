import { isEqual } from 'lodash';
import { EnumFieldInputType } from './Enum';

export const compareTwoArrayObject = (arrObj1: any, arrObj2: any) => {
    const result = (arrObj1 || []).filter((object1: any) => {
        return !(arrObj2 || []).some((object2: any) => {
            return (
                object1.name === object2.name &&
                ((object1.value &&
                    !isEqual(object1.value, []) &&
                    isEqual(object1.value, object2.value) &&
                    object1.endAdornmentValue === object2.endAdornmentValue) ||
                    ((object1.value === '' || isEqual(object1.value, []) || object1.value === undefined || object1.value === null) &&
                        (object2.value === '' || isEqual(object2.value, []) || object2.value === undefined || object2.value === null)))
            );
        });
    });
    return result;
};

export const defaultTagValue = Object.entries(EnumFieldInputType).reduce((obj, [_key, value]) => {
    return {
        ...obj,
        [value]: (() => {
            switch (value) {
                case EnumFieldInputType.TEXT:
                    return '';
                case EnumFieldInputType.GEO_FENCING:
                    return undefined;
                default:
                    return [];
            }
        })(),
    };
}, {}) as Record<`${EnumFieldInputType}`, any>;
