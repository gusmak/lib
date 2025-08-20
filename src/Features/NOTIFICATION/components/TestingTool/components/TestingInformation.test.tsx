import { render, screen } from '@testing-library/react';
import TestingInfomation from './TestingInformation';

jest.mock('@mui/material', () => ({
    Grid: ({ children }: any) => <div data-testid="grid">{children}</div>,
    Paper: ({ children }: any) => <div data-testid="paper">{children}</div>,
    Stack: ({ children }: any) => <div data-testid="stack">{children}</div>,
    Typography: ({ children }: any) => <div data-testid="typography">{children}</div>,
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('TestingInformation', () => {
    const defaultProps = {
        testingData: {
            changedObjectJson: '{}',
            objectFilter: {
                name: 'Test Filter',
                logicalExpression: 'test expression',
            },
            templateInput: {
                channelType: 'EMAIL',
                contentType: 'HTML',
            },
            template: {
                name: 'Test Template',
                channelType: 'EMAIL',
                contentType: 'HTML',
            },
        },
        objectTypeCode: 'TEST_TYPE',
        isObjectFilter: false,
        isNotificationTemplate: false,
        isNotificationConfig: false,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders basic information', () => {
        render(<TestingInfomation {...defaultProps} />);
        expect(screen.getByText('TestingTool.InputTitle')).toBeInTheDocument();
        expect(screen.getByText(/TEST_TYPE/)).toBeInTheDocument();
    });

    it('renders with missing information', () => {
        const defaultPropsWithMissingInformation = {
            testingData: {
                changedObjectJson: '{}',
            },
            objectTypeCode: 'TEST_TYPE',
            isObjectFilter: true,
            isNotificationTemplate: true,
            isNotificationConfig: true,
        };
        render(<TestingInfomation {...defaultPropsWithMissingInformation} />);
        expect(screen.queryByText(/Test Filter/)).not.toBeInTheDocument();
        expect(screen.queryByText(/EMAIL/)).not.toBeInTheDocument();
    });

    it('displays object filter information when isObjectFilter is true', () => {
        render(<TestingInfomation {...defaultProps} isObjectFilter={true} />);
        expect(screen.getByText(/test expression/)).toBeInTheDocument();
    });

    it('displays notification template information when isNotificationTemplate is true', () => {
        render(<TestingInfomation {...defaultProps} isNotificationTemplate={true} />);
        expect(screen.getByText(/EMAIL/)).toBeInTheDocument();
        expect(screen.getByText(/HTML/)).toBeInTheDocument();
    });

    it('displays notification config information when isNotificationConfig is true', () => {
        render(<TestingInfomation {...defaultProps} isNotificationConfig={true} />);
        expect(screen.getByText(/Test Filter/)).toBeInTheDocument();
        // expect(screen.getByText(/Test Template/)).toBeInTheDocument();
        // expect(screen.getByText(/EMAIL/)).toBeInTheDocument();
    });

    it('renders RowInfo component correctly', () => {
        render(<TestingInfomation {...defaultProps} objectTypeCode="CUSTOM_TYPE" />);
        expect(screen.getByText(/CUSTOM_TYPE/)).toBeInTheDocument();
    });
});
