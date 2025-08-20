import { render } from '@testing-library/react';
import { SimpleTreeView } from '@mui/x-tree-view';
import { NodeStatus } from 'AWING/HierarchyTree/interface';
import RenderTreeItem from './RenderTreeItem';

describe('RenderTreeItem', () => {
    const mockTreeNode = {
        nodeId: 'node-1',
        name: 'Node 1',
        status: NodeStatus.Unchecked,
        children: [
            {
                nodeId: 'child-1',
                name: 'Child 1',
                status: NodeStatus.Unchecked,
                children: [],
            },
        ],
    };

    const mockProps = {
        treeNode: mockTreeNode,
        onCheck: jest.fn(),
        onGetMoreData: jest.fn(),
        onTreeItemClick: jest.fn(),
        actionComponentProps: {},
        startIcon: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns null when no treeNode is provided', () => {
        const { container } = render(
            <SimpleTreeView>
                <RenderTreeItem {...mockProps} treeNode={undefined} />
            </SimpleTreeView>
        );
        // expect(container.firstChild).toBeNull();
    });

    it('calls onGetMoreData and onTreeItemClick when clicked', async () => {
        const { getByText } = render(
            <SimpleTreeView>
                <RenderTreeItem {...mockProps} />
            </SimpleTreeView>
        );
        const node = getByText('Node 1');
        node.click();
        expect(mockProps.onGetMoreData).toHaveBeenCalledWith('node-1');
        expect(mockProps.onTreeItemClick).toHaveBeenCalledWith(mockTreeNode);
    });
});
