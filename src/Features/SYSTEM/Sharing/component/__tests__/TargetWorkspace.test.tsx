import { render, screen, fireEvent } from '@testing-library/react';
import TargetWorkspace, { TargetWorkspaceProps } from '../TargetWorkspace';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { WorkspaceOptionsState, WorkspacesState, confirmExitState } from '../../Atoms';
import { SharingWorkspace } from '../../Types';
import { MemoryRouter } from 'react-router';
import { useNavigate } from 'react-router';
import { Constants } from '../../../constants';
import { workspaceCheckFilterValueConfigs } from '../../Utils';

const ConfigCreatePath = `${Constants.WORKSPACE_SHARING_CONFIG_PATH}${Constants.CREATE_PATH}`;
const ConfigCreateAllPath = `${Constants.WORKSPACE_SHARING_CONFIG_PATH}${Constants.CREATE_ALL_PATH}`;
const ConfigEditPath = `${Constants.WORKSPACE_SHARING_CONFIG_PATH}${Constants.EDIT_PATH}`;

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'),
    useAtom: jest.fn(),
    useSetAtom: jest.fn(),
    useAtomValue: jest.fn(),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
}));

jest.mock('../Utils', () => ({
    workspaceCheckFilterValueConfigs: jest.fn(),
}));

jest.mock('./../../../../AWING', () => ({
    // ...jest.requireActual('./../../../../AWING'),
    Page: (props: any) => {
        return (
            <div data-testid="Page">
                <span data-testid={props.caption}>{props.caption}</span>
                <div data-testid="actions">{props.actions}</div>
                {props.children}
            </div>
        );
    },
    SearchBox: (props: any) => (
        <input
            data-testid="SearchBox"
            type="text"
            placeholder={props.placeholderInput}
            onChange={(e) => props.onSearch('text', e.target.value)}
        />
    ),
    DataGrid: (props: any) => (
        <table data-testid="DataGrid">
            <tbody>
                <span data-testid="totalOfRows">{props.totalOfRows}</span>
                {props.rows.map((row: any) => (
                    <tr key={row.id} onClick={() => props.onRowClick(row.id)}>
                        <td>{row.targetWorkspace?.name}</td>
                    </tr>
                ))}
                {props.columns.map((column: any, index: number) => (
                    <div key={column.key} data-testid={column.key}>
                        <th>{column.headerName}</th>
                        {column.valueGetter ? (
                            <button data-testid={`column-${index}-valueGetter`} onClick={() => column.valueGetter({ row: { id: 1 } })}>
                                valueGetter
                            </button>
                        ) : null}
                    </div>
                ))}
                {props.rowActions.map((item: any) => {
                    return (
                        <button data-testid={item.tooltipTitle} onClick={() => item.action(1)}>
                            action
                        </button>
                    );
                })}
                <button data-testid="onRowClick" onClick={() => props.onRowClick(1)}>
                    onRowClick
                </button>
                <button data-testid="getRowId" onClick={() => props.getRowId(1)}>
                    onRowClick
                </button>
                <button data-testid="onPageSizeChange" onClick={() => props.onPageSizeChange(1)}>
                    onPageSizeChange
                </button>
                <button data-testid="onPageIndexChange" onClick={() => props.onPageIndexChange(1)}>
                    onPageIndexChange
                </button>
            </tbody>
        </table>
    ),
}));

jest.mock('./WorkspaceSharingConfig', () => (props: any) => (
    <div data-testid="WorkspaceSharingConfig">
        <button data-testid="onChangeConfigurations" onClick={(e: any) => props.onChangeConfigurations(e.target.config)}>
            onChangeConfigurations
        </button>
    </div>
));

jest.mock('./AllWorkspaceConfig', () => (props: any) => (
    <div data-testid="AllWorkspaceConfig">
        <button data-testid="onChangeMultiConfigurations" onClick={(e: any) => props.onChangeMultiConfigurations(e.target.config)}>
            onChangeMultiConfigurations
        </button>
    </div>
));

describe('TargetWorkspace', () => {
    const mockNavigate = jest.fn();
    const mockSetWorkspaces = jest.fn();
    const mockSetConfirmExit = jest.fn();

    const workspaceOptions = [
        { id: 1, name: 'Workspace 1', customerId: 1 },
        { id: 2, name: 'Workspace 2', customerId: 2 },
        { id: 3, name: 'Workspace 3', customerId: 3 },
    ];

    const workspaces: SharingWorkspace[] = [
        {
            __typename: 'SharingWorkspace',
            id: 1,
            targetWorkspaceId: 1,
        },
    ];

    const renderComponent = (props: Partial<TargetWorkspaceProps> = {}) => {
        const defaultProps: TargetWorkspaceProps = {
            configurationParams: undefined,
            filterParams: undefined,
            schemaParams: undefined,
            workspaces: workspaces,
            workspaceSharing: { objectFilterId: undefined, schemaId: 1 },
            ...props,
        };

        render(
            <MemoryRouter initialEntries={['/', `${ConfigCreatePath}`, `${ConfigEditPath}/:configId`, `${ConfigCreateAllPath}`]}>
                <TargetWorkspace {...defaultProps} />
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useAtom as jest.Mock).mockImplementation((state) => {
            if (state === WorkspacesState) return [workspaces, mockSetWorkspaces];
            return [[], jest.fn()];
        });
        (useAtomValue as jest.Mock).mockImplementation((state) => {
            if (state === WorkspaceOptionsState) return workspaceOptions;
            return null;
        });
        (useSetAtom as jest.Mock).mockImplementation((state) => {
            if (state === confirmExitState) return mockSetConfirmExit;
            return jest.fn();
        });
        (workspaceCheckFilterValueConfigs as jest.Mock).mockReturnValue({ check: false, value: [] });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the TargetWorkspace component', () => {
        renderComponent();

        expect(screen.getByText('WorkspaceSharing.TargetWorkspaceTitle')).toBeInTheDocument();
    });

    it('should call handleCreate when the create button is clicked', () => {
        (workspaceCheckFilterValueConfigs as jest.Mock).mockReturnValue({ check: true, value: [] });
        renderComponent();

        fireEvent.click(screen.getByTestId('create-workspace'));

        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigCreatePath}`);
    });

    it('should call handleAddAll when the add all button is clicked', () => {
        renderComponent();

        fireEvent.click(screen.getByTestId('add-all-workspace'));

        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigCreateAllPath}`);
    });

    it('should call handleDeleted when the delete button is clicked', async () => {
        renderComponent();

        fireEvent.click(screen.getByTestId('Common.Delete'));
        const mockSetWorkspaceCallback = mockSetWorkspaces.mock.calls[1][0];
        mockSetWorkspaceCallback(workspaces);
        expect(mockSetConfirmExit).toHaveBeenCalledWith(true);
        expect(mockSetWorkspaces).toHaveBeenCalled();
    });

    it('handles search', async () => {
        renderComponent();

        fireEvent.change(screen.getByTestId('SearchBox'), { target: { value: 'Workspace 1' } });

        expect(screen.getByTestId('totalOfRows')).toHaveTextContent('1');
    });

    it('should call handleRowEdit when a row is clicked', () => {
        renderComponent();

        fireEvent.click(screen.getByTestId('getRowId'));
        fireEvent.click(screen.getByTestId('column-0-valueGetter'));
        fireEvent.click(screen.getByTestId('column-1-valueGetter'));
        fireEvent.click(screen.getByTestId('onPageSizeChange'));
        fireEvent.click(screen.getByTestId('onPageIndexChange'));
        fireEvent.click(screen.getByTestId('onRowClick'));

        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigEditPath}/1`);
    });

    it('should update workspaces when handleChangeConfigurations is called and id is different', () => {
        renderComponent();

        fireEvent.click(screen.getByTestId('create-workspace'));

        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigCreatePath}`);

        const config = {
            id: -1,
            workspaceId: 1,
            configurations: [{ id: 1, paramName: 'param1', paramValue: 'value1' }],
        };

        const onChangeConfigurationsButton = screen.getByTestId('onChangeConfigurations');

        expect(screen.getByTestId('WorkspaceSharingConfig')).toBeInTheDocument();
        expect(onChangeConfigurationsButton).toBeInTheDocument();
        fireEvent.click(onChangeConfigurationsButton, { target: { config } });
        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigEditPath}`);
    });

    it('should update workspaces when handleChangeConfigurations is called', () => {
        renderComponent();

        fireEvent.click(screen.getByTestId('create-workspace'));

        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigCreatePath}`);

        const config = {
            id: 1,
            workspaceId: 1,
            configurations: [{ id: 1, paramName: 'param1', paramValue: 'value1' }],
        };

        const onChangeConfigurationsButton = screen.getByTestId('onChangeConfigurations');

        expect(screen.getByTestId('WorkspaceSharingConfig')).toBeInTheDocument();
        expect(onChangeConfigurationsButton).toBeInTheDocument();
        fireEvent.click(onChangeConfigurationsButton, { target: { config } });
        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigEditPath}`);
    });

    it('should update workspaces when handleChangeMultiConfigurations is called and workspaceId is different', () => {
        renderComponent();

        fireEvent.click(screen.getByTestId('add-all-workspace'));

        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigCreateAllPath}`);

        const config = [
            {
                workspaceId: -1,
                configurations: [{ id: 1, paramName: 'param1', paramValue: 'value1' }],
            },
        ];

        const onChangeMultiConfigurationsButton = screen.getByTestId('onChangeMultiConfigurations');
        expect(screen.getByTestId('AllWorkspaceConfig')).toBeInTheDocument();
        expect(onChangeMultiConfigurationsButton).toBeInTheDocument();
        fireEvent.click(onChangeMultiConfigurationsButton, { target: { config } });
        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigEditPath}`);
    });

    it('should update workspaces when handleChangeMultiConfigurations is called', () => {
        renderComponent();

        fireEvent.click(screen.getByTestId('add-all-workspace'));

        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigCreateAllPath}`);

        const config = [
            {
                workspaceId: 1,
                configurations: [{ id: 1, paramName: 'param1', paramValue: 'value1' }],
            },
        ];

        const onChangeMultiConfigurationsButton = screen.getByTestId('onChangeMultiConfigurations');
        expect(screen.getByTestId('AllWorkspaceConfig')).toBeInTheDocument();
        expect(onChangeMultiConfigurationsButton).toBeInTheDocument();
        fireEvent.click(onChangeMultiConfigurationsButton, { target: { config } });
        expect(mockNavigate).toHaveBeenCalledWith(`${ConfigEditPath}`);
    });
});
