import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Container from './Container';
import { Constants } from 'Commons/Constant';
import { useNavigate } from 'react-router';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
}));

jest.mock('AWING/SearchBox', () => ({
    __esModule: true,
    default: (props?: any) => (
        <div data-testid="SearchBox">
            <button data-testid="SearchBox-onSearch" onClick={props?.onSearch} />
        </div>
    ),
}));

jest.mock('../../components/ButtonTabs', () => ({
    __esModule: true,
    default: (props?: any) => (
        <div data-testid="ButtonTabs">
            <p data-testid="ButtonTabs-tabActive">{props?.tabActive}</p>
            <button data-testid="ButtonTabs-onSearch" onClick={props?.onUpdateTabActive} />
        </div>
    ),
}));
jest.mock('./MenuNotification', () => ({
    __esModule: true,
    default: (props?: any) => (
        <div data-testid="MenuNotification">
            <button data-testid="MenuNotification-onUpdateMenuItem" onClick={(e: any) => props?.onUpdateMenuItem(e.target.value)} />
        </div>
    ),
}));

const getRender = (props?: any) => {
    render(
        <Container
            valueFilter={{
                tabs: 'All',
                textSearch: 'Enter your key',
            }}
            onUpdateStatus={() => {}}
            onValueFilter={() => {}}
            onClosePopover={() => {}}
        />
    );
};

describe('Render', () => {
    it('should render', () => {
        getRender();
        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Common.Notification')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call SearchBox onSearch', () => {
        const mockOnValueFilter = jest.fn();

        getRender({
            onValueFilter: mockOnValueFilter,
        });

        fireEvent.click(screen.getByTestId('SearchBox-onSearch'));
        waitFor(() => {
            expect(mockOnValueFilter).toHaveBeenCalled();
        });
    });

    it('should call ButtonTabs onSearch', () => {
        const mockOnValueFilter = jest.fn();

        getRender({
            onValueFilter: mockOnValueFilter,
        });

        fireEvent.click(screen.getByTestId('ButtonTabs-onSearch'));
        waitFor(() => {
            expect(mockOnValueFilter).toHaveBeenCalled();
        });
    });

    it('should call MenuNotification onUpdateMenuItem with SELECT_ALL', () => {
        const mockOnValueFilter = jest.fn();
        const mockOnUpdateStatus = jest.fn();

        getRender({
            onValueFilter: mockOnValueFilter,
            onUpdateStatus: mockOnUpdateStatus,
        });

        fireEvent.click(screen.getByTestId('MenuNotification-onUpdateMenuItem'), {
            target: { value: Constants.SELECT_ALL },
        });
        waitFor(() => {
            expect(mockOnUpdateStatus).toHaveBeenCalled();
        });
    });

    it('should call MenuNotification onUpdateMenuItem with Notification path', () => {
        const mockoOnClosePopover = jest.fn();

        getRender({
            onClosePopover: mockoOnClosePopover,
        });

        fireEvent.click(screen.getByTestId('MenuNotification-onUpdateMenuItem'), {
            target: { value: Constants.NOTIFICATION_SETTING_SCREEN_PATH },
        });
        waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
            expect(mockoOnClosePopover).toHaveBeenCalled();
        });
    });

    it('should call MenuNotification onUpdateMenuItem with other path', () => {
        getRender({});

        fireEvent.click(screen.getByTestId('MenuNotification-onUpdateMenuItem'), {
            target: { value: 'demoPath' },
        });
        waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });
});
