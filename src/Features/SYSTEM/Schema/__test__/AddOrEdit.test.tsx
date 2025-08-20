import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router';
import { Provider } from 'jotai';
import { I18nProvider, i18nLib } from 'translate';
import { AppProvider } from 'Utils';
import AddOrEdit from '../AddOrEdit';
import { currentSchemaDetailsState, rootSchemasState, nameState } from '../Atoms';
import { SchemaContext } from '../context';
import { SchemaServices } from '../Services';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

// #region Mock AWING
jest.mock('AWING', () => ({
    ...jest.requireActual('AWING'),
    textValidation: () => ({ valid: true, message: '' }),
}));
// #endregion

const mockgetSchemas = jest.fn();
const mockcreateSchema = jest.fn();
const mockdeleteSchema = jest.fn();
const mockgetObjectDefinitions = jest.fn();
const mockgetSchemaById = jest.fn();
const mockupdateSchema = jest.fn();

const services: SchemaServices = {
    getSchemas: mockgetSchemas,
    createSchema: mockcreateSchema,
    deleteSchema: mockdeleteSchema,
    getObjectDefinitions: mockgetObjectDefinitions,
    getSchemaById: mockgetSchemaById,
    updateSchema: mockupdateSchema,
};

const moackOnDrawerLevelChange = jest.fn();
const moackOnUpdateSchemas = jest.fn();

jest.mock('../components/TabConfigtion', () => ({
    __esModule: true,
    default: () => {
        return <div>TabConfigtion</div>;
    },
}));

// #region Mock Commons
jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => {
        return (
            <div>
                Drawer Component
                <h6 data-testid="drawer-title">{props?.title}</h6>
                <p data-testid="drawer-disableButtonSubmit">{`${props?.disableButtonSubmit}`}</p>
                <button data-testid="drawer-submit" onClick={props.onSubmit}>
                    Submit
                </button>
                <button data-testid="ClassicDrawer-onClose" onClick={props?.onClose}>
                    onClose
                </button>
                <div data-testid="isDisableButtonSubmit">{props.disableButtonSubmit}</div>
                {props.children}
            </div>
        );
    },
}));
// #endregion

export const Render = (props?: any) => {
    const initialRecoilState = ({ set }: any) => {
        set(currentSchemaDetailsState, [
            {
                objectDefinitionId: 11,
                objectDefinition: {
                    id: 1,
                    fieldName: '.id.',
                    fields: [],
                },
                isReadOnly: false,
            },
        ]);
        set(rootSchemasState, [
            {
                objectTypeCode: 'Campaign',
            },
        ]);
        set(nameState, 'Demo schema name');
    };

    return render(
        <I18nProvider i18nData={i18nLib}>
            <AppProvider>
                <Provider initializeState={initialRecoilState}>
                    <SchemaContext.Provider
                        value={{
                            currentWorkspace: {
                                defaultSchemas: [],
                            },
                            services,
                            ...props,
                        }}
                    >
                        <AddOrEdit drawerLevel={2} onDrawerLevelChange={moackOnDrawerLevelChange} onUpdateSchemas={moackOnUpdateSchemas} />
                    </SchemaContext.Provider>
                </Provider>
            </AppProvider>
        </I18nProvider>
    );
};

describe('Render and Actions', () => {
    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
        mockupdateSchema.mockResolvedValue({});
        mockcreateSchema.mockResolvedValue({});
        mockgetSchemaById.mockResolvedValue({
            id: 1,
            name: 'Schema',
            objectTypeCode: 'Campaign',
            schemaObjectDefinitions: [
                {
                    id: 1,
                    objectDefinitionId: 11,
                    isReadOnly: false,
                },
                {
                    id: 1,
                    objectDefinitionId: 12,
                    isReadOnly: false,
                },
            ],
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render Drawer label', () => {
        Render();
        expect(screen.queryByText('Schema.TitleCreateSchema')).toBeInTheDocument();
    });

    it('should Drawer Submit to Create', () => {
        Render();

        fireEvent.click(screen.getByTestId('drawer-submit'));

        waitFor(() => {
            expect(mockcreateSchema).toHaveBeenCalled();
        });
    });

    it('should Drawer Submit to Edit', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        Render();

        fireEvent.click(screen.getByTestId('drawer-submit'));

        waitFor(() => {
            expect(mockupdateSchema).toHaveBeenCalled();
        });
    });

    it('should Drawer onClose', () => {
        Render();
        fireEvent.click(screen.getByTestId('ClassicDrawer-onClose'));

        waitFor(() => {
            expect(moackOnDrawerLevelChange).toHaveBeenCalled();
        });
    });

    describe('Create', () => {
        it('should show disableButtonSubmit', () => {
            Render();
        });
    });

    describe('Edit', () => {
        beforeEach(() => {
            (useParams as jest.Mock).mockReturnValue({ id: '1' });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should getSchemaById called', () => {
            Render();

            waitFor(() => {
                expect(mockgetSchemaById).toHaveBeenCalled();
            });
        });
    });
});
