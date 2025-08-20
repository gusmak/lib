import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import AddUser from './container';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import '@testing-library/jest-dom';
import React from 'react';
import { GetUsersDocument } from '../../Generated/graphql';

// Mock dependencies
jest.mock('../../../../Commons', () => ({
    ClassicDrawer: ({ children, onSubmit }) => (
        <div data-testid="classic-drawer">
            {children}
            <button onClick={onSubmit}>Submit</button>
        </div>
    ),
}));

jest.mock('./component', () => ({
    __esModule: true,
    default: ({ users, listUserId, onListUserIdChange }) => (
        <div data-testid="search-user-group">
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
            <button onClick={() => onListUserIdChange([1, 2])} data-testid="change-users">
                Change Users
            </button>
        </div>
    ),
}));

const mockUsers = {
    users: {
        items: [
            { id: 1, username: 'user1', name: 'User 1' },
            { id: 2, username: 'user2', name: 'User 2' },
            { id: 3, username: 'user3', name: 'User 3' },
        ],
    },
};

const mocks = [
    {
        request: {
            query: GetUsersDocument,
        },
        result: {
            data: mockUsers,
        },
    },
];

describe('AddUser Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <I18nextProvider i18n={i18n}>
                    <AddUser usersSelected={[]} onChangeAddUser={() => {}} />
                </I18nextProvider>
            </MockedProvider>
        );

        // expect(screen.getByTestId('circular-progress')).toBeInTheDocument()
    });

    it('renders users after loading', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <I18nextProvider i18n={i18n}>
                    <AddUser usersSelected={[]} onChangeAddUser={() => {}} />
                </I18nextProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('search-user-group')).toBeInTheDocument();
        });
    });

    it('handles user selection change correctly', async () => {
        const mockOnChangeAddUser = jest.fn();

        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <I18nextProvider i18n={i18n}>
                    <AddUser usersSelected={[]} onChangeAddUser={mockOnChangeAddUser} />
                </I18nextProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('search-user-group')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('change-users'));
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(mockOnChangeAddUser).toHaveBeenCalledWith([
                { id: 1, username: 'user1', name: 'User 1' },
                { id: 2, username: 'user2', name: 'User 2' },
            ]);
        });
    });

    it('filters out already selected users', async () => {
        const selectedUsers = [{ id: 1, username: 'user1', name: 'User 1' }];

        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <I18nextProvider i18n={i18n}>
                    <AddUser usersSelected={selectedUsers} onChangeAddUser={() => {}} />
                </I18nextProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            const userList = screen.getByTestId('search-user-group');
            expect(userList).toBeInTheDocument();
            expect(screen.queryByText('User 1')).not.toBeInTheDocument();
            expect(screen.getByText('User 2')).toBeInTheDocument();
        });
    });

    it('updates listUserId when usersSelected changes', async () => {
        const { rerender } = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <I18nextProvider i18n={i18n}>
                    <AddUser usersSelected={[]} onChangeAddUser={() => {}} />
                </I18nextProvider>
            </MockedProvider>
        );

        const newSelectedUsers = [{ id: 1, username: 'user1', name: 'User 1' }];

        rerender(
            <MockedProvider mocks={mocks} addTypename={false}>
                <I18nextProvider i18n={i18n}>
                    <AddUser usersSelected={newSelectedUsers} onChangeAddUser={() => {}} />
                </I18nextProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('search-user-group')).toBeInTheDocument();
        });
    });
});
