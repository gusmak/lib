import Editor from '@monaco-editor/react';
import { useRef } from 'react';

const MonacoEditor = (props: any) => {
    const { value, height, language, onChange, isReadOnly, isShowMinimap, ...options } = props;
    const valueGetter = useRef<any>(null);

    function handleEditorChange(_valueGetter: any) {
        valueGetter.current = _valueGetter;
        onChange(_valueGetter);
    }

    return (
        <>
            <Editor
                height={height ? height : '20vh'}
                language={language ? language : 'html'}
                value={value}
                onChange={handleEditorChange}
                options={{
                    minimap: {
                        enabled: isShowMinimap ? isShowMinimap : false,
                    },
                    wordWrap: 'on',
                    overviewRulerBorder: false,
                    links: false,
                    linkedEditing: false,
                    readOnly: isReadOnly ? isReadOnly : false,
                    ...options,
                }}
            />
        </>
    );
};

export default MonacoEditor;
