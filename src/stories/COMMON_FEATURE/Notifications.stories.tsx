import { Meta, StoryObj } from '@storybook/react';
import Layout from '../common/Layout';
import LayoutNotifications from 'Features/COMMON/Notifications';
import { BrowserRouter } from 'react-router';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'COMMON/Layout Notifications',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: LayoutNotifications,
} satisfies Meta<typeof LayoutNotifications>;
// #endregion Meta

const Demo = (props: any) => {
    return (
        <Layout>
            <BrowserRouter>
                <LayoutNotifications {...props} />
            </BrowserRouter>
        </Layout>
    );
};

export const Simple: Story = {
    args: {
        service: {
            notificationsPaging: (cancelToken) =>
                Promise.resolve({
                    items: [],
                    totalItemCount: 0,
                }),
            notificationsReadAll: (cancelToken) => Promise.resolve(),
            notificationsRead: (body, cancelToken) => Promise.resolve(),
            notificationsUnread: (body, cancelToken) => Promise.resolve(),
            notificationsCountUnreadMessages: (cancelToken) => Promise.resolve(10),
        },
    },
    render: (args) => {
        return <Demo {...args} />;
    },
};

export default meta;
