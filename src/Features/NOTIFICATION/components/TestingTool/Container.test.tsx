import { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestingTool, { NotificationTestingToolProps } from './index';
import { ConfigTypeCodeMap } from 'Features/NOTIFICATION/enums';
import { ChannelTypeMap } from 'Features/NOTIFICATION/enums';
import { TemplateContentType } from '../../enums';
import { computedTestingData } from './utils';
import { useAppHelper } from 'Context';

jest.mock('@mui/material', () => ({
    Grid: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('@mui/lab', () => ({
    LoadingButton: ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('Context', () => ({
    useAppHelper: jest.fn(),
}));
jest.mock('AWING', () => ({
    emailValid: jest.fn(),
    Drawer: (props: any) => (
        <div>
            <h6 data-testid="drawer-title">{props?.title}</h6>
            <button data-testid="drawer-onClose " onClick={props.onClose} />
            <button data-testid="drawer-submit" onClick={props.onSubmit}>
                Submit
            </button>

            {props.children}
        </div>
    ),
}));

jest.mock('./utils', () => ({
    ...jest.requireActual('./utils'),
    computedTestingData: jest.fn().mockReturnValue({}),
    getMessageTitle: jest.fn().mockReturnValue(''),
}));

jest.mock('./components/TestingInformation', () => ({
    __esModule: true,
    default: () => <div data-testid="testing-info">Test Info</div>,
}));

jest.mock('./components/TestingAction', () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="testing-action">
            Test Action
            <button data-testid="test-action-on-change" onClick={(e: any) => props.onChange(e.target.fieldName, e.target.changedValue)}>
                onChange
            </button>
        </div>
    ),
}));

describe('TestingTool', () => {
    const mockTestGetObjectJsonById = jest.fn();
    const mockTestNotification = jest.fn();
    // const mockGenerateTemplate = jest.fn();
    const mockSnackbar = jest.fn();

    const mockProps: NotificationTestingToolProps = {
        services: {
            getObjectJsonById: mockTestGetObjectJsonById,
            testNotification: mockTestNotification,
        },
        testingDataInput: {
            changedObjectJson: '{}',
            templateInput: {
                channelType: ChannelTypeMap.FILE,
                objectType: 'RECONCILIATION_PERIOD',
                content: '<div>Test</div>',
                configType: ConfigTypeCodeMap.OBJECT_ONLY,
                contentType: TemplateContentType.HTML,
                name: 'Test name',
                title: 'Test title',
            },
        },
        onChange: jest.fn(),
        onClose: jest.fn(),
    };

    beforeEach(() => {
        (useAppHelper as jest.Mock).mockReturnValue({ snackbar: mockSnackbar, alert: jest.fn() });
        (computedTestingData as jest.Mock).mockReturnValue({
            moduleTitle: 'TestingTool.NotificationConfig',
            objectTypeCode: 'RECONCILIATION_PERIOD',
            emails: '',
            telegrams: '',
            hasEmailChannel: true,
            hasTelegramChannel: true,
            formValid: true,
        });

        mockTestGetObjectJsonById.mockResolvedValue({
            data: {
                testGetObjectJsonById: {
                    objectJson: '{}',
                },
            },
        });
        mockTestNotification.mockResolvedValue({
            data: {
                testNotification: {
                    status: true,
                },
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders with initial state', () => {
        render(<TestingTool {...mockProps} />);
        expect(screen.getByTestId('testing-info')).toBeInTheDocument();
        expect(screen.getByTestId('testing-action')).toBeInTheDocument();
    });

    it('renders with objectFilterInput', () => {
        const mockPropsWithObjectFilterInput: NotificationTestingToolProps = {
            testingDataInput: {
                changedObjectJson: '{}',
                objectFilterInput: {
                    objectTypeCode: 'Test',
                },
            },
            onChange: jest.fn(),
            onClose: jest.fn(),
        };

        render(<TestingTool {...mockPropsWithObjectFilterInput} />);
        expect(screen.getByTestId('testing-info')).toBeInTheDocument();
        expect(screen.getByTestId('testing-action')).toBeInTheDocument();
    });

    it('renders with notificationConfigInput', () => {
        const mockPropsWithNotificationConfigInput: NotificationTestingToolProps = {
            testingDataInput: {
                changedObjectJson: '{}',
                notificationConfigInput: {
                    objectType: 'Test',
                },
            },
            onChange: jest.fn(),
            onClose: jest.fn(),
        };

        render(<TestingTool {...mockPropsWithNotificationConfigInput} />);
        expect(screen.getByTestId('testing-info')).toBeInTheDocument();
        expect(screen.getByTestId('testing-action')).toBeInTheDocument();
    });

    it('renders with missing testingDataInput', () => {
        const missingMockProps: NotificationTestingToolProps = {
            testingDataInput: {
                changedObjectJson: '{}',
            },
            onChange: jest.fn(),
            onClose: jest.fn(),
        };

        render(<TestingTool {...missingMockProps} />);
        expect(screen.getByTestId('testing-info')).toBeInTheDocument();
        expect(screen.getByTestId('testing-action')).toBeInTheDocument();
    });

    it('handles onChange action', () => {
        render(<TestingTool {...mockProps} />);
        fireEvent.click(screen.getByTestId('test-action-on-change'), { target: { fieldName: 'emailReceivers', changedValue: 'test 1' } });
        fireEvent.click(screen.getByTestId('test-action-on-change'), {
            target: { fieldName: 'telegramReceivers', changedValue: 'test 2' },
        });
    });

    it('should handle close', () => {
        const mockOnClose = jest.fn();
        const mockOnChange = jest.fn();

        render(<TestingTool {...mockProps} onClose={mockOnClose} onChange={mockOnChange} />);

        const closeButton = screen.getByTestId('drawer-onClose');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
        expect(mockOnChange).toHaveBeenCalled();
    });

    it('handles submit action with notificationTemplateInput ', async () => {
        render(<TestingTool {...mockProps} />);

        fireEvent.click(screen.getByTestId('drawer-submit'));
        // expect(submitButton).not.toBeDisabled();
    });

    it('handles submit action with notificationConfigInput', async () => {
        const mockPropsWithNotificationConfigInput: NotificationTestingToolProps = {
            testingDataInput: {
                changedObjectJson: '{}',
                notificationConfigInput: {
                    name: 'Test name',
                    objectType: 'RECONCILIATION_PERIOD',
                    transactionType: 'Test',
                    status: true,
                    notificationConfigDetails: [
                        {
                            value: {
                                channelType: ChannelTypeMap.EMAIL,
                                email: 'test@gmail.com',
                            },
                        },
                    ],
                },
            },
            onChange: jest.fn(),
            onClose: jest.fn(),
        };

        render(<TestingTool {...mockPropsWithNotificationConfigInput} />);

        fireEvent.click(screen.getByTestId('drawer-submit'));
        // fireEvent.click(submitButton);
        // expect(submitButton).not.toBeDisabled();

        await waitFor(() => {
            // expect(mockTestNotification).toHaveBeenCalled();
        });
    });
});
