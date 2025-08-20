import { render, screen, fireEvent } from '@testing-library/react';
import ClassicBaseDrawer from '../ClassicBaseDrawer';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

const theme = createTheme();

const defaultProps = {
    open: true,
    title: 'Test Drawer',
    children: <div>Test Content</div>,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
};

const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ClassicBaseDrawer', () => {
    it('renders with default props', () => {
        renderWithTheme(<ClassicBaseDrawer {...defaultProps} />);

        expect(screen.getByText('Test Drawer')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        renderWithTheme(<ClassicBaseDrawer {...defaultProps} />);

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onSubmit when save button is clicked', () => {
        renderWithTheme(<ClassicBaseDrawer {...defaultProps} />);

        const saveButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveButton);

        expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('disables save button when disableButtonSubmit is true', () => {
        renderWithTheme(<ClassicBaseDrawer {...defaultProps} disableButtonSubmit={true} />);

        const saveButton = screen.getByRole('button', { name: /save/i });
        expect(saveButton).toBeDisabled();
    });

    it('renders custom action when provided', () => {
        const customAction = <button>Custom Action</button>;
        renderWithTheme(<ClassicBaseDrawer {...defaultProps} customAction={customAction} />);

        expect(screen.getByText('Custom Action')).toBeInTheDocument();
    });
});
