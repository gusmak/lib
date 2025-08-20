import { atom } from 'jotai';
import { initPage } from './Constants';
import { Cell, IPages, RootFilter } from './Types';

/* Object for cache Atom */
export const atomCache = new Map<string, unknown>();

/* Create or Get an Atom */
export function getOrCreateAtom<T>(key: string, initialValue?: T) {
    if (!atomCache.has(key)) {
        /* Nếu không có key truyền vào thì tạo mới atom và */
        atomCache.set(key, atom<T>(initialValue!));
    }
    return atomCache.get(key) as ReturnType<typeof atom<T>>;
}

export const initializeAtoms = <FieldName>() => {
    return {
        /* Các cột table */
        cells: getOrCreateAtom<Cell<FieldName>[]>('cellsState', []),
        /* Danh sách các groupby */
        groupFields: getOrCreateAtom<FieldName[]>('groupFieldsState', []),
        /* Toàn bộ fieldName của cells */
        fieldNames: getOrCreateAtom<FieldName[]>('fieldNamesState', []),
        /* Danh sách filter theo fieldName của Cell */
        rootFilters: getOrCreateAtom<RootFilter<FieldName>[]>('rootFiltersState', []),
        /* Page Pagination on list */
        pageList: getOrCreateAtom<IPages>('pageListState', initPage),
        /* Trạng thái dragging */
        dragging: getOrCreateAtom<boolean>('draggingState', false),
    };
};
