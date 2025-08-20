import { render, screen } from '@testing-library/react';
import NotificationEmpty from '../NotificationEmpty';

jest.mock('@mui/icons-material', () => ({
    Notifications: () => <p data-testid="Notifications-Icon" />,
    ManageSearch: () => <p data-testid="ManageSearch-Icon" />,
}));

describe('Render', () => {
    it('should render', () => {
        render(<NotificationEmpty />);
        expect(screen.getByText('Notifications.TitleNoNotifications')).toBeInTheDocument();
        expect(screen.getByTestId('Notifications-Icon')).toBeInTheDocument();
    });

    it('should render with isSearch is true', () => {
        render(<NotificationEmpty isSearch />);
        expect(screen.getByText('Notifications.InappropriateNotification')).toBeInTheDocument();
        expect(screen.getByTestId('ManageSearch-Icon')).toBeInTheDocument();
    });
});
