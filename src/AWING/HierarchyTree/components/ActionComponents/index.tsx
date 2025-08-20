import { makeStyles } from '@mui/styles';
import { ActionComponentsProps } from '../../interface';
import CheckboxAction from './CheckboxAction';
import IconActions from './IconActions';

const useStyles = makeStyles({
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
});

const ActionComponents = (props: ActionComponentsProps) => {
    const classes = useStyles();
    const { actionProps, treeNode } = props;
    if (!actionProps) return null;
    const { actions, onChecklist } = actionProps;

    return (
        <div className={classes.actions}>
            {actions && <IconActions actions={actions} treeNode={treeNode} />}
            {onChecklist && <CheckboxAction currentNode={treeNode} onChecklist={onChecklist} />}
        </div>
    );
};

export default ActionComponents;
