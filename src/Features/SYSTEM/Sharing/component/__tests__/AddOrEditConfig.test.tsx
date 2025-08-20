import { render, screen, fireEvent } from '@testing-library/react';
import AddOrEditConfig from '../AddOrEditConfig';
import { SharingConfigParamType } from '../../Types';

jest.mock('./ChoseWorkspace', () => {
    return ({ onChange }: any) => (
        <div data-testid={`div-ChoseWorkspace`}>
            <input
                data-testid={`input-ChoseWorkspace`}
                onChange={(e) => onChange([{ id: 1, paramName: 'test', paramValue: e.target.value }])}
            />
            ChoseWorkspace
        </div>
    );
});

jest.mock('./ParamConfigurationInputs', () => {
    return ({ onChange, configType }: any) => (
        <div data-testid={`ParamConfigurationInputs-${configType}`}>
            <input
                data-testid={`input-${configType}`}
                onChange={(e) => onChange([{ id: 1, paramName: 'test', paramValue: e.target.value }])}
            />
            WorkspaceSharing.Caption.{configType}
        </div>
    );
});

describe('AddOrEditConfig', () => {
    const defaultProps = {
        selectedId: 1,
        isCreate: true,
        workspaceOptions: [
            { id: 1, name: 'Workspace 1' },
            { id: 2, name: 'Workspace 2' },
        ],
        configuration: {
            filter: [],
            schema: [],
        },
        onChoseWorkspace: jest.fn(),
        onClearWorkspace: jest.fn(),
        onChangeConfigurations: jest.fn(),
    };

    it('should render without crashing', () => {
        render(<AddOrEditConfig {...defaultProps} />);
        expect(screen.getByTestId('workspace-sharing-config')).toBeInTheDocument();
    });

    it('should call onClearWorkspace when close button is clicked', () => {
        const { container } = render(<AddOrEditConfig {...defaultProps} />);
        const closeButton = container.querySelector('[data-testid="CloseIcon"]');
        fireEvent.click(closeButton?.parentElement as Element);
        expect(defaultProps.onClearWorkspace).toHaveBeenCalledWith(1);
    });
    it('should display empty parameter message when there are no configurations and not in create mode', () => {
        render(<AddOrEditConfig {...defaultProps} isCreate={false} />);
        expect(screen.getByText('WorkspaceSharing.Label.EmptyParam')).toBeInTheDocument();
    });

    it('should render ParamConfigurationInputs for filter configurations', () => {
        const props = {
            ...defaultProps,
            configuration: {
                filter: [{ id: 1, paramName: 'filter1', paramValue: 'value1' }],
                schema: [],
            },
        };
        render(<AddOrEditConfig {...props} />);
        expect(screen.getByText('WorkspaceSharing.Caption.FILTER')).toBeInTheDocument();
        expect(screen.getByTestId('ParamConfigurationInputs-FILTER')).toBeInTheDocument();
    });

    it('should render ParamConfigurationInputs for schema configurations', async () => {
        const props = {
            ...defaultProps,
            configuration: {
                filter: [],
                schema: [{ id: 1, paramName: 'schema1', paramValue: 'value1' }],
            },
        };
        render(<AddOrEditConfig {...props} />);
        expect(screen.getByText('WorkspaceSharing.Caption.SCHEMA')).toBeInTheDocument();
        expect(screen.getByTestId('ParamConfigurationInputs-SCHEMA')).toBeInTheDocument();
    });

    it('should call onChangeConfigurations when Filter configuration changes', () => {
        const props = {
            ...defaultProps,
            configuration: {
                schema: [],
                filter: [{ id: 1, paramName: 'filter1', paramValue: 'value1' }],
            },
        };
        render(<AddOrEditConfig {...props} />);
        const input = screen.getByTestId('input-FILTER');
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(defaultProps.onChangeConfigurations).toHaveBeenCalledWith(
            [{ id: 1, paramName: 'test', paramValue: 'new value' }],
            SharingConfigParamType.Filter
        );
    });

    it('should call onChangeConfigurations when schema configuration changes', () => {
        const props = {
            ...defaultProps,
            configuration: {
                filter: [],
                schema: [{ id: 1, paramName: 'schema1', paramValue: 'value1' }],
            },
        };
        render(<AddOrEditConfig {...props} />);
        const input = screen.getByTestId('input-SCHEMA');
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(defaultProps.onChangeConfigurations).toHaveBeenCalledWith(
            [{ id: 1, paramName: 'test', paramValue: 'new value' }],
            SharingConfigParamType.Schema
        );
    });
});
