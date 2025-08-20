import type { PopoverProps } from '@mui/material/Popover';
import type { PickerProps, ModalCustomProps } from './utils';

export type PickerModalProps = PickerProps & {
    modalProps: PopoverProps;
    customProps?: ModalCustomProps;
};

export type Labels = {
    predefinedRanges?: string;
    actions?: {
        apply?: string;
        cancel?: string;
    };
    footer?: {
        startDate?: string;
        endDate?: string;
    };
};

export type DefinedRange = {
    startDate: Date;
    endDate: Date;
    label: string;
};

export interface DateRange {
    startDate?: Date;
    endDate?: Date;
}

export type Setter<T> = React.Dispatch<React.SetStateAction<T>> | ((value: T) => void);

export enum NavigationAction {
    Previous = -1,

    Next = 1,
}

export interface OptionsDateRangePickerProps {
    minDate?: Date;
    maxDate?: Date;
    hideDefaultRanges?: boolean;
    hideOutsideMonthDays?: boolean;
}
