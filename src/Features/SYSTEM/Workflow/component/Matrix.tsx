import { Button, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add as AddIcon, Clear as ClearIcon, ArrowRightAlt } from '@mui/icons-material';
import { WorkflowState, WorkflowMatrix, StateType } from '../types';

interface Props {
    workflowMatrices: StateType<WorkflowMatrix>[];
    selectableStates: WorkflowState[];
    onChanged: (workflowMatrices?: StateType<WorkflowMatrix>[]) => void;
}

export default function Matrix(props: Props) {
    const { t } = useTranslation();
    const { workflowMatrices, selectableStates, onChanged } = props;

    const onChangedRow = (index: number, fieldName: string, value: string) => {
        const obj = workflowMatrices[index];
        workflowMatrices.splice(index, 1, { ...obj, [fieldName]: value });
        onChanged(workflowMatrices);
    };

    const onAppend = () => {
        workflowMatrices.push({});
        onChanged(workflowMatrices);
    };

    const onRemove = (index: number) => {
        workflowMatrices.splice(index, 1);
        onChanged(workflowMatrices);
    };

    return (
        <>
            {workflowMatrices &&
                workflowMatrices.map((item, index) => {
                    return (
                        <Grid key={`row.${index}`} container pl={2} mb={2} data-testid="matrix-row">
                            <Grid size={{ xs: 2 }} pr={2}>
                                <TextField
                                    autoFocus
                                    label={t('Workflow.State.Start')}
                                    select
                                    value={item.stateStart}
                                    onChange={(e) => onChangedRow(index, 'stateStart', e.target.value)}
                                    required={true}
                                    variant="standard"
                                    fullWidth
                                    data-testid="matrix-start-state"
                                >
                                    {selectableStates.map((item, index: number) => (
                                        <MenuItem key={`$opt-${index}`} value={item.id || ''}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 1 }} style={{ position: 'relative' }}>
                                <ArrowRightAlt
                                    fontSize="large"
                                    style={{
                                        position: 'absolute',
                                        left: '30%',
                                        bottom: '5px',
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 4 }} pr={2}>
                                <TextField
                                    label={t('Workflow.State.End')}
                                    select
                                    value={item.stateEnd}
                                    onChange={(e) => onChangedRow(index, 'stateEnd', e.target.value)}
                                    required={true}
                                    variant="standard"
                                    fullWidth
                                    data-testid="matrix-end-state"
                                >
                                    {selectableStates.map((item, index: number) => (
                                        <MenuItem key={`$opt-${index}`} value={item.id || ''}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 5 }} pr={2} style={{ position: 'relative' }}>
                                <TextField
                                    label={t('Workflow.Priority')}
                                    type="number"
                                    value={item.priority}
                                    onChange={(e) => onChangedRow(index, 'priority', e.target.value)}
                                    variant="standard"
                                    fullWidth
                                />
                                <IconButton
                                    style={{
                                        position: 'absolute',
                                        right: '20px',
                                        top: '20%',
                                    }}
                                    onClick={() => {
                                        onRemove(index);
                                    }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    );
                })}
            <Grid size={{ xs: 12 }} pl={2}>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    disabled={selectableStates.length < 2}
                    onClick={() => onAppend()}
                >
                    {t('Common.Create')}
                </Button>
            </Grid>
        </>
    );
}
