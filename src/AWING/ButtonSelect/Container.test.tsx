import { fireEvent, render, screen } from '@testing-library/react';
import Container from './Container';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        text: {
            primary: '#000000',
        },
    },
});

// Mock MUI
jest.mock('@mui/icons-material', () => ({
    KeyboardArrowDown: () => <div data-testid="KeyboardArrowDown" />,
}));
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Button: (props?: any) => {
        return (
            <div data-testid="Button">
                {props?.sx.color({
                    palette: {
                        text: { primary: '#333' },
                    },
                })}
                <button data-testid="Button-onClick" onClick={props?.onClick} />
                {props?.endIcon}
                {props?.children}
            </div>
        );
    },
    Menu: (props?: any) => (
        <div data-testid="Menu">
            {props?.open ? <p data-testid="Menu-open" /> : <p data-testid="Menu-not-open" />}
            <button data-testid="Menu-onClose" onClick={props?.onClose} />
            {props?.children}
        </div>
    ),
    MenuItem: (props?: any) => (
        <div data-testid="MenuItem">
            <button data-testid="MenuItem-onClick" onClick={props?.onClick} />
            {props?.children}
        </div>
    ),
}));

const getRender = (props?: any) => {
    render(
        <ThemeProvider theme={theme}>
            <Container options={[]} {...props} />
        </ThemeProvider>
    );
};

describe('Render and Actions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('render basic', () => {
        getRender();
        expect(screen.getByTestId('Button')).toBeInTheDocument();
        expect(screen.getByTestId('KeyboardArrowDown')).toBeInTheDocument();
    });

    it('render menu', () => {
        getRender();

        fireEvent.click(screen.getByTestId('Button-onClick'));
        expect(screen.getByTestId('Menu-open')).toBeInTheDocument();
    });

    it('render list menu item', () => {
        const mockOnChangeSelected = jest.fn();
        getRender({
            options: [
                {
                    icon: 'icon demo 1',
                    name: 'name demo 1',
                    action: jest.fn(),
                },
                {
                    icon: 'icon demo 2',
                    name: 'name demo 2',
                    action: jest.fn(),
                },
            ],
            onChangeSelected: mockOnChangeSelected,
        });

        expect(screen.getAllByTestId('MenuItem')).toHaveLength(2);
        fireEvent.click(screen.getAllByTestId('MenuItem-onClick')[1]);
        expect(mockOnChangeSelected).toHaveBeenCalled();
    });

    it('render list menu item', () => {
        getRender({
            options: [
                {
                    icon: 'icon demo 1',
                    name: 'name demo 1',
                    action: jest.fn(),
                },
                {
                    icon: 'icon demo 2',
                    name: 'name demo 2',
                    action: jest.fn(),
                },
            ],
        });

        fireEvent.click(screen.getByTestId('Menu-onClose'));
        expect(screen.getByTestId('Menu-not-open')).toBeInTheDocument();
    });
});
