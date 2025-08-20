import { Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add as AddIcon } from '@mui/icons-material';
import StateRow from './StateRow';
import type { WorkflowState, StateType } from '../types';

interface Props {
    workflowStates: StateType<WorkflowState>[];
    onChanged: (workflowStates?: StateType<WorkflowState>[]) => void;
}

export default function State(props: Props) {
    const { t } = useTranslation();
    const { workflowStates, onChanged } = props;

    const handleRowChange = (index: number, newState: StateType<WorkflowState>) => {
        const temp: StateType<WorkflowState>[] = Object.assign([], workflowStates);
        temp[index] = newState;
        onChanged(temp);
    };
    const onAppend = () => {
        const temp: StateType<WorkflowState>[] = Object.assign([], workflowStates);
        temp.push({});
        onChanged(temp);
    };
    const handleRemove = (index: number) => {
        const temp = Object.assign([], workflowStates);
        temp.splice(index, 1);
        onChanged(temp);
    };
    return (
        <Grid container sx={{ flexGrow: 1 }} pl={2}>
            {workflowStates &&
                workflowStates.map((item, index) => {
                    return (
                        <StateRow
                            key={index}
                            stateIndex={index}
                            state={item}
                            onRemove={handleRemove}
                            onRowChange={handleRowChange}
                            level={0}
                        />
                    );
                })}

            <Grid size={{ xs: 12 }}>
                <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => onAppend()} data-testid="btn-add-state">
                    {t('Common.Create')}
                </Button>
            </Grid>
        </Grid>
    );
}
