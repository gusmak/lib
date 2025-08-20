import { render, screen } from '@testing-library/react';
import LayoutContainer from '../Container';
import { useSetAtom } from 'jotai';
import { currentWorkspaceState, menuPermissionsState } from '../Atom';

jest.mock('lodash', () => ({
    cloneDeep: (props: any) => props,
}));

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'),
    useSetAtom: jest.fn(),
}));

jest.mock('../Dashboard', () => ({
    __esModule: true,
    default: () => <div data-testid="Dashboard" />,
}));

const getRender = (props?: any) => {
    render(<LayoutContainer appName="App Name" currentWorkspace={{ id: '1', name: 'Workspace 1' }} services={{}} {...props} />);
};

describe('Render', () => {
    beforeEach(() => {
        (useSetAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === currentWorkspaceState) return jest.fn();
            if (atom === menuPermissionsState) return jest.fn();
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should render', () => {
        getRender();
        expect(screen.queryByTestId('Dashboard')).toBeInTheDocument();
    });
});
