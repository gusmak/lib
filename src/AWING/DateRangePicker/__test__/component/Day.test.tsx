import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import Day from 'AWING/DateRangePickerv2/component/Day';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#00000061',
        },
    },
});

const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Day Component', () => {
    describe('Rendering', () => {
        it('renders with default props', () => {
            renderWithTheme(<Day value={1} />);
            expect(screen.getByText('1')).toBeInTheDocument();
        });

        it('renders in disabled state', () => {
            renderWithTheme(<Day value={1} disabled />);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
        });

        it('renders in filled state', () => {
            renderWithTheme(<Day value={1} filled />);
            const button = screen.getByRole('button');
            expect(button).toHaveStyle({ backgroundColor: theme.palette.primary.dark });
        });

        it('renders in outlined state', () => {
            renderWithTheme(<Day value={1} outlined />);
            const button = screen.getByRole('button');
            expect(button).toHaveStyle({ border: `1px solid ${theme.palette.primary.dark}` });
        });
    });

    describe('Range States', () => {
        it('applies correct styles for start of range', () => {
            renderWithTheme(<Day value={1} startOfRange />);
            const container = screen.getByRole('button').parentElement;
            expect(container).toHaveStyle({ borderRadius: '50% 0 0 50%' });
        });

        it('applies correct styles for end of range', () => {
            renderWithTheme(<Day value={1} endOfRange />);
            const container = screen.getByRole('button').parentElement;
            expect(container).toHaveStyle({ borderRadius: '0 50% 50% 0' });
        });

        it('applies highlight styles', () => {
            renderWithTheme(<Day value={1} highlighted />);
            const container = screen.getByRole('button').parentElement;
            expect(container).toHaveStyle({ backgroundColor: theme.palette.primary.light });
        });
    });

    describe('Interactions', () => {
        it('calls onClick handler when clicked', () => {
            const handleClick = jest.fn();
            renderWithTheme(<Day value={1} onClick={handleClick} />);
            const button = screen.getByRole('button');
            fireEvent.click(button);
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('calls onHover handler when hovered', () => {
            const handleHover = jest.fn();
            renderWithTheme(<Day value={1} onHover={handleHover} />);
            const button = screen.getByRole('button');
            fireEvent.mouseOver(button);
            expect(handleHover).toHaveBeenCalledTimes(1);
        });

        it('does not call handlers when disabled', () => {
            const handleClick = jest.fn();
            const handleHover = jest.fn();
            renderWithTheme(<Day value={1} disabled onClick={handleClick} onHover={handleHover} />);
            const button = screen.getByRole('button');
            fireEvent.click(button);
            fireEvent.mouseOver(button);
            expect(handleClick).not.toHaveBeenCalled();
            expect(handleHover).not.toHaveBeenCalled();
        });
    });

    describe('Typography', () => {
        it('applies correct text color for regular state', () => {
            renderWithTheme(<Day value={1} />);
            const typography = screen.getByText('1');
            expect(typography).toHaveStyle({ color: theme.palette.text.primary });
        });

        it('applies correct text color for filled state', () => {
            renderWithTheme(<Day value={1} filled />);
            const typography = screen.getByText('1');
            expect(typography).toHaveStyle({ color: theme.palette.primary.contrastText });
        });

        it('applies correct text color for disabled state', () => {
            renderWithTheme(<Day value={1} disabled />);
            const typography = screen.getByText('1');
            expect(typography).toHaveStyle({ color: theme.palette.text.secondary });
        });
    });
});
