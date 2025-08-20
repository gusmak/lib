import { render, fireEvent } from '@testing-library/react';
import moment from 'moment';
import { ThemeProvider, createTheme } from '@mui/material';
import { DateRange, DefinedRange } from 'AWING/DateRangePickerv2/types';
import DefinedRanges from 'AWING/DateRangePickerv2/component/DefinedRanges';

// Mock moment to ensure consistent dates in tests
jest.mock('moment', () => {
    const mockMoment = (date: Date) => ({
        isSame: (other: Date, unit: string) => date.getTime() === other.getTime(),
    });
    return mockMoment;
});

describe('DefinedRanges', () => {
    const theme = createTheme();
    const mockDate1 = new Date('2023-01-01');
    const mockDate2 = new Date('2023-01-07');
    const mockDate3 = new Date('2023-01-14');

    const mockRanges: DefinedRange[] = [
        {
            label: 'Last 7 days',
            startDate: mockDate1,
            endDate: mockDate2,
        },
        {
            label: 'Last 14 days',
            startDate: mockDate1,
            endDate: mockDate3,
        },
    ];

    const defaultProps = {
        ranges: mockRanges,
        setRange: jest.fn(),
        selectedRange: {
            startDate: mockDate1,
            endDate: mockDate2,
        },
    };

    const setup = (props = {}) => {
        const finalProps = { ...defaultProps, ...props };
        return render(
            <ThemeProvider theme={theme}>
                <DefinedRanges {...finalProps} />
            </ThemeProvider>
        );
    };

    it('renders all provided ranges', () => {
        const { getAllByRole } = setup();
        const listItems = getAllByRole('listitem');
        expect(listItems).toHaveLength(mockRanges.length);
    });

    it('displays correct labels', () => {
        const { getByText } = setup();
        mockRanges.forEach((range) => {
            expect(getByText(range.label)).toBeInTheDocument();
        });
    });

    it('calls setRange when clicking a range', () => {
        const setRange = jest.fn();
        const { getAllByRole } = setup({ setRange });

        fireEvent.click(getAllByRole('button')[0]);
        expect(setRange).toHaveBeenCalledWith(mockRanges[0]);
    });

    it('applies selected styling to matching range', () => {
        const { getAllByRole } = setup();
        const listItems = getAllByRole('listitem');

        // First item should have dark background (selected)
        expect(listItems[0]).toHaveStyle({
            backgroundColor: theme.palette.primary.dark,
        });

        // Second item should not have dark background
        expect(listItems[1]).not.toHaveStyle({
            backgroundColor: theme.palette.primary.dark,
        });
    });

    describe('isSameRange', () => {
        it('returns true for identical ranges', () => {
            const range1: DateRange = {
                startDate: mockDate1,
                endDate: mockDate2,
            };
            const range2: DateRange = {
                startDate: mockDate1,
                endDate: mockDate2,
            };
            const { container } = setup({ selectedRange: range1 });
            expect(container).toBeInTheDocument();
        });

        it('returns false for different ranges', () => {
            const range1: DateRange = {
                startDate: mockDate1,
                endDate: mockDate2,
            };
            const range2: DateRange = {
                startDate: mockDate1,
                endDate: mockDate3,
            };
            const { container } = setup({ selectedRange: range1 });
            expect(container).toBeInTheDocument();
        });

        it('returns false when dates are null', () => {
            const range1: DateRange = {
                startDate: undefined,
                endDate: undefined,
            };
            const range2: DateRange = {
                startDate: mockDate1,
                endDate: mockDate2,
            };
            const { container } = setup({ selectedRange: range1 });
            expect(container).toBeInTheDocument();
        });
    });
});
