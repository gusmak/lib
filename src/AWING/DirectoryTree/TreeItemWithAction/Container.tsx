import { useState } from 'react';
import { TreeItem } from '@mui/x-tree-view';
import { Typography, Stack } from '@mui/material';
import { LabelDiv } from '../components/Styled';
import { TreeItemWithActionProps } from './types';

function TreeItemWithAction(props: TreeItemWithActionProps) {
    const { itemId, labelIcon, labelText, actions, onTreeItemClick, ...rest } = props;

    const [hovered, setHovered] = useState<boolean>(false);

    return (
        <TreeItem
            itemId={itemId}
            label={
                <LabelDiv onClickCapture={onTreeItemClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                    {labelIcon}
                    <Typography
                        variant="body2"
                        noWrap
                        sx={{
                            display: 'flex',
                            flex: 1,
                            fontWeight: 'inherit',
                            flexGrow: 1,
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {labelText}
                    </Typography>
                    <Stack
                        sx={() => ({
                            mr: 2,
                            display: hovered ? 'flex' : 'none',
                        })}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Danh sách các hành động trên mỗi item */}
                        {actions}
                    </Stack>
                </LabelDiv>
            }
            sx={(theme) => ({
                '& .MuiTreeItem-content': {
                    '&:hover .MuiTypography-root': {
                        display: 'block',
                    },
                    backgroundColor: theme.palette.background.paper,
                    marginTop: theme.spacing(0.5),
                    boxShadow: theme.shadows[2],
                    borderRadius: '4px',
                    borderCollapse: 'collapse',
                },
            })}
            {...rest}
        />
    );
}

export default TreeItemWithAction;
