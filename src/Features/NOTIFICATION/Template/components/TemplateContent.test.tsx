import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TemplateContent, { OwnProps } from './TemplateContent';
import { ChannelTypeMap, TemplateContentType } from 'Features/NOTIFICATION/enums';
import { previewTemplate } from '../utils';
import { useGetContext } from '../context';
import { TemplateContext } from '../context';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// jest.mock('hooks/useAppHelper', () => ({
//     __esModule: true,
//     default: () => ({
//         snackbar: jest.fn(),
//     }),
// }));

// jest.mock('../context', () => ({
//     useGetContext: () => jest.fn(),
// }));

jest.mock('../utils', () => ({
    previewTemplate: jest.fn(),
}));

jest.mock('Features/NOTIFICATION/components/MonacoEditor', () => ({
    __esModule: true,
    default: ({ value, onChange }: any) => (
        <div data-testid="monaco-editor">
            <input value={value} onChange={(e) => onChange(e.target.value)} data-testid="monaco-input" />
        </div>
    ),
}));

const generateTemplate = jest.fn();

describe('TemplateContent', () => {
    const defaultProps: OwnProps = {
        onChange: jest.fn(),
        contentPermission: true,
        value: 'test content',
        // loadingGenerateTemplate: false,
        testingDataInput: {},
    };

    beforeEach(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
        // generateTemplate.mockImplementation(({ onCompleted }) => {
        //     onCompleted({ generateTemplate: '<div>Test</div>' });
        // });
        // (useGetContext as jest.Mock).withImplementation(() => ({
        //     services: {
        //         generateTemplate,
        //     }
        // }))
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders HTML editor when type is HTML', () => {
        render(<TemplateContent {...defaultProps} type={TemplateContentType.HTML} />);
        expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    });

    it('renders text field when type is not HTML', () => {
        render(<TemplateContent {...defaultProps} type={TemplateContentType.TEXT} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('shows preview button for FILE channel type', () => {
        render(<TemplateContent {...defaultProps} channelType={ChannelTypeMap.FILE} value="test" />);
        expect(screen.getByText('FileExport.Preview')).toBeInTheDocument();
    });

    it('handles preview action correctly', async () => {
        render(
            <TemplateContext.Provider
                value={{
                    services: {
                        generateTemplate: jest.fn().mockResolvedValue({ generateTemplate: '<div>Test</div>' }),
                        createTemplate: jest.fn(),
                        updateTemplate: jest.fn(),
                        deleteNotificationTemplate: jest.fn(),
                        getObjectDefinitions: jest.fn(),
                        getTemplateById: jest.fn(),
                        getTemplates: jest.fn(),
                    },
                }}
            >
                <TemplateContent {...defaultProps} channelType={ChannelTypeMap.FILE} value="test" />
            </TemplateContext.Provider>
        );

        fireEvent.click(screen.getByText('FileExport.Preview'));

        await waitFor(() => {
            expect(previewTemplate).toHaveBeenCalled();
            expect(screen.getByText('Template.Label.Preview')).toBeInTheDocument();
            expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
                behavior: 'smooth',
                block: 'start',
            });
        });
    });

    it('handles preview action correctly with value is undefined', async () => {
        render(<TemplateContent {...defaultProps} channelType={ChannelTypeMap.FILE} value={undefined} />);

        expect(screen.queryByText('Template.Label.Preview')).not.toBeInTheDocument();
    });

    it('handles content changes', () => {
        render(<TemplateContent {...defaultProps} type={TemplateContentType.TEXT} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'new content' } });

        expect(defaultProps.onChange).toHaveBeenCalledWith('new content');
    });

    it('disables preview when no content', () => {
        render(<TemplateContent {...defaultProps} channelType={ChannelTypeMap.FILE} value="" />);

        expect(screen.queryByText('FileExport.Preview')).not.toBeInTheDocument();
    });
});
