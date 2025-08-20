import { Meta, StoryObj } from '@storybook/react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon, FolderOpen as FolderOpenIcon, FileCopy as FileCopyIcon } from '@mui/icons-material';
import TreeItemWithAction from 'AWING/DirectoryTree/TreeItemWithAction';
import Layout from '../common/Layout';

// #region Meta
const meta = {
    title: 'AWING/TreeItemWithAction',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: TreeItemWithAction,
} satisfies Meta<typeof TreeItemWithAction>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {
        itemId: 'root',
        labelIcon: <FolderOpenIcon color="secondary" style={{ marginRight: '8px' }} />,
        labelText: 'root',
        actions: [],
        color: 'red',
    },
    render: (args) => {
        return (
            <Layout>
                <div style={{ minWidth: '200px' }}>
                    <SimpleTreeView>
                        <TreeItemWithAction {...args} />
                    </SimpleTreeView>
                </div>
            </Layout>
        );
    },
};

export const Multiple: Story = {
    args: {
        itemId: 'root',
        labelIcon: <FolderOpenIcon color="secondary" />,
        labelText: 'root',
        actions: [],
        color: 'red',
    },
    render: (_args) => {
        return (
            <Layout>
                <div style={{ minWidth: '200px' }}>
                    <SimpleTreeView>
                        <TreeItemWithAction
                            itemId="item1"
                            labelIcon={<FolderOpenIcon />}
                            labelText="item 1"
                            actions={[
                                <IconButton
                                    onClick={(e) => {
                                        console.log('Delete Action', e);
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>,
                            ]}
                            color="red"
                            onTreeItemClick={() => console.log('onTreeItemClick')}
                        />
                        <TreeItemWithAction
                            itemId="item2"
                            labelIcon={<FileCopyIcon />}
                            labelText="item 2"
                            actions={[
                                <IconButton
                                    onClick={(e) => {
                                        console.log('Delete Action', e);
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>,
                            ]}
                            color="red"
                            onTreeItemClick={() => console.log('onTreeItemClick')}
                        />
                    </SimpleTreeView>
                </div>
            </Layout>
        );
    },
};

export default meta;
