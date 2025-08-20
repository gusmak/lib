import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'jotai';
import { getNewPermissions, getNewPermissionStates, removeSchema } from '../../utils';
import { fullFieldsState, rootSchemasState, workflowStates } from '../../Atoms';
import PageContent from '../PageContent';
import { PageContentProps } from '../types';

// #region Mount
const initProps: PageContentProps = {
    authenPermissions: [],
    disableSelectSchema: false,
    explicitMatrixPermissions: [],
    explicitPermissions: [
        {
            permissions: [1],
            schemaId: null,
            workflowStateIds: [],
        },
    ],
    inheritedMatrixPermissions: [],
    inheritedPermissions: [],
    isCreate: false,
    onExplicitMatrixPermissionsChange: jest.fn(),
    onExplicitPermissionsChange: jest.fn(),
};

const getRender = (props?: Partial<PageContentProps>, workflowState?: any) => {
    const initialRecoilState = ({ set }: any) => {
        set(fullFieldsState, []);
        set(rootSchemasState, []);
        set(workflowStates, workflowState);
    };

    render(
        <Provider initializeState={initialRecoilState}>
            <MemoryRouter initialEntries={['/SelectSchema']}>
                <PageContent {...initProps} {...props} />
            </MemoryRouter>
        </Provider>
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
    Link: (props: any) => <a>{props?.children}</a>,
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Button: (props: any) => (
        <a data-testid="Material-Button-onClick" onClick={props.onClick}>
            {props?.children}
        </a>
    ),
}));

jest.mock('../../utils', () => ({
    getNewPermissions: jest.fn(),
    getNewPermissionStates: jest.fn(),
    removeSchema: jest.fn(),
}));

jest.mock('../../components/AddOrEditHeader', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p data-testid="AddOrEditHeader-header">AddOrEditHeader</p>
                <button data-testid="AddOrEditHeader-onDeleteAuthen" onClick={props?.onDeleteAuthen} />
            </div>
        );
    },
}));

jest.mock('../../components/PermissionTable', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p data-testid="PermissionTable-header">PermissionTable</p>
                <button
                    data-testid="PermissionTable-onChangePermission"
                    onClick={(e: any) => props?.onChangePermission(e.target.permissionCode, e.target.schemaId)}
                />
                <button data-testid="PermissionTable-onDeleteSchema" onClick={(e: any) => props?.onDeleteSchema(e.target.schemaId)} />
                <button
                    data-testid="PermissionTable-onChangeStates"
                    onClick={(e: any) => props?.onChangeStates(e.target.stateId, e.target.schemaId)}
                />
            </div>
        );
    },
}));

jest.mock('../../components/WorkflowMatrix', () => ({
    __esModule: true,
    default: (props: any) => {
        return <p data-testid="WorkflowMatrix-header">WorkflowMatrix</p>;
    },
}));
// #endregion Mock

beforeEach(() => {
    (getNewPermissions as jest.Mock).mockReturnValue([]);
    (getNewPermissionStates as jest.Mock).mockReturnValue([]);
    (removeSchema as jest.Mock).mockReturnValue([]);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Render', () => {
    it('should render PageContent', () => {
        getRender();
        expect(screen.getByTestId('AddOrEditHeader-header')).toBeInTheDocument();
    });

    it('should render workflow', () => {
        getRender(
            {},
            {
                id: 1,
                name: 'workflow demo',
                objectTypeCode: 'Campaigns',
                stateFieldName: 'state',
                description: 'workflow description',
                workflowMatrices: [],
                workflowStates: [],
            }
        );
        expect(screen.getByTestId('AddOrEditHeader-header')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call Material-Button-onClick', () => {
        const mockOnDrawerLevelChange = jest.fn();
        getRender({ onDrawerLevelChange: mockOnDrawerLevelChange });
        fireEvent.click(screen.getByTestId('Material-Button-onClick'));
        expect(mockOnDrawerLevelChange).toHaveBeenCalled();
    });

    it('should call AddOrEditHeader onDeleteAuthen', () => {
        const mockOnDeleteAuthen = jest.fn();
        getRender({ onDeleteAuthen: mockOnDeleteAuthen });
        fireEvent.click(screen.getByTestId('AddOrEditHeader-onDeleteAuthen'));
        expect(mockOnDeleteAuthen).toHaveBeenCalled();
    });

    it('should call PermissionTable onChangeStates', () => {
        const mockOnExplicitPermissionsChange1 = jest.fn();
        getRender({ onExplicitPermissionsChange: mockOnExplicitPermissionsChange1 });

        fireEvent.click(screen.getByTestId('PermissionTable-onChangeStates'), {
            target: { stateId: 1, schemaId: 1 },
        });

        expect(mockOnExplicitPermissionsChange1).toHaveBeenCalled();
    });

    it('should call PermissionTable onDeleteSchema', () => {
        const mockOnExplicitPermissionsChange2 = jest.fn();
        getRender({ onExplicitPermissionsChange: mockOnExplicitPermissionsChange2 });

        fireEvent.click(screen.getByTestId('PermissionTable-onDeleteSchema'), {
            target: { schemaId: 1 },
        });
        expect(mockOnExplicitPermissionsChange2).toHaveBeenCalled();
    });

    it('should call PermissionTable onChangePermission', () => {
        const mockOnExplicitPermissionsChange3 = jest.fn();
        getRender(
            { onExplicitPermissionsChange: mockOnExplicitPermissionsChange3 },
            {
                workflowStates: undefined,
            }
        );

        fireEvent.click(screen.getByTestId('PermissionTable-onChangePermission'), {
            target: { permissionCode: 1, schemaId: 1 },
        });
        expect(mockOnExplicitPermissionsChange3).toHaveBeenCalled();
    });
});
