import { ReactNode } from 'react';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface CustomFieldDefinition extends Omit<BaseFieldDefinition<string>, 'component'> {
    type: FIELD_TYPE.CUSTOM;
    component?: ReactNode;
}

export const CustomInput = (fieldDefinition: CustomFieldDefinition) => {
    const { component } = fieldDefinition;

    return <>{component ?? null}</>;
};

export default CustomInput;
