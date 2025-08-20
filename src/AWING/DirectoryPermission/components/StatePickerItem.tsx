import { TreeItem } from '@mui/x-tree-view';
import { Box, Checkbox, Typography } from '@mui/material';
import { WorkflowState } from '../types';

export type OwnProps = {
    rootState: WorkflowState;
    state: WorkflowState;
    states: WorkflowState[];
    iWorkflowStateIds: string[];
    eWorkflowStateIds: string[];
    onChangeStates: (stateId: string) => void;
    key?: number;
};

export default function StatePickerItem(props: OwnProps) {
    const { rootState, state, states, iWorkflowStateIds, eWorkflowStateIds, onChangeStates } = props;

    return state.id ? (
        <TreeItem
            id-key={state.id}
            itemId={state.id}
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 2,
                    }}
                    data-testid="root-label-container"
                >
                    <Checkbox
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        checked={iWorkflowStateIds.includes(rootState.id ?? '-1') || iWorkflowStateIds.includes(state.id)}
                        disabled={true}
                        data-testid="StatePickerItem-iWorkflowState-Checkbox"
                    />
                    <Checkbox
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        checked={eWorkflowStateIds.includes(rootState.id ?? '-1') || eWorkflowStateIds.includes(state.id)}
                        onChange={() => {
                            state.id && onChangeStates(state.id);
                        }}
                        data-testid="StatePickerItem-eWorkflowState-Checkbox"
                    />
                    <Typography data-testid="TreeItem-label">{state.name}</Typography>
                </Box>
            }
            data-testid={`StatePickerItem-TreeItem-root`}
        >
            {states
                .filter((s) => s.parentId === state.id)
                .map((s, index: number) => (
                    <StatePickerItem
                        rootState={rootState}
                        key={index}
                        state={s}
                        states={states}
                        iWorkflowStateIds={iWorkflowStateIds}
                        eWorkflowStateIds={eWorkflowStateIds}
                        onChangeStates={onChangeStates}
                    />
                ))}
        </TreeItem>
    ) : null;
}
