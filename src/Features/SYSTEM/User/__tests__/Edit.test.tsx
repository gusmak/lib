import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAppHelper } from 'Context';
import { useNavigate, useParams } from 'react-router';
import { UserContext } from '../context';
import Edit from '../Edit';
import { UserServices } from '../Services';
import { User } from '../types';
import React, { act } from 'react';

const initUsers: User[] = [
    {
        id: 1,
        name: 'User 01',
        username: 'user01',
        description: 'User 01 Description',
        roleAuthens: [
            {
                id: 1,
                roleId: 1,
                role: {
                    name: 'Role 01',
                },
            },
        ],
    },
    {
        id: 2,
        name: 'User 02',
        username: 'user02',
        description: 'User 02 Description',
        roleAuthens: [
            {
                id: 1,
                roleId: 1,
                role: {
                    name: 'Role 01',
                },
            },
        ],
    },
];

// Mock dependencies
jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({ t: jest.fn((key) => key) }),
}));

jest.mock('Context', () => ({
    ...jest.requireActual('Context'),
    useAppHelper: jest.fn(),
    AppContext: {
        Provider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
}));

jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

const mockUpdate = jest.fn();

// #region Mock AWING
jest.mock('AWING', () => ({
    textValidation: () => ({ valid: true, message: '' }),
    CircularProgress: () => <div>CircularProgress Component</div>,
    DataForm: (props: any) => {
        // props.onUpdate && mockUpdate(props.onUpdate);
        props.onUpdate &&
            props.onUpdate(
                {
                    roleName: 'Role 01',
                    roleDescription: "Role's Description 01",
                    roleTagIds: [1],

                    roles: [
                        {
                            id: 1,
                            name: 'Role 01',
                            description: "Role's Description 01",
                            roleTagIds: [1],
                        },
                        {
                            id: 2,
                            name: 'Role 02',
                            description: "Role's Description 02",
                            roleTagIds: [2],
                        },
                    ],
                },
                true
            );

        return (
            <div>
                <div>
                    <div>{props.oldValue?.roleName}</div>
                    <div data-testid="roleTags">
                        {props.oldValue?.roleTagIds?.length ? (
                            props.oldValue?.roleTagIds?.map((id?: number) => (
                                <span data-testid={`roleTag-${id}`}>{id}</span>
                            ))
                        ) : (
                            <span data-testid="empty-roleTags">Empty</span>
                        )}
                    </div>
                </div>
                <button
                    data-testid="data-form-update"
                    onClick={() =>
                        props.onUpdate(
                            {
                                roleName: 'Role 01 update',
                                roleDescription: "Role's Description 01",
                                roleTagIds: [1],
                            },
                            true
                        )
                    }
                >
                    Update
                </button>
            </div>
        );
    },
}));
// #endregion

// #region Mock Commons
jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => {
        return (
            <div>
                Drawer Component
                <h6 data-testid="drawer-title">{props?.title}</h6>
                <button data-testid="drawer-submit" onClick={props.onSubmit}>
                    Submit
                </button>
                <button
                    data-testid="custom-action-button"
                    onClick={() => {
                        props.customAction?.props?.onChange({
                            target: { value: 500 },
                        });
                    }}
                >
                    {props.customAction?.props?.label}
                </button>
                <div>{props.children}</div>
            </div>
        );
    },
}));
// #endregion

const mockDelete = jest.fn();
const mockGetRoleTags = jest.fn();
const mockGetUserById = jest.fn();

export const services: UserServices = {
    getUsers: jest.fn(),
    updateUser: (_p) => {
        return Promise.resolve();
    },
    deleteUser: mockDelete,
    getRoleTags: mockGetRoleTags,
    getUserById: mockGetUserById,
    addToWorkspace: jest.fn(),
    checkUsernameExisted: jest.fn(),
    isLoading: false,
    isSubmitLoading: false,
};

const UI = ({ isService }: { isService?: boolean }) => {
    return (
        <UserContext.Provider
            value={{
                services: isService ? services : undefined,
                roleTagOptions: [],
                // setRoleTagOptions,
            }}
        >
            <Edit />
        </UserContext.Provider>
    );
};
const renderUi = (isService = true) => render(<UI isService={isService} />);

/** mocks value */
const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({ id: '1' }));

const mockAppHelper = {
    confirm: jest.fn(),
    snackbar: jest.fn(),
};

beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue(mockUseParams);
    (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);

    mockGetUserById.mockResolvedValue({
        ...initUsers[0],
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('render', () => {
    it('should show CircularProgress', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        expect(screen.getByText('CircularProgress Component')).toBeInTheDocument();
    });

    it('should show Drawer title', () => {
        renderUi();

        expect(screen.getByText('Drawer Component')).toBeInTheDocument();
    });

    it('should is Edit', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        expect(screen.getByTestId('drawer-title')).toHaveTextContent('User.TitleEdit');
    });

    it('should show show roleTag', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();
        waitFor(() => {
            fireEvent.click(screen.getByTestId('data-form-update'));
            expect(mockUpdate).toHaveBeenCalled();
        });
    });
});

describe('actions', () => {
    it('should call onSubmit when Edit', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        fireEvent.click(screen.getByTestId('drawer-submit'));
        // expect(mockUpdateUser).toHaveBeenCalled();
    });
});

describe('Mock useState', () => {
    jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: jest.fn(),
    }));
    it('should call onSubmit when Edit', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [false, jest.fn()])
            .mockImplementationOnce(() => [false, jest.fn()])
            .mockImplementationOnce(() => [true, jest.fn()])
            .mockImplementationOnce(() => [
                {
                    id: 1,
                    username: 'johndoe',
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
                jest.fn(),
            ])
            .mockImplementationOnce(() => [
                [
                    {
                        id: 1,
                        roleId: 101,
                        role: {
                            name: 'Admin',
                        },
                    },
                    {
                        id: 2,
                        roleId: 102,
                        role: {
                            name: 'User',
                        },
                    },
                ],
                jest.fn(),
            ])
            .mockImplementationOnce(() => [true, jest.fn()]);
        await act(async () => renderUi());

        fireEvent.click(screen.getByTestId('drawer-submit'));
    });
});
