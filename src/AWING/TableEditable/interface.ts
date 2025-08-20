import { TableCellProps } from '@mui/material/TableCell';
import { ReactNode } from 'react';
import type { SelectionActionDefinition } from '../DataGrid/interface';
import { FieldDefinitionProps } from 'AWING/DataInput/interfaces';

export type CellDefinition<T extends object> = FieldDefinitionProps<T> & {
    TableCellProps?: TableCellProps;
    isTooltip?: boolean;
    row?: Partial<T>;
    getTitleTooltip?: (value: T[keyof T]) => NonNullable<ReactNode>;
};

export interface ColumnDefinition<T extends object> {
    headerName: ReactNode;
    /**
     * Độ rộng của cột
     */
    width?: string | number;
    TableCellProps?: TableCellProps;
    editFieldDefinition?: CellDefinition<T>;
    isRowGroup?: boolean;
    contentGetter?: (obj: T, idx?: number) => ReactNode;
    fieldName?: string;
    isTooltip?: boolean;
    getTitleTooltip?: (value: T[keyof T]) => NonNullable<ReactNode>;
}

export type TableEditableProps<T> = {
    columnDefinitions: Array<ColumnDefinition<Partial<T>>>;
    items: Array<Partial<T>>;
    onChange(newData: Array<Partial<T>>, dataValid: boolean): void;
    getRowId?(obj: Partial<T>): number;
    selected?: number[];
    onSelectedChange?(ids: number[]): void;
    hideHeader?: boolean;
    onAddNew?(): void;
    includeDelete?: boolean;
    spanningRows?: ReactNode[];
    selectionActions?: SelectionActionDefinition[];
    mergeRowsBy?: string;
};

export interface TopBarActionsProps {
    selected: number[];
    selectionActions?: SelectionActionDefinition[];
}

export interface TableHeaderProps<T> {
    selected?: number[];
    onSelectedChange?: (selected: number[]) => void;
    numOfRows: number;
    onSelectAll: () => void;
    includeDelete?: boolean;
    columnDefinitions: Array<ColumnDefinition<Partial<T>>>;
}

export interface TableEditableBodyProps<T> {
    items: Array<Partial<T>>;
    getId: (item: Partial<T>) => string | number | undefined;
    selected?: number[];
    onSelectedChange?: (selected: number[]) => void;
    onSelect: (id: number) => void;
    columnDefinitions: Array<ColumnDefinition<Partial<T>>>;
    dataValidation: Partial<{ [K in keyof T]: boolean }>[];
    includeDelete?: boolean;
    spanningRows?: ReactNode[];
    onChange: (indexes: number[], fieldName: keyof T, newValue: T[keyof T], valid: boolean) => void;
    onDelete: (rowIdx: number) => void;
    mergeRowsBy?: string;
}

export interface TableCellEditableProps<T extends object> {
    cellDefinition: CellDefinition<T>;
    numOfRowSpan?: number;
}
