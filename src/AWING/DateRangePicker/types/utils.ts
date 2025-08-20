import type { SvgIconProps } from '@mui/material';
import type { ElementType } from 'react';
import type { Labels } from '.';

export type DefinedRange = {
    startDate: Date;
    endDate: Date;
    label: string;
};

export type DateRange = {
    startDate?: Date;
    endDate?: Date;
};

export type RangeSeparatorIconsProps = {
    xs?: ElementType<SvgIconProps>;
    md?: ElementType<SvgIconProps>;
};

export type PickerProps = {
    initialDateRange?: DateRange;
    definedRanges?: DefinedRange[];
    minDate?: Date | string;
    maxDate?: Date | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locale?: any;
    labels?: Labels;
    onChange?: (dateRange: DateRange) => void;

    hideDefaultRanges?: boolean;
    hideOutsideMonthDays?: boolean;
};

export type ModalCustomProps = {
    value?: DateRange;
    onSubmit?: (dateRange: DateRange) => void;
    onCloseCallback?: () => void;
    RangeSeparatorIcons?: RangeSeparatorIconsProps;
    hideActionButtons?: boolean;
};
