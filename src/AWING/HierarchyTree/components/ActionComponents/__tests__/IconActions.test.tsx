import { render, screen, fireEvent } from '@testing-library/react';
import { IconActionsProps, NodeStatus } from 'AWING/HierarchyTree/interface';
import IconActions from '../IconActions';

jest.mock('@mui/material', () => ({
    IconButton: (props: any) => <button {...props} />,
    Tooltip: ({ children, title }: any) => <div title={title}>{children}</div>,
}));

describe('IconActions Component', () => {
    const mockTreeNode = {
        id: '1',
        name: 'Test Node',
        nodeId: '1',
        status: NodeStatus.Checked,
        children: [],
    };
    const mockAction = jest.fn();

    const defaultProps: IconActionsProps = {
        treeNode: mockTreeNode,
        actions: [
            {
                icon: <span>Icon1</span>,
                action: mockAction,
                tooltip: 'Test Tooltip',
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render null when no actions provided', () => {
        const { container } = render(<IconActions treeNode={mockTreeNode} actions={[]} />);
    });

    it('should render correct number of action buttons', () => {
        const props = {
            ...defaultProps,
            actions: [
                { icon: <span>Icon1</span>, action: mockAction },
                { icon: <span>Icon2</span>, action: mockAction, tooltip: 'Tooltip 2', isShouldHideAction: () => false },
            ],
        };
        render(<IconActions {...props} />);
    });

    it('should hide action based on isShouldHideAction', () => {
        const props = {
            ...defaultProps,
            actions: [
                {
                    icon: <span>Icon1</span>,
                    action: mockAction,
                    tooltip: 'Tooltip',
                    isShouldHideAction: () => true,
                },
            ],
        };
        const { container } = render(<IconActions {...props} />);
        expect(container.querySelector('button')).toBeNull();
    });

    it('should call action and stop propagation on click', () => {
        render(<IconActions {...defaultProps} />);
        const button = screen.getByText('Icon1');
        const mockEvent = { stopPropagation: jest.fn() };

        fireEvent.click(button, mockEvent);

        expect(mockAction).toHaveBeenCalledWith(mockTreeNode);
    });

    it('should render tooltip with correct text', () => {
        render(<IconActions {...defaultProps} />);
        const tooltipContainer = screen.getByTitle('Test Tooltip');
        expect(tooltipContainer).toBeInTheDocument();
    });
});
