import { Meta, StoryObj } from '@storybook/react';
import Layout from '../common/Layout';
import { NotificationPopover } from 'Features/COMMON/Notifications';
import { BrowserRouter } from 'react-router';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'COMMON/NotificationPopover',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: NotificationPopover,
} satisfies Meta<typeof NotificationPopover>;
// #endregion Meta

const Demo = (props: any) => {
    return (
        <BrowserRouter>
            <Layout>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <NotificationPopover {...props} />
                </div>
            </Layout>
        </BrowserRouter>
    );
};

export const Simple: Story = {
    args: {
        service: {
            notificationsPaging: (cancelToken) =>
                Promise.resolve({
                    items: [
                        {
                            status: 0,
                            sagaTransactionType: 1107,
                            fields: [],
                            userId: '5013461470212533044',
                            id: 130549,
                        },
                    ],
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
