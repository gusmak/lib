import { Meta, StoryObj } from '@storybook/react';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import NotificationConfig from 'Features/NOTIFICATION/NotificationConfig';
import { services } from './services';

const Demo = () => {
    return (
        <AppWrapper>
            <NotificationConfig {...services} />
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'NOTIFICATION/NotificationConfig',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof NotificationConfig>;
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
