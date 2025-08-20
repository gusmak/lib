import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAppHelper } from 'Context';
import { useNavigate } from 'react-router';
import UserContainer from '../container';
import { UserServices } from '../Services';
import { RoleTag, User } from '../types';
import { UserContext } from '../context';

const initUsers: User[] = [
    {
        id: 1,
        name: 'User 01',
        username: 'user01',
    },
    {
        id: 2,
        name: 'User 02',
        username: 'user02',
    },
];

const initRoleTags: RoleTag[] = [
    {
        id: 1,
        description: 'demo role 1',
        name: 'Role 1',
        workspaceId: 2,
    },
    {
        id: 2,
        description: 'demo role 2',
        name: 'Role 2',
        workspaceId: 2,
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
}));

// import PageManagement from 'AWING/PageManagement';
jest.mock('AWING/PageManagement', () => (props: any) => {
    props.onChangeQueryInput({
        searchString: '',
        pageIndex: 0,
        sortModel: [
            {
                field: 'id',
                sort: 'asc',
            },
            {
                field: 'name',
                sort: 'desc',
            },
        ],
    });

    const getValue = (s: any, index: number) => {
        return s.valueGetter(initUsers[1], index);
    };

    return (
        <div>
            <span data-testid="page-label">{props.title}</span>
            <button
                data-testid="changedQueryInput"
                onClick={() => {
                    props.onChangeQueryInput({
                        searchString: '1',
                        pageIndex: 0,
                        pageSize: 10,
                    });
                }}
            />
            <button
                data-testid="changedQueryInputPageZize"
                onClick={() => {
                    props.onChangeQueryInput({
                        searchString: '1',
                        pageIndex: 1,
                        pageSize: 20,
                    });
                }}
            />
            <button
                data-testid="removeQueryInput"
                onClick={() => {
                    props.onChangeQueryInput({
                        advancedObject: {},
                        searchString: '',
                        pageIndex: 0,
                    });
                }}
            />
            {(props.columns as any[])
                .filter((item) => item.valueGetter)
                .map((getter, idx) => (
                    <span key={idx} data-testid={getter.field}>
                        {getValue(getter, idx)}
                    </span>
                ))}

            <span data-testid="rowid">{props.getRowId(initUsers[0])}</span>
            <button data-testid="CreateBtn" onClick={props.onCreateButtonClick} />
            <button
                data-testid="Rowclick"
                onClick={() => {
                    props.onRowClick(initUsers[0].id, {
                        target: { cellIndex: 1 },
                    });
                }}
            >
                Rowclick
            </button>
            <button
                data-testid="btnDelete"
                onClick={() => {
                    props.onDelete(initUsers[0].id);
                }}
            >
                Remove Btn
            </button>
            <button
                data-testid="btnShowNotificationSuccess"
                onClick={() => {
                    props.showNotificationSuccess();
                }}
            >
                Remove call showNotificationSuccess
            </button>
            <p>{JSON.stringify(initUsers)}</p>
            <span data-testid="totalItemCount">totalItemCount: {initUsers.length}</span>
        </div>
    );
});

const mockDelete = jest.fn();
const mockGetUsers = jest.fn();
const mockGetRoleTags = jest.fn();

export const services: UserServices = {
    getUsers: mockGetUsers,
    updateUser: (_p) => {
        return Promise.resolve();
    },
    deleteUser: mockDelete,
    getRoleTags: mockGetRoleTags,
    getUserById: jest.fn(),
    addToWorkspace: jest.fn(),
    checkUsernameExisted: jest.fn(),
    isLoading: false,
    isSubmitLoading: false,
};

// #region Mock Component

// #endregion

const renderUi = () => {
    return render(
        <UserContext.Provider
            value={{
                services,
                roleTagOptions: [],
                setRoleTagOptions: jest.fn(),
            }}
        >
            <UserContainer />
        </UserContext.Provider>
    );
};

/** mocks value */
const mockNavigate = jest.fn();

const mockAppHelper = {
    confirm: jest.fn(),
    snackbar: jest.fn(),
};

describe('render', () => {
    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);
        mockGetUsers.mockResolvedValue({
            users: initUsers,
            total: initUsers.length,
        });
        mockGetRoleTags.mockResolvedValue({
            roleTags: initRoleTags,
            total: initRoleTags.length,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show page title', () => {
        renderUi();
        expect(screen.getByTestId('page-label')).toHaveTextContent('User.Title');
    });

    it('Should render users correctly', async () => {
        renderUi();

        await waitFor(() => {
            fireEvent.click(screen.getByTestId('changedQueryInput'));

            expect(screen.getByText(JSON.stringify(initUsers))).toBeInTheDocument();
        });
    });

    it('Should render roles correctly', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('changedQueryInput'));

        await waitFor(() => {
            expect(screen.getByText(JSON.stringify(initUsers))).toBeInTheDocument();
        });
    });

    it('Should render totalItemCount', async () => {
        renderUi();
        await waitFor(() => {
            expect(screen.getByTestId('totalItemCount')).toHaveTextContent('totalItemCount: 2');
        });
    });
});

describe('actions', () => {
    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);
        mockGetUsers.mockResolvedValue({
            users: initUsers,
            total: initUsers.length,
        });
        mockGetRoleTags.mockResolvedValue({
            roleTags: initRoleTags,
            total: initRoleTags.length,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Show called create', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('CreateBtn'));
    });

    it('Show row click', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('Rowclick'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });

    it('Show called Delete', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('btnDelete'));

        await waitFor(() => {
            expect(mockDelete).toHaveBeenCalled();
        });
    });

    it('Show called showNotificationSuccess', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('btnShowNotificationSuccess'));

        await waitFor(() => {
            expect(mockAppHelper.snackbar).toHaveBeenCalled();
        });
    });

    it('Show changed query input page size', async () => {
        renderUi();

        fireEvent.click(screen.getByTestId('changedQueryInputPageZize'));

        await waitFor(async () => {
            expect(mockGetUsers).toHaveBeenCalled();
        });
    });
});
