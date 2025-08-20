import { Meta, StoryObj } from '@storybook/react';
import Toolbar from 'Layouts/Toolbar';
import Layout from '../common/Layout';
import { BrowserRouter } from 'react-router';

const Demo = () => {
    return (
        <Toolbar
            currentWorkspace={{
                id: 0,
                name: 'ACM',
            }}
            getCurrentUser={() =>
                Promise.resolve({
                    id: 1,
                    name: 'Admin',
                    username: 'admin',
                })
            }
            getFavoriteWorkspaces={() =>
                Promise.resolve({
                    items: Array.from({ length: 10 }).map((_, index) => ({
                        id: index + 1,
                        name: `Demo Workspace ${index + 1}`,
                    })),
                    totalCount: 10,
                })
            }
            getAllWorkSpaceByUserPermission={() =>
                Promise.resolve({
                    items: Array.from({ length: 20 }).map((_, index) => ({
                        id: index + 1,
                        name: `Demo Workspace ${index + 1}`,
                    })),
                    totalCount: 20,
                })
            }
            notificationsCountUnreadMessages={() => Promise.resolve(3)}
            notificationsPaging={() =>
                Promise.resolve({
                    items: [],
                    totalItemCount: 0,
                })
            }
            notificationsRead={() => Promise.resolve()}
            notificationsReadAll={() => Promise.resolve()}
            notificationsUnread={() => Promise.resolve()}
            onLogout={() => Promise.resolve()}
        />
    );
};

// #region Meta
const meta = {
    title: 'Layout/Toolbar',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof Toolbar>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    render: () => {
        return (
            <Layout>
                <BrowserRouter>
                    <Demo />
                </BrowserRouter>
            </Layout>
        );
    },
};

export default meta;
