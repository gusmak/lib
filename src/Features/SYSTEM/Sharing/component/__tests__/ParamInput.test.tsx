import { render, screen, fireEvent } from '@testing-library/react';
import ParamInput, { OwnProps } from '../ParamInput';
import { ParamConfiguration } from '../../Types';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    TextField: (props: any) => (
        <div data-testid={props['data-testid']}>
            <span>{props.label}</span>
            <button data-testid={`${props['data-testid']}-onChange`} onClick={(e: any) => props.onChange(e)}>
                onChange
            </button>
        </div>
    ),
}));

describe('ParamInput', () => {
    const paramConfiguration: ParamConfiguration = {
        id: 1,
        paramName: 'param1',
        paramValue: 'value1',
    };

    const renderComponent = (props: Partial<OwnProps> = {}) => {
        const defaultProps: OwnProps = {
            paramType: 'name',
            type: 'text',
            paramConfiguration: paramConfiguration,
            configurations: [paramConfiguration],
            onParamChange: jest.fn(),
            ...props,
        };

        return render(<ParamInput {...defaultProps} />);
    };

    it('should render the param name input when paramType is "name" and type is "text"', () => {
        renderComponent({ paramType: 'name', type: 'text' });

        expect(screen.getByTestId('param-name-input')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.ParamName')).toBeInTheDocument();
    });

    it('should render the param name input when param name is undefined', () => {
        renderComponent({ paramType: 'name', type: 'text', paramConfiguration: { ...paramConfiguration, paramName: undefined as any } });

        expect(screen.getByTestId('param-name-input')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.ParamName')).toBeInTheDocument();
    });

    it('should render the param name input when param value is undefined', () => {
        renderComponent({ paramType: 'value', type: 'text', paramConfiguration: { ...paramConfiguration, paramValue: undefined } });

        expect(screen.getByTestId('param-value-input')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.ParamValue')).toBeInTheDocument();
    });

    it('should render null when param type is invalid', () => {
        renderComponent({ paramType: undefined, type: 'text' });

        expect(screen.queryByTestId('param-name-input')).not.toBeInTheDocument();
        expect(screen.queryByTestId('param-value-input')).not.toBeInTheDocument();
    });

    it('should render the param value input when paramType is "value" and type is "text"', () => {
        renderComponent({ paramType: 'value', type: 'text' });

        expect(screen.getByTestId('param-value-input')).toBeInTheDocument();
        expect(screen.getByText('WorkspaceSharing.Label.ParamValue')).toBeInTheDocument();
    });

    it('should call onParamChange when the param value input changes', () => {
        const onParamChangeMock = jest.fn();
        renderComponent({ paramType: 'value', type: 'text', onParamChange: onParamChangeMock });

        const valueInputChange = screen.getByTestId('param-value-input-onChange');
        expect(valueInputChange).toBeInTheDocument();
        fireEvent.click(valueInputChange, { target: { value: 'new value' } });

        expect(onParamChangeMock).toHaveBeenCalled();
    });

    it('should not render the param name input when type is not "text"', () => {
        renderComponent({ paramType: 'name', type: 'select' });

        expect(screen.queryByTestId('param-name-input')).not.toBeInTheDocument();
    });

    it('should not render the param value input when type is not "text"', () => {
        renderComponent({ paramType: 'value', type: 'select' });

        expect(screen.queryByTestId('param-value-input')).not.toBeInTheDocument();
    });
});
