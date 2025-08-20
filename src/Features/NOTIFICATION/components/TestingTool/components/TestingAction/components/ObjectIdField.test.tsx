import { render, screen, fireEvent } from '@testing-library/react';
import ObjectIdField, { ObjectIdFieldProps } from './ObjectIdField';

jest.mock('@mui/material', () => ({
    Grid: ({ children }: any) => <div data-testid="grid">{children}</div>,
    TextField: ({ value, onChange, onKeyUp, slotProps }: any) => (
        <div data-testid="textfield">
            <input value={value} onChange={onChange} onKeyUp={onKeyUp} data-testid="input" />
            <div data-testid="start-adornment">{slotProps.input.startAdornment}</div>
            <div data-testid="end-adornment">{slotProps.input.endAdornment}</div>
        </div>
    ),
    IconButton: ({ onClick, children }: any) => (
        <button onClick={onClick} data-testid="load-button">
            {children}
        </button>
    ),
    InputAdornment: ({ children }: any) => <div>{children}</div>,
    CircularProgress: () => <div data-testid="loading" />,
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('@mui/icons-material/KeyboardDoubleArrowDown', () => () => 'DownIcon');

describe('ObjectIdField', () => {
    const defaultProps: ObjectIdFieldProps = {
        testingData: {
            objectId: 1,
        },
        objectTypeCode: 'TEST',
        loadingGetObjectTestJson: false,
        onChange: jest.fn(),
        loadObjectJson: jest.fn(),
    };

    it('renders with initial values', () => {
        render(<ObjectIdField {...defaultProps} />);
        expect(screen.getByTestId('input')).toHaveValue('1');
        expect(screen.getByText('TEST')).toBeInTheDocument();
    });

    it('handles Enter key press', () => {
        render(<ObjectIdField {...defaultProps} />);

        fireEvent.keyUp(screen.getByTestId('input'), { key: 'Shift' });
        expect(defaultProps.loadObjectJson).not.toHaveBeenCalledWith('TEST', 1);

        fireEvent.keyUp(screen.getByTestId('input'), { key: 'Enter' });
        expect(defaultProps.loadObjectJson).toHaveBeenCalledWith('TEST', 1);
    });

    it('shows loading state', () => {
        render(<ObjectIdField {...defaultProps} loadingGetObjectTestJson={true} />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.queryByTestId('load-button')).not.toBeInTheDocument();
    });

    it('handles load button click', () => {
        render(<ObjectIdField {...defaultProps} />);
        fireEvent.click(screen.getByTestId('load-button'));
        expect(defaultProps.loadObjectJson).toHaveBeenCalledWith('TEST', 1);
    });

    it('handles value change', () => {
        render(<ObjectIdField {...defaultProps} />);
        fireEvent.change(screen.getByTestId('input'), { target: { value: '456' } });
        expect(defaultProps.onChange).toHaveBeenCalledWith('objectId', '456');
    });
});
