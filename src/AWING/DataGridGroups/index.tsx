import { Provider } from 'jotai';
import Container from './Container';
import { DataGridGroupsProps } from './Container';

export function DataGridGroup<FieldName extends string>(props: DataGridGroupsProps<FieldName>) {
    return (
        <Provider>
            <Container {...props} />
        </Provider>
    );
}

export type { Cell, Row } from './Types';
export { type DataGridGroupsProps as IDataGridGroups };
export default DataGridGroup;
