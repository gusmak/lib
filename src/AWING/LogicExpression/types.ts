type PrimitiveType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'function' | 'object' | 'any';

type ArrayType<T extends PrimitiveType> = `array(${T})`;
type EnumType<T extends string> = `enum[${T}]`;
type ArrayConditionType = `condition(${number})`; // điều kiện cho phần tử thứ {number} của function
type NullableType<T extends PrimitiveType | ArrayConditionType> = `${T}?`;

export type AcceptedType = PrimitiveType | NullableType<PrimitiveType> | ArrayType<PrimitiveType> | EnumType<string>;

export type ObjectStructure = {
    [key: string]: ObjectStructure | AcceptedType | Array<ObjectStructure>;
};

export type FunctionStructure = {
    name: string;
    returnType: AcceptedType;
    parameters: (AcceptedType | ArrayConditionType | NullableType<ArrayConditionType>)[];
};
