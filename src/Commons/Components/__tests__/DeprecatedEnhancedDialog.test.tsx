import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DeprecatedEnhancedDialog from '../DeprecatedEnhancedDialog';
import { textValidation } from 'AWING/ultis';

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Dialog: (props?: any) => (
        <div data-testid="Dialog">
            <button onClick={() => props?.onClose()} data-testid="Dialog-onClose" />
            {props?.children}
        </div>
    ),
    TextField: (props?: any) => (
        <div data-testid="TextField">
            <p data-testid="TextField-label">{props?.label}</p>
            <p data-testid="TextField-helperText">{props?.helperText}</p>
            {props?.error ? <p data-testid="TextField-error" /> : <p data-testid="TextField-without-error" />}
            <button onClick={(e: any) => props?.onChange(e.target.value)} data-testid="TextField-onChange" />
            <input onKeyDown={(e: any) => props?.onKeyDown(e)} data-testid="TextField-onKeyDown" />
        </div>
    ),
    Button: (props: any) => (
        <button data-testid="Button" onClick={() => props?.onClick()}>
            {props?.children}
        </button>
    ),
}));

jest.mock('AWING/ultis/validation', () => ({
    textValidation: jest.fn(),
}));

const getRender = (props?: any) => {
    render(<DeprecatedEnhancedDialog isOpen={false} {...props} />);
};

describe('Render', () => {
    it('should render', () => {
        getRender();

        expect(screen.getByTestId('Dialog')).toBeInTheDocument();
        expect(screen.getByText('Dialog.Title')).toBeInTheDocument();
    });

    it('should render text label', () => {
        getRender({
            label: 'Text label',
        });

        expect(screen.getByTestId('TextField-label')).toHaveTextContent('Text label');
    });
});

describe('Actions', () => {
    it('should call handle close', () => {
        const mockOnClose = jest.fn();
        getRender({
            onClose: mockOnClose,
        });

        fireEvent.click(screen.getByTestId('Dialog-onClose'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should change TextField', () => {
        const mockOnClose = jest.fn();

        (textValidation as jest.Mock).mockReturnValue({
            valid: true,
            message: 'demo value',
        });

        getRender({
            onClose: mockOnClose,
        });

        fireEvent.click(screen.getByTestId('TextField-onChange'), {
            target: {
                value: 'demo value',
            },
        });

        waitFor(() => {
            expect(screen.getByTestId('TextField-without-error')).toBeInTheDocument();
        });
    });

    it('should change TextField not valid', () => {
        const mockOnClose = jest.fn();

        (textValidation as jest.Mock).mockReturnValue({
            valid: false,
            message: '%%',
        });

        getRender({
            onClose: mockOnClose,
        });

        fireEvent.click(screen.getByTestId('TextField-onChange'), {
            target: {
                value: '%%',
            },
        });

        waitFor(() => {
            expect(screen.getByTestId('TextField-error')).toBeInTheDocument();
        });
    });

    it('should onKeyDown to submit', () => {
        const mockOnSubmit = jest.fn();

        getRender({
            onSubmit: mockOnSubmit,
        });

        fireEvent.keyDown(screen.getByTestId('TextField-onKeyDown'), { key: 'Enter', code: 'Enter', charCode: 13 });
        waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });

    it('should click to submit button', () => {
        const mockOnSubmit = jest.fn();
        (textValidation as jest.Mock).mockReturnValue({
            valid: true,
            message: 'demo value',
        });

        getRender({
            // notIncludeInput: true,
            onSubmit: mockOnSubmit,
        });

        fireEvent.click(screen.getAllByTestId('Button')[1]);
        waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });
});
