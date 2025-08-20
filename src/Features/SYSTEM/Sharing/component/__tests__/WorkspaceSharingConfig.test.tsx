import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkspaceSharingConfig, { WorkspaceSharingConfigProps } from '../WorkspaceSharingConfig';
import { useAtom } from 'jotai';
import { useParams } from 'react-router';
import { SharingConfigParamType } from '../../Types';

jest.mock('react-router', () => ({
    useParams: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'),
    useAtom: jest.fn(),
}));

jest.mock('../../../../Commons/Components/ClassicDrawer', () => (props: any) => (
    <div data-testid="ClassicDrawer">
        <h1>{props.title}</h1>
        <button data-testid="onSubmit" onClick={props.onSubmit}>
            Submit
        </button>
        {props.children}
        <span data-testid="confirmExit">{props.confirmExit ? 'true' : 'false'}</span>
    </div>
));

jest.mock('./AddOrEditConfig', () => (props: any) => (
    <div data-testid="AddOrEdit">
        <button data-testid="chooseWorkspace" onClick={() => props.onChoseWorkspace(1)}>
            Choose Workspace
        </button>
        <button data-testid="changeConfiguration" onClick={(e: any) => props.onChangeConfigurations(e.target.config, e.target.paramType)}>
            Change Configuration
        </button>
    </div>
));

const renderComponent = (props: WorkspaceSharingConfigProps) => {
    render(<WorkspaceSharingConfig {...props} />);
};

describe('WorkspaceSharingConfig Component', () => {
    const defaultProps: WorkspaceSharingConfigProps = {
        workspaces: [
            {
                id: 1,
                targetWorkspaceId: 1,
                sharingWorkspaceConfigs: [
                    {
                        id: 1,
                        paramName: 'filter1',
                        paramType: SharingConfigParamType.Filter,
                    },
                    {
                        id: 2,
                        paramName: 'schema1',
                        paramType: SharingConfigParamType.Schema,
                    },
                    {
                        id: 3,
                        paramName: 'Test 3',
                        paramType: SharingConfigParamType.Filter,
                    },
                ],
            },
        ],
        filter: ['filter1', 'filter2'],
        schema: ['schema1', 'schema2'],
        workspaceSelectedId: 1,
        onChangeConfigurations: jest.fn(),
    };

    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({ configId: '1' });
        (useAtom as jest.Mock).mockReturnValue([[{ id: 1, name: 'Workspace 1' }], jest.fn()]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with the correct title', () => {
        (useParams as jest.Mock).mockReturnValue({ configId: undefined });

        renderComponent(defaultProps);
        expect(screen.getByTestId('ClassicDrawer')).toBeInTheDocument();
        expect(screen.getByTestId('AddOrEdit')).toBeInTheDocument();
        expect(screen.getByText('Common.Create')).toBeInTheDocument();
    });

    it('renders the component with workspaces is null and workspaceSelectedId is undefined', () => {
        renderComponent({
            ...defaultProps,
            workspaces: undefined,
            workspaceSelectedId: undefined,
        });
        expect(screen.getByTestId('ClassicDrawer')).toBeInTheDocument();
        expect(screen.getByTestId('AddOrEdit')).toBeInTheDocument();
        expect(screen.getByText('Common.Edit')).toBeInTheDocument();
    });

    it('renders the edit title when editing', () => {
        renderComponent(defaultProps);
        expect(screen.getByTestId('ClassicDrawer')).toBeInTheDocument();
        expect(screen.getByTestId('AddOrEdit')).toBeInTheDocument();
        expect(screen.getByText('Common.Edit')).toBeInTheDocument();
    });

    it('calls onSubmit when the submit button is clicked', () => {
        renderComponent(defaultProps);
        fireEvent.click(screen.getByTestId('onSubmit'));

        expect(defaultProps.onChangeConfigurations).toHaveBeenCalled();
    });

    it('calls onSubmit when the submit button is clicked and targetWorkspaceId is null', () => {
        renderComponent({
            ...defaultProps,
            workspaces: defaultProps!.workspaces!.map((item: any) => {
                return { ...item, targetWorkspaceId: null };
            }),
        });
        fireEvent.click(screen.getByTestId('onSubmit'));

        expect(defaultProps.onChangeConfigurations).toHaveBeenCalled();
    });

    it('calls onSubmit when the submit button is clicked and isCreate = true', () => {
        (useParams as jest.Mock).mockReturnValue({ configId: undefined });
        renderComponent(defaultProps);
        fireEvent.click(screen.getByTestId('onSubmit'));

        expect(defaultProps.onChangeConfigurations).toHaveBeenCalled();
    });

    it('updates selected workspace when a workspace is chosen', () => {
        renderComponent(defaultProps);
        fireEvent.click(screen.getByTestId('chooseWorkspace'));

        expect(screen.getByTestId('confirmExit')).toHaveTextContent('true');
    });

    it('handles change configuration', () => {
        renderComponent(defaultProps);

        const changeConfigurationButton = screen.getByTestId('changeConfiguration');

        fireEvent.click(changeConfigurationButton, {
            target: {
                config: [
                    {
                        id: 1,
                        paramName: 'test name',
                        paramValue: 'test value',
                    },
                ],
                paramType: SharingConfigParamType.Schema,
            },
        });

        fireEvent.click(changeConfigurationButton, {
            target: {
                config: [
                    {
                        id: 1,
                        paramName: 'test name',
                        paramValue: 'test value',
                    },
                ],
                paramType: SharingConfigParamType.Schema,
            },
        });

        expect(screen.getByTestId('confirmExit')).toHaveTextContent('true');
    });
});
