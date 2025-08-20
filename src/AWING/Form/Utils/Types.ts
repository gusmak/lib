export type FieldValues = Record<string, any>;
export type FieldOptions = {
    required: boolean;
    onValidate: (value: any) => boolean;
};
