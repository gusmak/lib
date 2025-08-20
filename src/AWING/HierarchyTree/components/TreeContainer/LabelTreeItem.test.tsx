import { fireEvent, render, screen } from '@testing-library/react';
import { NodeStatus, TreeNode } from 'AWING/HierarchyTree/interface';
import LabelTreeItem from './LabelTreeItem';

describe('LabelTreeItem', () => {
    const mockOnCheck = jest.fn();

    const createMockNode = (status: NodeStatus): TreeNode => ({
        nodeId: 'test-node',
        name: 'Test Node',
        status: status,
        children: [],
    });

    const defaultProps = {
        treeNode: createMockNode(NodeStatus.Unchecked),
        onCheck: mockOnCheck,
        actionComponentProps: {},
        startIcon: null,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render checkbox as checked when node status is Checked', () => {
        const checkedNode = createMockNode(NodeStatus.Checked);
        render(<LabelTreeItem {...defaultProps} treeNode={checkedNode} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('should render checkbox as unchecked when node status is Unchecked', () => {
        const uncheckedNode = createMockNode(NodeStatus.Unchecked);
        render(<LabelTreeItem {...defaultProps} treeNode={uncheckedNode} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    it('should render checkbox as indeterminate when node status is Indeterminate', () => {
        const indeterminateNode = createMockNode(NodeStatus.Indeterminate);
        render(<LabelTreeItem {...defaultProps} treeNode={indeterminateNode} />);

        const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
        expect(checkbox.indeterminate).toBe(false);
        expect(checkbox).not.toBeChecked();
    });

    it('should not render checkbox when onCheck is not provided', () => {
        render(<LabelTreeItem {...defaultProps} onCheck={undefined} startIcon={<></>} />);

        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it('onClick & onChange', () => {
        render(<LabelTreeItem {...defaultProps} startIcon={<></>} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
    });
});
