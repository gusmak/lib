import { useEffect, useState } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view';
import { IDirectoryTreeViewProps, NodeStatus, TreeNode } from './interface';
import RenderTreeItem from './components/TreeContainer/RenderTreeItem';

export const HierarchyTree = ({
    data,
    onGetTreeNode,
    onGetMoreData,
    onTreeItemClick,
    actionComponentProps,
    hideSelectCheckbox,
    startIcon,
}: IDirectoryTreeViewProps) => {
    const [treeNode, setTreeNode] = useState<TreeNode>();

    const findParentNode = (treeNode: TreeNode, currentNodeId: string): TreeNode | undefined => {
        let parentNode;
        for (let i = 0; i < treeNode.children.length; i++) {
            let item = treeNode.children[i];

            if (item.nodeId === currentNodeId) {
                return treeNode;
            } else {
                const recursiveParentId = findParentNode(item, currentNodeId);
                if (recursiveParentId) {
                    parentNode = recursiveParentId;
                    break;
                }
            }
        }
        return parentNode;
    };

    const findNodeByNodeId = (treeNode: TreeNode, currentNodeId: string): TreeNode | undefined => {
        if (treeNode.nodeId === currentNodeId) {
            return treeNode;
        }

        if (treeNode.children && treeNode.children.length > 0) {
            for (let i = 0; i < treeNode.children.length; i++) {
                const foundNode = findNodeByNodeId(treeNode.children[i], currentNodeId);
                if (foundNode) {
                    return foundNode;
                }
            }
        }
    };

    const updateParentNode = (treeNode: TreeNode, currentNode: TreeNode) => {
        const parentNode = findParentNode(treeNode, currentNode.nodeId);
        if (!parentNode) return;
        const allChildrenChecked = parentNode?.children.every((child) => child.status === NodeStatus.Checked);
        const anyChildChecked = parentNode.children.some(
            (child) => child.status === NodeStatus.Checked || child.status === NodeStatus.Indeterminate
        );

        if (allChildrenChecked) {
            parentNode.status = NodeStatus.Checked;
        } else if (anyChildChecked) {
            parentNode.status = NodeStatus.Indeterminate;
        } else {
            parentNode.status = NodeStatus.Unchecked;
        }

        updateParentNode(treeNode, parentNode);
    };

    const toggleNestedItem = (currentNode: TreeNode | undefined) => {
        if (!currentNode) return;
        const status = currentNode.status;
        const newStatus = status === NodeStatus.Checked ? NodeStatus.Unchecked : NodeStatus.Checked;
        currentNode.status = newStatus;

        if (!currentNode?.children?.length) return;

        for (let i = 0; i < currentNode.children.length; i++) {
            const childNode = currentNode.children[i];
            if (!childNode?.children?.length) {
                childNode.status = newStatus;
            } else {
                childNode.status = status;
                toggleNestedItem(childNode);
            }
        }
    };

    const onCheck = (currentNode: TreeNode) => {
        if (!treeNode) return;

        const newTreeNode = { ...treeNode };
        const currentNodeInTree = findNodeByNodeId(newTreeNode, currentNode.nodeId);

        toggleNestedItem(currentNodeInTree);
        updateParentNode(newTreeNode, currentNode);
        setTreeNode(newTreeNode);
    };

    useEffect(() => {
        if (!treeNode) return;
        onGetTreeNode && onGetTreeNode(treeNode);
    }, [treeNode]);

    useEffect(() => {
        setTreeNode(data);
    }, [data]);

    if (!treeNode) return null;

    return (
        <SimpleTreeView>
            <RenderTreeItem
                treeNode={treeNode}
                onCheck={hideSelectCheckbox ? undefined : onCheck}
                onGetMoreData={onGetMoreData}
                onTreeItemClick={onTreeItemClick}
                actionComponentProps={actionComponentProps}
                startIcon={startIcon}
            />
        </SimpleTreeView>
    );
};

export default HierarchyTree;
export * from './interface';
