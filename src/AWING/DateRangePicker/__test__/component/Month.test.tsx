import { render, screen, fireEvent } from '@testing-library/react';
import moment from 'moment';
import Month from '../../component/Month';
import { NavigationAction } from '../../types';

describe('Month Component', () => {
    const defaultProps = {
        value: new Date('2024-01-15'),
        marker: Symbol('test'),
        dateRange: { startDate: null, endDate: null },
        minDate: new Date('2023-01-01'),
        maxDate: new Date('2024-12-31'),
        navState: [true, true] as [boolean, boolean],
        setValue: jest.fn(),
        helpers: {
            inHoverRange: jest.fn().mockReturnValue(false),
        },
        handlers: {
            onDayClick: jest.fn(),
            onDayHover: jest.fn(),
            onMonthNavigate: jest.fn(),
        },
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders with default weekdays', () => {
        render(<Month {...defaultProps} />);
        const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        weekDays.forEach((day) => {
            expect(screen.getByText(day)).toBeInTheDocument();
        });
    });

    test('renders with custom locale weekdays', () => {
        const locale = {
            code: 'fr',
            options: { weekStartsOn: 1 },
        };
        render(<Month {...defaultProps} locale={locale} />);
        const weekDays = moment.weekdaysShort(true);
        weekDays.forEach((day) => {
            expect(screen.getByText(day.substring(0, 2))).toBeInTheDocument();
        });
    });

    test('handles navigation clicks', () => {
        render(<Month {...defaultProps} />);

        const prevButton = screen.getByLabelText('Previous');
        const nextButton = screen.getByLabelText('Next');

        fireEvent.click(prevButton);
        expect(defaultProps.handlers.onMonthNavigate).toHaveBeenCalledWith(defaultProps.marker, NavigationAction.Previous);

        fireEvent.click(nextButton);
        expect(defaultProps.handlers.onMonthNavigate).toHaveBeenCalledWith(defaultProps.marker, NavigationAction.Next);
    });

    test('disables navigation based on navState', () => {
        render(<Month {...defaultProps} navState={[false, false]} />);

        const prevButton = screen.getByLabelText('Previous');
        const nextButton = screen.getByLabelText('Next');

        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });

    test('handles day click', () => {
        render(<Month {...defaultProps} />);

        const dayButton = screen.getByText('15');
        fireEvent.click(dayButton);

        expect(defaultProps.handlers.onDayClick).toHaveBeenCalled();
    });

    test('handles day hover', () => {
        render(<Month {...defaultProps} />);

        const dayButton = screen.getByText('15');
        fireEvent.mouseEnter(dayButton);

        expect(defaultProps.handlers.onDayHover).toHaveBeenCalled();
    });

    test('displays date range correctly', () => {
        const dateRange = {
            startDate: new Date('2024-01-10'),
            endDate: new Date('2024-01-20'),
        };
        render(<Month {...defaultProps} dateRange={dateRange} />);

        // Check if start date is marked
        const startDay = screen.getByText('10');
        expect(startDay.parentElement).toHaveAttribute('data-start-range', 'true');

        // Check if end date is marked
        const endDay = screen.getByText('20');
        expect(endDay.parentElement).toHaveAttribute('data-end-range', 'true');
    });

    test('disables dates outside min/max range', () => {
        const minDate = new Date('2024-01-15');
        const maxDate = new Date('2024-01-20');

        render(<Month {...defaultProps} minDate={minDate} maxDate={maxDate} />);

        // Day before min date should be disabled
        const disabledDay = screen.getByText('14');
        expect(disabledDay.parentElement).toHaveAttribute('aria-disabled', 'true');

        // Day within range should be enabled
        const enabledDay = screen.getByText('16');
        expect(enabledDay.parentElement).toHaveAttribute('aria-disabled', 'false');
    });
});
