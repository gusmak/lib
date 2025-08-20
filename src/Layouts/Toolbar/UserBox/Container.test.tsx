import { fireEvent, render, screen } from '@testing-library/react';
import Container from './Container';
import { useAtomValue } from 'jotai';
import { currentUserState } from '../Atom';
import { useGetToolbarContext } from '../context';
import { useAppHelper } from 'Context';

const getRender = () => {
    render(<Container />);
};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('jotai', () => ({
    useAtomValue: jest.fn(),
    atom: jest.fn(() => ({})),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    IconButton: ({ onClick, children }: any) => (
        <button data-testid="IconButton" onClick={onClick}>
            {children}
        </button>
    ),
    Menu: ({ children, open, onClose }: any) => (
        <div data-testid="Material-Menu">
            {open ? <div>{children}</div> : null}
            <button onClick={onClose} data-testid="Material-Menu-onClose">
                Close
            </button>
        </div>
    ),
    MenuItem: ({ about, children, onClick }: any) => (
        <div data-testid={`Material-MenuItem-${about}`}>
            {children}
            <button onClick={onClick} data-testid={`Material-MenuItem-${about}-onClick`}>
                MenuItem
            </button>
        </div>
    ),
}));

jest.mock('Commons/Constant', () => ({
    Constants: {
        ID_DOMAIN: 'http://localhost',
        PROFILE_PATH: 'profile',
        USER_PROFILE_INFO: 'user',
    },
}));

jest.mock('../context', () => ({
    useGetToolbarContext: jest.fn(),
}));

jest.mock('Context', () => ({
    useAppHelper: jest.fn(),
}));

describe('Render and Actions', () => {
    const mockSnackbar = jest.fn();
    beforeEach(() => {
        (useAppHelper as jest.Mock).mockReturnValue({ snackbar: mockSnackbar, alert: jest.fn() });

        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === currentUserState) return { id: 1, name: 'Admin', username: 'admin' };
        });
        (useGetToolbarContext as jest.Mock).mockReturnValue({ services: { onLogout: jest.fn() } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        getRender();

        expect(screen.getByTestId('IconButton')).toBeInTheDocument();
    });

    it('should render without username', () => {
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === currentUserState) return { id: 1 };
        });
        getRender();

        expect(screen.getByText('U')).toBeInTheDocument();
    });

    it('should show/hidden menu', () => {
        getRender();

        fireEvent.click(screen.getByTestId('IconButton'));
        expect(screen.getByTestId('Material-MenuItem-name-onClick')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('Material-Menu-onClose'));
        expect(screen.queryByTestId('Material-MenuItem-name-onClick')).not.toBeInTheDocument();
    });

    it('should call show profile', () => {
        getRender();

        fireEvent.click(screen.getByTestId('IconButton'));
        expect(screen.getByTestId('Material-MenuItem-name-onClick')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('Material-MenuItem-name-onClick'));
        expect(screen.queryByTestId('Material-MenuItem-name-onClick')).not.toBeInTheDocument();
    });

    it('should call show setting', () => {
        getRender();

        fireEvent.click(screen.getByTestId('IconButton'));
        expect(screen.getByTestId('Material-MenuItem-setting-onClick')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('Material-MenuItem-setting-onClick'));
        expect(screen.queryByTestId('Material-MenuItem-setting-onClick')).not.toBeInTheDocument();
    });

    it('should call show logout', () => {
        getRender();

        fireEvent.click(screen.getByTestId('IconButton'));
        expect(screen.getByTestId('Material-MenuItem-logout-onClick')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('Material-MenuItem-logout-onClick'));
        expect(screen.queryByTestId('Material-MenuItem-logout-onClick')).not.toBeInTheDocument();
    });
});
