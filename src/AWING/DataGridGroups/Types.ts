import { DataGridSortType } from 'Commons/Enums';
import { ReactNode } from 'react';

export type Cell<FieldName> = {
    fieldName: FieldName;
    label: string;
    draggable?: boolean;
    colWidth?: string;
    align?: 'left' | 'center' | 'right';
    isnumeric?: boolean;
    onSort?: (fieldName: FieldName, sort: DataGridSortType) => void;
};

export type Row = {
    [key: 'groupKeyId' | string]: ReactNode;
};

export type IPages = {
    pageSize: number;
    pageIndex: number;
};

export type RootFilter<FieldName> = { key: FieldName; value: string | number; parentGroupKey?: string | number };

export type OnFilter<FieldName> = (
    page: {
        pageSize: number;
        pageIndex: number;
    },
    /* Giá trị hiện tại được group  */
    groupBy?: string,
    /* Danh sách filter, nếu mở các row */
    filters?: RootFilter<FieldName>[]
) => Promise<{
    items: Record<string | 'groupKeyId', ReactNode>[];
    totalCount: number;
}>;
