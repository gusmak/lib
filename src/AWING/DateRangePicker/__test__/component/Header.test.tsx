import { render, fireEvent, screen } from '@testing-library/react';
import Header from 'AWING/DateRangePickerv2/component/Header';
import moment from 'moment';

// Header.test.tsx

// Mock moment
jest.mock('moment', () => {
    const mockMoment = (date: Date) => ({
        year: () => date.getFullYear(),
        month: () => date.getMonth(),
        format: (fmt: string) => {
            if (fmt === 'MMM') return ['Jan', 'Feb', 'Mar'][date.getMonth()] || 'Jan';
        },
        toDate: () => date,
    });
    mockMoment.locale = jest.fn();
    return mockMoment;
});

describe('Header Component', () => {
    const mockProps = {
        date: new Date(2023, 5, 15),
        setDate: jest.fn(),
        nextDisabled: false,
        prevDisabled: false,
        onClickNext: jest.fn(),
        onClickPrevious: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with default props', () => {
        render(<Header {...mockProps} />);

        expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(4); // 2 IconButtons + 2 Selects
    });

    it('disables previous/next buttons when specified', () => {
        render(<Header {...mockProps} nextDisabled={true} prevDisabled={true} />);

        expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    });

    it('calls onClickPrevious when previous button is clicked', () => {
        render(<Header {...mockProps} />);

        fireEvent.click(screen.getByRole('button', { name: /previous/i }));
        expect(mockProps.onClickPrevious).toHaveBeenCalledTimes(1);
    });

    it('calls onClickNext when next button is clicked', () => {
        render(<Header {...mockProps} />);

        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        expect(mockProps.onClickNext).toHaveBeenCalledTimes(1);
    });

    it('handles month change', () => {
        render(<Header {...mockProps} />);

        const monthSelect = screen.getAllByRole('button')[1];
        fireEvent.mouseDown(monthSelect);

        const monthOption = screen.getByText('Feb');
        fireEvent.click(monthOption);

        expect(mockProps.setDate).toHaveBeenCalled();
    });

    it('handles year change', () => {
        render(<Header {...mockProps} />);

        const yearSelect = screen.getAllByRole('button')[2];
        fireEvent.mouseDown(yearSelect);

        const yearOption = screen.getByText('2024');
        fireEvent.click(yearOption);

        expect(mockProps.setDate).toHaveBeenCalled();
    });

    it('uses custom locale when provided', () => {
        render(<Header {...mockProps} locale="fr" />);
        expect(moment.locale).toHaveBeenCalled();
    });
});

// describe('generateYears utility', () => {
//     it('generates correct year range', () => {
//         const date = new Date(2023, 0, 1)
//         const years = generateYears(date, 5)

//         expect(years).toHaveLength(5)
//         expect(years).toContain(2023)
//         expect(Math.min(...years)).toBe(2021)
//         expect(Math.max(...years)).toBe(2025)
//     })
// })
