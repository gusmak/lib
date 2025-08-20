import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import LogicExpression from './index';
import { ObjectStructure, FunctionStructure } from './types';
import { getSuggestionsAndValidaton } from './utils';

// Mock the getSuggestionsAndValidaton helper function
jest.mock('./utils', () => ({
    __esModule: true,
    getSuggestionsAndValidaton: jest.fn(),
}));

describe('LogicExpressionInput Component', () => {
    const mockOnChange = jest.fn();
    const objectStructures: ObjectStructure[] = [];
    const functionStructures: FunctionStructure[] = [];

    beforeEach(() => {
        (getSuggestionsAndValidaton as jest.Mock).mockImplementation(
            (inputValue: string, objectStructures: ObjectStructure[], functionStructures: FunctionStructure[]) => ({
                suggestions: ['suggestion1', 'suggestion2'],
                isValid: inputValue !== 'error',
            })
        );
    });

    // Common setup for all tests
    const renderWithContext = (props = {}) => {
        return render(
            <LogicExpression
                value=""
                objectStructures={objectStructures}
                functionStructures={functionStructures}
                onChange={mockOnChange}
                {...props}
            />
        );
    };

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    test('renders with initial value', () => {
        renderWithContext({ value: 'initial value' });
        const input = screen.getByRole('combobox');
        expect(input).toHaveValue('initial value');
    });

    test('calls onChange with new value and validity', () => {
        renderWithContext();
        const input = screen.getByRole('combobox');

        input.focus();
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(input).toHaveValue('new value');
        expect(mockOnChange).toHaveBeenCalledWith('new value', true);
    });

    test('updates suggestions based on input value', () => {
        renderWithContext();
        // const input = screen.getByRole('combobox')

        // fireEvent.change(input, { target: { value: 'new value' } })
        // fireEvent.mouseDown(input.parentNode);
        // input.parentNode?.focus();

        // const listoptions = screen.getByRole('listbox')
        // expect(listoptions.childNodes.length).toBe(2)

        const input = screen.getByRole('combobox');
        input.parentElement!.focus();
        fireEvent.change(input, { target: { value: 's' } });
        fireEvent.keyDown(input.parentElement!, { key: 'ArrowDown' });
        fireEvent.keyDown(input.parentElement!, { key: 'ArrowDown' });
        fireEvent.keyDown(input.parentElement!, { key: 'Enter' });

        expect(input).toHaveValue('ssuggestion2');
    });

    test('displays error when input is invalid', () => {
        renderWithContext();
        const input = screen.getByRole('combobox');

        fireEvent.change(input, { target: { value: 'error' } });
        expect(input.parentNode).toHaveClass('Mui-error');
    });

    test('does not display error when input is valid', () => {
        renderWithContext();
        const input = screen.getByRole('combobox');

        fireEvent.change(input, { target: { value: 'valid value' } });
        expect(input.parentNode).not.toHaveClass('Mui-error');
    });
});
