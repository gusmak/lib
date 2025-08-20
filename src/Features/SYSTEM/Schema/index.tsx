import { AppProvider } from 'Utils';
import Container from './Container';
import { SchemaContext } from './context';
import { SchemaServices } from './Services';
import type { CurrentWorkspace } from '../types';
import { Provider } from 'jotai';

export type SchemaSystemProps = SchemaServices & {
    currentWorkspace?: CurrentWorkspace;
};

export function SchemaSystem(props: SchemaSystemProps) {
    const { currentWorkspace, ...services } = props;

    return currentWorkspace?.id ? (
        <AppProvider>
            <Provider>
                <SchemaContext.Provider
                    value={{
                        services,
                        currentWorkspace,
                    }}
                >
                    <Container />
                </SchemaContext.Provider>
            </Provider>
        </AppProvider>
    ) : null;
}

export * from './types';
export * from './Services';
export { default as FieldView } from './components/FieldView';
export default SchemaSystem;
