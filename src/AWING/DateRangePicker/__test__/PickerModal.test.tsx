import { render, screen } from '@testing-library/react';
import { PickerModal } from '../PickerModal';

describe('PickerModal', () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
        modalProps: {
            open: true,
            anchorEl: null,
            onClose: () => {},
        },
        customProps: {},
        initialDateRange: { startDate: undefined, endDate: undefined },
        minDate: new Date('2023-01-01'),
        maxDate: new Date('2023-12-31'),
        onChange: mockOnChange,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<PickerModal {...defaultProps} />);
    });

    it('renders with custom props', () => {
        render(<PickerModal {...defaultProps} hideDefaultRanges={true} hideOutsideMonthDays={true} />);
    });

    it('handles null initialDateRange', () => {
        render(<PickerModal {...defaultProps} initialDateRange={undefined} />);
    });

    it('respects min and max date constraints', () => {
        render(<PickerModal {...defaultProps} minDate={new Date('2023-06-01')} maxDate={new Date('2023-06-30')} />);
    });
});
