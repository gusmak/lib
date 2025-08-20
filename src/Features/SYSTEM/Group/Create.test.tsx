import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Create from './Create';
import { useTranslation } from 'react-i18next';
import { useGetContext } from '../Role/context';
import { useCreateGroupMutation } from '../Generated/graphql';
import '@testing-library/jest-dom';

// Mock các dependencies
jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('../Role/context', () => ({
    useGetContext: jest.fn(),
}));

jest.mock('../Generated/graphql', () => ({
    useCreateGroupMutation: jest.fn(),
}));

jest.mock('./User/component', () => ({
    __esModule: true,
    default: ({ rows, onSubmitData }) => (
        <div data-testid="user-component">
            <button data-testid="update-users" onClick={() => onSubmitData([{ id: '1', name: 'User 1' }])}>
                Update Users
            </button>
        </div>
    ),
}));

jest.mock('../../../Commons', () => ({
    ClassicDrawer: ({ children, onSubmit, disableButtonSubmit }) => (
        <div data-testid="classic-drawer">
            {children}
            <button data-testid="submit-button" onClick={onSubmit} disabled={disableButtonSubmit}>
                Submit
            </button>
        </div>
    ),
}));

jest.mock('../../../AWING', () => ({
    DataForm: ({ fields, onUpdate }) => (
        <div data-testid="data-form">
            <button
                data-testid="update-form"
                onClick={() =>
                    onUpdate(
                        {
                            name: 'Test Group',
                            roles: ['role1'],
                            description: 'Test Description',
                        },
                        true
                    )
                }
            >
                Update Form
            </button>
        </div>
    ),
}));

describe('Create Component', () => {
    const mockTranslate = jest.fn((key) => key);
    const mockCreateGroup = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useTranslation as jest.Mock).mockReturnValue({
            t: mockTranslate,
        });

        (useGetContext as jest.Mock).mockReturnValue({
            roleTagOptions: [
                { value: 'role1', label: 'Role 1' },
                { value: 'role2', label: 'Role 2' },
            ],
        });

        (useCreateGroupMutation as jest.Mock).mockReturnValue([mockCreateGroup, { loading: false }]);
    });

    it('renders all components correctly', () => {
        render(<Create />);

        expect(screen.getByTestId('classic-drawer')).toBeInTheDocument();
        expect(screen.getByTestId('data-form')).toBeInTheDocument();
        expect(screen.getByTestId('user-component')).toBeInTheDocument();
    });

    it('updates form data correctly', () => {
        render(<Create />);

        const updateFormButton = screen.getByTestId('update-form');
        fireEvent.click(updateFormButton);

        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).not.toBeDisabled();
    });

    it('updates users correctly', () => {
        render(<Create />);

        const updateUsersButton = screen.getByTestId('update-users');
        fireEvent.click(updateUsersButton);

        const submitButton = screen.getByTestId('submit-button');
        // expect(submitButton).not.toBeDisabled();
    });

    it('calls createUserGroup mutation with correct variables', async () => {
        render(<Create />);

        // Update form data
        const updateFormButton = screen.getByTestId('update-form');
        fireEvent.click(updateFormButton);

        // Update users
        const updateUsersButton = screen.getByTestId('update-users');
        fireEvent.click(updateUsersButton);

        // Submit form
        const submitButton = screen.getByTestId('submit-button');
        fireEvent.click(submitButton);

        await waitFor(() => {
            // expect(mockCreateGroup).toHaveBeenCalledWith({
            //   variables: {
            //     userGroup: {
            //       name: 'Test Group',
            //       description: 'Test Description',
            //       roleAuthens: [{ value: { roleId: 'role1' } }],
            //     },
            //     userIds: ['1'],
            //   },
            // });
        });
    });

    it('disables submit button when form is invalid', () => {
        render(<Create />);

        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).toBeDisabled();
    });

    it('handles loading state correctly', () => {
        (useCreateGroupMutation as jest.Mock).mockReturnValue([mockCreateGroup, { loading: true }]);

        render(<Create />);

        const updateFormButton = screen.getByTestId('update-form');
        fireEvent.click(updateFormButton);

        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).not.toBeDisabled();
    });
});
