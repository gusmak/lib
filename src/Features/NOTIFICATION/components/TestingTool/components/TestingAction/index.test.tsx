import { render, screen, fireEvent } from '@testing-library/react';
import TestingAction from './index';

jest.mock('@mui/material', () => ({
    Grid: ({ children }: any) => <div data-testid="grid">{children}</div>,
    Paper: ({ children }: any) => <div data-testid="paper">{children}</div>,
    Typography: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('./components/Receivers', () => ({
    __esModule: true,
    default: ({ channelType, value }: any) => (
        <div data-testid="receivers">
            Channel: {channelType}, Value: {value}
        </div>
    ),
}));

jest.mock('./components/ObjectIdField', () => ({
    __esModule: true,
    default: () => <div data-testid="object-id-field" />,
}));

jest.mock('./components/DataTesting', () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="data-testing">
            <button data-testid="open-full-editor" onClick={(e: any) => props.onSetOpenFullEditor(true, e.target.position, 'Test')}>
                openFullEditor
            </button>
        </div>
    ),
}));

jest.mock('Features/NOTIFICATION/components/FullEditor', () => ({
    __esModule: true,
    default: ({ onClose, onChange }: any) => (
        <div data-testid="full-editor">
            <button data-testid="full-editor-change" onClick={(e: any) => onChange(e.target.value)}>
                onChange
            </button>
            <button data-testid="full-editor-close" onClick={onClose}>
                Close
            </button>
        </div>
    ),
}));

describe('TestingAction', () => {
    const defaultProps = {
        testingData: {
            changedObjectJson: '{}',
        },
        loadingGetObjectTestJson: false,
        previewIframeRef: { current: null },
        objectTypeCode: 'TEST',
        hasEmailChannel: false,
        hasTelegramChannel: false,
        loadObjectJson: jest.fn(),
        onChange: jest.fn(),
        openPreview: false,
        loadingPreview: false,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders basic component structure', () => {
        render(<TestingAction {...defaultProps} />);
        expect(screen.getByText('TestingTool.FormData.Header')).toBeInTheDocument();
        expect(screen.getByText('TestingTool.FormData.Description')).toBeInTheDocument();
    });

    it('renders basic component structure with channel', () => {
        const defaultPropsWithTelegramChannel = {
            testingData: {
                changedObjectJson: '{}',
            },
            loadingGetObjectTestJson: false,
            previewIframeRef: { current: null },
            objectTypeCode: 'TEST',
            hasEmailChannel: false,
            hasTelegramChannel: true,
            loadObjectJson: jest.fn(),
            onChange: jest.fn(),
            openPreview: false,
            loadingPreview: false,
        };
        render(<TestingAction {...defaultPropsWithTelegramChannel} />);
        expect(screen.getByText('TestingTool.FormData.Header')).toBeInTheDocument();
        expect(screen.getByText('TestingTool.FormData.Description')).toBeInTheDocument();
    });

    it('shows receivers for email channel', () => {
        render(<TestingAction {...defaultProps} hasEmailChannel={true} />);
        const receivers = screen.getByTestId('receivers');
        expect(receivers).toBeInTheDocument();
        expect(receivers).toHaveTextContent('Channel: Email, Value:');
    });

    it('handles opening full editor', () => {
        render(<TestingAction {...defaultProps} />);
        fireEvent.click(screen.getByTestId('open-full-editor'));
        expect(screen.getByTestId('full-editor')).toBeInTheDocument();
    });

    it('handles full editor state with position 0', () => {
        render(<TestingAction {...defaultProps} />);

        // position 0
        fireEvent.click(screen.getByTestId('open-full-editor'), { target: { position: 0 } });

        const editor = screen.getByTestId('full-editor');
        expect(editor).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('full-editor-change'), { target: { value: 'Test 0' } });

        fireEvent.click(screen.getByTestId('full-editor-close'));
        expect(screen.queryByTestId('full-editor')).not.toBeInTheDocument();
    });

    it('handles full editor state with position 1', () => {
        render(<TestingAction {...defaultProps} />);

        // position 0
        fireEvent.click(screen.getByTestId('open-full-editor'), { target: { position: 1 } });

        const editor = screen.getByTestId('full-editor');
        expect(editor).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('full-editor-change'), { target: { value: 'Test 1' } });

        fireEvent.click(screen.getByTestId('full-editor-close'));
        expect(screen.queryByTestId('full-editor')).not.toBeInTheDocument();
    });
});
