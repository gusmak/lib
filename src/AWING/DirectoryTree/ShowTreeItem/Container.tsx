import { FolderOpen as FolderOpenIcon } from '@mui/icons-material';
import TreeItemWithAction from '../TreeItemWithAction';
import { getChildrentByParentPath } from '../helper';
import type { ShowTreeItemProps } from './types';

function ShowTreeItem(props: ShowTreeItemProps) {
    const { rootItem, items, onTreeItemClick } = props;

    const childs = getChildrentByParentPath(items, rootItem.directoryPath ?? '');

    return (
        <TreeItemWithAction
            itemId={rootItem.value.toString()}
            labelIcon={
                <FolderOpenIcon
                    sx={{
                        color: 'rgba(0, 0, 0, 0.54)',
                        marginRight: '8px',
                    }}
                    color="secondary"
                />
            }
            labelText={rootItem.text}
            onTreeItemClick={() => onTreeItemClick(rootItem.value)}
            actions={rootItem.actions}
        >
            {childs?.length ? (
                <>
                    {childs
                        .sort(
                            (item1, item2) =>
                                (item1.order && item2.order && item1.order - item2.order) || item1.text.localeCompare(item2.text)
                            /* Nếu child 1 và child 2 có giá trị order bằng nhau, thì sắp xếp theo chữ cái của text */
                        )
                        .map((item) => {
                            return <ShowTreeItem key={item.value} rootItem={item} items={items} onTreeItemClick={onTreeItemClick} />;
                        })}
                </>
            ) : null}
        </TreeItemWithAction>
    );
}

export default ShowTreeItem;
