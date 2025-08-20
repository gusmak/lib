import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import Container from '../Container';
import { Schema } from '../types';
import { SchemaContext } from '../context';
import { AppProvider } from 'Utils';
import { useAppHelper } from 'Context';
import { useNavigate, MemoryRouter } from 'react-router';
import { Constants } from '../Constants';
import { SchemaServices } from '../Services';

const creatPath = Constants.CREATE_PATH;
const editPath = Constants.EDIT_PATH;
const viewPath = Constants.VIEW_PATH;

const resData: Schema[] = [
    {
        id: 1,
        name: 'Schema 01',
        objectTypeCode: 'Campaign',
        workspaceId: 2,
    },
    {
        id: 2,
        name: 'Schema 02',
        objectTypeCode: 'Campaign',
        workspaceId: 2,
    },
    {
        id: 3,
        name: 'Schema 03',
        objectTypeCode: 'Campaign',
        workspaceId: 2,
        schemaObjectDefinitions: [],
    },
];

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
}));

jest.mock('Context', () => ({
    ...jest.requireActual('Context'),
    useAppHelper: jest.fn(),
}));

jest.mock('Commons/Enums', () => ({
    SortEnumType: {
        Asc: 'ASC',
        Desc: 'DESC',
    },
}));

// #region Mock PageManagement
jest.mock('AWING', () => ({
    ...jest.requireActual('AWING'),
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
                {/* Demo onChangeQueryInput */}
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
                {/* Demo onChangeQueryInput with other pageSize */}
                <button
                    data-testid="changedQueryInputPageZize"
                    onClick={() => {
                        props.onChangeQueryInput({
                            searchString: '1',
                            pageIndex: 1,
                            pageSize: 20,
                            sorts: [
                                {
                                    field: 'name',
                                    sort: 'asc',
                                },
                            ],
                            advancedObject: { objectTypeCode: 'Campaign' },
                        });
                    }}
                />

                {/* Demo onChangeQueryInput with searchString empty */}
                <button
                    data-testid="removeQueryInput"
                    onClick={() => {
                        props.onChangeQueryInput({
                            searchString: '',
                            pageIndex: 0,
                            advancedObject: {},
                        });
                    }}
                />

                {/* Map columns */}
                {(props.columns as any[])
                    .filter((item) => item.valueGetter)
                    .map((getter, idx) => (
                        <span key={idx} data-testid={getter.field}>
                            {getValue(getter, idx)}
                        </span>
                    ))}

                {/* Map advancedSearchFields */}
                {props?.advancedSearchFields?.map((i: any) => {
                    return (
                        <span key={i.field} data-testid={i.field}>
                            {i.label}
                        </span>
                    );
                })}

                <button data-testid="PageManagement-onDelete" onClick={(e: any) => props.onDelete(e.target.id)}>
                    onDelete
                </button>
                <span data-testid="rowid">{props.getRowId(resData[0])}</span>
                <button data-testid="CreateBtn" onClick={props.onCreateButtonClick} />
                <button
                    data-testid="Rowclick"
                    onClick={(e: any) => {
                        props.onRowClick(e.target.id);
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

const moackgetSchemas = jest.fn();
const moackcreateSchema = jest.fn();
const moackdeleteSchema = jest.fn();
const mockgetObjectDefinitions = jest.fn();
const moackgetSchemaById = jest.fn();
const moackupdateSchema = jest.fn();

const services: SchemaServices = {
    getSchemas: moackgetSchemas,
    createSchema: moackcreateSchema,
    deleteSchema: moackdeleteSchema,
    getObjectDefinitions: mockgetObjectDefinitions,
    getSchemaById: moackgetSchemaById,
    updateSchema: moackupdateSchema,
};

export const Render = (props?: any) =>
    render(
        <AppProvider>
            <Provider>
                <SchemaContext.Provider
                    value={{
                        currentWorkspace: {
                            id: 10,
                            defaultSchemas: [
                                {
                                    id: 1,
                                    name: 'Schema 01',
                                    objectTypeCode: 'Campaign',
                                    workspaceId: 2,
                                },
                            ],
                        },
                        services,
                        ...props,
                    }}
                >
                    <MemoryRouter initialEntries={[creatPath, `${editPath}/:id`, `${viewPath}/:id`]}>
                        <Container />
                    </MemoryRouter>
                </SchemaContext.Provider>
            </Provider>
        </AppProvider>
    );

describe('Schema', () => {
    const mockAppHelper = {
        confirm: jest.fn(),
        snackbar: jest.fn(),
    };

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);
        moackgetSchemas.mockResolvedValue({
            itmes: [],
            total: 0,
        });
        mockgetObjectDefinitions.mockResolvedValue({
            items: [
                {
                    id: 1,
                    objectTypeCode: 'Campaign',
                },
            ],
            total: 0,
        });
        moackdeleteSchema.mockResolvedValue({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Render', () => {
        it('should render page title', () => {
            Render();
            expect(screen.queryByTestId('page-label')).toHaveTextContent('Schema.Title');
        });
    });

    describe('Actions', () => {
        it('should call create button', () => {
            Render();
            fireEvent.click(screen.getByTestId('CreateBtn'));
            expect(mockNavigate).toHaveBeenCalledWith(creatPath);
        });

        it('should edit when click to row', () => {
            Render();
            fireEvent.click(screen.getByTestId('Rowclick'), { target: { id: 2 } });
            expect(mockNavigate).toHaveBeenCalledWith(`${editPath}/2`);
        });

        it('should view when click to row (view when root schema)', () => {
            Render();
            fireEvent.click(screen.getByTestId('Rowclick'), { target: { id: 1 } });
            expect(mockNavigate).toHaveBeenCalledWith(`${editPath}/1`);
        });

        it('should call handleDeleted when the delete button is clicked', async () => {
            Render();

            fireEvent.click(screen.getByTestId('PageManagement-onDelete'));
            expect(moackdeleteSchema).toHaveBeenCalled();
        });

        it('should call snackbar', async () => {
            moackdeleteSchema.mockRejectedValue({});
            Render();
            fireEvent.click(screen.getByTestId('btnShowNotificationSuccess'));
            expect(mockAppHelper.snackbar).toHaveBeenCalled();
        });

        it('should call changedQueryInputPageZize', async () => {
            moackdeleteSchema.mockRejectedValue({});
            Render();
            fireEvent.click(screen.getByTestId('changedQueryInputPageZize'));
            await waitFor(async () => {
                expect(moackgetSchemas).toHaveBeenCalled();
            });
        });

        it('should call changedQueryInputPageZize with advancedObject', async () => {
            moackdeleteSchema.mockRejectedValue({});
            Render();
            fireEvent.click(screen.getByTestId('changedQueryInputPageZize'));
            await waitFor(async () => {
                expect(moackgetSchemas).toHaveBeenCalled();
            });
        });
    });
});
