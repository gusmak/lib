import { Checkbox, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CheckboxActionProps } from 'AWING/HierarchyTree/interface';

const useStyles = makeStyles({
    checkbox: {
        padding: 'unset',
    },
});

const CheckboxAction = (props: CheckboxActionProps) => {
    const classes = useStyles();
    const { currentNode, onChecklist } = props;
    if (!onChecklist) return null;
    return (
        <Typography className={classes.checkbox}>
            <Checkbox
                checked={currentNode?.isReadOnly}
                onClick={(e) => e.stopPropagation()}
                onChange={(_e, v) => onChecklist?.(v, currentNode)}
            />
        </Typography>
    );
};

export default CheckboxAction;
