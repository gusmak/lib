import { MenuOption } from 'AWING/interface';

export type Value = string | number;

export type TreeItemOption = MenuOption<Value> & {
    description?: string;
    isFile?: boolean;
    isSystem?: boolean;
    objectTypeCode?: string;
};

export type DirectoryTreeProps = {
    labelSearch: string;
    options: TreeItemOption[];
    defaultValue: string;
    rootDirectoryId: Value;
    titleSearch?: string;
    onChange(value: Value): void;
    onDirectoryOpen?: (id: Value) => void;
};
