import { ReactNode } from 'react';
import { Moment } from 'moment';
import { TYPE_FILTERS } from './Enums';

export interface QueryInputStatistics<F> extends Record<string, F> {}

export interface IControlPanel<F> {
    onChangeQueryInput: (input: QueryInputStatistics<F>) => void;
    initialFilters: FiltersType<F>[];
    isLoadings: boolean;
    disableView?: boolean;
}

export interface FiltersType<F> {
    type?: TYPE_FILTERS;
    name?: string;
    defaultValue?: F;
    initValue?: F;
    value?: F;
    onChange?: (value: F) => void;
    initialData?: {
        label?: string;
        value?: F;
    }[];
    isEnhanced?: boolean;
    isShowCalendarInfo?: boolean;
    isFutureDate?: boolean;
    isDayBlocked?: (day: Moment | null) => boolean;
    nodeElement?: React.ComponentType;
    disableMulti?: boolean;
    col?: number;
    component?: ReactNode;
    label?: string;
}
