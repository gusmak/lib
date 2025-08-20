import { IconButton, Tooltip } from '@mui/material';
import { IconActionsProps } from 'AWING/HierarchyTree/interface';

const IconActions = (props: IconActionsProps) => {
    const { actions, treeNode } = props;
    if (!actions) return null;

    return (
        <div className="icon_actions" style={{ display: 'none' }}>
            {actions.map((action, index) => {
                const isHide = action.isShouldHideAction && action.isShouldHideAction(treeNode);
                return (
                    !isHide && (
                        <Tooltip key={index} title={action.tooltip || ''}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.action && action.action(treeNode);
                                }}
                            >
                                {action.icon}
                            </IconButton>
                        </Tooltip>
                    )
                );
            })}
        </div>
    );
};

export default IconActions;
