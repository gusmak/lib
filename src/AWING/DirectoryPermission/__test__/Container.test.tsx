import { DirectoryPermissionContext } from '../context';
import { useNavigate, useParams, MemoryRouter } from 'react-router';
import { Provider } from 'jotai';
import { AppProvider } from 'Utils';
import { convertDirectoryPermissionData } from '../utils';
import Container from '../Container';
import { useAppHelper } from 'Context';
import { act, fireEvent, render, screen } from '@testing-library/react';

const mockOnCloseDrawer = jest.fn();
const mockDeleteDirectoryPermission = jest.fn();
const Component = (props?: any & { initialEntries: string[] }) => {
    const initialEntries = props?.initialEntries || ['EditSchema/:authenTypeValue/*'];

    return (
        <Provider>
            <AppProvider>
                <DirectoryPermissionContext.Provider
                    value={{
                        ...props,
                        currentWorkspace: {
                            id: 10,
                            name: 'workspaceName',
                            defaultSchemas: [
                                {
                                    id: 1,
                                    name: 'Default Schema',
                                    objectTypeCode: 'Campaign',
                                    workspaceId: 0,
                                },
                            ],
                        },
                        services: {
                            addDirectoryPermission: jest.fn(),
                            createSchema: jest.fn(),
                            deleteDirectoryPermission: mockDeleteDirectoryPermission,
                            getGroups: jest.fn(),
                            getRoles: jest.fn(),
                            getUsers: jest.fn(),
                            getSchemaById: jest.fn(),
                            getDirectoryById: jest.fn(() => Promise.resolve({})),
                            getObjectDefinitions: jest.fn(() =>
                                Promise.resolve({
                                    items: [
                                        {
                                            fieldName: 'field1',
                                            fieldPath: '.field1.',
                                            id: 4,
                                            objectTypeCode: 'Campaign',
                                        },
                                        {
                                            fieldName: 'field2',
                                            fieldPath: '.field2.',
                                            id: 5,
                                            objectTypeCode: 'Campaign',
                                        },
                                        {
                                            fieldName: 'id',
                                            fieldPath: '.id.',
                                            id: 2,
                                            isPrimaryKey: true,
                                            objectTypeCode: 'Campaign',
                                        },
                                        {
                                            fieldName: 'name',
                                            fieldPath: '.name.',
                                            id: 3,
                                            objectTypeCode: 'Campaign',
                                        },
                                    ],
                                    total: 4,
                                })
                            ),
                            getSchemas: jest.fn(() =>
                                Promise.resolve({
                                    items: [],
                                    total: 0,
                                })
                            ),
                        },
                        onCloseDrawer: mockOnCloseDrawer,
                    }}
                >
                    <MemoryRouter initialEntries={initialEntries}>
                        <Container />
                    </MemoryRouter>
                </DirectoryPermissionContext.Provider>
            </AppProvider>
        </Provider>
    );
};

const getRender = (props?: any) => render(<Component {...props} />);

// #region Mock
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('Context', () => ({
    ...jest.requireActual('Context'),
    useAppHelper: jest.fn(),
}));

jest.mock('../utils', () => ({
    ...jest.requireActual('../utils'),
    convertDirectoryPermissionData: jest.fn(),
}));

jest.mock('@mui/lab', () => ({
    LoadingButton: (props: any) => (
        <div>
            <p data-testid="LoadingButton-header">LoadingButton</p>
            <button data-testid="LoadingButton-openAddPermission" onClick={props?.onClick} />
        </div>
    ),
}));

jest.mock('@mui/icons-material', () => ({
    AddCircleOutline: () => <p data-testid="Icon-AddCircleOutline" />,
}));

jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => {
        return (
            <div>
                <p data-testid="ClassicDrawer-header">ClassicDrawer</p>
                <p data-testid="ClassicDrawer-title">{props.title}</p>
                <button data-testid="ClassicDrawer-onClose" onClick={props.onClose} />
                {props?.customAction}
                {props?.children}
            </div>
        );
    },
}));

const mockOnDrawerLevelChange = jest.fn();
jest.mock('../AddOrEdit', () => ({
    __esModule: true,
    default: (props: any) => {
        const { onDrawerLevelChange = mockOnDrawerLevelChange } = props;
        return (
            <div>
                <p data-testid="AddOrEdit-title">AddOrEdit</p>
                <button data-testid="AddOrEdit-onUpdateDirectoryPermission" onClick={props?.onUpdateDirectoryPermission} />
                <button data-testid="AddOrEdit-onDrawerLevelChange" onClick={(e: any) => onDrawerLevelChange(e.target.level)} />
            </div>
        );
    },
}));

const mockTabPermissionStatesOnChangeTab = jest.fn();
jest.mock('../components/TabPermissionStates', () => ({
    __esModule: true,
    default: (props: any) => {
        const { onChangeTab = mockTabPermissionStatesOnChangeTab } = props;

        return (
            <div>
                <p data-testid="TabPermissionStates-title">TabPermissionStates</p>
                <button data-testid="TabPermissionStates-onChangeTab" onClick={(e: any) => onChangeTab(e.target.tabValue)} />

                {props?.children}
            </div>
        );
    },
}));

const mockOpenEditPermission = jest.fn();
jest.mock('../components/PermissionManagement', () => ({
    __esModule: true,
    default: (props: any) => {
        const { openEditPermission = mockOpenEditPermission } = props;
        return (
            <div>
                <p data-testid="PermissionManagement-title">PermissionManagement</p>
                <button
                    data-testid="PermissionManagement-openEditPermission"
                    onClick={(e: any) => openEditPermission(e.target.authenValue, e.target.authenType)}
                />
                <button
                    data-testid="PermissionManagement-onDeletePermission"
                    onClick={(e: any) => props?.onDeletePermission(e.target.authen)}
                />

                {props?.children}
            </div>
        );
    },
}));
// #endregion Mock

const mockConfirm = jest.fn();
const mockAppHelper = {
    confirm: mockConfirm,
    snackbar: jest.fn(),
};

beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ id: '10' });
    (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);

    (convertDirectoryPermissionData as jest.Mock).mockReturnValue({
        objectTypeCode: 'Campaign',
        workflow: {
            id: 1,
            workflowStates: [
                { id: '0.1.', name: 'DEFAULT' },
                { id: '1.1.', name: 'Name 2' },
            ],
        },
    });
});

describe('Render', () => {
    it('should not have directory Id', () => {
        (convertDirectoryPermissionData as jest.Mock).mockReturnValue({
            workflow: {},
        });
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        getRender();

        expect(screen.queryByText('ClassicDrawer-header')).toBeNull();
    });

    it('should render component', () => {
        getRender();

        expect(screen.getByTestId('ClassicDrawer-header')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call TabPermissionStates onChangeTab', async () => {
        getRender();
        fireEvent.click(screen.getByTestId('TabPermissionStates-onChangeTab'), {
            target: { tabValue: 'acm' },
        });
    });

    it('should call PermissionManagement onDeletePermission', async () => {
        getRender();
        await act(async () => {
            fireEvent.click(screen.getByTestId('PermissionManagement-onDeletePermission'), {
                target: { authen: {} },
            });
        });

        const mockConfirmCallback = mockConfirm.mock.calls[0][0];
        await act(async () => {
            mockConfirmCallback();
        });

        expect(mockDeleteDirectoryPermission).toHaveBeenCalled();
    });

    it('should call LoadingButton openAddPermission', async () => {
        getRender({});

        fireEvent.click(screen.getByTestId('LoadingButton-openAddPermission'));
        expect(mockNavigate).toHaveBeenCalled();
    });

    it('should call PermissionManagement openEditPermission', async () => {
        getRender({});

        fireEvent.click(screen.getByTestId('PermissionManagement-openEditPermission'), {
            target: {
                authenValue: '1',
                authenType: 'USER',
            },
        });
        expect(mockNavigate).toHaveBeenLastCalledWith('EditDirectoryPermission/USER_1');
    });

    it('should call ClassicDrawer onClose', async () => {
        getRender();

        fireEvent.click(screen.getByTestId('ClassicDrawer-onClose'));
        expect(mockOnCloseDrawer).toHaveBeenCalled();
    });
});
