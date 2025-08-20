import { render, screen, fireEvent } from '@testing-library/react';
import DataTesting from './DataTesting';

jest.mock('@mui/material', () => ({
    Grid: ({ children }: any) => <div>{children}</div>,
    Typography: ({ children }: any) => <div>{children}</div>,
    IconButton: ({ onClick, children, title }: any) => (
        <button onClick={onClick} title={title}>
            {children}
        </button>
    ),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('@mui/icons-material/OpenInFull', () => () => 'OpenFullIcon');

jest.mock('Features/NOTIFICATION/components/MonacoEditor', () => ({
    __esModule: true,
    default: ({ value, onChange }: any) => (
        <textarea data-testid="monaco-editor" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    ),
}));

describe('DataTesting', () => {
    const mockProps = {
        testingData: {
            oldObjectJson: '{"old": "data"}',
        },
        onChange: jest.fn(),
        onSetOpenFullEditor: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders old and changed data sections', () => {
        render(<DataTesting {...mockProps} />);

        expect(screen.getByText('TestingTool.FormData.Old')).toBeInTheDocument();
        expect(screen.getByText('TestingTool.FormData.Change')).toBeInTheDocument();
    });

    it('displays correct initial data in editors', () => {
        render(<DataTesting {...mockProps} />);

        const editors = screen.getAllByTestId('monaco-editor');
        expect(editors[0]).toHaveValue('{"old": "data"}');
        expect(editors[1]).not.toHaveValue();
    });

    it('calls onSetOpenFullEditor when clicking full editor buttons', () => {
        render(<DataTesting {...mockProps} />);

        const buttons = screen.getAllByTitle('TestingTool.FormData.OpenInFullTitle');
        fireEvent.click(buttons[1]);

        expect(mockProps.onSetOpenFullEditor).toHaveBeenCalledWith(true, 1, '');
        fireEvent.click(buttons[0]);

        expect(mockProps.onSetOpenFullEditor).toHaveBeenCalledWith(true, 0, '{"old": "data"}');
    });

    it('calls onChange when editing data', () => {
        render(<DataTesting {...mockProps} />);

        const editors = screen.getAllByTestId('monaco-editor');
        fireEvent.change(editors[0], { target: { value: 'new value' } });

        expect(mockProps.onChange).toHaveBeenCalledWith('oldObjectJson', 'new value');
    });
});
