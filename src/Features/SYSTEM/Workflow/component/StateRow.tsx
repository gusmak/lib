import { useState } from 'react';
import { Clear, Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, IconButton } from '@mui/material';
import { textValidation } from 'AWING/ultis/validation';
import { WorkflowState, StateType } from '../types';

interface Props {
    level: number;
    stateIndex: number;
    state: StateType<WorkflowState>;
    onRemove: (index: number) => void;
    onRowChange: (index: number, newState: StateType<WorkflowState>) => void;
}

export default function StateRow(props: Props) {
    const { t } = useTranslation();
    const { level, stateIndex, state, onRemove, onRowChange } = props;
    const { name, value, priority, inverseParent } = state;

    const [isChangeName, setIsChangeName] = useState(false);

    const handleChange = <T extends keyof WorkflowState>(fieldName: T, newValue: WorkflowState[T] | undefined) => {
        if (fieldName === 'name') setIsChangeName(true);
        const temp = Object.assign({}, state);
        temp[fieldName] = newValue;
        onRowChange(stateIndex, temp);
    };

    const getError = () => {
        if (value === undefined) {
            return t('Common.Required');
        }
        if (Number(value) < 0) {
            return t('Common.InvalidData');
        }
        return '';
    };

    return (
        <>
            {level > 0 && <Grid size={{ xs: Math.min(level, 3) }} />}
            <Grid size={{ xs: 4 - Math.min(level, 3) }} pr={2}>
                <TextField
                    autoFocus
                    label={t('Workflow.Value')}
                    type="text"
                    value={value ?? ''}
                    onChange={(e) => {
                        const { value } = e.target;
                        handleChange('value', value === '' ? undefined : Number(value));
                    }}
                    error={Boolean(getError())}
                    helperText={getError()}
                    required={true}
                    variant="standard"
                    fullWidth
                    slotProps={{ htmlInput: { 'data-testid': 'row-input-value' } }}
                />
            </Grid>
            <Grid size={{ xs: 3 }} pr={2}>
                <TextField
                    label={t('Workflow.Name')}
                    type="text"
                    value={name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required={true}
                    variant="standard"
                    error={isChangeName && !textValidation(name ?? '', 200).valid}
                    helperText={isChangeName && textValidation(name ?? '', 200).message}
                    fullWidth
                    slotProps={{ htmlInput: { 'data-testid': 'row-input-name' } }}
                />
            </Grid>
            <Grid size={{ xs: 3 }} pr={2} style={{ position: 'relative' }}>
                <TextField
                    label={t('Workflow.Priority')}
                    type="number"
                    value={priority}
                    onChange={(e) => {
                        const { value } = e.target;
                        handleChange('priority', value === '' ? undefined : Number(value));
                    }}
                    variant="standard"
                    fullWidth
                    slotProps={{ htmlInput: { 'data-testid': 'row-input-priority' } }}
                />
            </Grid>
            <Grid size={{ xs: 2 }} pr={2} style={{ alignSelf: 'end', textAlign: 'start' }}>
                <IconButton
                    color="primary"
                    onClick={() => {
                        const temp = Object.assign({}, state);
                        temp.inverseParent = [...(temp.inverseParent || []), {}];
                        onRowChange(stateIndex, temp);
                    }}
                >
                    <Add />
                </IconButton>
                <IconButton
                    onClick={() => {
                        onRemove(stateIndex);
                    }}
                >
                    <Clear />
                </IconButton>
            </Grid>
            {inverseParent?.map((childState, index: number) => {
                return (
                    <StateRow
                        key={index}
                        level={level + 1}
                        stateIndex={index}
                        state={childState}
                        onRemove={(index: number) => {
                            const temp = Object.assign({}, state);
                            temp.inverseParent?.splice(index, 1);
                            onRowChange(stateIndex, temp);
                        }}
                        onRowChange={(index: number, newChild) => {
                            const temp = Object.assign({}, state);
                            if (temp.inverseParent) {
                                temp.inverseParent[index] = newChild;
                            }
                            onRowChange(stateIndex, temp);
                        }}
                    />
                );
            })}
        </>
    );
}
