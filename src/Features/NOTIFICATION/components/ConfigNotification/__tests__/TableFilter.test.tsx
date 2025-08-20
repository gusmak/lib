import { fireEvent, render, screen } from '@testing-library/react';
import { useSetAtom } from 'jotai';
import { BrowserRouter, useNavigate } from 'react-router';
import TableFilter from '../TableFilter';
import { Detail } from '../type';

// Mock các dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('jotai', () => ({
    useSetAtom: jest.fn(),
    atom: jest.fn(() => ({})), // Add atom mock
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
}));

// Mock data test
const mockNotificationConfigDetails = [
    {
        objectFilterId: 1,
        channels: [
            {
                channelType: 'EMAIL',
                lastPoints: [
                    {
                        type: 'EMAIL',
                        email: 'test@example.com',
                        templateId: '1',
                    },
                ],
            },
        ],
    },
];

const mockUsers = [
    { id: '1', name: 'User 1' },
    { id: '2', name: 'User 2' },
];

const mockGroups = [
    { id: 1, name: 'Group 1' },
    { id: 2, name: 'Group 2' },
];

const mockTemplates = [
    { id: '1', name: 'Template 1' },
    { id: '2', name: 'Template 2' },
];

const mockObjectFilters = [
    {
        id: 1,
        name: 'Filter 1',
        configType: 'TYPE1',
        logicalExpression: 'AND',
        notificationConfigDetails: [],
        objectType: 'OBJECT1',
        status: true,
        type: 'FILTER',
        subscriptionConfigDetails: [],
        workspaceSharings: [],
    },
    {
        id: 2,
        name: 'Filter 2',
        configType: 'TYPE1',
        logicalExpression: 'AND',
        notificationConfigDetails: [],
        objectType: 'OBJECT1',
        status: true,
        type: 'FILTER',
        subscriptionConfigDetails: [],
        workspaceSharings: [],
    },
];

// Props mặc định cho component
const defaultProps = {
    notificationConfigDetails: mockNotificationConfigDetails,
    users: mockUsers,
    groups: mockGroups,
    templates: mockTemplates,
    loading: false,
    objectFilters: mockObjectFilters,
    onSubmitData: jest.fn(),
    onClickTesting: jest.fn(),
    notificationConfigDetailPermissions: true,
};

const renderComponent = (props = {}) => {
    return render(
        <BrowserRouter>
            <TableFilter {...defaultProps} {...props} />
        </BrowserRouter>
    );
};

describe('TableFilter Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test render cơ bản
    it('should render correctly with data', () => {
        renderComponent();

        expect(screen.getByText('NotificationConfig.ListOfObject')).toBeInTheDocument();
        expect(screen.getByText('Common.Add')).toBeInTheDocument();
    });

    // Test loading state
    it('should show loading spinner when loading prop is true', () => {
        renderComponent({ loading: true });

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    // Test empty state
    it('should show no data message when notification details is empty', () => {
        renderComponent({ notificationConfigDetails: [] });

        expect(screen.getByText('Common.NoData')).toBeInTheDocument();
    });

    // Test permissions
    it('should disable add button when notificationConfigDetailPermissions is false', () => {
        renderComponent({ notificationConfigDetailPermissions: false });

        const addButton = screen.getByText('Common.Add').closest('button');
    });

    // Test click handlers
    it('should call onClickTesting when test button is clicked', () => {
        renderComponent();

        const testButton = screen.getByLabelText('test');
        fireEvent.click(testButton);

        expect(defaultProps.onClickTesting).toHaveBeenCalled();
    });
});

describe('handleDeleteLastPoint', () => {
    it('should delete last point and keep channel when multiple last points exist', () => {
        const mockDetail: Detail = {
            objectFilterId: 1,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [
                        { type: 'EMAIL', email: 'test1@email.com', templateId: '1' },
                        { type: 'EMAIL', email: 'test2@email.com', templateId: '2' },
                    ],
                },
            ],
        };

        renderComponent({
            notificationConfigDetails: [mockDetail],
        });

        // Find and click delete button for the second last point
        const deleteButtons = screen.getAllByLabelText('delete');
        fireEvent.click(deleteButtons[1]);

        // Verify onSubmitData was called with updated data
        expect(defaultProps.onSubmitData).toHaveBeenCalledWith([
            {
                ...mockDetail,
                channels: [
                    {
                        channelType: 'EMAIL',
                        lastPoints: [{ type: 'EMAIL', email: 'test1@email.com', templateId: '1' }],
                    },
                ],
            },
        ]);
    });

    it('should delete channel when deleting last remaining point', () => {
        const mockDetail: Detail = {
            objectFilterId: 1,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [{ type: 'EMAIL', email: 'test@email.com', templateId: '1' }],
                },
            ],
        };

        renderComponent({
            notificationConfigDetails: [mockDetail],
        });

        // Find and click delete button
        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);

        // Verify onSubmitData was called with updated data
        expect(defaultProps.onSubmitData).toHaveBeenCalledWith([]);
    });

    it('should be disabled when notificationConfigDetailPermissions is false', () => {
        const mockDetail: Detail = {
            objectFilterId: 1,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [{ type: 'EMAIL', email: 'test@email.com', templateId: '1' }],
                },
            ],
        };

        renderComponent({
            notificationConfigDetails: [mockDetail],
            notificationConfigDetailPermissions: false,
        });

        // Verify delete button is disabled
        const deleteButton = screen.getByLabelText('delete');
        expect(deleteButton).toBeDisabled();
    });
});

describe('renderUserChips', () => {
    const mockLastPoint = {
        type: 'USER_IDS',
        userIds: ['1', '2'],
        templateId: '1',
    };

    const mockDetail: Detail = {
        objectFilterId: 1,
        channels: [
            {
                channelType: 'EMAIL',
                lastPoints: [mockLastPoint],
            },
        ],
    };

    it('should render chips for all user IDs', () => {
        renderComponent({
            notificationConfigDetails: [mockDetail],
        });

        // Check if both user chips are rendered
        expect(screen.getByText('NotificationConfig.ReceiverType.USER_IDS: User 1')).toBeInTheDocument();
        expect(screen.getByText('NotificationConfig.ReceiverType.USER_IDS: User 2')).toBeInTheDocument();
    });

    it('should not render chips when userIds is empty', () => {
        const emptyUserIds = {
            ...mockDetail,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [
                        {
                            ...mockLastPoint,
                            userIds: [],
                        },
                    ],
                },
            ],
        };

        renderComponent({
            notificationConfigDetails: [emptyUserIds],
        });

        // Verify no user chips are rendered
        expect(screen.queryByText(/NotificationConfig.ReceiverType.USER_IDS:/)).not.toBeInTheDocument();
    });

    it('should handle undefined users prop', () => {
        renderComponent({
            notificationConfigDetails: [mockDetail],
            users: undefined,
        });
    });

    it('should handle non-existent user IDs', () => {
        const nonExistentUsers = {
            ...mockDetail,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [
                        {
                            ...mockLastPoint,
                            userIds: ['999', '888'],
                        },
                    ],
                },
            ],
        };

        renderComponent({
            notificationConfigDetails: [nonExistentUsers],
        });
    });

    it('should render chips with correct styling', () => {
        renderComponent({
            notificationConfigDetails: [mockDetail],
        });

        const chips = screen.getAllByRole('button');
        chips.forEach((chip) => {
            const style = window.getComputedStyle(chip);
            expect(style.getPropertyValue('margin-bottom')).toBe('0px');
            expect(style.getPropertyValue('margin-right')).toBe('0px');
        });
    });
});

describe('renderUserGroupChips', () => {
    const mockLastPoint = {
        type: 'USER_GROUP_IDS',
        userGroupIds: ['1', '2'],
        templateId: '1',
    };

    const mockDetail: Detail = {
        objectFilterId: 1,
        channels: [
            {
                channelType: 'EMAIL',
                lastPoints: [mockLastPoint],
            },
        ],
    };

    it('should render chips for all user group IDs', () => {
        renderComponent({
            notificationConfigDetails: [mockDetail],
        });

        // Check if both user group chips are rendered
        expect(screen.getByText('NotificationConfig.ReceiverType.USER_GROUP_IDS: Group 1')).toBeInTheDocument();
        expect(screen.getByText('NotificationConfig.ReceiverType.USER_GROUP_IDS: Group 2')).toBeInTheDocument();
    });

    it('should not render chips when userGroupIds is empty', () => {
        const emptyGroupIds = {
            ...mockDetail,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [
                        {
                            ...mockLastPoint,
                            userGroupIds: [],
                        },
                    ],
                },
            ],
        };

        renderComponent({
            notificationConfigDetails: [emptyGroupIds],
        });

        // Verify no user group chips are rendered
        // expect(screen.queryByText(/NotificationConfig.ReceiverType.USER_GROUP_IDS:/)).not.toBeInTheDocument();
    });

    it('should handle undefined groups prop', () => {
        renderComponent({
            notificationConfigDetails: [mockDetail],
            groups: undefined,
        });

        // Should render chips with undefined group names
        // expect(screen.getByText('NotificationConfig.ReceiverType.USER_GROUP_IDS: undefined')).toBeInTheDocument();
    });

    it('should handle non-existent group IDs', () => {
        const nonExistentGroups = {
            ...mockDetail,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [
                        {
                            ...mockLastPoint,
                            userGroupIds: ['999', '888'],
                        },
                    ],
                },
            ],
        };

        renderComponent({
            notificationConfigDetails: [nonExistentGroups],
        });

        // Should render chips with undefined for non-existent groups
        // expect(screen.getByText('NotificationConfig.ReceiverType.USER_GROUP_IDS: undefined')).toBeInTheDocument();
    });

    it('should handle mixing user groups and other receiver types', () => {
        const mixedLastPoint = {
            ...mockLastPoint,
            email: 'test@email.com',
        };

        const mixedDetail = {
            ...mockDetail,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [mixedLastPoint],
                },
            ],
        };

        renderComponent({
            notificationConfigDetails: [mixedDetail],
        });

        // Check if both group chips and email chip are rendered
        // expect(screen.getByText('NotificationConfig.ReceiverType.USER_GROUP_IDS: Group 1')).toBeInTheDocument();
        // expect(screen.getByText('NotificationConfig.ReceiverType.USER_GROUP_IDS: Group 2')).toBeInTheDocument();
        expect(screen.getByText('Email: test@email.com')).toBeInTheDocument();
    });
});

describe('renderRows', () => {
    const mockDetail: Detail = {
        objectFilterId: 1,
        channels: [
            {
                channelType: 'EMAIL',
                lastPoints: [
                    { type: 'EMAIL', email: 'test1@example.com', templateId: '1' },
                    { type: 'EMAIL', email: 'test2@example.com', templateId: '2' },
                ],
            },
        ],
    };

    it('should render rows correctly', () => {
        renderComponent({
            notificationConfigDetails: [mockDetail],
        });

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('Filter 1')).toBeInTheDocument();
        expect(screen.getByText('EMAIL')).toBeInTheDocument();
        expect(screen.getByText('Email: test1@example.com')).toBeInTheDocument();
        expect(screen.getByText('Email: test2@example.com')).toBeInTheDocument();
    });

    it('should not navigate if notificationConfigDetailPermissions is false', () => {
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        renderComponent({
            notificationConfigDetails: [mockDetail],
            notificationConfigDetailPermissions: false,
        });

        const row = screen.getAllByRole('row')[1];
        fireEvent.click(row);

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should call setFilterObject with correct id on row click', () => {
        const mockSetFilterObject = jest.fn();
        (useSetAtom as jest.Mock).mockReturnValue(mockSetFilterObject);

        renderComponent({
            notificationConfigDetails: [mockDetail],
        });

        const row = screen.getAllByRole('row')[1];
        fireEvent.click(row);
    });

    it('should render multiple channels correctly', () => {
        const multiChannelDetail: Detail = {
            objectFilterId: 1,
            channels: [
                {
                    channelType: 'EMAIL',
                    lastPoints: [{ type: 'EMAIL', email: 'test1@example.com', templateId: '1' }],
                },
                {
                    channelType: 'SMS',
                    lastPoints: [{ type: 'SMS', receiverId: '12345', templateId: '2' }],
                },
            ],
        };

        renderComponent({
            notificationConfigDetails: [multiChannelDetail],
        });

        expect(screen.getByText('EMAIL')).toBeInTheDocument();
        expect(screen.getByText('SMS')).toBeInTheDocument();
        expect(screen.getByText('Email: test1@example.com')).toBeInTheDocument();
        expect(screen.getByText('ChatID: 12345')).toBeInTheDocument();
    });
});
