import NoData from 'AWING/NoData';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';

// #region Meta
const meta = {
    title: 'AWING/NoData',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: NoData,
} satisfies Meta<typeof NoData>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    render: () => {
        return (
            <Layout>
                <NoData />
            </Layout>
        );
    },
};

export default meta;
