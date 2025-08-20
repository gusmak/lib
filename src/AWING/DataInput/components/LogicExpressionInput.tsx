import { FunctionStructure, ObjectStructure } from 'AWING/LogicExpression/types';
import { LogicExpression } from 'AWING/index';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface LogicExpressionDefinition extends BaseFieldDefinition<string> {
    type: FIELD_TYPE.LOGIC_EXPRESSION;
    defaultValue?: string;
    objectStructures: ObjectStructure[];
    functionStructures: FunctionStructure[];
}

export const LogicExpressionInput = (fieldDefinition: LogicExpressionDefinition) => {
    const { value, onChange, objectStructures, functionStructures, ...other } = fieldDefinition;

    return (
        <LogicExpression
            onChange={(newValue: string | undefined, valid: boolean) => onChange && onChange(newValue ?? '', valid)}
            value={value ?? ''}
            objectStructures={objectStructures}
            functionStructures={functionStructures}
            variant="standard"
            {...other}
        />
    );
};

export default LogicExpressionInput;
