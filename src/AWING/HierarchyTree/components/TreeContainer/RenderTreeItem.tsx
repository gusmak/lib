import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { RenderTreeItemProps } from 'AWING/HierarchyTree/interface';
import LabelTreeItem from './LabelTreeItem';

const RenderTreeItem = (props: RenderTreeItemProps) => {
    const { treeNode, onCheck, onGetMoreData, onTreeItemClick, actionComponentProps, startIcon } = props;

    if (!treeNode) return null;

    return (
        <TreeItem
            style={{ userSelect: 'none' }}
            key={treeNode.nodeId}
            itemId={treeNode.nodeId}
            label={
                <LabelTreeItem treeNode={treeNode} onCheck={onCheck} actionComponentProps={actionComponentProps} startIcon={startIcon} />
            }
            onClick={() => {
                onGetMoreData(treeNode.nodeId);
                onTreeItemClick && onTreeItemClick(treeNode);
            }}
        >
            {Array.isArray(treeNode.children) &&
                treeNode.children.length > 0 &&
                treeNode.children.map((treeNodeChildren) => {
                    return (
                        <RenderTreeItem
                            key={treeNodeChildren.nodeId}
                            treeNode={treeNodeChildren}
                            onCheck={onCheck}
                            onGetMoreData={onGetMoreData}
                            onTreeItemClick={onTreeItemClick}
                            actionComponentProps={actionComponentProps}
                            startIcon={startIcon}
                        />
                    );
                })}
        </TreeItem>
    );
};

export default RenderTreeItem;
