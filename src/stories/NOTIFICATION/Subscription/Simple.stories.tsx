import { Meta, StoryObj } from '@storybook/react';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import SubscriptionConfig from 'Features/NOTIFICATION/SubscriptionConfig';
import { services } from './services';

const Demo = () => {
    return (
        <AppWrapper>
            <SubscriptionConfig services={services} />
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'NOTIFICATION/SubscriptionConfig',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof SubscriptionConfig>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    render: (args) => {
        return (
            <Layout>
                <Demo />
            </Layout>
        );
    },
};

export default meta;
