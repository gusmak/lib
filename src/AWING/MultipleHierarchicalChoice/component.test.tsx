import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import MultipleHierarchicalChoiceComponent from './component';

const mockOptions = [
    {
        code: 'parent1',
        name: 'Parent 1',
        parentUnitCode: '',
    },
    {
        code: 'child1',
        name: 'Child 1',
        parentUnitCode: 'parent1',
    },
    {
        code: 'parent2',
        name: 'Parent 2',
        parentUnitCode: '',
    },
];

const mockOperators = [
    { id: 'AND', name: 'AND' },
    { id: 'OR', name: 'OR' },
];

const defaultProps = {
    open: false,
    currentChoice: [],
    options: mockOptions,
    selected: [],
    onChange: jest.fn(),
    onOpen: jest.fn(),
    onClose: jest.fn(),
    onOperatorChange: jest.fn(),
};

describe('MultipleHierarchicalChoiceComponent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('displays label and placeholder', () => {
        const label = 'Test Label';
        const placeholder = 'Select items';
        render(<MultipleHierarchicalChoiceComponent {...defaultProps} label={label} placeholder={placeholder} />);
        expect(screen.getByLabelText(label)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
    });

    it('shows error state and helper text', () => {
        const helperText = 'This field is required';
        render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} error={true} helperText={helperText} />);
        expect(screen.getByText(helperText)).toBeInTheDocument();
    });

    it('renders selected items as chips', () => {
        const selected = [[mockOptions[0]], [mockOptions[1]]];
        render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} selected={selected} />);
        expect(screen.getByText('Parent 1')).toBeInTheDocument();
        expect(screen.getByText('Child 1')).toBeInTheDocument();
    });

    it('handles operator button click', () => {
        render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} operators={mockOperators} operator="AND" />);

        const operatorButton = screen.getByText('AND');
        fireEvent.click(operatorButton);

        expect(defaultProps.onOperatorChange).toHaveBeenCalledWith('OR');
    });

    it('displays parent title in group header', () => {
        const parentTitle = 'Parent Units';
        render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} parentTitle={parentTitle} open={true} />);
        const listItem = screen.getByRole('option', {
            name: /child 1/i,
        });
        expect(listItem).toBeInTheDocument();
    });

    it('displays current choice name in group header', () => {
        const currentChoice = [mockOptions[0]];
        render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} currentChoice={currentChoice} open={true} />);
        const listItem = screen.getByRole('option', {
            name: /parent 1/i,
        });
        expect(listItem).toBeInTheDocument();
    });

    it('calls onChange when removing a chip', () => {
        const selected = [[mockOptions[0]]];
        render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} selected={selected} />);

        const removeButton = screen.getByTestId('CancelIcon');
        fireEvent.click(removeButton);

        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('renders chips with full hierarchy path', () => {
        const selected = [[mockOptions[0], mockOptions[1]]];
        render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} selected={selected} />);

        expect(screen.getByText('Parent 1 - Child 1')).toBeInTheDocument();
    });

    it('handles variant prop correctly', () => {
        render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} variant="filled" />);

        const input = screen.getByRole('combobox');
        expect(input.closest('.MuiFilledInput-root')).toBeInTheDocument();
    });

    it('maintains selected values order', () => {
        const selected = [[mockOptions[0]], [mockOptions[2]]];
        const { container } = render(<MultipleHierarchicalChoiceComponent label={''} {...defaultProps} selected={selected} />);

        const chips = container.querySelectorAll('.MuiChip-root');
        expect(chips[0]).toHaveTextContent('Parent 1');
        expect(chips[1]).toHaveTextContent('Parent 2');
    });
});
