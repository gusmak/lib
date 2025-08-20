import { fireEvent, render, screen } from '@testing-library/react';
import { useGetContext } from '../Context';
import Container from './Container';

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    IconButton: (props: any) => (
        <div data-testid="IconButton-Icon">
            <button data-testid="IconButton-onClick" onClick={props?.onClick} />
            {props?.children}
        </div>
    ),
    Popover: (props: any) => (
        <div data-testid="Popover">
            <button data-testid="Popover-onClose" onClick={props?.onClose} />
            {props?.open && <p data-testid="Popover-open" />}
            {props?.children}
        </div>
    ),
}));

jest.mock('../NotificationDetail', () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="NotificationDetail">
            <button data-testid="NotificationDetail-onClosePopover" onClick={props?.onClosePopover} />
        </div>
    ),
}));

jest.mock('../Context', () => ({
    useGetContext: jest.fn(),
}));

const getRender = () => render(<Container />);

describe('Render', () => {
    beforeEach(() => {
        (useGetContext as jest.Mock).mockReturnValue({
            service: {
                notificationsCountUnreadMessages: jest.fn().mockResolvedValue(5),
            },
            numberNotification: 0,
            onNotificationClick: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        getRender();
        expect(screen.getByTestId('IconButton-Icon')).toBeInTheDocument();
    });

    it('should click open', () => {
        getRender();
        fireEvent.click(screen.getByTestId('IconButton-onClick'));
        expect(screen.getByTestId('Popover')).toBeInTheDocument();
    });

    it('should click NotificationDetail-onClosePopover', () => {
        getRender();
        fireEvent.click(screen.getByTestId('NotificationDetail-onClosePopover'));
        expect(screen.queryByTestId('Popover-open')).not.toBeInTheDocument();
    });
});
