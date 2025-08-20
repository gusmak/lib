import { useState } from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { I18nProvider, i18nLib } from 'translate';
import { useNavigate } from 'react-router';
import { useAppHelper } from 'Context';
import { RoleServices } from '../Services';
import Container from '../Container';
import { initRoles, initRoleTags } from './services';
import type { Role, RoleTagOptions } from '../types';
import { RoleContext } from '../context';

const resData: Role[] = [
    {
        id: 1,
        name: 'Role 01',
        description: 'Role Description 01',
    },
    {
        id: 2,
        name: 'Role 02',
        description: 'Role Description 02',
        roleTags: [
            {
                id: 1,
                name: 'RoleTag 01',
            },
            {
                id: 2,
                name: 'RoleTag 02',
            },
        ],
    },
];

const initRoleTagOptions: RoleTagOptions[] = [{ text: 'RoleTag 01', value: 1 }];

jest.mock('Context', () => ({
    useAppHelper: jest.fn(),
}));

jest.mock('react-router', () => ({
    useNavigate: jest.fn(),
}));

// #region Mock PageManagement
jest.mock('AWING', () => ({
    PageManagement: (props: any) => {
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
            return s.valueGetter(resData[1], index);
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

                <span data-testid="rowid">{props.getRowId(resData[0])}</span>
                <button data-testid="CreateBtn" onClick={props.onCreateButtonClick} />
                <button
                    data-testid="Rowclick"
                    onClick={() => {
                        props.onRowClick(resData[0].id, {
                            target: { cellIndex: 1 },
                        });
                    }}
                >
                    Rowclick
                </button>
                <button
                    data-testid="btnDelete"
                    onClick={() => {
                        props.onDelete(resData[0].id);
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
                <p>{JSON.stringify(resData)}</p>
                <span data-testid="totalItemCount">totalItemCount: {resData.length}</span>
            </div>
        );
    },
}));
// #endregion

jest.mock('Commons/Constant', () => ({
    Constants: {
        PAGE_SIZE_DEFAULT: 10,
    },
}));

jest.mock('../../constants', () => ({
    Constants: {
        CREATE_PATH: 'create',
        EDIT_PATH: 'edit',
    },
}));

const mockDelete = jest.fn();
const mockGetRoles = jest.fn();
const mockGetRoleTags = jest.fn();

export const services: RoleServices = {
    getRoles: mockGetRoles,
    createRole: (_p) => {
        return Promise.resolve();
    },
    updateRole: (_p) => {
        return Promise.resolve();
    },
    deleteRole: mockDelete,
    getRoleTags: mockGetRoleTags,
    getRoleById: (p) => {
        const role = initRoles.find((r) => r.id === p.id);
        return Promise.resolve(role ?? {});
    },
};

// #region Mock Component
const UI = () => {
    const [roleTagOptions, setRoleTagOptions] = useState<RoleTagOptions[]>(initRoleTagOptions);

    return (
        <I18nProvider i18nData={i18nLib}>
            <RoleContext.Provider
                value={{
                    services,
                    roleTagOptions,
                    setRoleTagOptions,
                }}
            >
                <Container />
            </RoleContext.Provider>
        </I18nProvider>
    );
};
// #endregion

const renderUi = () => render(<UI />);

/** mocks value */
const mockNavigate = jest.fn();

const mockAppHelper = {
    confirm: jest.fn(),
    snackbar: jest.fn(),
};

beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);
    mockGetRoles.mockResolvedValue({
        roles: initRoles,
        total: initRoles.length,
    });
    mockGetRoleTags.mockResolvedValue({
        roleTags: initRoleTags,
        total: initRoleTags.length,
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('render', () => {
    it('should show page title', () => {
        renderUi();
        expect(screen.getByTestId('page-label')).toHaveTextContent('Role.Title');
    });

    it('should show row name', () => {
        renderUi();
        expect(screen.getByTestId('roleTagIds.name')).toHaveTextContent('RoleTag 01');
    });

    it('Should render roles correctly', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('changedQueryInput'));

        await waitFor(() => {
            expect(screen.getByText(JSON.stringify(resData))).toBeInTheDocument();
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
    it('Show called create', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('CreateBtn'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
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

    it('Show changed query input', async () => {
        renderUi();
        fireEvent.click(screen.getByTestId('changedQueryInput'));

        await waitFor(async () => {
            expect(mockGetRoles).toHaveBeenCalled();

            act(() => {
                expect(mockGetRoleTags).toHaveBeenCalled();
            });
        });
    });

    it('Show changed query input page size', async () => {
        renderUi();

        fireEvent.click(screen.getByTestId('changedQueryInputPageZize'));

        await waitFor(async () => {
            expect(mockGetRoles).toHaveBeenCalled();
        });
    });
});
