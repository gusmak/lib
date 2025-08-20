import { Meta, StoryObj } from '@storybook/react';
import Layout from '../common/Layout';
import HierarchyTree from 'AWING/HierarchyTree';
import { NodeStatus } from 'AWING/HierarchyTree/interface';

// #region Meta
const meta = {
    title: 'AWING/HierarchyTree',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: HierarchyTree,
} satisfies Meta<typeof HierarchyTree>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {
        data: {
            nodeId: '1',
            name: 'Root',
            status: NodeStatus.Indeterminate,
            children: [
                { nodeId: '2', name: 'Child 1', status: NodeStatus.Unchecked, children: [] },
                { nodeId: '3', name: 'Child 2', status: NodeStatus.Indeterminate, children: [] },
            ],
        },
        onGetMoreData: async (nodeId: string, forceUpdate?: boolean) => {},
    },
    render: (args) => {
        return (
            <Layout>
                <HierarchyTree {...args} />
            </Layout>
        );
    },
};

export default meta;
