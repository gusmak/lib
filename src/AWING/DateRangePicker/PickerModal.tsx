import { Popover } from '@mui/material';
import DateRangePickerComponent from './component/DateRangePicker';
import type { PickerModalProps } from './types';

export const PickerModal = ({ modalProps, customProps, initialDateRange, minDate, maxDate, ...dateRangePickerProps }: PickerModalProps) => {
    return (
        <Popover {...modalProps}>
            <DateRangePickerComponent
                open={modalProps.open}
                initialDateRange={initialDateRange}
                customProps={customProps}
                onChange={dateRangePickerProps.onChange ?? (() => {})}
                minDate={minDate}
                maxDate={maxDate}
                hideDefaultRanges={dateRangePickerProps.hideDefaultRanges}
                hideOutsideMonthDays={dateRangePickerProps.hideOutsideMonthDays}
            />
        </Popover>
    );
};
