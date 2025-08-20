import { render, screen } from '@testing-library/react';
import NotificationList from './Container';
import { NotificationMessageStatus } from '../../Enum';
import type { NotificationMessage } from '../../Types';
import { Constants } from 'Commons/Constant';

// Mock các dependencies
jest.mock('react-router', () => ({
    useNavigate: () => jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('Context', () => ({
    useAwing: () => ({
        transactionType: 'test-transaction',
    }),
}));

// Mock các components con
jest.mock('./NotificationItem', () => () => <div data-testid="notification-item">Notification Item</div>);
jest.mock('../../components/NotificationEmpty', () => ({ isSearch }: { isSearch: boolean }) => (
    <div data-testid="notification-empty">{isSearch ? 'Search Empty' : 'No Notifications'}</div>
));
jest.mock('../../components/NotificationLoading', () => () => <div data-testid="notification-loading">Loading...</div>);

describe('NotificationList', () => {
    const mockNotificationMessages: NotificationMessage[] = [
        {
            id: 1,
            status: NotificationMessageStatus.Unread,
            sagaTransactionType: 1,
            fields: [
                {
                    name: 'url',
                    value: '/test-url',
                    text: 'Test URL',
                },
            ],
        },
        {
            id: 2,
            status: NotificationMessageStatus.Read,
            sagaTransactionType: 2,
            fields: [
                {
                    name: 'url',
                    value: '/test-url-2',
                    text: 'Test URL 2',
                },
            ],
        },
    ];

    const mockOnUpdateStatus = jest.fn();

    it('should render empty state when no notifications and not loading', () => {
        render(
            <NotificationList
                valueFilter={{ textSearch: '', tabs: 'all' }}
                isLoading={false}
                notificationMessage={[]}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getByTestId('notification-empty')).toBeInTheDocument();
        expect(screen.getByText('No Notifications')).toBeInTheDocument();
    });

    it('should render empty state with search message when textSearch is not empty', () => {
        render(
            <NotificationList
                valueFilter={{ textSearch: 'test', tabs: 'all' }}
                isLoading={false}
                notificationMessage={[]}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getByTestId('notification-empty')).toBeInTheDocument();
        expect(screen.getByText('Search Empty')).toBeInTheDocument();
    });

    it('should render loading state when isLoading is true', () => {
        render(
            <NotificationList
                valueFilter={{ textSearch: '', tabs: 'all' }}
                isLoading={true}
                notificationMessage={[]}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getByTestId('notification-loading')).toBeInTheDocument();
    });

    it('should render all notifications when tabs is "all"', () => {
        render(
            <NotificationList
                valueFilter={{ textSearch: '', tabs: 'all' }}
                isLoading={false}
                notificationMessage={mockNotificationMessages}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getAllByTestId('notification-item')).toHaveLength(2);
    });

    it('should filter unread notifications when tabs is "unread"', () => {
        render(
            <NotificationList
                valueFilter={{ textSearch: '', tabs: Constants.UNREAD }}
                isLoading={false}
                notificationMessage={mockNotificationMessages}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getAllByTestId('notification-item')).toHaveLength(1);
    });

    it('should update notifications when notificationMessage prop changes', () => {
        const { rerender } = render(
            <NotificationList
                valueFilter={{ textSearch: '', tabs: 'all' }}
                isLoading={false}
                notificationMessage={[mockNotificationMessages[0]]}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getAllByTestId('notification-item')).toHaveLength(1);

        rerender(
            <NotificationList
                valueFilter={{ textSearch: '', tabs: 'all' }}
                isLoading={false}
                notificationMessage={mockNotificationMessages}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getAllByTestId('notification-item')).toHaveLength(2);
    });

    it('should update filtered notifications when tabs value changes', () => {
        const { rerender } = render(
            <NotificationList
                valueFilter={{ textSearch: '', tabs: 'all' }}
                isLoading={false}
                notificationMessage={mockNotificationMessages}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getAllByTestId('notification-item')).toHaveLength(2);

        rerender(
            <NotificationList
                valueFilter={{ textSearch: '', tabs: Constants.UNREAD }}
                notificationMessage={mockNotificationMessages}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getAllByTestId('notification-item')).toHaveLength(1);
    });

    it('should handle loading state with notifications', () => {
        render(
            <NotificationList
                valueFilter={{ textSearch: '', tabs: 'all' }}
                isLoading={true}
                notificationMessage={mockNotificationMessages}
                onUpdateStatus={mockOnUpdateStatus}
            />
        );

        expect(screen.getByTestId('notification-loading')).toBeInTheDocument();
        expect(screen.getAllByTestId('notification-item')).toHaveLength(2);
    });
});
