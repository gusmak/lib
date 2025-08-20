import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { I18nProvider, i18nLib } from 'translate';
import { useNavigate } from 'react-router';
import { useAppHelper } from 'Context';
import { ObjectFilterServices } from '../Services';
import Container from '../Container';
import { initObjectFilter } from './servicesData';
import type { ObjectFilter } from '../types';
import { checkPermissionControl } from '../utils';
import { ObjectFilterContext } from '../context';

const resData: ObjectFilter[] = [
    {
        id: 246,
        name: 'AAA_HN_XaLa ',
        objectTypeCode: 'MEDIA_PLAN',
        logicalExpression: 'any(o.BillCustomer.Brands) = false ',
        configType: 'OBJECT_AND_CHANGED',
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectTypeCode',
                        fieldPath: '.objectTypeCode.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'logicalExpression',
                        fieldPath: '.logicalExpression.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'configType',
                        fieldPath: '.configType.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
            ],
        },
    },
    {
        id: 245,
        name: 'WMP_6771_WMd',
        objectTypeCode: 'MEDIA_PLAN',
        logicalExpression: 'any(o.BillCustomer.Brands) = false ',
        configType: 'OBJECT_AND_CHANGED',
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectTypeCode',
                        fieldPath: '.objectTypeCode.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'logicalExpression',
                        fieldPath: '.logicalExpression.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'configType',
                        fieldPath: '.configType.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
            ],
        },
    },
    {
        id: 244,
        name: 'Sub-Campaign',
        objectTypeCode: 'MEDIA_PLAN',
        logicalExpression: 'c.BillCustomer.Brands.0.CustomerId = o.BillCustomer.Id ',
        configType: 'OBJECT_AND_CHANGED',
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectTypeCode',
                        fieldPath: '.objectTypeCode.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'logicalExpression',
                        fieldPath: '.logicalExpression.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'configType',
                        fieldPath: '.configType.',
                        objectTypeCode: 'OBJECT_FILTER',
                    },
                },
            ],
        },
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

jest.mock('../utils', () => ({
    checkPermissionControl: jest.fn(),
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
        CREATE_PATH: 'create',
        EDIT_PATH: 'edit',
        PAGE_SIZE_DEFAULT: 10,
        PERMISSION_CODE: {
            FULL_CONTROL: 31,
            MODIFY: 15,
            WRITE: 4,
            READ_AND_EXECUTE: 3,
            READ: 2,
            LIST_FOLDER_CONTENTS: 1,
        },
    },
}));

const mockGetObjectFilters = jest.fn();
const mockCreateObjectFilter = jest.fn();
const mockUpdateObjectFilter = jest.fn();
const mockGetObjectFilterById = jest.fn();
const mockDelete = jest.fn();

export const services: ObjectFilterServices = {
    getObjectFilters: mockGetObjectFilters,
    createObjectFilter: mockCreateObjectFilter,
    updateObjectFilter: mockUpdateObjectFilter,
    getObjectFilterById: mockGetObjectFilterById,
    deleteObjectFilter: mockDelete,
};

// #region Mock Component
const UI = () => {
    return (
        <I18nProvider i18nData={i18nLib}>
            <ObjectFilterContext.Provider
                value={{
                    services,
                }}
            >
                <Container />
            </ObjectFilterContext.Provider>
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
    mockGetObjectFilters.mockResolvedValue({
        roles: initObjectFilter,
        total: initObjectFilter.length,
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('render', () => {
    it('should show page title', () => {
        renderUi();
        expect(screen.getByTestId('page-label')).toHaveTextContent('Filter.Title');
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
            expect(screen.getByTestId('totalItemCount')).toHaveTextContent(`totalItemCount: ${resData.length}`);
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
        (checkPermissionControl as jest.Mock).mockReturnValue(true);
        renderUi();
        fireEvent.click(screen.getByTestId('btnDelete'));

        expect(mockDelete).toHaveBeenCalled();
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
            expect(mockGetObjectFilters).toHaveBeenCalled();
        });
    });
});
