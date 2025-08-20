import { type ReactNode } from 'react';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';

export type TreeItemWithActionProps = TreeItemProps & {
    itemId: string;
    labelIcon: ReactNode;
    labelText: string;
    actions?: ReactNode;
    onTreeItemClick?: () => void;
};
