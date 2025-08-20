import { render, screen, fireEvent } from '@testing-library/react';
import ParamConfigurationInputs, { ParamConfigurationInputsProps } from '../ParamConfigurationInputs';
import { Configuration, SharingConfigParamType } from '../../Types';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('./ParamInput', () => (props: any) => (
    <div data-testid="param-input">
        {props.paramType}
        <button data-testid="onParamChange" onClick={(e: any) => props.onParamChange(e.target.configurations)}>
            onParamChange
        </button>
    </div>
));
jest.mock('@mui/material/Select', () => (props: any) => (
    <div>
        <label>{props.label}</label>
        <span>{props.labelId}</span>
        <button data-testid="select-onChange" onClick={(e: any) => props.onChange(e)}>
            select on change
        </button>
    </div>
));

describe('ParamConfigurationInputs', () => {
    const configurations: Configuration[] = [
        { id: 1, paramName: 'param1', paramValue: 'value1', paramType: SharingConfigParamType.Schema },
    ];

    const renderComponent = (props: Partial<ParamConfigurationInputsProps> = {}) => {
        const defaultProps: ParamConfigurationInputsProps = {
            configurations: configurations,
            configurationParams: ['param1', 'param2'],
            paramNameFieldType: 'text',
            paramValueFieldType: 'text',
            onChange: jest.fn(),
            canAdd: true,
            configType: SharingConfigParamType.Schema,
            title: 'Test Title',
            ...props,
        };

        return render(<ParamConfigurationInputs {...defaultProps} />);
    };

    it('should render the ParamConfigurationInputs component', () => {
        renderComponent();

        expect(screen.getByTestId('param-config-input')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('demo-simple-select-standard-label')).toBeInTheDocument();
    });

    it('should render the ParamConfigurationInputs component with paramValueFieldType = "select"', () => {
        renderComponent({
            paramValueFieldType: 'select',
        });

        expect(screen.getByTestId('param-config-input')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('demo-simple-select-standard-label')).toBeInTheDocument();
    });

    it('should render the ParamConfigurationInputs component with empty configurations', () => {
        renderComponent({
            configurations: [],
        });

        expect(screen.getByTestId('param-config-input')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.queryByText('demo-simple-select-standard-label')).not.toBeInTheDocument();
    });

    it('should render the ParamConfigurationInputs component with different props', () => {
        renderComponent({
            canAdd: false,
            configType: SharingConfigParamType.Filter,
        });

        expect(screen.getByTestId('param-config-input')).toBeInTheDocument();
        expect(screen.getAllByTestId('param-input')).toHaveLength(2);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.queryByText('demo-simple-select-standard-label')).not.toBeInTheDocument();
    });

    it('should call onChange when adding a new configuration', () => {
        const onChangeMock = jest.fn();
        renderComponent({ onChange: onChangeMock });

        fireEvent.click(screen.getByText('Common.Create'));

        expect(onChangeMock).toHaveBeenCalledWith([
            { id: 1, paramName: 'param1', paramType: 'SCHEMA', paramValue: 'value1' },
            { id: 2, paramName: 'param1', paramType: 'SCHEMA', paramValue: '' },
        ]);
    });

    it('should call onChange when deleting a configuration', () => {
        const onChangeMock = jest.fn();
        renderComponent({ onChange: onChangeMock });

        fireEvent.click(screen.getByTestId('DeleteIcon'));

        expect(onChangeMock).toHaveBeenCalledWith([{ id: 1, paramName: 'param1', paramType: 'SCHEMA', paramValue: undefined }]);
    });

    it('should call onChange when deleting a configuration with different configurations length', () => {
        const onChangeMock = jest.fn();
        renderComponent({
            onChange: onChangeMock,
            configurations: [
                { id: 1, paramName: 'param1', paramType: 'SCHEMA', paramValue: 'value1' },
                { id: 2, paramName: 'param2', paramType: 'SCHEMA', paramValue: 'value2' },
            ],
        });

        fireEvent.click(screen.getAllByTestId('DeleteIcon')[0]); // xóa thằng đầu tiên có id = 1 => còn thằng thứ 2

        expect(onChangeMock).toHaveBeenCalledWith([{ id: 2, paramName: 'param2', paramType: 'SCHEMA', paramValue: 'value2' }]);
    });

    it('should call onChange when changing a schema param value', () => {
        const onChangeMock = jest.fn();
        renderComponent({ onChange: onChangeMock });

        const changeParamValue = screen.getByTestId('param-input');
        expect(changeParamValue).toBeInTheDocument();

        const onParamChange = screen.getByTestId('onParamChange');
        fireEvent.click(onParamChange, {
            target: { configurations: { id: 1, paramName: 'param1', paramValue: 'value2', paramType: 'SCHEMA' } },
        });

        expect(onChangeMock).toHaveBeenCalled();
    });

    it('should call onChange when changing a schema param key', () => {
        const onChangeMock = jest.fn();
        renderComponent({ onChange: onChangeMock });

        const onParamKeyChange = screen.getByTestId('select-onChange');
        expect(onParamKeyChange).toBeInTheDocument();
        fireEvent.click(onParamKeyChange, { target: { value: 'test' } });

        expect(onChangeMock).toHaveBeenCalled();
    });

    it('should disable the add button when canAdd is false', () => {
        renderComponent({ canAdd: false });

        expect(screen.queryByText('Common.Create')).not.toBeInTheDocument();
    });
});
