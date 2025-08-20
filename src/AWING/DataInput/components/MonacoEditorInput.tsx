import MonacoEditor, { IMonacoEditorProps } from 'AWING/MonacoEditor';
import { notNullValid } from 'AWING/ultis';
import { type BaseFieldDefinition } from '../interfaces';
import { FIELD_TYPE } from '../enums';

export interface MonacoEditorFieldDefinition extends BaseFieldDefinition<string>, Omit<IMonacoEditorProps, 'onChange'> {
    type: FIELD_TYPE.MONACO_EDITOR;
}

export const MonacoEditorInput = (fieldDefinition: MonacoEditorFieldDefinition) => {
    const { onChange, onValidateCustom, ...other } = fieldDefinition;

    const onValidate = (val: string | undefined): boolean => {
        if (onValidateCustom) {
            return onValidateCustom(val);
        }
        return notNullValid(val);
    };

    return (
        <div
            style={{
                border: '1px solid #e4e4e4',
                padding: '10px 0',
                borderRadius: '4px',
                marginTop: '16px',
            }}
        >
            <MonacoEditor
                onChange={(newValue) => onChange && onChange(newValue ?? '', onValidate(newValue))}
                {...other}
            />
        </div>
    );
};

export default MonacoEditorInput;
