import { Checkbox, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ILabelTreeItemProps, NodeStatus, TreeNode } from 'AWING/HierarchyTree/interface';
import ActionComponents from '../ActionComponents';

const useStyles = makeStyles({
    root: {
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        height: 40,
        padding: 8,
        '&:hover .icon_actions': {
            display: 'flex !important',
            alignItems: 'center',
        },
    },
    boxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
    },
    labelText: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
    },
});

const LabelTreeItem = (props: ILabelTreeItemProps) => {
    const { treeNode, onCheck, actionComponentProps, startIcon } = props;

    const classes = useStyles();

    const isChecked = (currentNode: TreeNode) => {
        if (currentNode.status === NodeStatus.Checked) {
            return true;
        } else if (currentNode.status === NodeStatus.Unchecked) {
            return false;
        }
    };

    return (
        <div className={classes.root}>
            <div className={classes.boxLabel}>
                {startIcon && startIcon}
                {onCheck && (
                    <Typography>
                        <Checkbox
                            data-nodeid={treeNode.nodeId}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            onChange={() => {
                                onCheck(treeNode);
                            }}
                            checked={isChecked(treeNode)}
                            indeterminate={treeNode.status === NodeStatus.Indeterminate}
                        />
                    </Typography>
                )}

                <div className={classes.labelText}>
                    <Typography>{treeNode.name}</Typography>
                </div>
            </div>
            <ActionComponents treeNode={treeNode} actionProps={actionComponentProps} />
        </div>
    );
};

export default LabelTreeItem;
