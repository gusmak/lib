import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Layout from '../../common/Layout';
import { SortableTree, type TreeItems, type TreeItem } from 'AWING/DragAndDrop/TreeSortable';
import { CustomTreeItem, type MinimalTreeItemData } from './components/CustomTree';

export type Story = StoryObj<typeof meta>;

const getItems = (param: { id: number | string; label: React.ReactNode }[]) => {
    const result: TreeItems<MinimalTreeItemData> = [];

    param.forEach((i) => {
        result.push({
            id: i.id,
            label: i.label,
            canHaveChildren: false, // Không cho phép kéo thả vào children
            children: [
                {
                    id: `${i.id}_1`,
                    label: <h3>Option Item {`${i.id}_1`}</h3>,
                    disableSorting: true, // Không cho phép sắp xếp
                    canHaveChildren: false, // Không cho phép kéo thả vào children
                },
                {
                    id: `${i.id}_2`,
                    label: <h3>Option Item {`${i.id}_2`}</h3>,
                    disableSorting: true, // Không cho phép sắp xếp
                    canHaveChildren: false, // Không cho phép kéo thả vào children
                },
            ],
        });
    });

    return result as any;
};
const Demo = () => {
    const [items, setItems] = React.useState<TreeItem<MinimalTreeItemData>[]>([]);

    const handleItemsChanged = (newItems: TreeItems<MinimalTreeItemData>) => {
        setItems(newItems);
    };

    React.useEffect(() => {
        setItems(
            getItems([
                {
                    id: 1,
                    label: <h3>Item 1</h3>,
                },
                {
                    id: 2,
                    label: <h3>Item 2</h3>,
                },
                {
                    id: 3,
                    label: <h3>Item 3</h3>,
                },
                {
                    id: 4,
                    label: <h3>Item 4</h3>,
                },
                {
                    id: 5,
                    label: <h3>Item 5</h3>,
                },
            ])
        );
    }, []);

    return (
        <Layout>
            <h2>Report Sidebar Collaped</h2>
            <SortableTree
                TreeItemComponent={CustomTreeItem}
                onItemsChanged={(newItems) => handleItemsChanged(newItems)}
                items={items}
                disableCollapseOnItemClick={true}
            />
        </Layout>
    );
};

// #region Meta
const meta = {
    title: 'DragAndDrop/SortableTree',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof Demo>;
// #endregion Meta

export const Simple: Story = {
    args: {},
    render: (args) => {
        return <Demo {...args} />;
    },
};

export default meta;
