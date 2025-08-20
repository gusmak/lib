import { render, screen, fireEvent } from '@testing-library/react';
import ComboBox, { OwnProps } from '../ChoseWorkspace';
import { Workspace } from 'Features/SYSTEM/types';

const options: Workspace[] = [
    { id: 1, name: 'Workspace 1' },
    { id: 2, name: 'Workspace 2' },
];

jest.mock('@mui/material/Autocomplete', () => (props: any) => (
    <div data-testid="chose-workspace-field">
        {props.disabled ? <span data-testid="disabled"></span> : <span data-testid="enabled"></span>}
        {props.options.map((option: any) => (
            <span key={option.value} data-testid="option">
                {option.text}
            </span>
        ))}
        <button data-testid="getOptionLabel" onClick={(e: any) => props.getOptionLabel(e.target.optionValue)}>
            getOptionLabel
        </button>
        <button data-testid="renderInput" onClick={(e: any) => props.renderInput(e.target.optionValue)}>
            renderInput
        </button>
        <button data-testid="onChange" onClick={(e: any) => props.onChange(e, e.target.optionValue)}>
            onChange
        </button>
    </div>
));

describe('ChoseWorkspace', () => {
    const renderComponent = (props: Partial<OwnProps> = {}) => {
        const defaultProps: OwnProps = {
            selectedId: undefined,
            options: options,
            disabled: false,
            onChange: jest.fn(),
            ...props,
        };

        return render(<ComboBox {...defaultProps} />);
    };

    it('should render the ComboBox component', () => {
        renderComponent();

        const getOptionLabel = screen.getByTestId('getOptionLabel');
        const renderInput = screen.getByTestId('renderInput');

        expect(screen.getByTestId('chose-workspace-field')).toBeInTheDocument();
        expect(getOptionLabel).toBeInTheDocument();
        expect(renderInput).toBeInTheDocument();

        fireEvent.click(getOptionLabel, { target: { optionValue: { text: 'test' } } });
        fireEvent.click(renderInput, { target: { optionValue: { text: 'test' } } });
    });

    it('should display the correct options', () => {
        renderComponent();

        const options = screen.getAllByTestId('option');
        expect(options[0]).toHaveTextContent('Workspace 1');
        expect(options[1]).toHaveTextContent('Workspace 2');
    });

    it('should handle valid value option in handleChangeWorkspace', () => {
        const onChangeMock = jest.fn();
        renderComponent({ onChange: onChangeMock });

        const onChange = screen.getByTestId('onChange');
        expect(onChange).toBeInTheDocument();
        fireEvent.click(onChange, { target: { optionValue: { value: 1, text: 'test' } } });

        expect(onChangeMock).toHaveBeenCalledWith(1);
    });

    it('should handle invalid value option in handleChangeWorkspace', () => {
        const onChangeMock = jest.fn();
        renderComponent({ onChange: onChangeMock });

        const onChange = screen.getByTestId('onChange');
        expect(onChange).toBeInTheDocument();
        fireEvent.click(onChange, { target: { optionValue: null } });

        expect(onChangeMock).toHaveBeenCalledWith(-1);
    });

    it('should disable the ComboBox when disabled prop is true', () => {
        renderComponent({ disabled: true });

        expect(screen.queryByTestId('disabled')).toBeInTheDocument();
        expect(screen.queryByTestId('enabled')).not.toBeInTheDocument();
    });
});
