import { IMonacoEditorProps } from './interface';
import MonacoEditorContainer from './container';

export function MonacoEditor(props: IMonacoEditorProps) {
    return <MonacoEditorContainer {...props} />;
}
export default MonacoEditor;
export * from './interface';
