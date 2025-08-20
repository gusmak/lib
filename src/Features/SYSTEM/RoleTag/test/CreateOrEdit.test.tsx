import { useState } from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router';
import { I18nProvider, i18nLib } from 'translate';
import { useAppHelper } from 'Context';
import { RoleTagServices } from '../Services';
import { initRoles, initRoleTags } from './services';
import { RoleTagContext } from '../context';
import CreateOrEdit from '../CreateOrEdit';
import type { RoleOptions } from '../types';

const initRoleOptions: RoleOptions[] = [{ text: 'Role 01', value: 1 }];

jest.mock('Context', () => ({
    ...jest.requireActual('Context'),
    useAppHelper: jest.fn(),
}));

jest.mock('util', () => ({
    useParams: jest.fn(),
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
        props.onUpdate && mockUpdate(props.onUpdate);

        return (
            <div>
                <div>
                    <div>{props.oldValue?.name}</div>
                    <div>{props.oldValue?.description}</div>
                    <div data-testid="roleTags">
                        {props.fields.map((field: any) => (
                            <div data-testid={field.fieldName}>
                                <label>{field.value}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    data-testid="data-form-update"
                    onClick={() =>
                        props.onUpdate({
                            roleTagName: 'Role 01 update',
                            roleTagDescription: 'demo',
                            roleIds: [1, 2],
                        })
                    }
                >
                    Update
                </button>
            </div>
        );
    },
    FIELD_TYPE: {
        TEXT: 'text',
        AUTOCOMPLETE: 'autocomplete',
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

const mockGetRoles = jest.fn();
const mockGetRoleTags = jest.fn();
const mockCreateRoleTag = jest.fn();
const mockUpdateRoleTag = jest.fn();
const mockDeleteRoleTag = jest.fn();
const mockGetRoleTagById = jest.fn();

export const services: RoleTagServices = {
    getRoles: mockGetRoles,
    getRoleTags: mockGetRoleTags,
    createRoleTag: mockCreateRoleTag,
    updateRoleTag: mockUpdateRoleTag,
    deleteRoleTag: mockDeleteRoleTag,
    getRoleTagById: mockGetRoleTagById,
};

const UI = (props: any) => {
    const [roleOptions, setRoleOptions] = useState<RoleOptions[]>(initRoleOptions);

    return (
        <I18nProvider i18nData={i18nLib}>
            <RoleTagContext.Provider
                value={{
                    services,
                    roleOptions,
                    setRoleOptions,
                    ...props,
                }}
            >
                <CreateOrEdit />
            </RoleTagContext.Provider>
        </I18nProvider>
    );
};
const renderUi = (props?: any) => render(<UI {...props} />);

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

    mockGetRoles.mockResolvedValue({
        roles: initRoles,
        total: initRoles.length,
    });
    mockGetRoleTags.mockResolvedValue({
        roleTags: initRoleTags,
        total: initRoleTags.length,
    });
    mockGetRoleTagById.mockResolvedValue({
        ...initRoleTags[0],
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('render', () => {
    it('should show CircularProgress', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        expect(screen.getByText('CircularProgress Component')).toBeInTheDocument();
    });

    it('should show Drawer title', () => {
        renderUi();

        expect(screen.getByText('Drawer Component')).toBeInTheDocument();
    });

    it('should is Create', () => {
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        renderUi();

        expect(screen.getByTestId('drawer-title')).toHaveTextContent('RoleTag.Create');
    });

    it('should is Edit', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        expect(screen.getByTestId('drawer-title')).toHaveTextContent('RoleTag.Edit');
    });

    it('should show show roleTag', () => {
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        renderUi();
        fireEvent.click(screen.getByTestId('data-form-update'));
        expect(mockUpdate).toHaveBeenCalled();
    });

    it('should call onCompleted', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        mockGetRoles.mockResolvedValue({
            ...initRoles,
        });
        mockGetRoleTagById.mockResolvedValue({
            ...initRoleTags[0],
        });
        renderUi();

        await waitFor(() => {
            expect(screen.queryByTestId('roleIds')).toBeInTheDocument();
        });
    });
});

describe('actions', () => {
    it('should call onSubmit when Create', () => {
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        renderUi();

        fireEvent.click(screen.getByTestId('drawer-submit'));
        expect(mockCreateRoleTag).toHaveBeenCalled();
    });

    it('should call onSubmit when Edit', () => {
        renderUi({
            services: undefined,
        });

        fireEvent.click(screen.getByTestId('drawer-submit'));
        expect(mockUpdateRoleTag).not.toHaveBeenCalled();
    });

    it('should call onSubmit when Edit', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        renderUi();

        fireEvent.click(screen.getByTestId('drawer-submit'));
        expect(mockUpdateRoleTag).toHaveBeenCalled();
    });
});
