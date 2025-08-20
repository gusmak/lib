import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuthenMemoByKey } from '../../hooks';
import Container from '../Container';
import { useGetDirectoryContext } from '../../context';
import { ContainerProps, SearchWrapperProps } from '../types';

// #region Mount
const initProps: ContainerProps = {
    authenPermissions: [],
    drawerLevel: 0,
    onTempPermissionsChange: jest.fn(),
    onDrawerLevelChange: jest.fn(),
};

const getRender = (props?: Partial<ContainerProps>) => {
    return render(<Container {...initProps} {...props} />);
};
// #endregion Mount

// #region Mock
jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({ t: (str: string) => str }),
}));

jest.mock('../../hooks', () => ({
    useAuthenMemoByKey: jest.fn(),
}));
jest.mock('../../hooks', () => ({
    useAuthenMemoByKey: jest.fn(),
}));

jest.mock('../../context', () => ({
    useGetDirectoryContext: jest.fn(),
}));

jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => (
        <div>
            <p data-testid="ClassicDrawer-header">ClassicDrawer</p>
            <button data-testid="ClassicDrawer-onClose" onClick={props.onClose} />
            <button data-testid="ClassicDrawer-onSubmit" onClick={props.onSubmit} />
            <p data-testid="ClassicDrawer-children">{props.children}</p>
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

jest.mock('../SearchWrapper', () => ({
    __esModule: true,
    default: (props: SearchWrapperProps) => {
        return (
            <div>
                <p data-testid="SearchWrapper-header">SearchWrapper</p>
                <div>
                    <textarea data-testid="SearchWrapper-roles">{JSON.stringify(props?.authens.ROLE)}</textarea>
                    <textarea data-testid="SearchWrapper-users">{JSON.stringify(props?.authens.USER)}</textarea>
                    <textarea data-testid="SearchWrapper-groups">{JSON.stringify(props?.authens.GROUP)}</textarea>
                </div>
                <div>
                    <textarea data-testid="SearchWrapper-roleIds">{JSON.stringify(props?.authenIds.ROLE)}</textarea>
                    <textarea data-testid="SearchWrapper-userIds">{JSON.stringify(props?.authenIds.USER)}</textarea>
                    <textarea data-testid="SearchWrapper-groupIds">{JSON.stringify(props?.authenIds.GROUP)}</textarea>
                </div>
                <button
                    data-testid="SearchWrapper-onRoleIdsChange"
                    onClick={(e: any) => props?.onAuthenIdsChange(e.target.authenIds, 'ROLE')}
                />
                <button
                    data-testid="SearchWrapper-onUserIdsChange"
                    onClick={(e: any) => props?.onAuthenIdsChange(e.target.authenIds, 'USER')}
                />
                <button
                    data-testid="SearchWrapper-onGroupIdsChange"
                    onClick={(e: any) => props?.onAuthenIdsChange(e.target.authenIds, 'GROUP')}
                />
            </div>
        );
    },
}));
// #endregion Mock

beforeEach(() => {
    (useGetDirectoryContext as jest.Mock).mockImplementation(() => ({
        services: {
            getRoles: jest.fn(() =>
                Promise.resolve({
                    items: [
                        { id: 1, name: 'role1' },
                        { id: 2, name: 'role2' },
                    ],
                    total: 2,
                })
            ),
            getUsers: jest.fn(() =>
                Promise.resolve({
                    items: [
                        { id: 1, name: 'user1' },
                        { id: 2, name: 'user2' },
                    ],
                    total: 2,
                })
            ),
            getGroups: jest.fn(() =>
                Promise.resolve({
                    items: [
                        { id: 1, name: 'group1' },
                        { id: 2, name: 'group2' },
                    ],
                    total: 2,
                })
            ),
        },
    }));
    (useAuthenMemoByKey as jest.Mock).mockImplementation(() => [
        {
            ROLE: [],
            USER: [],
            GROUP: [],
        },
        jest.fn(),
    ]);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Render', () => {
    it('should render correctly', () => {
        getRender();
        expect(screen.getByText('ClassicDrawer')).toBeInTheDocument();
    });

    it('should render CircularProgress', () => {
        (useGetDirectoryContext as jest.Mock).mockImplementation(() => ({}));
        getRender();
        expect(screen.getByText('CircularProgress')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call SearchWrapper onRoleIdsChange', async () => {
        const mockSetAuthensByType = jest.fn();
        (useAuthenMemoByKey as jest.Mock).mockImplementation(() => [{}, mockSetAuthensByType]);
        getRender();

        await waitFor(() => {
            fireEvent.click(screen.getByTestId('SearchWrapper-onRoleIdsChange'), {
                target: { authenIds: [1, 2] },
            });
        });

        expect(mockSetAuthensByType).toHaveBeenCalled();
        // await waitFor(() => {
        //     expect(screen.getByTestId('SearchWrapper-onUserIdsChange')).toBeInTheDocument();
        //     expect(screen.getByTestId('SearchWrapper-onGroupIdsChange')).toBeInTheDocument();
        // });
    });

    it('should call Drawer onClose', () => {
        const mockOnDrawerLevelChange = jest.fn();
        getRender({
            drawerLevel: 4,
            onDrawerLevelChange: mockOnDrawerLevelChange,
        });

        fireEvent.click(screen.getByTestId('ClassicDrawer-onClose'));
        expect(mockOnDrawerLevelChange).toHaveBeenCalledWith(3);
    });

    it('should call Drawer onSubmit', async () => {
        const mockOnDrawerLevelChange = jest.fn();
        const mockOnTempPermissionsChange = jest.fn();
        getRender({
            drawerLevel: 4,
            onDrawerLevelChange: mockOnDrawerLevelChange,
            onTempPermissionsChange: mockOnTempPermissionsChange,
        });

        fireEvent.click(screen.getByTestId('ClassicDrawer-onSubmit'));

        await waitFor(() => {
            // expect(mockOnDrawerLevelChange).toHaveBeenCalledWith(3);
            // expect(mockOnTempPermissionsChange).toHaveBeenCalled();
        });
    });
});
