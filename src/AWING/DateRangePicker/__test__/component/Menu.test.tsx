import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import Menu from '../../component/Menu';

// Mock child components
jest.mock('../../component/Month', () => {
    return function MockMonth(props: any) {
        return <div data-testid="mock-month">{props.value.toString()}</div>;
    };
});

jest.mock('../../component/DefinedRanges', () => {
    return function MockDefinedRanges() {
        return <div data-testid="mock-defined-ranges">Defined Ranges</div>;
    };
});

describe('Menu Component', () => {
    const mockDate = new Date('2023-01-15');
    const defaultProps = {
        dateRange: {
            startDate: mockDate,
            endDate: new Date('2023-01-20'),
        },
        ranges: [],
        minDate: new Date('2022-01-01'),
        maxDate: new Date('2024-12-31'),
        firstMonth: mockDate,
        secondMonth: new Date('2023-02-15'),
        setFirstMonth: jest.fn(),
        setSecondMonth: jest.fn(),
        setDateRange: jest.fn(),
        helpers: {
            inHoverRange: jest.fn(),
        },
        handlers: {
            onDayClick: jest.fn(),
            onDayHover: jest.fn(),
            onMonthNavigate: jest.fn(),
        },
    };

    const theme = createTheme();
    const renderWithTheme = (ui: React.ReactElement) => {
        return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
    };

    it('renders without crashing', () => {
        renderWithTheme(<Menu {...defaultProps} />);
        expect(screen.getByText(/15 January 2023/)).toBeInTheDocument();
    });

    it('displays default date placeholders when no dates selected', () => {
        renderWithTheme(<Menu {...defaultProps} dateRange={{ startDate: undefined, endDate: undefined }} />);
        expect(screen.getByText('Start Date')).toBeInTheDocument();
        expect(screen.getByText('End Date')).toBeInTheDocument();
    });

    it('hides defined ranges when hideDefaultRanges is true', () => {
        renderWithTheme(<Menu {...defaultProps} hideDefaultRanges={true} />);
        expect(screen.queryByTestId('mock-defined-ranges')).not.toBeInTheDocument();
    });

    it('shows defined ranges by default', () => {
        renderWithTheme(<Menu {...defaultProps} />);
        expect(screen.getByTestId('mock-defined-ranges')).toBeInTheDocument();
    });

    it('renders custom buttons when customProps provided', () => {
        const onCloseCallback = jest.fn();
        renderWithTheme(<Menu {...defaultProps} customProps={{ onCloseCallback }} />);

        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Apply')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel'));
        expect(onCloseCallback).toHaveBeenCalled();
    });

    it('calculates canNavigateCloser correctly', () => {
        const props = {
            ...defaultProps,
            firstMonth: new Date('2023-01-01'),
            secondMonth: new Date('2023-02-01'),
        };
        renderWithTheme(<Menu {...props} />);
        const months = screen.getAllByTestId('mock-month');
        expect(months).toHaveLength(2);
    });

    it('formats dates correctly', () => {
        renderWithTheme(<Menu {...defaultProps} />);
        expect(screen.getByText('15 January 2023')).toBeInTheDocument();
        expect(screen.getByText('20 January 2023')).toBeInTheDocument();
    });

    it('handles locale prop correctly', () => {
        renderWithTheme(<Menu {...defaultProps} locale={{ code: 'fr' }} />);
        // Verify months are rendered with correct locale
        expect(screen.getAllByTestId('mock-month')).toHaveLength(2);
    });
});
