import type { QueryInput as PageQueryInput } from 'AWING/PageManagement/interface';

import { SortEnumType } from 'Commons/Enums';

export type DataObject<T = any> = { [key: string]: T };

export type GridSortDirection = 'asc' | 'desc';

export interface GridSortModel {
    field: string;
    sort: GridSortDirection;
}

export type ObjectDataInput<TID, TInput> = {
    id?: TID;
    value?: TInput;
};

export type QueryInput = PageQueryInput;

export type ItemOfArrayInputType<T> = {
    id?: number | string;
    value?: ObjectInputType<T>;
};

export type ObjectInputType<T> = {
    [K in keyof T]?: T[K] extends Array<infer U> | undefined ? Array<ItemOfArrayInputType<U>> : T[K];
};

export type SortInputType<T> = {
    [P in keyof T]?: SortEnumType;
};

export type FilterInputType<T> = {
    [P in keyof T]?: {
        and?: FilterInputType<T>[];
        contains?: T[P];
        endsWith?: T[P];
        eq?: T[P];
        in?: NonNullable<T[P]>[];
        ncontains?: T[P];
        nendsWith?: T[P];
        neq?: T[P];
        nin?: NonNullable<T[P]>[];
        nstartsWith?: T[P];
        or?: FilterInputType<T>[];
        startsWith?: T[P];
    };
} & {
    and?: FilterInputType<T>[];
    or?: FilterInputType<T>[];
};

export type PagingQueryInput<T> = {
    where?: FilterInputType<T>;
    order?: Array<SortInputType<T>> | SortInputType<T>;
    skip?: number;
    take?: number;
};

export type PagingType<T> = {
    items: T[];
    totalCount: number;
};

export type ObjectTypeCode = EnumTypeConvert & {
    label?: string;
};

export type DateTime = { input: Date; output: Date };

/*
 * Enum có dạng
 * enum = {
 *
 * }
 */
export type EnumTypeConvert = {
    key: string;
    value: string | number;
};
