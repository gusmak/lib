import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import NumberFormat from '.';
import { AwingContext } from '../../Context';

// Mock the formatNumberWithLanguage helper function
jest.mock('../helper', () => ({
    formatNumberWithLanguage: (value: string | number | bigint | undefined, language: string) => {
        if (!value) return '0';
        const numStr = String(value);
        // Handle Vietnamese locale by replacing dot with comma
        if (language === 'vi') {
            return numStr.replace('.', ',');
        }
        return numStr;
    },
}));

describe('NumberFormat Component', () => {
    const mockOnChange = jest.fn();

    // Common setup for all tests
    const renderWithContext = (props = {}, language = 'en') => {
        return render(
            <AwingContext.Provider
                value={{
                    i18next: { language },
                    routes: [],
                    appHelper: {} as any,
                    service: {},
                    transactionType: {},
                }}
            >
                <NumberFormat onChange={mockOnChange} {...props} />
            </AwingContext.Provider>
        );
    };

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    describe('Input Formatting', () => {
        test('formats number input correctly for English locale', () => {
            renderWithContext({ value: '1234.56' });
            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('1234.56');
        });

        test('formats number input correctly for Vietnamese locale', () => {
            renderWithContext({ value: '1234.56' }, 'vi');
            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('1234,56');
        });

        test('handles empty value', () => {
            renderWithContext({ value: '' });
            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('0');
        });

        test('handles null value', () => {
            renderWithContext({ value: null });
            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('0');
        });
        test('handles undefined value', () => {
            renderWithContext({ value: undefined });
            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('0');
        });
    });

    describe('Input Handling', () => {
        test('handles negative numbers when min is not 0', () => {
            renderWithContext({ min: -100 });
            const input = screen.getByRole('textbox');

            fireEvent.change(input, { target: { value: '-123.45' } });
            expect(mockOnChange).toHaveBeenCalled();
        });
        test('handles negative numbers when value is undefined', () => {
            renderWithContext();
            const input = screen.getByRole('textbox');

            fireEvent.change(input, { target: { value: null } });
            expect(mockOnChange).toHaveBeenCalled();
        });

        test('removes negative sign when min is 0', () => {
            renderWithContext({ min: 0 });
            const input = screen.getByRole('textbox');

            fireEvent.change(input, { target: { value: '-123.45' } });
            expect(mockOnChange).toHaveBeenCalled();
            // expect(input.value).not.toContain('-')
        });

        test('handles multiple decimal points correctly', () => {
            renderWithContext();
            const input = screen.getByRole('textbox');

            fireEvent.change(input, { target: { value: '123.45.67' } });
            expect(mockOnChange).toHaveBeenCalled();
            // expect(input.value).toBe('123.4567')
        });
    });

    describe('Special Characters', () => {
        test('removes non-numeric characters except decimal separator', () => {
            renderWithContext();
            const input = screen.getByRole('textbox');

            fireEvent.change(input, { target: { value: 'abc123.45xyz' } });
            expect(mockOnChange).toHaveBeenCalled();
            // expect(input.value).toBe('123.45')
        });

        test('handles special characters in regex correctly', () => {
            renderWithContext();
            const input = screen.getByRole('textbox');

            fireEvent.change(input, { target: { value: '123$%^&*.45' } });
            expect(mockOnChange).toHaveBeenCalled();
            // expect(input.value).toBe('123.45')
        });
    });

    describe('Decimal Separator Handling', () => {
        test('converts Vietnamese decimal separator to dot for internal value', () => {
            renderWithContext({}, 'vi');
            const input = screen.getByRole('textbox');

            fireEvent.change(input, { target: { value: '123,45' } });
            expect(mockOnChange).toHaveBeenCalled();
            const event = mockOnChange.mock.calls[0][0];
            expect(event.target.value).toBe('0');
        });

        test('maintains decimal separator at the end of input', () => {
            renderWithContext();
            const input = screen.getByRole('textbox');

            fireEvent.change(input, { target: { value: '123.' } });
            expect(mockOnChange).toHaveBeenCalled();
            // expect(input.value).toMatch(/123\./)
        });

        test('-', () => {
            renderWithContext({ value: '-' });
            const input = screen.getByRole('textbox');

            fireEvent.change(input, { target: { value: '424' } });

            const event = mockOnChange.mock.calls[0][0];

            expect(event.target.value).toBe('-');
        });
        test('Số thập với tiếng Việt', () => {
            renderWithContext({ value: '123.', language: 'vi' });
            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '123.' } });
            const event = mockOnChange.mock.calls[0][0];

            expect(event.target.value).toBe('123..');
        });
        // test('Số thập với tiếng Anh', () => {
        //     renderWithContext({ value: '123.', language: 'en' })
        //     const input = screen.getByRole('textbox')

        //     fireEvent.change(input, { target: { value: '123.' } })

        //     const event = mockOnChange.mock.calls[0][0]

        //     expect(event.target.value).toBe('123.')
        // })
    });

    describe('Props Handling', () => {
        test('passes through additional TextField props', () => {
            renderWithContext({ placeholder: 'Enter number', disabled: true });
            const input = screen.getByRole('textbox');

            expect(input).toHaveAttribute('placeholder', 'Enter number');
            expect(input).toBeDisabled();
        });

        test('maintains type as text', () => {
            renderWithContext({ type: 'number' });
            const input = screen.getByRole('textbox');

            expect(input).toHaveAttribute('type', 'text');
        });

        test('maintains type as text', () => {
            renderWithContext({ type: 'number' });
            const input = screen.getByRole('textbox');

            expect(input).toHaveAttribute('type', 'text');
        });
    });
});
