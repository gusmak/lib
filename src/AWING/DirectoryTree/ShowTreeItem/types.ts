import { TreeItemOption, Value } from '../interface';

/* ShowTreeItem */
export type ShowTreeItemProps = {
    /* rootItem: đối tượng root của cây */
    rootItem: TreeItemOption;
    /* danh sách các đối tượng con của rootItem */
    items: TreeItemOption[];
    /* Hàm xử lý khi click vào một node trên cây */
    onTreeItemClick: (id: Value) => void;
    loading?: boolean;
};
