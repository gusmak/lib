import { render, screen } from '@testing-library/react';
import Rule from '../Rule';

// Mock các dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('Features/NOTIFICATION/components/ConfigNotification/Receiver', () => ({
    __esModule: true,
    default: () => <div>Receiver</div>,
}));

jest.mock('Features/NOTIFICATION/NotificationConfig/common', () => ({
    ChannelTypeMap: [
        { value: 'TELEGRAM', label: 'Telegram' },
        { value: 'EMAIL', label: 'Email' },
    ],
    LastPointType: {
        TELEGRAM: 'TELEGRAM',
        EMAIL: 'EMAIL',
    },
}));

// Mock data test
const mockProps = {
    objectFilters: [
        {
            id: 1,
            name: 'Filter 1',
            configType: 'type1',
            logicalExpression: '',
            notificationConfigDetails: [],
            objectType: 'type1',
            subscriptionConfigDetails: [],
            workspaceSharings: [],
        },
        {
            id: 2,
            name: 'Filter 2',
            configType: 'type2',
            logicalExpression: '',
            notificationConfigDetails: [],
            objectType: 'type2',
            subscriptionConfigDetails: [],
            workspaceSharings: [],
        },
    ],
    rule: {
        objectFilterId: 1,
        channels: [
            {
                channelType: 'TELEGRAM',
                lastPoints: [
                    {
                        type: 'TELEGRAM',
                        receiverId: '1',
                        templateId: '1',
                    },
                ],
            },
        ],
    },
    onChange: jest.fn(),
    users: [],
    groups: [],
    templates: [],
    objectType: 'type1',
};

describe('Rule Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with initial props', () => {
        render(<Rule {...mockProps} />);

        // expect(screen.getByLabelText('NotificationConfig.Filter')).toBeInTheDocument();
        // expect(screen.getByLabelText('NotificationConfig.Channel')).toBeInTheDocument();
    });

    //   test('handles filter change correctly', () => {
    //     render(<Rule {...mockProps} />);

    //     const filterSelect = screen.getByLabelText('NotificationConfig.Filter');
    //     fireEvent.change(filterSelect, { target: { value: '2' } });

    //     expect(mockProps.onChange).toHaveBeenCalledWith({
    //       objectFilterId: '2',
    //       channels: mockProps.rule.channels,
    //     });
    //   });

    //   test('handles add channel correctly', () => {
    //     render(<Rule {...mockProps} />);

    //     const addChannelButton = screen.getByTitle('NotificationConfig.AddChannel');
    //     fireEvent.click(addChannelButton);

    //     expect(mockProps.onChange).toHaveBeenCalledWith({
    //       ...mockProps.rule,
    //       channels: [
    //         ...mockProps.rule.channels,
    //         {
    //           channelType: 'TELEGRAM',
    //           lastPoints: [
    //             {
    //               type: 'TELEGRAM',
    //               receiverId: '',
    //               templateId: '',
    //             },
    //           ],
    //         },
    //       ],
    //     });
    //   });

    // //   test('handles delete channel correctly', () => {
    // //     render(<Rule {...mockProps} />);

    // //     const deleteButtons = screen.getAllByRole('button');
    // //     const deleteChannelButton = deleteButtons.find(button =>
    // //       button.querySelector('svg[data-testid="ClearIcon"]')
    // //     );

    // //     fireEvent.click(deleteChannelButton);

    // //     expect(mockProps.onChange).toHaveBeenCalledWith({
    // //       ...mockProps.rule,
    // //       channels: [],
    // //     });
    // //   });

    //   test('handles change channel type correctly', () => {
    //     render(<Rule {...mockProps} />);

    //     const channelSelect = screen.getByLabelText('NotificationConfig.Channel');
    //     fireEvent.change(channelSelect, { target: { value: 'EMAIL' } });

    //     expect(mockProps.onChange).toHaveBeenCalledWith({
    //       ...mockProps.rule,
    //       channels: [
    //         {
    //           channelType: 'EMAIL',
    //           lastPoints: [
    //             {
    //               type: 'EMAIL',
    //               email: '',
    //               templateId: '',
    //             },
    //           ],
    //         },
    //       ],
    //     });
    //   });

    //   test('handles add last point correctly', () => {
    //     render(<Rule {...mockProps} />);

    //     const addLastPointButton = screen.getByTitle('NotificationConfig.AddLastPoint');
    //     fireEvent.click(addLastPointButton);

    //     expect(mockProps.onChange).toHaveBeenCalledWith({
    //       ...mockProps.rule,
    //       channels: [
    //         {
    //           ...mockProps.rule.channels[0],
    //           lastPoints: [
    //             ...mockProps.rule.channels[0].lastPoints,
    //             {
    //               type: 'TELEGRAM',
    //               receiverId: '',
    //               templateId: '',
    //             },
    //           ],
    //         },
    //       ],
    //     });
    //   });

    //   // test('handles delete last point correctly', () => {
    //   //   const propsWithMultipleLastPoints = {
    //   //     ...mockProps,
    //   //     rule: {
    //   //       ...mockProps.rule,
    //   //       channels: [
    //   //         {
    //   //           ...mockProps.rule.channels[0],
    //   //           lastPoints: [
    //   //             ...mockProps.rule.channels[0].lastPoints,
    //   //             {
    //   //               type: 'TELEGRAM',
    //   //               receiverId: '2',
    //   //               templateId: '2',
    //   //             },
    //   //           ],
    //   //         },
    //   //       ],
    //   //     },
    //   //   };

    //   //   render(<Rule {...propsWithMultipleLastPoints} />);

    //   //   const receivers = screen.getAllByTestId('receiver-component');
    //   //   const deleteLastPointButton = receivers[1].querySelector('[aria-label="delete"]');

    //   //   fireEvent.click(deleteLastPointButton);

    //   //   expect(mockProps.onChange).toHaveBeenCalledWith({
    //   //     ...propsWithMultipleLastPoints.rule,
    //   //     channels: [
    //   //       {
    //   //         ...propsWithMultipleLastPoints.rule.channels[0],
    //   //         lastPoints: [propsWithMultipleLastPoints.rule.channels[0].lastPoints[0]],
    //   //       },
    //   //     ],
    //   //   });
    //   // });

    //   test('handles empty rule prop', () => {
    //     const propsWithoutRule = {
    //       ...mockProps,
    //       rule: undefined,
    //     };

    //     render(<Rule {...propsWithoutRule} rule={propsWithoutRule.rule || { objectFilterId: 0, channels: [] }} />);

    //     expect(screen.getByLabelText('NotificationConfig.Filter')).toBeInTheDocument();
    //     expect(screen.queryByLabelText('NotificationConfig.Channel')).not.toBeInTheDocument();
    //   });

    //   test('handles disabled add channel button when no rule', () => {
    //     const propsWithoutChannels = {
    //       ...mockProps,
    //       rule: {
    //         ...mockProps.rule,
    //         channels: [],
    //       },
    //     };

    //     render(<Rule {...propsWithoutChannels} />);

    //     const addChannelButton = screen.getByTitle('NotificationConfig.AddChannel');
    //     expect(addChannelButton).toBeDisabled();
    //   });
});
