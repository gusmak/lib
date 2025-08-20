import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Container from './Container';

// Mock MUI
jest.mock('@mui/x-date-pickers', () => ({
    ...jest.requireActual('@mui/x-date-pickers'),
    DatePicker: (props?: any) => (
        <div data-testid="DatePicker">
            <input
                data-testid="textfield-input"
                onBlur={props?.slotProps?.textField?.onBlur}
                onFocus={props?.slotProps?.textField?.onFocus}
            />
            <p data-testid="DatePicker-format">{props?.format}</p>
            <p data-testid="DatePicker-helperText">{props?.helperText}</p>
            <button data-testid="DatePicker-onChange" onClick={() => props?.onChange()} />
        </div>
    ),
}));

const getRender = (props?: any) => {
    render(
        <Container
            fieldDef={{
                fieldName: 'date-demo',
            }}
            {...props}
        />
    );
};

describe('Render and Actions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render basic', () => {
        getRender();
        expect(screen.getByTestId('DatePicker')).toBeInTheDocument();
    });

    it('should render helper when error', () => {
        const mockElement = document.createElement('input');
        jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

        getRender({
            error: true,
            fieldDef: {
                helperText: 'Helper Text error',
            },
        });

        const input = screen.getByTestId('textfield-input');
        fireEvent.focus(input);

        waitFor(() => {
            expect(screen.getByTestId('DatePicker-format')).toHaveTextContent('DD/MM/YY');
            expect(document.getElementById).toHaveBeenCalledWith('test-field');
            expect(screen.getByTestId('DatePicker-helperText')).toHaveTextContent('Helper Text error');
        });
    });

    it('should call onChange', () => {
        const mockOnChange = jest.fn();

        getRender({
            fieldValue: new Date(),
            onChange: mockOnChange,
        });

        fireEvent.click(screen.getByTestId('DatePicker-onChange'));
        expect(mockOnChange).toHaveBeenCalled();
    });

    it('should set isFocus to false when onBlur is triggered', () => {
        getRender();
        const input = screen.getByTestId('textfield-input');
        fireEvent.blur(input);

        // Check UI has been changed
        expect(screen.getByTestId('DatePicker-format')).toHaveTextContent('DD/MM/YYYY');
    });

    it('should set isFocus to true when onFocus is triggered', () => {
        const fieldDef = { fieldName: 'test-field' };

        // Mock document.getElementById
        const mockElement = document.createElement('input');
        jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

        getRender({
            fieldDef: { fieldDef },
        });

        const input = screen.getByTestId('textfield-input');
        fireEvent.focus(input);

        waitFor(() => {
            expect(screen.getByTestId('DatePicker-format')).toHaveTextContent('DD/MM/YY');
            expect(document.getElementById).toHaveBeenCalledWith('test-field');
        });
    });
});
