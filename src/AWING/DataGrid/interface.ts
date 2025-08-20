import { SxProps, TableCellProps, TableRowProps, Theme } from '@mui/material';
import type { FunctionComponent, MouseEvent, ReactElement, ReactNode } from 'react';

export * from '../interface';
export type GridSortDirection = 'asc' | 'desc';
export interface GridSortModel {
    field: string;
    sort: GridSortDirection;
}

export interface DataGridColumnDefinitionBase<T> {
    /**
     * Tên trường
     */
    field: string;
    /**
     * Nội dung hiển thị ở header
     */
    headerName: ReactNode;
    /**
     * Nếu bằng true thì sẽ cho phép sort theo trường này
     */
    sortable?: boolean;
    /**
     * Hàm kiểm tra giá trị điền khi sửa trực tiếp trường này
     *
     * @param value Giá trị
     */
    // checkValid?(value: any): boolean
    /**
     * Kiểu dữ liệu của trường
     */
    type?: 'text' | 'number';
    /**
     * Cách lấy nội dung hiển thị khác, nếu có
     *
     * @param row Một đối tượng trong danh sách hiển thị
     * @param idx Số thứ tự của đối tượng trong danh sách
     */
    valueGetter?(row: T, idx: number, stt: number): ReactNode;
    /**
     * Độ rộng của cột
     */
    width?: string | number;
    TableCellProps?: TableCellProps;
    dynamicTableCellProps?: (row: T) => TableCellProps;
}

export interface RowActionDefinition<T> {
    /**
     * Icon của button action
     */
    icon:
        | ReactNode
        | FunctionComponent<{
              id: string;
              row: T;
              idx: number;
              order: number;
          }>;
    /**
     * Nội dung hiển thị trên tooltip
     */
    tooltipTitle: string;
    /**
     * Hành động thực hiện khi nhấn nút
     */
    action(id: string | number): void;
    isShouldHideActions?: (row: T) => boolean;
    sx?: SxProps<Theme>;
}

export interface SelectionActionDefinition {
    /**
     * Icon của button action
     */
    icon: ReactNode;
    /**
     * Nội dung hiển thị trên tooltip
     */
    tooltipTitle: string;
    /**
     * Hành động thực hiện khi nhấn nút
     */
    action(ids?: Array<string>): void;
    disabled?: boolean;
}

export interface TableGridProps<T> {
    columns: DataGridColumnDefinitionBase<T>[];
    dynamicTableRowProps?: (row: T) => TableRowProps;
    rows: T[];
    hideHeader?: boolean;
    spanningRows?: ReactElement;
    spanningRowsPosition?: 'top' | 'bottom';
    getRowId?(obj: T): RowId;
    onRowClick?(id: RowId, event?: MouseEvent<HTMLTableRowElement>): void;
    rowActions?: RowActionDefinition<T>[];
    sortModel?: GridSortModel[];
    onSortModelChange?(model: GridSortModel[]): void;
    selected?: RowId[];
    onSelectedChange?(ids: RowId[]): void;
    selectionActions?: SelectionActionDefinition[];
    pageIndex?: number;
    pageSize?: number;
}

export type RowId = string | number;
export interface DataGridProps<T> extends TableGridProps<T> {
    totalOfRows?: number;
    rowsPerPageOptions?: number[];
    onPageIndexChange?(pageIndex: number): void;
    onPageSizeChange?(pageIndex: number): void;
}
