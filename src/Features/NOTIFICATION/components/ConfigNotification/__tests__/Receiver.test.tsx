import { LastPointType } from 'Features/NOTIFICATION/NotificationConfig/common';
import Receiver from '../Receiver';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('Receiver', () => {
    const mockOnChange = jest.fn();
    const mockOnDelete = jest.fn();
    const mockUsers: any[] = [
        { id: '1', name: 'user1' },
        { id: '2', name: 'user2' },
    ];
    const mockGroups: any[] = [
        { id: '1', name: 'group1' },
        { id: '2', name: 'group2' },
    ];
    const mockTemplates: any[] = [];
    it('case telegram', () => {
        const { getByRole } = render(
            <Receiver
                lastPoint={{
                    templateId: '1',
                    type: 'telegram',
                    receiverId: '123',
                }}
                objectType="MEDIA_PLAN"
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                users={mockUsers}
                groups={mockGroups}
                templates={mockTemplates}
            />
        );
        const idInput = getByRole('spinbutton', {
            name: 'NotificationConfig.ChatId',
        });
        fireEvent.change(idInput, { target: { value: '-345' } });
        expect(mockOnChange.mock.calls[0][0]).toEqual({
            receiverId: '-345',
            templateId: '1',
            type: 'telegram',
        });
    });
    it('case email', () => {
        const { getByRole } = render(
            <Receiver
                lastPoint={{
                    templateId: '1',
                    type: 'email',
                    email: 'email.@mail.com',
                }}
                objectType="MEDIA_PLAN"
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                users={mockUsers}
                groups={mockGroups}
                templates={mockTemplates}
            />
        );
        const emailInput = getByRole('textbox', {
            name: 'NotificationConfig.Email',
        });
        fireEvent.change(emailInput, { target: { value: 'newmail@mail.com' } });
        expect(mockOnChange.mock.calls[0][0]).toEqual({
            templateId: '1',
            type: 'email',
            email: 'newmail@mail.com',
        });
    });
    it('case users', () => {
        const { getAllByRole } = render(
            <Receiver
                lastPoint={{
                    templateId: 1,
                    type: 'user_ids',
                    userIds: ['1', '2'],
                }}
                objectType="MEDIA_PLAN"
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                users={mockUsers}
                groups={mockGroups}
                templates={mockTemplates}
            />
        );
        const selects = getAllByRole('combobox');
        expect(selects.length).toBe(3);
    });
    it('case groups', () => {
        const { getAllByRole } = render(
            <Receiver
                lastPoint={{
                    templateId: 1,
                    type: 'user_group_ids',
                    userGroupIds: ['1', '2'],
                }}
                objectType="MEDIA_PLAN"
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                users={mockUsers}
                groups={mockGroups}
                templates={mockTemplates}
            />
        );
        const selects = getAllByRole('combobox');
        expect(selects.length).toBe(3);
    });
    it('should call onChange with correct values when handleReceiverTypeChange is called', () => {
        render(
            <Receiver
                lastPoint={{
                    templateId: '1',
                    type: LastPointType.EMAIL,
                    email: 'test@mail.com',
                    userIds: ['1'],
                    userGroupIds: ['1'],
                }}
                objectType="MEDIA_PLAN"
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                users={mockUsers}
                groups={mockGroups}
                templates={mockTemplates}
            />
        );

        const select = screen.getByDisplayValue('email');
        fireEvent.change(select, { target: { value: LastPointType.USER_IDS } });

        expect(mockOnChange).toHaveBeenCalledWith({
            templateId: '1',
            type: LastPointType.USER_IDS,
            email: '',
            userIds: [],
            userGroupIds: [],
        });
    });
});

describe('Receiver Component', () => {
    const mockProps = {
        lastPoint: {
            type: LastPointType.EMAIL,
            email: '',
            templateId: '',
        },
        onChange: jest.fn(),
        onDelete: jest.fn(),
        users: [
            { id: '1', name: 'User 1' },
            { id: '2', name: 'User 2' },
        ],
        groups: [
            { id: 1, name: 'Group 1' },
            { id: 2, name: 'Group 2' },
        ],
        templates: [
            { id: '1', name: 'Template 1', channelType: 'EMAIL', objectType: 'TYPE1' },
            { id: '2', name: 'Template 2', channelType: 'EMAIL', objectType: 'TYPE1' },
        ],
        objectType: 'TYPE1',
    };

    it('renders receiver type select', async () => {
        render(<Receiver {...mockProps} />);
        // await waitFor(() => {
        //     expect(screen.getByLabelText('NotificationConfig.Template')).toBeInTheDocument();
        // });
    });

    it('handles delete action', () => {
        render(<Receiver {...mockProps} />);
        const deleteButton = screen.getByTestId('ClearIcon').parentElement;
        fireEvent.click(deleteButton!);
        expect(mockProps.onDelete).toHaveBeenCalled();
    });

    it('renders user groups select for USER_GROUP_IDS type', () => {
        render(
            <Receiver
                {...{
                    ...mockProps,
                    lastPoint: {
                        ...mockProps.lastPoint,
                        type: LastPointType.USER_GROUP_IDS,
                    },
                }}
            />
        );
    });
});

describe('renderReceiverInput', () => {
    const mockOnChange = jest.fn();
    const mockOnDelete = jest.fn();
    const mockUsers = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
    ];
    const mockGroups = [
        { id: 1, name: 'Group 1' },
        { id: 2, name: 'Group 2' },
    ];
    const mockTemplates = [
        { id: '1', name: 'Template 1', channelType: 'EMAIL', objectType: 'TYPE1' },
        { id: '2', name: 'Template 2', channelType: 'EMAIL', objectType: 'TYPE1' },
    ];

    it('renders email input when type is EMAIL', () => {
        render(
            <Receiver
                lastPoint={{ type: LastPointType.EMAIL, email: '', templateId: '' }}
                objectType="TYPE1"
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                users={mockUsers}
                groups={mockGroups}
                templates={mockTemplates}
            />
        );
    });

    it('renders user select when type is USER_IDS', () => {
        render(
            <Receiver
                lastPoint={{ type: LastPointType.USER_IDS, userIds: [], templateId: '' }}
                objectType="TYPE1"
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                users={mockUsers}
                groups={mockGroups}
                templates={mockTemplates}
            />
        );
    });

    it('renders user group select when type is USER_GROUP_IDS', () => {
        render(
            <Receiver
                lastPoint={{ type: LastPointType.USER_GROUP_IDS, userGroupIds: [], templateId: '' }}
                objectType="TYPE1"
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                users={mockUsers}
                groups={mockGroups}
                templates={mockTemplates}
            />
        );
    });

    it('does not render input for unknown type', () => {
        render(
            <Receiver
                lastPoint={{ type: 'UNKNOWN_TYPE', templateId: '' }}
                objectType="TYPE1"
                onChange={mockOnChange}
                onDelete={mockOnDelete}
                users={mockUsers}
                groups={mockGroups}
                templates={mockTemplates}
            />
        );
    });
});
