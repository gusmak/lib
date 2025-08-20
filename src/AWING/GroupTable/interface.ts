export interface HeadCell {
    label: string;
    field: string;
    isGrouping: boolean;
    isFixed: boolean;
    getDisplay?: (info: any) => any;
    isDisplayTotal?: boolean;
    sort?: 'ready' | 'asc' | 'desc';
    numberic?: boolean;
}

export interface GroupFilter {
    field: string;
    value: any;
}

export interface GroupTableProps<T extends object> {
    headCells: HeadCell[];
    filters: GroupFilter[];
    onGetData: (groupFilters: GroupFilter[], pageIndex: number, pageSize: number) => Promise<{ data: T[]; totalCount: number }>;
    onRowClicked?: (rowInfo: T) => void;
    customRow?: T | React.ComponentType<RowProps<T>>;
}

export interface GroupComponentProps<T extends object> extends GroupTableProps<T> {
    displayData: T & { groupIndex: number };
}

export interface RowProps<T extends object> {
    info: T & { rowIndex: number };
    headCells: HeadCell[];
    onRowClicked?: (rowInfo: T) => void;
}
