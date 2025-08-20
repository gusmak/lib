import { SyntheticEvent, useState } from 'react';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';
import { ExpandLess, ChevronRight } from '@mui/icons-material';
import { Box, Checkbox, Typography } from '@mui/material';
import { WorkflowState } from '../types';
import StatePickerItem from './StatePickerItem';

export type OwnProps = {
    rootState: WorkflowState;
    states: WorkflowState[];
    iWorkflowStateIds: string[];
    eWorkflowStateIds: string[];
    onChangeStates: (stateId: string) => void;
};

export default function StatePicker(props: OwnProps) {
    const { rootState, states, eWorkflowStateIds, iWorkflowStateIds, onChangeStates } = props;

    const [expanded, setExpanded] = useState<string[]>(['root']);
    const handleToggle = (_event: SyntheticEvent | null, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    return (
        <SimpleTreeView
            aria-label="controlled"
            slots={{ collapseIcon: ExpandLess, expandIcon: ChevronRight }}
            expandedItems={expanded}
            onExpandedItemsChange={handleToggle}
            sx={{ paddingBottom: 2, marginLeft: 20 }}
            disableSelection={true}
        >
            <TreeItem
                itemId={'root'}
                label={
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Checkbox
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                checked={iWorkflowStateIds.includes(rootState.id ?? '-1')}
                                disabled={true}
                            />
                            <Checkbox
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                checked={eWorkflowStateIds.includes(rootState.id ?? '-1')}
                                onChange={() => {
                                    rootState.id && onChangeStates(rootState.id);
                                }}
                            />
                            <Typography>{rootState.name}</Typography>
                        </Box>
                    </div>
                }
            >
                {states
                    .filter((s) => s.parentId === rootState.id)
                    .map((child, index: number) => {
                        return (
                            <StatePickerItem
                                rootState={rootState}
                                key={index}
                                state={child}
                                states={states}
                                iWorkflowStateIds={iWorkflowStateIds}
                                eWorkflowStateIds={eWorkflowStateIds}
                                onChangeStates={onChangeStates}
                            />
                        );
                    })}
            </TreeItem>
        </SimpleTreeView>
    );
}
