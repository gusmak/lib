import { EditorProps } from '@monaco-editor/react';

export interface IMonacoEditorProps extends EditorProps {
    height?: string;
    language?: string;
    isShowMinimap?: boolean;
    disableFormatJSON?: boolean;
}
