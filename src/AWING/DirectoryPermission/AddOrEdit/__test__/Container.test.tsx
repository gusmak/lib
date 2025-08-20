import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useParams } from 'react-router';
import { getAuthenValueAndType, getPermissionUpdate } from '../../utils';
import { fullFieldsState, rootSchemasState, workflowStates } from '../../Atoms';
import Container from '../Container';
import { useGetDirectoryContext } from '../../context';
import { AddOrEditProps } from '../types';

// #region Mount
const initProps: AddOrEditProps = {
    drawerLevel: 2,
};

const getRender = (props?: Partial<AddOrEditProps>, initialEntries: string[] = ['/SelectSchema/*']) => {
    const initialRecoilState = ({ set }: any) => {
        set(fullFieldsState, []);
        set(rootSchemasState, [
            {
                id: 1,
                name: 'schema',
                objectTypeCode: 'Campaigns',
            },
        ]);
        set(workflowStates, {
            id: 1,
            name: 'workflow',
            objectTypeCode: 'Campaigns',
        });
    };

    render(
        <MemoryRouter initialEntries={initialEntries}>
            <Container {...initProps} {...props} />
        </MemoryRouter>
    );
};
// #endregion Mount

// #region Mock
jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({ t: (str: string) => str }),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));

jest.mock('../../context', () => ({
    ...jest.requireActual('../../context'),
    useGetDirectoryContext: jest.fn(),
}));

jest.mock('../../utils', () => ({
    ...jest.requireActual('../../utils'),
    getPermissionUpdate: jest.fn(),
    getAuthenValueAndType: jest.fn(),
}));

jest.mock('../PageContent', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p data-testid="PageContent-header">PageContent</p>
                <p data-testid="PageContent-isCreate">{props?.isCreate}</p>
                <textarea data-testid="PageContent-authenPermissions" defaultValue={JSON.stringify(props?.authenPermissions)} />

                <button data-testid="PageContent-onDeleteAuthen" onClick={(e: any) => props?.onDeleteAuthen(e.target.authen)} />
                <button
                    data-testid="PageContent-onExplicitPermissionsChange"
                    onClick={(e: any) => props?.onExplicitPermissionsChange(e.target.exPermissions)}
                />
                <button
                    data-testid="PageContent-onExplicitMatrixPermissionsChange"
                    onClick={(e: any) => props?.onExplicitMatrixPermissionsChange(e.target.newValue)}
                />
            </div>
        );
    },
}));

jest.mock('../../AddNewAuthen', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p data-testid="AddNewAuthen-header">AddNewAuthen</p>
                <p data-testid="AddNewAuthen-drawerLevel">{props?.drawerLevel}</p>
                <button
                    data-testid="AddNewAuthen-onTempPermissionsChange"
                    onClick={(e: any) => props?.onTempPermissionsChange(e.target.permissions)}
                />
            </div>
        );
    },
}));

jest.mock('../../SelectSchema', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p data-testid="SelectSchema-header">SelectSchema</p>
                <p data-testid="SelectSchema-drawerLevel">{props?.drawerLevel}</p>
            </div>
        );
    },
}));

jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => (
        <div>
            <p data-testid="ClassicDrawer-header">ClassicDrawer</p>
            <p data-testid="ClassicDrawer-title">{props?.title}</p>
            <button data-testid="ClassicDrawer-onClose" onClick={props.onClose} />
            <button data-testid="ClassicDrawer-onSubmit" onClick={props.onSubmit} />
            {props.children}
        </div>
    ),
}));

jest.mock('AWING', () => ({
    CircularProgress: () => (
        <div>
            <p data-testid="CircularProgress-header">CircularProgress</p>
        </div>
    ),
}));
// #endregion Mock

beforeEach(() => {
    (useGetDirectoryContext as jest.Mock).mockImplementation(() => ({
        services: {
            addDirectoryPermission: jest.fn(),
        },
    }));
});
afterEach(() => {
    jest.clearAllMocks();
});

describe('Create', () => {
    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({ id: '114' });
        (getAuthenValueAndType as jest.Mock).mockReturnValue({
            authenValue: -1,
            authenType: '',
        });
        (getPermissionUpdate as jest.Mock).mockReturnValue({
            name: '',
            explicitPermissions: [],
            inheritedPermissions: [],
            explicitMatrixPermissions: [],
            inheritedMatrixPermissions: [],
            authenValue: -1,
            authenType: '',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Render', () => {
        it('should render correctly', () => {
            getRender();
            expect(screen.getByText('ClassicDrawer')).toBeInTheDocument();
        });

        it('should render AddNewAuthen', () => {
            getRender(
                {
                    drawerLevel: 3,
                },
                ['/AddNewAuthen']
            );
            expect(screen.getByText('AddNewAuthen')).toBeInTheDocument();
        });

        it('should render drawerLevel', () => {
            const getRender = (props?: Partial<AddOrEditProps>, initialEntries: string[] = ['/AddNewAuthen']) => {
                const initialRecoilState = ({ set }: any) => {
                    set(fullFieldsState, []);
                    set(rootSchemasState, []);
                    set(workflowStates, undefined);
                };

                render(
                    <MemoryRouter initialEntries={initialEntries}>
                        <Container {...initProps} {...props} />
                    </MemoryRouter>
                );
            };
            getRender();
            expect(screen.getByTestId('AddNewAuthen-drawerLevel')).toHaveTextContent('2');
        });
    });

    describe('Actions', () => {
        it('should call onDrawerLevelChange when ClassicDrawer onClose', () => {
            const mockOnDrawerLevelChange = jest.fn();
            getRender({
                drawerLevel: 3,
                onDrawerLevelChange: mockOnDrawerLevelChange,
            });
            fireEvent.click(screen.getByTestId('ClassicDrawer-onClose'));
            expect(mockOnDrawerLevelChange).toHaveBeenCalledWith(2);
        });

        it('should call PageContent onDeleteAuthen when isCreate', async () => {
            getRender(
                {
                    drawerLevel: 3,
                },
                ['/AddNewAuthen']
            );
            fireEvent.click(screen.getByTestId('AddNewAuthen-onTempPermissionsChange'), {
                target: {
                    permissions: [
                        {
                            authenType: 'ROLE',
                            authenValue: 1,
                            name: 'demo role 1',
                        },
                        {
                            authenType: 'ROLE',
                            authenValue: 2,
                            name: 'demo role 2',
                        },
                    ],
                },
            });

            fireEvent.click(screen.getByTestId('PageContent-onDeleteAuthen'), {
                target: {
                    authen: { authenType: 'ROLE', authenValue: 1 },
                },
            });

            fireEvent.click(screen.getByTestId('PageContent-onExplicitPermissionsChange'), {
                target: {
                    exPermissions: [],
                },
            });
            fireEvent.click(screen.getByTestId('PageContent-onExplicitMatrixPermissionsChange'), {
                target: {
                    newValue: [],
                },
            });
        });

        it('should call ClassicDrawer onSubmit', () => {
            const mockAddDirectoryPermission = jest.fn(() => Promise.resolve({}));
            (useGetDirectoryContext as jest.Mock).mockImplementation(() => ({
                services: {
                    addDirectoryPermission: mockAddDirectoryPermission,
                },
            }));
            getRender({
                drawerLevel: 3,
                onDrawerLevelChange: jest.fn(),
                onUpdateDirectoryPermission: jest.fn(),
            });
            fireEvent.click(screen.getByTestId('ClassicDrawer-onSubmit'));
            expect(mockAddDirectoryPermission).toHaveBeenCalled();
        });
    });
});

describe('Edit', () => {
    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({ id: '114', authenTypeValue: 'ROLE_1' });
        (getAuthenValueAndType as jest.Mock).mockReturnValue({
            authenValue: 1,
            authenType: 'ROLE',
        });
        (getPermissionUpdate as jest.Mock).mockReturnValue({
            name: 'demo',
            explicitPermissions: [],
            inheritedPermissions: [
                {
                    permission: [1, 2, 3],
                    workflowStateIds: [],
                },
            ],
            explicitMatrixPermissions: [],
            inheritedMatrixPermissions: [],
            authenValue: 1,
            authenType: 'ROLE',
        });
    });

    it('should render correctly', () => {
        getRender({
            directoryPermission: {
                id: 1143,
                name: 'demo',
                explicitPermissions: [],
                inheritedPermissions: [],
                // explicitMatrixPermissions: [],
                // inheritedMatrixPermissions: [],
                // authenValue: 1,
                // authenType: 'ROLE',
            },
            listPermission: [
                {
                    name: 'demo',
                    authenType: 'ROLE',
                    authenValue: 1,
                    permission: 1,
                },
            ],
        });
        expect(screen.getByText('ClassicDrawer')).toBeInTheDocument();
    });

    it('should call ClassicDrawer onSubmit', () => {
        const mockAddDirectoryPermission = jest.fn(() => Promise.resolve({}));
        (useGetDirectoryContext as jest.Mock).mockImplementation(() => ({
            services: {
                addDirectoryPermission: mockAddDirectoryPermission,
            },
        }));
        getRender({
            drawerLevel: 3,
            onDrawerLevelChange: jest.fn(),
            onUpdateDirectoryPermission: jest.fn(),
        });
        fireEvent.click(screen.getByTestId('ClassicDrawer-onSubmit'));
        expect(mockAddDirectoryPermission).toHaveBeenCalled();
    });
});
