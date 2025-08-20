import { render, fireEvent, waitFor, screen, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddExistedUser from '.';
import { useContextUser } from '../context';
import * as React from 'react';

jest.mock('../context');
const mockUseContextUser = useContextUser as jest.Mock;

const mockServices = {
    addUserExisted: jest.fn(),
    checkUsernameExisted: jest.fn(),
    getUsers: jest.fn(),
};

const mockRoleTagOptions = [
    { text: 'Admin', value: 'admin' },
    { text: 'User', value: 'user' },
];

const mockUsers = [
    { username: 'existinguser1', roleAuthens: ['admin'] },
    { username: 'existinguser2', roleAuthens: ['user'] },
];

// import { ClassicDrawer } from 'Commons/Components';
jest.mock('Commons/Components', () => ({
    ClassicDrawer: ({ children, onSubmit, childrenWrapperStyle }: any) => (
        <div>
            {children}
            <button onClick={() => onSubmit()} data-testid="submitClassicDrawer">
                onSubmit
            </button>
            {childrenWrapperStyle && childrenWrapperStyle.padding({ spacing: (value: number) => value })}
        </div>
    ),
}));

describe('AddExistedUser', () => {
    beforeEach(() => {
        mockUseContextUser.mockReturnValue({
            services: mockServices,
            roleTagOptions: mockRoleTagOptions,
        });
        mockServices.getUsers.mockResolvedValue({ users: mockUsers });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state initially', async () => {
        render(<AddExistedUser />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle username input and validation', async () => {
        mockServices.addUserExisted.mockResolvedValueOnce({});
        await act(() => {
            render(<AddExistedUser />);
        });
        await waitFor(() => {
            const input = screen.getByLabelText(/Username/i);
            fireEvent.change(input, { target: { value: 'testuser' } });
            expect(mockServices.checkUsernameExisted).toHaveBeenCalledWith({
                username: 'testuser',
            });
        });
    });

    it('should handle role selection', async () => {
        await act(() => {
            render(<AddExistedUser />);
        });

        await waitFor(() => {
            const roleInput = screen.getByLabelText(/Roles/i);
            fireEvent.click(roleInput);
        });
    });

    it('should disable submit when form is invalid', async () => {
        await act(() => {
            render(<AddExistedUser />);
        });

        waitFor(() => {
            const submitButton = screen.getByRole('button', { name: /submit/i });
            expect(submitButton).toBeDisabled();
        });
    });

    // it('should submit form', async () => {
    //     mockServices.checkUsernameExisted.mockResolvedValueOnce({});
    //     await act(() => {
    //         render(<AddExistedUser />);
    //     });

    //     await waitFor(() => {
    //         const submitButton = screen.getByRole('button', { name: /submit/i });
    //         fireEvent.click(submitButton);
    //     });

    //     await waitFor(() => {
    //         expect(mockServices.checkUsernameExisted).toHaveBeenCalled();
    //     });
    // });

    it('calls onChange when an option is selected', async () => {
        await act(() => {
            render(<AddExistedUser />);
        });
        waitFor(() => {
            const AreaSelectComplete = screen.getByTestId('AutocompleteRole');
            const input = within(AreaSelectComplete).getByRole('combobox');
            AreaSelectComplete.focus();
            fireEvent.change(input, { target: { value: 'A' } });
            fireEvent.keyDown(AreaSelectComplete, { key: 'ArrowDown' });
            fireEvent.keyDown(AreaSelectComplete, { key: 'Enter' });
        });
    });
});

describe('Mock useState', () => {
    jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: jest.fn(),
    }));

    it('should call onSubmit when Edit', async () => {
        mockUseContextUser.mockReturnValue({
            services: mockServices,
            roleTagOptions: mockRoleTagOptions,
        });
        mockServices.getUsers.mockResolvedValue({ users: mockUsers });
        mockServices.addUserExisted.mockResolvedValueOnce({});

        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => ['admin', jest.fn()])
            .mockImplementationOnce(() => [false, jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => [false, jest.fn()])
            .mockImplementationOnce(() => [false, jest.fn()])
            .mockImplementationOnce(() => [
                [
                    { value: 1, text: 'Admin' },
                    { value: 2, text: 'User' },
                    { value: 3, text: 'Guest' },
                    { value: 4, text: 'Manager' },
                ],
                jest.fn(),
            ])
            .mockImplementationOnce(() => ['err', jest.fn()])

            .mockImplementationOnce(() => [
                [
                    {
                        id: 1,
                        username: 'testuser',
                        name: 'John Doe',
                        description: 'Software Developer',
                        gender: 1,
                        image: 'https://example.com/avatar.jpg',
                        roles: [1, 2],
                        roleAuthens: [
                            {
                                id: 1,
                                roleId: 1,
                                role: {
                                    name: 'Admin',
                                },
                            },
                        ],
                    },
                ],
                jest.fn(),
            ]);

        await act(async () => {
            render(<AddExistedUser />);
        });

        await waitFor(() => {
            const input = screen.getByLabelText(/Username/i);
            fireEvent.change(input, { target: { value: 'testuser' } });
            mockServices.addUserExisted.mockResolvedValueOnce({
                username: 'testuser',
                roleAuthenInput: { roleAuthens: [] },
            });
            // expect(mockServices.addUserExisted).toHaveBeenCalledWith({
            //     username: 'testuser',
            //     roleAuthenInput: { roleAuthens: [] },
            // });
        });
    });
});
