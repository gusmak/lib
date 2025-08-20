import { Meta, StoryObj } from '@storybook/react';
import LayoutContainer from 'Layouts/Container';
import { SettingsApplications as SettingsApplicationsIcon, CircleNotifications as CircleNotificationsIcon } from '@mui/icons-material';
import i18next from 'i18next';
import { I18nProvider } from 'translate';
import { ThemeProvider } from '../Themes';

const Demo = () => {
    return (
        <LayoutContainer
            isShowLayout={true}
            currentWorkspace={{
                id: 10,
                name: 'ACM',
            }}
            menuPermission={[
                { id: 1, name: 'System', key: 'system' },
                { id: 2, name: 'Notification', key: 'notification' },
                {
                    id: 3,
                    name: 'Role',
                    key: 'role',
                    parentId: 1,
                },
                {
                    id: 4,
                    name: 'Filter',
                    key: 'filter',
                    parentId: 2,
                },
            ]}
            routeList={[
                {
                    key: 'system',
                    title: 'System',
                    tooltip: 'System',
                    enabled: true,
                    icon: SettingsApplicationsIcon,
                    subRoutes: [
                        {
                            key: 'role',
                            title: 'Role',
                            tooltip: 'Role',
                            path: 'Role',
                            enabled: true,
                            element: <div>Role</div>,
                        },
                    ],
                },
                {
                    key: 'notification',
                    title: 'Notification',
                    tooltip: 'Notification',
                    enabled: true,
                    icon: CircleNotificationsIcon,
                    subRoutes: [
                        {
                            key: 'filter',
                            title: 'Filter',
                            tooltip: 'Filter',
                            path: 'Filter',
                            enabled: true,
                            element: <div>Filter</div>,
                        },
                    ],
                },
            ]}
            services={{
                getAllWorkSpaceByUserPermission: () => Promise.resolve({ items: [], totalCount: 0 }),
                getCurrentUser: () => Promise.resolve({ id: 1, name: 'John Doe' }),
                getFavoriteWorkspaces: () => Promise.resolve({ items: [], totalCount: 0 }),
                onChangeWorkspace: () => Promise.resolve(),
                onLogout: () => Promise.resolve(),
                notificationsCountUnreadMessages: () => Promise.resolve(3),
                notificationsPaging: () =>
                    Promise.resolve({
                        items: [],
                        totalItemCount: 0,
                    }),
                notificationsRead: () => Promise.resolve(),
                notificationsReadAll: () => Promise.resolve(),
                notificationsUnread: () => Promise.resolve(),
                getWorkspaceById: () =>
                    Promise.resolve({
                        id: 10,
                    }),
            }}
            appName="AWING APP"
        />
    );
};

// #region Meta
const meta = {
    title: 'Layout/LayoutContainer',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof LayoutContainer>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

const i18n = i18next.createInstance();
i18n.init(
    {
        resources: {},
        fallbackLng: 'vi',
        debug: false,
        cleanCode: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        react: {
            useSuspense: false,
        },
        initImmediate: false,
    },
    (err, t) => {
        if (err) return console.log(err);
        t('key');
    }
);

export const Simple: Story = {
    render: () => {
        return (
            <div style={{ height: '100vh', width: '100vw', margin: '-16px' }}>
                <I18nProvider i18nData={i18n}>
                    <ThemeProvider>
                        <Demo />
                    </ThemeProvider>
                </I18nProvider>
            </div>
        );
    },
};

export default meta;
