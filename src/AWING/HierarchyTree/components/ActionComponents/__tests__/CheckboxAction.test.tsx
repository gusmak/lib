import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NodeStatus, TreeNode } from 'AWING/HierarchyTree/interface';
import CheckboxAction from '../CheckboxAction';

describe('CheckboxAction', () => {
    const mockNode: TreeNode = {
        nodeId: 'test-id',
        name: 'Test Node',
        isReadOnly: false,
        status: NodeStatus.Unchecked,
        children: [],
    };

    const mockOnChecklist = jest.fn();

    const defaultProps = {
        currentNode: mockNode,
        onChecklist: mockOnChecklist,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders checkbox when onChecklist is provided', () => {
        render(<CheckboxAction {...defaultProps} />);
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('returns null when onChecklist is not provided', () => {
        const { container } = render(<CheckboxAction currentNode={mockNode} onChecklist={undefined} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('reflects isReadOnly state from currentNode', () => {
        const readOnlyNode = { ...mockNode, isReadOnly: true };
        render(<CheckboxAction currentNode={readOnlyNode} onChecklist={mockOnChecklist} />);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it.skip('stops event propagation on click', async () => {
        const user = userEvent.setup();
        const mockStopPropagation = jest.fn();

        render(<CheckboxAction {...defaultProps} />);
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox);

        // Simulate the event object
        const mockEvent = { stopPropagation: mockStopPropagation } as Partial<MouseEventInit>;
        checkbox.dispatchEvent(new MouseEvent('click', mockEvent));

        expect(mockStopPropagation).toHaveBeenCalled();
    });

    it('calls onChecklist with correct arguments when changed', async () => {
        const user = userEvent.setup();
        render(<CheckboxAction {...defaultProps} />);

        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);

        expect(mockOnChecklist).toHaveBeenCalledWith(true, mockNode);
    });

    it('applies correct styling', () => {
        render(<CheckboxAction {...defaultProps} />);
        const typography = screen.getByRole('checkbox').closest('p');
        expect(typography).toHaveStyle({ padding: 'unset' });
    });
});
