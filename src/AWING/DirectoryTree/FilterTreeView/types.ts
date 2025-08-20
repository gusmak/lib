import { SxProps, Theme } from '@mui/material';
import { TreeItemOption } from '../interface';

export type FilterTreeViewProps = {
    items: TreeItemOption[];
    onDirectoryOpen: (id: TreeItemOption['value']) => void;
    onTreeItemClick: (id: TreeItemOption['value']) => void;
    rootDirectoryId: TreeItemOption['value'];
    isLoading?: boolean;
    sx?: SxProps<Theme>;
};
