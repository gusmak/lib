import type { PagingQueryInput } from 'Features/types';
import type { ObjectFilter, ObjectFilterInput } from './types';

export type ObjectFilterServices = {
    /** Get Paging ObjectFilter
     * @param p - PagingQueryInput<ObjectFilter>
     */
    getObjectFilters: (p: PagingQueryInput<ObjectFilter>) => Promise<{ items: ObjectFilter[]; totalCount: number }>;

    /** Delete */
    deleteObjectFilter: (p: { id: number }) => Promise<void>;

    /** Get by Id */
    getObjectFilterById: (p: { id: number }) => Promise<{ objectFilter?: ObjectFilter }>;

    /** Create */
    createObjectFilter: (p: { input: ObjectFilterInput }) => Promise<void>;

    /** Update */
    updateObjectFilter: (p: { input: ObjectFilterInput; id: number }) => Promise<void>;
};
