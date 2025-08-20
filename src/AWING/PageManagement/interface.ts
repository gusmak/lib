import { ReactNode } from 'react';
import type { AdvancedSearchField } from '../AdvancedSearch';
import type { DataGridProps, GridSortModel } from '../DataGrid/interface';
import type { SearchBoxProps } from '../SearchBox/interface';

export interface QueryInput<T = object> {
    id?: string;
    searchString?: string;
    pageSize?: number;
    pageIndex?: number;
    sortModel?: GridSortModel[];
    advancedObject?: T;
}

export interface CombinedProps<T> extends DataGridProps<T>, Omit<SearchBoxProps, 'rows' | 'onSearch'> {
    rows: DataGridProps<T>['rows'];
}

export interface PageManagementProps<T> extends CombinedProps<T> {
    title: string;
    checkboxSelection?: boolean;
    onDeleteSelected?: (ids: string[]) => Promise<void>;
    advancedSearchFields?: AdvancedSearchField[];
    disableSearch?: boolean;
    disablePagination?: boolean;
    onChangeQueryInput: (input: QueryInput) => void;
    loading: boolean;
    onCreateButtonClick?: () => void;
    onCreateFolderButtonClick?: () => void;
    onDelete?: (id: ReturnType<NonNullable<this['getRowId']>>) => Promise<void>;
    showNotificationSuccess?: () => void;
    confirmDelete?: (f: () => void) => void;
    customActions?: ReactNode;
}
