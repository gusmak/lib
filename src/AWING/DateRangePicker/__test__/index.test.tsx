import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import moment from 'moment';
import DateRangePicker from '../index';

// Mock child components
jest.mock('../DateRangeField', () => {
    return function MockDateRangeField(props: any) {
        return (
            <div data-testid="date-range-field" onClick={() => props.onClickDateRange({ current: <input /> })}>
                {props.label}
            </div>
        );
    };
});

jest.mock('../PickerModal', () => {
    return {
        PickerModal: function MockPickerModal(props: any) {
            return (
                <div
                    data-testid="picker-modal"
                    onClick={() =>
                        props.onChange({
                            startDate: new Date(2023, 0, 1),
                            endDate: new Date(2023, 0, 2),
                        })
                    }
                ></div>
            );
        },
    };
});

describe('DateRangePicker', () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
        onChange: mockOnChange,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<DateRangePicker {...defaultProps} />);
        expect(screen.getByTestId('date-range-field')).toBeInTheDocument();
    });

    it('displays label correctly', () => {
        const label = 'Date Range';
        render(<DateRangePicker {...defaultProps} label={label} />);
        expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('handles initial value correctly', () => {
        const value = {
            startDate: new Date(2023, 0, 1),
            endDate: new Date(2023, 0, 2),
        };
        render(<DateRangePicker {...defaultProps} value={value} />);
        expect(screen.getByTestId('date-range-field')).toBeInTheDocument();
    });

    it('handles date selection flow correctly', async () => {
        render(<DateRangePicker {...defaultProps} />);

        // Click to open modal
        const field = screen.getByTestId('date-range-field');
        act(() => {
            fireEvent.click(field);
        });

        // Simulate date selection
        const modal = screen.getByTestId('picker-modal');
        act(() => {
            fireEvent.click(modal);
        });

        // Verify onChange called with correct dates
        expect(mockOnChange).toHaveBeenCalledWith({
            startDate: new Date(2023, 0, 1),
            endDate: new Date(2023, 0, 2),
        });
    });

    it('applies options correctly', () => {
        const options = {
            minDate: new Date(2023, 0, 1),
            maxDate: new Date(2023, 11, 31),
            hideDefaultRanges: true,
            hideOutsideMonthDays: true,
        };
        render(<DateRangePicker {...defaultProps} options={options} />);
        expect(screen.getByTestId('picker-modal')).toBeInTheDocument();
    });
});
