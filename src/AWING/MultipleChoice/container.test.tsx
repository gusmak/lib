import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { USE_LOGIC_OPERATOR, DEFAULT_LOGIC_OPERATOR } from 'Commons/Constant';
import MultipleChoice from './container';

const mockOptions = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
];

const defaultProps = {
    label: 'Test Label',
    placeholder: 'Select options',
    options: mockOptions,
    onChange: jest.fn(),
    value: [],
    variant: 'outlined' as const,
    popupOpen: false,
};

describe('MultipleChoice Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<MultipleChoice {...defaultProps} />);
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Select options')).toBeInTheDocument();
    });

    it('displays initial value correctly', () => {
        const initialValue = [mockOptions[0]];
        render(<MultipleChoice {...defaultProps} value={initialValue} />);
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('handles selection changes', async () => {
        const onChange = jest.fn();
        render(<MultipleChoice {...defaultProps} onChange={onChange} />);

        const input = screen.getByRole('combobox');
        await userEvent.click(input);

        const option = screen.getByText('Option 1');
        await userEvent.click(option);

        expect(onChange).toHaveBeenCalledWith([mockOptions[0]]);
    });

    it('handles removal of selected options', async () => {
        const onChange = jest.fn();
        const initialValue = [mockOptions[0]];
        render(<MultipleChoice {...defaultProps} value={initialValue} onChange={onChange} />);

        const removeButton = screen.getByLabelText('Test Label');
        await userEvent.click(removeButton);
    });

    it('handles clear all', async () => {
        const onChange = jest.fn();
        const initialValue = [mockOptions[0], mockOptions[1]];
        render(<MultipleChoice {...defaultProps} value={initialValue} onChange={onChange} />);

        const clearButton = screen.getByLabelText('Clear');
        await userEvent.click(clearButton);

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it('displays error state correctly', () => {
        render(<MultipleChoice {...defaultProps} error={true} helperText="Error message" />);

        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('handles logic operator changes', async () => {
        const onEndAdornmentValueChange = jest.fn();
        render(
            <MultipleChoice
                {...defaultProps}
                endAdornmentOptions={USE_LOGIC_OPERATOR}
                onEndAdornmentValueChange={onEndAdornmentValueChange}
            />
        );

        const operatorSelect = screen.getByRole('button', { name: DEFAULT_LOGIC_OPERATOR[0].name });
        await userEvent.click(operatorSelect);

        const newOperator = screen.getByText(DEFAULT_LOGIC_OPERATOR[1].name);
        await userEvent.click(newOperator);

        expect(onEndAdornmentValueChange).toHaveBeenCalledWith(DEFAULT_LOGIC_OPERATOR[1].id);
    });

    it('updates when value prop changes', () => {
        const { rerender } = render(<MultipleChoice {...defaultProps} value={[]} />);

        rerender(<MultipleChoice {...defaultProps} value={[mockOptions[0]]} />);
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('handles popup open/close', async () => {
        render(<MultipleChoice {...defaultProps} />);

        const input = screen.getByRole('combobox');
        await userEvent.click(input);

        // Check if options are visible
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();

        // Click outside to close popup
        await userEvent.click(document.body);

        // Options should not be visible anymore
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('handles custom endAdornment options', async () => {
        const customOperators = [
            { id: 'custom1', name: 'Custom 1' },
            { id: 'custom2', name: 'Custom 2' },
        ];

        const onEndAdornmentValueChange = jest.fn();
        render(
            <MultipleChoice {...defaultProps} endAdornmentOptions={customOperators} onEndAdornmentValueChange={onEndAdornmentValueChange} />
        );

        const operatorSelect = screen.getByRole('button', { name: 'Custom 1' });
        await userEvent.click(operatorSelect);

        const newOperator = screen.getByText('Custom 2');
        await userEvent.click(newOperator);

        expect(onEndAdornmentValueChange).toHaveBeenCalledWith('custom2');
    });

    it('handles default value when no value is provided', () => {
        const defaultValue = [mockOptions[0]];
        render(<MultipleChoice {...defaultProps} value={undefined} defaultValue={defaultValue} />);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
});
