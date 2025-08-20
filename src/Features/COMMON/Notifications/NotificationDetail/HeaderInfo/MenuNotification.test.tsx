import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MenuNotification from './MenuNotification';
import { Constants } from 'Commons/Constant';

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock MUI components
jest.mock('@mui/material', () => ({
    IconButton: ({ onClick, children }: any) => (
        <button onClick={onClick} data-testid="icon-button">
            {children}
        </button>
    ),
    Typography: ({ children }: any) => <div>{children}</div>,
    MenuItem: ({ onClick, children, 'data-value': dataValue }: any) => (
        <div onClick={onClick} data-value={dataValue} data-testid="menu-item">
            {children}
        </div>
    ),
    Popover: ({ children, open }: any) => (open ? <div data-testid="popover">{children}</div> : null),
    Box: ({ children }: any) => <div>{children}</div>,
}));

// Mock MUI icons
jest.mock('@mui/icons-material', () => ({
    MoreHorizOutlined: () => <div data-testid="more-icon" />,
    Check: () => <div data-testid="check-icon" />,
    DisplaySettings: () => <div data-testid="settings-icon" />,
}));

describe('MenuNotification Component', () => {
    const mockOnUpdateMenuItem = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders icon button correctly', () => {
        render(<MenuNotification onUpdateMenuItem={mockOnUpdateMenuItem} />);
        expect(screen.getByTestId('more-icon')).toBeInTheDocument();
    });

    it('opens popover when icon button is clicked', () => {
        render(<MenuNotification onUpdateMenuItem={mockOnUpdateMenuItem} />);

        fireEvent.click(screen.getByTestId('icon-button'));
        expect(screen.getByTestId('popover')).toBeInTheDocument();
    });

    it('renders all menu items correctly', () => {
        render(<MenuNotification onUpdateMenuItem={mockOnUpdateMenuItem} />);

        fireEvent.click(screen.getByTestId('icon-button'));

        const menuItems = screen.getAllByTestId('menu-item');
        expect(menuItems).toHaveLength(2);

        // Check first menu item (Select All)
        expect(menuItems[0]).toHaveAttribute('data-value', Constants.SELECT_ALL);

        // Check second menu item (Notification Settings)
        expect(menuItems[1]).toHaveAttribute('data-value', Constants.NOTIFICATION_SETTING_SCREEN_PATH);
    });

    it('calls onUpdateMenuItem with correct value when menu item is clicked', () => {
        render(<MenuNotification onUpdateMenuItem={mockOnUpdateMenuItem} />);

        fireEvent.click(screen.getByTestId('icon-button'));

        const menuItems = screen.getAllByTestId('menu-item');

        // Test Select All menu item
        fireEvent.click(menuItems[0]);
        expect(mockOnUpdateMenuItem).toHaveBeenCalledWith(Constants.SELECT_ALL);

        // Reset mock
        mockOnUpdateMenuItem.mockClear();

        // Test Notification Settings menu item
        fireEvent.click(menuItems[1]);
        waitFor(() => {
            expect(mockOnUpdateMenuItem).toHaveBeenCalledWith(Constants.NOTIFICATION_SETTING_SCREEN_PATH);
        });
    });

    it('renders correct translations for menu items', () => {
        render(<MenuNotification onUpdateMenuItem={mockOnUpdateMenuItem} />);

        fireEvent.click(screen.getByTestId('icon-button'));

        expect(screen.getByText('Notifications.SelectAll')).toBeInTheDocument();
        expect(screen.getByText('Notifications.NotificationSettings')).toBeInTheDocument();
    });
});
