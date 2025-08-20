import { fireEvent, render, screen } from '@testing-library/react';
import MultipleChoiceComponent from './component';
import { IMultipleChoiceComponentProps } from './interface';

const mockProps: IMultipleChoiceComponentProps = {
    label: 'Test Label',
    selected: [],
    options: [
        { id: '1', name: 'Option 1' },
        { id: '2', name: 'Option 2' },
    ],
    onChange: jest.fn(),
    popupOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
    variant: 'outlined',
    placeholder: 'Select options',
    error: false,
    helperText: '',
    operators: [
        { id: 'equals', name: '=' },
        { id: 'notEquals', name: '!=' },
    ],
    operator: 'equals',
    onOperatorChange: jest.fn(),
};

describe('MultipleChoiceComponent', () => {
    it('renders without crashing', () => {
        render(<MultipleChoiceComponent {...mockProps} />);
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('displays the correct placeholder', () => {
        render(<MultipleChoiceComponent {...mockProps} />);
        expect(screen.getByPlaceholderText('Select options')).toBeInTheDocument();
    });

    it('calls onOpen when the autocomplete is opened', () => {
        render(<MultipleChoiceComponent {...mockProps} />);
        fireEvent.mouseDown(screen.getByLabelText('Test Label'));
        expect(mockProps.onOpen).toHaveBeenCalled();
    });

    it('calls onClose when the autocomplete is closed', () => {
        render(<MultipleChoiceComponent {...mockProps} />);
        fireEvent.mouseDown(screen.getByLabelText('Test Label'));
        fireEvent.keyDown(document, { key: 'Escape' });
    });

    it('renders options correctly', () => {
        render(<MultipleChoiceComponent {...mockProps} popupOpen={true} />);
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('calls onChange when an option is selected', () => {
        render(<MultipleChoiceComponent {...mockProps} popupOpen={true} />);
        fireEvent.click(screen.getByText('Option 1'));
        expect(mockProps.onChange).toHaveBeenCalled();
    });

    it('displays the operator button and changes operator on click', () => {
        render(<MultipleChoiceComponent {...mockProps} />);
        const operatorButton = screen.getByText('=');
        expect(operatorButton).toBeInTheDocument();
        fireEvent.click(operatorButton);
        expect(mockProps.onOperatorChange).toHaveBeenCalledWith('notEquals');
    });

    it('displays error message when error is true', () => {
        render(<MultipleChoiceComponent {...mockProps} error={true} helperText="Error message" />);
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('operator is empty', async () => {
        render(<MultipleChoiceComponent {...mockProps} operator={undefined} />);
    });

    it('renders tags correctly', () => {
        render(<MultipleChoiceComponent {...mockProps} selected={[{ id: '1', name: 'Option 1' }]} />);
        const chip = screen.getByText('Option 1');
        expect(chip).toBeInTheDocument();
    });

    it('renders multiple tags correctly', () => {
        render(
            <MultipleChoiceComponent
                {...mockProps}
                selected={[
                    { id: '1', name: 'Option 1' },
                    { id: '2', name: 'Option 2' },
                ]}
            />
        );
        const chip1 = screen.getByText('Option 1');
        expect(chip1).toBeInTheDocument();
    });
});
