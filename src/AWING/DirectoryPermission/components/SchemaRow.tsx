import { useState } from 'react';
import { TableRow, TableCell, Checkbox, IconButton, Box, Typography } from '@mui/material';
import { Clear, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Constants } from '../constants';
import { rootSchemasState } from '../Atoms';
import StatePicker from './StatePicker';
import type { ExplicitPermission, Schema, Workflow } from '../types';
import { useAtomValue } from 'jotai';

export type OwnProps = {
    index: number;
    explicitPermission: ExplicitPermission;
    inheritedPermissions: ExplicitPermission[];
    schemas: Schema[];
    schemaId: number | null;
    onChangePermission: (code: number, schemaId: number | null) => void;
    onDeleteSchema: (schemaId: number | null) => void;
    disableSelectSchema: boolean;
    workflow: Workflow;
    onChangeStates: (stateId: string, schemaId: number | null) => void;
};

export default function Container(props: OwnProps) {
    const {
        index,
        schemas,
        schemaId,
        onChangePermission,
        disableSelectSchema,
        onDeleteSchema,
        inheritedPermissions,
        explicitPermission,
        workflow,
        onChangeStates,
    } = props;

    const rootSchemas = useAtomValue(rootSchemasState);

    const inherit = inheritedPermissions?.find((i) => i.schemaId === explicitPermission.schemaId);
    /** Caculate */
    const iPermissions = inherit?.permissions || [];
    const iWorkflowStateIds = inherit?.workflowStateIds || [];
    const ePermissions = explicitPermission.permissions;
    const eWorkflowStateIds = explicitPermission.workflowStateIds;

    const [open, setOpen] = useState(true);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleChangeStates = (stateId: string) => {
        onChangeStates(stateId, schemaId);
    };

    return (
        <>
            <TableRow
                key={index}
                style={{
                    borderBottom: 'none',
                }}
            >
                <TableCell
                    sx={{
                        fontWeight: '500',
                        minWidth: '160px',
                        borderBottom: open ? 'none' : '',
                        cursor: 'pointer',
                    }}
                    onClick={handleOpen}
                >
                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                        {workflow &&
                            (open ? (
                                <ExpandLess
                                    sx={{
                                        marginRight: 0.5,
                                    }}
                                />
                            ) : (
                                <ExpandMore
                                    sx={{
                                        marginRight: 0.5,
                                    }}
                                />
                            ))}
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {
                                (
                                    [...rootSchemas, ...schemas].find((s: Schema) => s.id === schemaId) || {
                                        name: 'Default',
                                    }
                                ).name
                            }
                        </Typography>
                    </Box>
                </TableCell>
                {Object.values(Constants.PERMISSION_CODE).map((code) => (
                    <TableCell
                        key={`per_${code}`}
                        padding="checkbox"
                        style={{
                            width: '160px',
                            minWidth: '100px',
                            borderBottom: open ? 'none' : '',
                        }}
                    >
                        <Checkbox disabled color="primary" checked={iPermissions.indexOf(code) !== -1} value={code} />
                        <Checkbox
                            color="primary"
                            checked={ePermissions.indexOf(code) !== -1}
                            onChange={() => {
                                onChangePermission(code, schemaId);
                            }}
                            value={code}
                        />
                    </TableCell>
                ))}
                <TableCell
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        borderBottom: open ? 'none' : '',
                    }}
                >
                    {disableSelectSchema ? (
                        <Clear
                            color="action"
                            sx={{
                                opacity: '0',
                                margin: 1,
                            }}
                        />
                    ) : (
                        <IconButton
                            onClick={() => {
                                onDeleteSchema(schemaId);
                            }}
                        >
                            <Clear color="action" />
                        </IconButton>
                    )}
                </TableCell>
            </TableRow>
            {workflow && open && (
                <TableRow>
                    <TableCell colSpan={8}>
                        {workflow?.workflowStates
                            ?.filter((w) => !w.parentId)
                            .map((state) => {
                                return (
                                    <StatePicker
                                        key={`state_${state.id}`}
                                        rootState={state}
                                        states={workflow.workflowStates ?? []}
                                        iWorkflowStateIds={iWorkflowStateIds}
                                        eWorkflowStateIds={eWorkflowStateIds}
                                        onChangeStates={handleChangeStates}
                                    />
                                );
                            })}
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}
