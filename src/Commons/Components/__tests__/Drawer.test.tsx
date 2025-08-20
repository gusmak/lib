import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router';
import Drawer from '../Drawer';
import { useAppHelper } from 'Context';

// Mock các dependencies
jest.mock('Context', () => ({
    useAppHelper: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

jest.mock('../ClassicBaseDrawer', () => ({
    __esModule: true,
    default: (props?: any) => {
        return (
            <div data-testid="drawer-base">
                <button onClick={() => props?.onClose()} data-testid="close-button">
                    Close
                </button>
                <button onClick={props?.onSubmit} data-testid="submit-button">
                    Submit
                </button>
                {props?.children}
            </div>
        );
    },
}));

const getRender = (props?: any) => {
    render(<Drawer children={<div>Content</div>} {...props} />);
};

describe('ClassicDrawer', () => {
    const mockConfirm = jest.fn();
    const mockSnackbar = jest.fn();
    const mockNavigate = jest.fn();
    const mockLocation = {
        state: { type: 'history' },
        pathname: '/test',
    };

    beforeEach(() => {
        (useAppHelper as jest.Mock).mockReturnValue({
            confirm: mockConfirm,
            snackbar: mockSnackbar,
        });

        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useLocation as jest.Mock).mockReturnValue(mockLocation);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render drawer with basic props', () => {
        getRender();
        expect(screen.getByTestId('drawer-base')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle close without confirm', () => {
        const mockOnClose = jest.fn();
        getRender({ onClose: mockOnClose });
        const closeButton = screen.getByTestId('close-button');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should handle close with confirm', async () => {
        const mockOnClose = jest.fn();
        getRender({ confirmExit: true, onClose: mockOnClose });

        const closeButton = screen.getByTestId('close-button');
        fireEvent.click(closeButton);
        const mockConfirmCallback = mockConfirm.mock.calls[0][0];
        act(() => {
            jest.runAllTimers();
        });

        await act(async () => {
            mockConfirmCallback();
        });
        expect(mockConfirm).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should handle submit without confirm', async () => {
        const mockSubmit = jest.fn().mockResolvedValue('Reload');
        getRender({ onSubmit: mockSubmit, confirmSave: true });

        fireEvent.click(screen.getByTestId('submit-button'));
        const mockConfirmCallback = mockConfirm.mock.calls[0][0];

        await act(async () => {
            mockConfirmCallback();
        });
        expect(mockSubmit).toHaveBeenCalled();
    });

    it('should handle submit, and onSubmit ', async () => {
        const mockSubmit = jest.fn(() => Promise.reject({ status: 'Error' }));
        getRender({ onSubmit: mockSubmit });

        fireEvent.click(screen.getByTestId('submit-button'));
        expect(mockSubmit).toHaveBeenCalled();

        await waitFor(() => {
            expect(mockSnackbar).toHaveBeenCalled();
        });
    });

    it('should handle submit, and onSubmit ', () => {
        const mockSubmit = jest.fn(() => Promise.resolve('AA'));
        getRender({ onSubmit: mockSubmit });

        fireEvent.click(screen.getByTestId('submit-button'));
        expect(mockSubmit).toHaveBeenCalled();
    });
});
