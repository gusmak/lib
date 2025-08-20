import { AdvancedValue } from './TreeView/SearchColumn/types';
import { Directory } from './types';

/** Get Directories and format to Directory type */
export const getFormatDirectoriesData = (data?: Directory[]): Directory[] => {
    const items = data || [];

    const directories: Directory[] = items.map((s) => ({
        ...s,
        isSystem: !!s.isSystem,
        level: s.level ?? 0,
    }));

    return directories;
};

export const isSearch = (searchValue: { searchKey: string; advancedObject?: AdvancedValue }) => {
    if (searchValue.searchKey !== '') return true;
    if (searchValue?.advancedObject?.objectTypeCode?.value !== '') return true;
    return false;
};
