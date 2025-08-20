import { ObjectTypeCode } from 'Features/types';

export type AdvancedValue = {
    objectTypeCode: {
        value: string;
        label?: string;
    };
};

export type SearchValue = {
    searchKey?: string;
    advancedObject?: AdvancedValue;
};

export type OwnProps = {
    objectTypeCodes?: ObjectTypeCode[];
    searchValue?: SearchValue;
    onSearch?: (data?: SearchValue) => void;
};
