import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router';
import { useAwing } from 'Context';
import NotificationItem from './NotificationItem';
import { NotificationMessageStatus } from '../../Enum';
import type { NotificationMessage } from '../../Types';

// Mock các dependencies
jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('Context', () => ({
    useAwing: jest.fn(),
}));

describe('NotificationItem', () => {
    const mockNavigate = jest.fn();
    const mockOnUpdateStatus = jest.fn();
    const mockTransactionType = 'test-transaction';

    const mockNotificationMessage: NotificationMessage = {
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
    };

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useAwing as jest.Mock).mockReturnValue({ transactionType: mockTransactionType });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should renders correctly with unread status', () => {
        render(<NotificationItem notificationMessage={mockNotificationMessage} onUpdateStatus={mockOnUpdateStatus} />);

        expect(screen.getByTestId('iconStatus')).toBeInTheDocument();
    });

    it('should renders correctly with read status', () => {
        const readNotification = {
            ...mockNotificationMessage,
            status: NotificationMessageStatus.Read,
        };

        render(<NotificationItem notificationMessage={readNotification} onUpdateStatus={mockOnUpdateStatus} />);

        expect(screen.queryByTestId('iconStatus')).not.toBeInTheDocument();
    });

    it('should calls onUpdateStatus when clicking the notification with unread status', () => {
        render(<NotificationItem notificationMessage={mockNotificationMessage} onUpdateStatus={mockOnUpdateStatus} />);

        const notificationItem = screen.getByTestId('iconStatus').parentElement;
        fireEvent.click(notificationItem!);

        expect(mockOnUpdateStatus).toHaveBeenCalledWith({
            id: mockNotificationMessage.id,
            status: mockNotificationMessage.status,
        });
    });

    it('should handles status update button click correctly', () => {
        render(<NotificationItem notificationMessage={mockNotificationMessage} onUpdateStatus={mockOnUpdateStatus} />);

        // Hover to show the status button
        const notificationItem = screen.getByTestId('iconStatus').parentElement;
        fireEvent.mouseEnter(notificationItem!);

        const statusButton = screen.getByTitle('Notifications.TitleMarkRead');
        fireEvent.click(statusButton);

        expect(mockOnUpdateStatus).toHaveBeenCalledWith({
            id: mockNotificationMessage.id,
            status: mockNotificationMessage.status,
        });
    });

    it('should does not call onUpdateStatus when clicking notification with read status', () => {
        const readNotification = {
            ...mockNotificationMessage,
            status: NotificationMessageStatus.Read,
        };

        render(<NotificationItem notificationMessage={readNotification} onUpdateStatus={mockOnUpdateStatus} />);

        const notificationItem = screen.getByRole('img').parentElement?.parentElement;
        fireEvent.click(notificationItem!);

        expect(mockOnUpdateStatus).not.toHaveBeenCalled();
    });
});
