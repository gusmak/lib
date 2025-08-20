import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { useAtomValue } from 'jotai';
import { currentWorkspaceState } from '../Atom';
import { useGetLayoutContext } from '../context';

jest.mock('lodash', () => ({
    cloneDeep: (props: any) => props,
}));

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'),
    useAtomValue: jest.fn(),
}));

jest.mock('../context', () => ({
    ...jest.requireActual('../context'),
    useGetLayoutContext: jest.fn(),
}));

jest.mock('../Footer', () => ({
    __esModule: true,
    default: () => <div data-testid="Footer" />,
}));

jest.mock('../NavDrawer', () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="NavDrawer">
            {props?.menuOpen && <p data-testid="NavDrawer-menuOpen" />}
            <button data-testid="NavDrawer-toggleMenu" onClick={props?.toggleMenu} />,
        </div>
    ),
}));

jest.mock('../Toolbar', () => ({
    __esModule: true,
    default: () => <div data-testid="Toolbar" />,
}));

const getRender = () => {
    render(<Dashboard />);
};

describe('Render and Actions', () => {
    beforeEach(() => {
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === currentWorkspaceState) return { id: '1', name: 'Workspace 1' };
        });
        (useGetLayoutContext as jest.Mock).mockReturnValue({
            services: {},
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should render', () => {
        getRender();
        expect(screen.queryByTestId('NavDrawer')).toBeInTheDocument();
        expect(screen.queryByTestId('Footer')).toBeInTheDocument();
    });

    it('Should toggleMenu', () => {
        getRender();

        fireEvent.click(screen.getByTestId('NavDrawer-toggleMenu'));

        waitFor(() => {
            expect(screen.queryByTestId('NavDrawer-menuOpen')).toBeInTheDocument();
        });
    });
});
