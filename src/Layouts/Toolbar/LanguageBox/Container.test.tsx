import { fireEvent, render, screen } from '@testing-library/react';
import Container from './Container';

jest.mock('../flag/gb', () => ({
    __esModule: true,
    default: () => 'EnglandFlag',
}));

jest.mock('../flag/id', () => ({
    __esModule: true,
    default: () => 'IndonesiaFlag',
}));

jest.mock('../flag/vn', () => ({
    __esModule: true,
    default: () => 'VietnamFlag',
}));

jest.mock('../flag/th', () => ({
    __esModule: true,
    default: () => 'VietnamFlag',
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Button: ({ children, onClick }: any) => (
        <button onClick={onClick} data-testid="Material-Button">
            {children}
        </button>
    ),
    Menu: ({ children, open, onClose }: any) => (
        <div data-testid="Material-Menu">
            {open ? <div>{children}</div> : null}
            <button onClick={onClose} data-testid="Material-Menu-onClose">
                Close
            </button>
        </div>
    ),
    MenuItem: ({ id, children, onClick }: any) => (
        <div data-testid={`Material-MenuItem-${id}`}>
            {children}
            <button onClick={onClick} data-testid={`Material-MenuItem-${id}-onClick`}>
                MenuItem
            </button>
        </div>
    ),
}));

const getRender = () => {
    render(<Container />);
};

const link = <a href="#">ClickMe</a>;

describe('Render & Actions', () => {
    it('should render button flag', () => {
        getRender();
        expect(screen.getByTestId('Material-Button')).toBeInTheDocument();
    });

    it('should show menu when click button flag', () => {
        getRender();
        fireEvent.click(screen.getByTestId('Material-Button'), {
            currentTarget: '<button>ClickMe</button>',
        });
        expect(screen.getByTestId('Material-Menu')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('Material-MenuItem-vi-onClick'));
        expect(screen.queryByTestId('Material-MenuItem-vi-onClick')).not.toBeInTheDocument();
        fireEvent.click(screen.getByTestId('Material-Button'), {
            currentTarget: '<button>ClickMe</button>',
        });
        fireEvent.click(screen.getByTestId('Material-MenuItem-en-onClick'));
        expect(screen.queryByTestId('Material-MenuItem-en-onClick')).not.toBeInTheDocument();
    });

    it('should call onClose', () => {
        getRender();
        fireEvent.click(screen.getByTestId('Material-Button'), {
            currentTarget: '<button>ClickMe</button>',
        });
        expect(screen.getByTestId('Material-Menu')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('Material-Menu-onClose'), {
            currentTarget: link,
        });
        expect(screen.queryByTestId('Material-MenuItem-en-onClick')).not.toBeInTheDocument();
    });
});
