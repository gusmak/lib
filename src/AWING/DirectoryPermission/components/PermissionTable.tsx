import { Table, TableBody, Stack } from '@mui/material';
import { schemasState, workflowStates } from '../Atoms';
import { headCells } from '../utils';
import TableHeader from './TableHeader';
import SchemaRow from './SchemaRow';
import type { ExplicitPermission } from '../types';
import { useAtomValue } from 'jotai';

export type HeadCell = {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
    explain?: string;
};

export type OwnProps = {
    explicitPermissions: ExplicitPermission[];
    inheritedPermissions: ExplicitPermission[];
    onChangePermission: (code: number, schemaId: number | null) => void;
    onDeleteSchema: (schemaId: number | null) => void;
    disableSelectSchema: boolean;
    onChangeStates: (stateId: string, schemaId: number | null) => void;
};

export default function PermissionTable(props: OwnProps) {
    const { disableSelectSchema, explicitPermissions, inheritedPermissions, onChangePermission, onDeleteSchema, onChangeStates } = props;

    const schemas = useAtomValue(schemasState);
    const workflow = useAtomValue(workflowStates);

    return (
        <Stack
            sx={{
                width: '100%',
                overflowX: 'auto',
            }}
        >
            <Table
                sx={{
                    minWidth: '900px',
                }}
            >
                <TableHeader headCells={headCells} />
                <TableBody>
                    {explicitPermissions.map((item, idx: number) => {
                        return (
                            <SchemaRow
                                key={`schemaRow_${item.schemaId}`}
                                index={idx}
                                schemas={schemas}
                                schemaId={item?.schemaId ?? null}
                                onChangePermission={onChangePermission}
                                disableSelectSchema={disableSelectSchema}
                                onDeleteSchema={onDeleteSchema}
                                inheritedPermissions={inheritedPermissions}
                                explicitPermission={item}
                                workflow={workflow!}
                                onChangeStates={onChangeStates}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </Stack>
    );
}
