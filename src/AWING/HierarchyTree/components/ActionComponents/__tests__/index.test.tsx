import { render, screen } from '@testing-library/react';
import { NodeStatus } from 'AWING/HierarchyTree/interface';
import ActionComponents from '..';

describe('ActionComponents', () => {
    const mockTreeNode = { nodeId: '1', name: 'Test Node', status: NodeStatus.Checked, children: [] };
    const mockActions = [{ icon: <span>✓</span>, tooltip: 'Action 1', action: () => {} }];
    const mockOnChecklist = jest.fn();

    it('should render null when actionProps is not provided', () => {
        const { container } = render(<ActionComponents treeNode={mockTreeNode} actionProps={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render with correct classes', () => {
        const { container } = render(
            <ActionComponents treeNode={mockTreeNode} actionProps={{ actions: mockActions }} />
        );
        const actionsDiv = container.firstChild;
        expect(actionsDiv).toHaveStyle({
            display: 'flex',
            alignItems: 'center',
        });
    });

    it('should render CheckboxAction when onChecklist prop is provided', () => {
        render(<ActionComponents treeNode={mockTreeNode} actionProps={{ onChecklist: mockOnChecklist }} />);

        const inputCheckbox = screen.getByRole('checkbox');
        expect(inputCheckbox).toBeInTheDocument();
    });

    it.skip('should render both IconActions and CheckboxAction when both props are provided', () => {
        const { getByTestId } = render(
            <ActionComponents
                treeNode={mockTreeNode}
                actionProps={{
                    actions: mockActions,
                    onChecklist: mockOnChecklist,
                }}
            />
        );
        expect(getByTestId('icon-actions')).toBeInTheDocument();
        expect(getByTestId('checkbox-action')).toBeInTheDocument();
    });
});
