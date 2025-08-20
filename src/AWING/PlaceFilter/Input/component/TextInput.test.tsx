import { render, fireEvent, screen } from '@testing-library/react';
import { renderTextInput } from './TextInput';
import '@testing-library/jest-dom';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';

describe('TextInput Component', () => {
    const mockOnChange = jest.fn();
    const mockFilterField: any = {
        value: '',
        label: 'Test Label',
        placeHolders: ['Test Placeholder'],
        style: { icon: undefined, gridSize: 12 },
        type: EnumFieldInputType.TEXT,
        name: 'test',
        isAdvanceField: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with correct label and placeholder', () => {
        render(
            renderTextInput({
                filterField: mockFilterField,
                onChange: mockOnChange,
                index: 0,
            })
        );

        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('updates value on user input', () => {
        render(
            renderTextInput({
                filterField: mockFilterField,
                onChange: mockOnChange,
                index: 0,
            })
        );

        const input = screen.getByLabelText('Test Label');
        fireEvent.change(input, { target: { value: 'test input' } });
        expect(input).toHaveValue('test input');
    });

    it('calls onChange when Enter is pressed', () => {
        render(
            renderTextInput({
                filterField: mockFilterField,
                onChange: mockOnChange,
                index: 0,
            })
        );

        const input = screen.getByLabelText('Test Label');
        fireEvent.change(input, { target: { value: 'test input' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(mockOnChange).toHaveBeenCalledWith('test input', 0);
    });

    it('updates when filterField value changes', () => {
        const { rerender } = render(
            renderTextInput({
                filterField: mockFilterField,
                onChange: mockOnChange,
                index: 0,
            })
        );

        const updatedFilterField = {
            ...mockFilterField,
            value: 'new value',
        };

        rerender(
            renderTextInput({
                filterField: updatedFilterField,
                onChange: mockOnChange,
                index: 0,
            })
        );

        expect(screen.getByLabelText('Test Label')).toHaveValue('new value');
    });
});
