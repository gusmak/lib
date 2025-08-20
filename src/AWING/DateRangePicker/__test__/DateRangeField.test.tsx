import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import moment from 'moment';
import DateRangeField from '../DateRangeField';
import userEvent from '@testing-library/user-event';

describe('DateRangeField', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    describe('Initial Rendering', () => {
        it('renders with default props', () => {
            render(<DateRangeField />);
            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('DD/MM/YYYY - DD/MM/YYYY');
        });

        it('renders with custom label', () => {
            render(<DateRangeField label="Custom Label" />);
            expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
        });

        it('renders with initial value', () => {
            const initialValue = {
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
            };
            render(<DateRangeField value={initialValue} />);
            expect(screen.getByRole('textbox')).toHaveValue('01/01/2023 - 31/12/2023');
        });
    });

    describe('Input Handling', () => {
        it('handles valid date input', async () => {
            const onChange = jest.fn();
            render(<DateRangeField onChange={onChange} />);
            const input = screen.getByRole('textbox') as HTMLInputElement;

            // Simulate typing a valid date
            act(() => {
                fireEvent.click(input);
                userEvent.type(input, '01');
                jest.runAllTimers();
            });

            expect((input as HTMLInputElement).selectionStart).toBe(3);
            expect((input as HTMLInputElement).selectionEnd).toBe(5);
        });

        it('shows error for invalid date', () => {
            render(<DateRangeField />);
            const input = screen.getByRole('textbox');

            act(() => {
                fireEvent.change(input, { target: { value: '32/13/2023 - DD/MM/YYYY' } });
            });

            expect(screen.getByText('Ngày không hợp lệ')).toBeInTheDocument();
        });

        it('shows error when end date is before start date', () => {
            render(<DateRangeField />);
            const input = screen.getByRole('textbox');

            act(() => {
                fireEvent.change(input, { target: { value: '01/01/2023 - 01/01/2022' } });
            });

            expect(screen.getByText('Ngày kết thúc phải sau ngày khởi đầu')).toBeInTheDocument();
        });
    });

    describe('Navigation', () => {
        it('handles arrow key navigation', () => {
            render(<DateRangeField />);
            const input = screen.getByRole('textbox');

            act(() => {
                fireEvent.click(input);
                fireEvent.keyDown(input, { key: 'ArrowRight' });
                jest.runAllTimers();
            });

            expect((input as HTMLInputElement).selectionStart).toBe(3);
            expect((input as HTMLInputElement).selectionEnd).toBe(5);
        });
    });

    describe('Calendar Icon', () => {
        it('calls onClickDateRange when calendar icon is clicked', () => {
            const onClickDateRange = jest.fn();
            render(<DateRangeField onClickDateRange={onClickDateRange} />);

            const calendarButton = screen.getByTestId('CalendarTodayIcon').parentElement;
            fireEvent.click(calendarButton!);

            expect(onClickDateRange).toHaveBeenCalled();
        });
    });

    describe('Date Updates', () => {
        it('updates when valueDateRangePicker changes', () => {
            const { rerender } = render(<DateRangeField />);

            const newValue = {
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
            };

            rerender(<DateRangeField valueDateRangePicker={newValue} />);

            expect(screen.getByRole('textbox')).toHaveValue('01/01/2023 - 31/12/2023');
        });

        it('calls onChange with valid dates', () => {
            const onChange = jest.fn();
            render(<DateRangeField onChange={onChange} />);
            const input = screen.getByRole('textbox');

            act(() => {
                fireEvent.change(input, { target: { value: '01/01/2023 - 31/12/2023' } });
            });

            expect(onChange).toHaveBeenCalledWith(moment('01/01/2023', 'DD/MM/YYYY'), moment('31/12/2023', 'DD/MM/YYYY'));
        });
    });

    describe('Input Selection', () => {
        it('selects correct segments when clicking', () => {
            render(<DateRangeField />);
            const input = screen.getByRole('textbox') as HTMLInputElement;

            // Click at start day position
            act(() => {
                fireEvent.click(input, { target: { selectionStart: 0 } });
            });

            expect(input.selectionStart).toBe(0);
            expect(input.selectionEnd).toBe(2);

            // Click at end year position
            act(() => {
                fireEvent.click(input, { target: { selectionStart: 20 } });
            });

            expect(input.selectionStart).toBe(19);
            expect(input.selectionEnd).toBe(23);
        });
    });
});
