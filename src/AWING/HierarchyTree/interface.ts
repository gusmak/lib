import React, { ReactNode } from 'react';

export type TreeNode = {
    nodeId: string;
    name: string;
    /**
     * trạng thái của node
     */
    status: NodeStatus;
    parentId?: string;
    isSystem?: boolean;
    isReadOnly?: boolean;
    children: TreeNode[] | [];
};

export enum NodeStatus {
    Checked = 'CHECKED',
    Unchecked = 'UNCHECKED',
    Indeterminate = 'INDETERMINATE',
}
export interface IDirectoryTreeViewProps {
    //OPTIONAL feature TreeView
    data: TreeNode;
    hideSelectCheckbox?: boolean;
    defaultCollapseIcon?: React.ReactNode;
    defaultExpandIcon?: React.ReactNode;
    defaultExpanded?: string[];
    startIcon?: React.ReactNode;

    //OPTIONAL feature TreeItem
    actionComponents?: (node?: TreeNode) => React.JSX.Element;

    //REQUIRED feature TreeContainer
    onGetConvertedData?: (nodeId?: string) => Promise<TreeNode>;
    onGetCheckedList?: (checkList: string[]) => string[];
    onGetMoreData: (nodeId: string, forceUpdate?: boolean) => Promise<void>;
    onGetTreeNode?: (treeNode: TreeNode) => void;
    onTreeItemClick?: (treeNode: TreeNode) => void;

    actionComponentProps?: IActionComponentProps;
}

export interface IAction {
    icon: ReactNode;
    tooltip?: string;
    action?: (node: TreeNode) => void;
    isShouldHideAction?: (node: TreeNode) => boolean;
}
export type IActionComponentProps = {
    actions?: IAction[];
    onChecklist?: (status?: boolean, currentNode?: TreeNode) => void;
};

export type IActionProps = {
    createAction?: IconAction;
    permissionAction?: IconAction;
    editAction?: IconAction;
    deleteAction?: IconAction;
    checklistAction?: IChecklist;
};

export type IconAction = {
    icon: React.JSX.Element;
    url: string;
};

export type IChecklist = {
    currentNode: TreeNode;
    onChecklist: (status?: boolean, currentNode?: TreeNode) => void;
};

export interface IconActionsProps {
    actions: IAction[];
    treeNode: TreeNode;
}

export interface ActionComponentsProps {
    actionProps?: IActionComponentProps;
    treeNode: TreeNode;
}

export interface CheckboxActionProps {
    onChecklist?: (status?: boolean, currentNode?: TreeNode) => void;
    currentNode?: TreeNode;
}

export type ILabelTreeItemProps = {
    treeNode: TreeNode;
    onCheck?: (treeNode: TreeNode) => void;

    actionComponentProps?: IActionComponentProps;
    startIcon?: React.ReactNode;
};

export interface RenderTreeItemProps {
    treeNode?: TreeNode;
    onCheck?: (treeNode: TreeNode) => void;
    onGetMoreData: (nodeId: string) => Promise<void>;
    onTreeItemClick?: (treeNode: TreeNode) => void;
    actionComponentProps?: IActionComponentProps;
    startIcon?: ReactNode;
}
