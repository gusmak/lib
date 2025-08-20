import Editor from '@monaco-editor/react';
import { formatJSON } from 'Helpers';
import { useState } from 'react';
import { IMonacoEditorProps } from './interface';

const MonacoEditorContainer = (props: IMonacoEditorProps) => {
    const { value, height, language, onChange, isShowMinimap, disableFormatJSON = false, ...options } = props;

    const [valueGetter, setValueGetter] = useState(() => {
        if (disableFormatJSON) {
            return value;
        } else {
            return formatJSON(value ?? '');
        }
    });
    const handleEditorChange = (value?: string) => {
        const newValue = value ?? '';
        setValueGetter(newValue);
        if (onChange) {
            onChange(newValue, undefined);
        }
    };

    return (
        <>
            <Editor
                height={height ? height : '20vh'}
                language={language ? language : 'html'}
                value={valueGetter}
                onChange={handleEditorChange}
                options={{
                    minimap: {
                        enabled: isShowMinimap ? isShowMinimap : false,
                    },
                    wordWrap: 'on',
                    overviewRulerBorder: false,
                    links: false,
                    linkedEditing: false,
                    ...options,
                }}
            />
        </>
    );
};
export default MonacoEditorContainer;
