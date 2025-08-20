import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAppHelper } from 'Context';
import Container from './Container';

// Mock MUI
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Drawer: (props?: any) => (
        <div data-testid="Drawer">
            <button data-testid="Drawer-onClose" onClick={props?.onClose} />
            {props?.children}
        </div>
    ),

    Button: (props: any) => (
        <button data-testid="Button-submit" onClick={() => props?.onClick()}>
            {props?.children}
        </button>
    ),
}));

jest.mock('lodash', () => ({
    debounce: jest.fn((action) => action),
}));

jest.mock('Context', () => ({
    useAppHelper: jest.fn(),
}));

const getRender = (props?: any) => {
    render(<Container title="Demo Drawer" {...props} />);
};

describe('Render and Actions', () => {
    const mockConfirm = jest.fn();
    beforeEach(() => {
        (useAppHelper as jest.Mock).mockReturnValue({
            confirm: mockConfirm,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('render basic', () => {
        getRender({
            onSubmit: jest.fn(),
            loading: false,
        });
        expect(screen.getByText('Demo Drawer')).toBeInTheDocument();
        expect(screen.getByText('Common.Save')).toBeInTheDocument();
    });

    it('render customAction', () => {
        getRender({
            onSubmit: jest.fn(),
            customAction: <div data-testid="customAction" />,
            loading: true,
        });
        expect(screen.getByTestId('customAction')).toBeInTheDocument();
        expect(screen.getByText('Common.Loading')).toBeInTheDocument();
    });

    it('render custom ButtonSubmit ', () => {
        getRender({
            onSubmit: jest.fn(),
            customButtonSubmit: <button data-testid="customButtonSubmit" />,
            loading: true,
        });
        expect(screen.getByTestId('customButtonSubmit')).toBeInTheDocument();
    });

    it('should call Drawer onClose with confirmExit', () => {
        const mockOnClose = jest.fn();
        getRender({
            confirmExit: true,
            wrapperStyle: {},
            onClose: mockOnClose,
        });

        fireEvent.click(screen.getByTestId('Drawer-onClose'));

        waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('should call Drawer onClose without confirmExit', () => {
        const mockOnClose = jest.fn();
        getRender({
            confirmExit: false,
            onClose: mockOnClose,
        });

        fireEvent.click(screen.getByTestId('Drawer-onClose'));

        waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('should call Button submit', () => {
        const mockOnSubmit = jest.fn();
        getRender({
            onSubmit: mockOnSubmit,
        });

        fireEvent.click(screen.getByTestId('Button-submit'));

        waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });
});
