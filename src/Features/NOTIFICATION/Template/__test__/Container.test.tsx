import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nProvider, i18nLib } from 'translate';
import { useNavigate } from 'react-router';
import { useAppHelper } from 'Context';
import { TemplateServices } from '../Services';
import Container from '../Container';
import { checkPermissionControl } from '../utils';
import { initTemplates } from './servicesData';
import type { Template } from '../types';
import { TemplateContext } from '../context';

const resData: Template[] = [
    {
        id: 260,
        name: 'Biên bản nghiệm thu thực tế đợt v1.2 (VIE)',
        objectType: 'MEDIA_PLAN',
        contentType: 'HTML',
        channelType: 'FILE',
        configType: 'OBJECT_AND_CHANGED',
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectType',
                        fieldPath: '.objectType.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'schemaId',
                        fieldPath: '.schemaId.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'channelType',
                        fieldPath: '.channelType.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'contentType',
                        fieldPath: '.contentType.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'title',
                        fieldPath: '.title.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'content',
                        fieldPath: '.content.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'configType',
                        fieldPath: '.configType.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'schema',
                        fieldPath: '.schema.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
            ],
        },
    },
    {
        id: 259,
        name: 'Biên bản nghiệm thu đợt v1.2 (VIE)',
        objectType: 'MEDIA_PLAN',
        contentType: 'HTML',
        channelType: 'FILE',
        configType: 'OBJECT_AND_CHANGED',

        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectType',
                        fieldPath: '.objectType.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'schemaId',
                        fieldPath: '.schemaId.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'channelType',
                        fieldPath: '.channelType.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'contentType',
                        fieldPath: '.contentType.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'title',
                        fieldPath: '.title.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'content',
                        fieldPath: '.content.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'configType',
                        fieldPath: '.configType.',
                        objectTypeCode: 'TEMPLATE',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'schema',
                        fieldPath: '.schema.',
                        objectTypeCode: 'TEMPLATE',
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
                <p data-testid="PageManagement-label">{props.title}</p>
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

jest.mock('../utils', () => ({
    checkPermissionControl: jest.fn(),
}));

const mockGetTemplates = jest.fn().mockReturnValue({
    roles: initTemplates,
    total: initTemplates.length,
});
const mockDelete = jest.fn();

export const services: TemplateServices = {
    getTemplates: mockGetTemplates,
    deleteNotificationTemplate: mockDelete,
    generateTemplate: jest.fn(),
    createTemplate: jest.fn(),
    updateTemplate: jest.fn(),
    getObjectDefinitions: jest.fn(),
    getTemplateById: jest.fn(),
};

// #region Mock Component
const UI = () => {
    return (
        <I18nProvider i18nData={i18nLib}>
            <TemplateContext.Provider
                value={{
                    services,
                }}
            >
                <Container />
            </TemplateContext.Provider>
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
    mockGetTemplates.mockResolvedValue({
        roles: initTemplates,
        total: initTemplates.length,
    });
    (checkPermissionControl as jest.Mock).mockReturnValue(true);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('render', () => {
    it('should show page title', () => {
        renderUi();
        expect(screen.getByTestId('PageManagement-label')).toHaveTextContent('Template.Title');
    });

    it('Should render Data correctly', async () => {
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
            expect(mockGetTemplates).toHaveBeenCalled();
        });
    });
});
