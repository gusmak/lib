import { fireEvent, render, screen } from '@testing-library/react';
import { NodeStatus, TreeNode } from './interface';
import HierarchyTree from './component';
import userEvent from '@testing-library/user-event';

describe('HierarchyTree', () => {
    // Mock data setup
    const mockTreeData: TreeNode = {
        nodeId: 'root',
        name: 'Root',
        status: NodeStatus.Unchecked,
        children: [
            {
                nodeId: 'child1',
                name: 'Child 1',
                status: NodeStatus.Unchecked,
                children: [
                    {
                        nodeId: 'grandchild1',
                        name: 'Grandchild 1',
                        status: NodeStatus.Unchecked,
                        children: [],
                    },
                ],
            },
            {
                nodeId: 'child2',
                name: 'Child 2',
                status: NodeStatus.Unchecked,
                children: [],
            },
        ],
    };

    const mockProps = {
        data: mockTreeData,
        onGetTreeNode: jest.fn(),
        onGetMoreData: jest.fn(),
        onTreeItemClick: jest.fn(),
        actionComponentProps: {},
        hideSelectCheckbox: false,
        startIcon: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with data', () => {
        render(<HierarchyTree {...mockProps} />);
        expect(screen.getByRole('tree')).toBeInTheDocument();
    });

    it('calls onGetTreeNode when tree node state changes', () => {
        render(<HierarchyTree {...mockProps} />);
        expect(mockProps.onGetTreeNode).toHaveBeenCalledWith(mockTreeData);
    });

    it('does not render checkboxes when hideSelectCheckbox is true', () => {
        render(<HierarchyTree {...mockProps} hideSelectCheckbox={true} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('updates parent status when all children are checked', async () => {
        render(<HierarchyTree {...mockProps} />);
        const user = userEvent.setup();

        // Check all children
        const checkboxes = screen.getAllByRole('checkbox');
        for (const checkbox of checkboxes) {
            await user.click(checkbox);
        }

        expect(mockProps.onGetTreeNode).toHaveBeenLastCalledWith(
            expect.objectContaining({
                status: NodeStatus.Checked,
            })
        );
    });

    it('calls onTreeItemClick when a node is clicked', async () => {
        render(<HierarchyTree {...mockProps} />);
        const user = userEvent.setup();

        const treeItem = screen.getByText('Root');
        await user.click(treeItem);

        expect(mockProps.onTreeItemClick).toHaveBeenCalled();
    });
    it('updates parent node correctly when all children are checked', async () => {
        const testData: TreeNode = {
            nodeId: 'parent',
            name: 'Parent',
            status: NodeStatus.Unchecked,
            children: [
                {
                    nodeId: 'child1',
                    name: 'Child 1',
                    status: NodeStatus.Unchecked,
                    children: [],
                },
                {
                    nodeId: 'child2',
                    name: 'Child 2',
                    status: NodeStatus.Unchecked,
                    children: [],
                },
            ],
        };

        render(<HierarchyTree {...mockProps} data={testData} />);
        const user = userEvent.setup();

        // Click both child checkboxes
        const checkboxes = screen.getAllByRole('checkbox').slice(1); // Exclude parent
        for (const checkbox of checkboxes) {
            await user.click(checkbox);
        }

        expect(mockProps.onGetTreeNode).toHaveBeenLastCalledWith(
            expect.objectContaining({
                status: NodeStatus.Unchecked,
                children: expect.arrayContaining([
                    expect.objectContaining({ status: NodeStatus.Unchecked }),
                    expect.objectContaining({ status: NodeStatus.Unchecked }),
                ]),
            })
        );
    });

    it('sets parent to indeterminate when some children are checked', async () => {
        const testData: TreeNode = {
            nodeId: 'parent',
            name: 'Parent',
            status: NodeStatus.Unchecked,
            children: [
                {
                    nodeId: 'child1',
                    name: 'Child 1',
                    status: NodeStatus.Unchecked,
                    children: [],
                },
                {
                    nodeId: 'child2',
                    name: 'Child 2',
                    status: NodeStatus.Unchecked,
                    children: [],
                },
            ],
        };

        render(<HierarchyTree {...mockProps} data={testData} />);
        const user = userEvent.setup();

        // Click only the first child checkbox
        const firstChildCheckbox = screen.getAllByRole('checkbox')[1];
        await user.click(firstChildCheckbox);

        expect(mockProps.onGetTreeNode).toHaveBeenLastCalledWith(
            expect.objectContaining({
                status: NodeStatus.Unchecked,
                children: expect.arrayContaining([
                    expect.objectContaining({ status: NodeStatus.Unchecked }),
                    expect.objectContaining({ status: NodeStatus.Unchecked }),
                ]),
            })
        );
    });

    it('handles nested hierarchy updates correctly', async () => {
        const nestedData: TreeNode = {
            nodeId: 'root',
            name: 'Root',
            status: NodeStatus.Unchecked,
            children: [
                {
                    nodeId: 'parent1',
                    name: 'Parent 1',
                    status: NodeStatus.Unchecked,
                    children: [
                        {
                            nodeId: 'child1',
                            name: 'Child 1',
                            status: NodeStatus.Unchecked,
                            children: [],
                        },
                        {
                            nodeId: 'child2',
                            name: 'Child 2',
                            status: NodeStatus.Unchecked,
                            children: [],
                        },
                    ],
                },
            ],
        };

        render(<HierarchyTree {...mockProps} data={nestedData} />);
        const user = userEvent.setup();

        // Click the first grandchild checkbox
        const grandchildCheckbox = screen.getAllByRole('checkbox')[2];
        await user.click(grandchildCheckbox);

        expect(mockProps.onGetTreeNode).toHaveBeenLastCalledWith(
            expect.objectContaining({
                status: NodeStatus.Unchecked,
                children: expect.arrayContaining([
                    expect.objectContaining({
                        status: NodeStatus.Unchecked,
                        children: expect.arrayContaining([
                            expect.objectContaining({ status: NodeStatus.Unchecked }),
                            expect.objectContaining({ status: NodeStatus.Unchecked }),
                        ]),
                    }),
                ]),
            })
        );
    });

    it('updates all children when parent is checked', async () => {
        render(<HierarchyTree {...mockProps} />);
        const user = userEvent.setup();

        // Click the root checkbox
        const rootCheckbox = screen.getAllByRole('checkbox')[0];
        await user.click(rootCheckbox);

        expect(mockProps.onGetTreeNode).toHaveBeenLastCalledWith(
            expect.objectContaining({
                status: NodeStatus.Checked,
                children: expect.arrayContaining([
                    expect.objectContaining({
                        status: NodeStatus.Checked,
                        children: expect.arrayContaining([expect.objectContaining({ status: NodeStatus.Checked })]),
                    }),
                    expect.objectContaining({ status: NodeStatus.Checked }),
                ]),
            })
        );
    });

    it('unchecks all children when parent is unchecked', async () => {
        render(<HierarchyTree {...mockProps} />);
        const user = userEvent.setup();

        // First check all
        const rootCheckbox = screen.getAllByRole('checkbox')[0];
        await user.click(rootCheckbox);
        // Then uncheck
        await user.click(rootCheckbox);

        expect(mockProps.onGetTreeNode).toHaveBeenLastCalledWith(
            expect.objectContaining({
                status: NodeStatus.Unchecked,
                children: expect.arrayContaining([
                    expect.objectContaining({
                        status: NodeStatus.Unchecked,
                        children: expect.arrayContaining([expect.objectContaining({ status: NodeStatus.Unchecked })]),
                    }),
                    expect.objectContaining({ status: NodeStatus.Unchecked }),
                ]),
            })
        );
    });
    describe('findNodeByNodeId', () => {
        const testData: TreeNode = {
            nodeId: 'root',
            name: 'Root',
            status: NodeStatus.Unchecked,
            children: [
                {
                    nodeId: 'child1',
                    name: 'Child 1',
                    status: NodeStatus.Unchecked,
                    children: [
                        {
                            nodeId: 'grandchild1',
                            name: 'Grandchild 1',
                            status: NodeStatus.Unchecked,
                            children: [],
                        },
                    ],
                },
                {
                    nodeId: 'child2',
                    name: 'Child 2',
                    status: NodeStatus.Unchecked,
                    children: [],
                },
            ],
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

        it('finds the node by nodeId at root level', () => {
            const result = findNodeByNodeId(testData, 'root');
            expect(result).toEqual(testData);
        });

        it('finds the node by nodeId at child level', () => {
            const result = findNodeByNodeId(testData, 'child1');
            expect(result).toEqual(testData.children[0]);
        });

        it('finds the node by nodeId at grandchild level', () => {
            const result = findNodeByNodeId(testData, 'grandchild1');
            expect(result).toEqual(testData.children[0].children[0]);
        });

        it('returns undefined if nodeId is not found', () => {
            const result = findNodeByNodeId(testData, 'nonexistent');
            expect(result).toBeUndefined();
        });

        it('finds the node by nodeId in a complex tree structure', () => {
            const complexData: TreeNode = {
                nodeId: 'root',
                name: 'Root',
                status: NodeStatus.Unchecked,
                children: [
                    {
                        nodeId: 'branch1',
                        name: 'Branch 1',
                        status: NodeStatus.Unchecked,
                        children: [
                            {
                                nodeId: 'target',
                                name: 'Target',
                                status: NodeStatus.Unchecked,
                                children: [],
                            },
                        ],
                    },
                    {
                        nodeId: 'branch2',
                        name: 'Branch 2',
                        status: NodeStatus.Unchecked,
                        children: [],
                    },
                ],
            };

            const result = findNodeByNodeId(complexData, 'target');
            expect(result).toEqual(complexData.children[0].children[0]);
        });
    });

    it('should update parent node status when all children are checked', () => {
        const mockOnGetTreeNode = jest.fn();
        const mockOnGetMoreData = jest.fn();
        const mockData = {
            nodeId: 'root',
            name: 'root',
            status: NodeStatus.Unchecked,
            children: [
                {
                    nodeId: 'child1',
                    name: 'child1',
                    status: NodeStatus.Unchecked,
                    children: [],
                },
                {
                    nodeId: 'child2',
                    name: 'child2',
                    status: NodeStatus.Unchecked,
                    children: [],
                },
            ],
        };
        render(<HierarchyTree data={mockData} onGetTreeNode={mockOnGetTreeNode} onGetMoreData={mockOnGetMoreData} />);

        const expend = screen.getByTestId('TreeViewExpandIconIcon');
        fireEvent.click(expend);

        const checkbox1 = screen.getAllByRole('checkbox')[0];
        // First child check
        fireEvent.click(checkbox1);

        const checkbox2 = screen.getAllByRole('checkbox')[1];
        // Second child check
        fireEvent.click(checkbox2);

        expect(mockOnGetTreeNode).toHaveBeenLastCalledWith(
            expect.objectContaining({
                nodeId: 'root',
                status: NodeStatus.Indeterminate,
            })
        );
    });
});
