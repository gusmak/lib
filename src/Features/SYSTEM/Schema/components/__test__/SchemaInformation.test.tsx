import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import { rootSchemaObjectsState, rootSchemasState, fullFieldsState, selectedRootSchemaState, objectTypeCodesState } from '../../Atoms';
import { SchemaContext } from '../../context';
import SchemaInformation from '../SchemaInformation';
import { convertToDisplayData, convertToTreeData, countEnableFields, getFieldChilds, getParentNames } from '../../utils';

const mockTextFieldOnChange = jest.fn();
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    MenuItem: (props: any) => {
        const { children } = props;
        return <div>{children}</div>;
    },
    TextField: (props: any) => {
        const { onChange = mockTextFieldOnChange } = props;
        return (
            <div>
                <p data-testid={`${props['data-testid']}-label`}>{props.label}</p>
                <button data-testid={`${props['data-testid']}-onChange`} onClick={(e: any) => onChange(e.target)}>
                    onChange
                </button>
            </div>
        );
    },
}));

jest.mock('AWING', () => ({
    textValidation: () => ({ valid: false, message: '' }),
}));

const mockObjectFieldsOnSelect = jest.fn();
const mockObjectFieldsOnSelectAll = jest.fn();
const mockObjectFieldsOnCheckReadOnly = jest.fn();
jest.mock('../ObjectFields', () => ({
    __esModule: true,
    default: (props: any) => {
        const {
            onSelectAll = mockObjectFieldsOnSelectAll,
            onSelect = mockObjectFieldsOnSelect,
            onCheckReadOnly = mockObjectFieldsOnCheckReadOnly,
        } = props;
        return (
            <div>
                <p>ObjectFields</p>
                <p data-testid="ObjectFields-isSelectAll">{props.isSelectAll}</p>
                <button data-testid="ObjectFields-onSelectAll" onClick={(e: any) => onSelectAll(e.target.checked)}>
                    onSelectAll
                </button>
                <button data-testid="ObjectFields-onSelect" onClick={(e: any) => onSelect(e.target.checked, e.target.fieldInfo)}>
                    onSelect
                </button>
                <button
                    data-testid="ObjectFields-onCheckReadOnly"
                    onClick={(e: any) => onCheckReadOnly(e.target.checked, e.target.fieldInfo)}
                >
                    onCheckReadOnly
                </button>
            </div>
        );
    },
}));

jest.mock('../../utils', () => ({
    ...jest.requireActual('../../utils'),
    convertToDisplayData: jest.fn(),
    convertToTreeData: jest.fn(),
    addFieldChildsToRestFields: jest.fn(),
    countEnableFields: jest.fn(),
    getFieldChilds: jest.fn(),
    getParentNames: jest.fn(),
    pushIfNotExists: jest.fn(),
}));

beforeEach(() => {
    (convertToDisplayData as jest.Mock).mockReturnValue([
        {
            id: 1,
            name: 'name',
            fieldPath: 'name',
            isEnable: true,
            isReadOnly: false,
        },
        {
            id: 2,
            name: 'description',
            fieldPath: 'description',
            isEnable: true,
            isReadOnly: true,
        },
    ]);
    (convertToTreeData as jest.Mock).mockReturnValue([
        {
            description: null,
            fieldName: 'id',
            fieldPath: '.id.',
            id: 2,
            isPrimaryKey: true,
            objectTypeCode: 'Campaign',
        },
        {
            id: 1,
            fieldName: 'name',
            fieldPath: 'name',
            isEnable: true,
            isReadOnly: false,
            objectTypeCode: 'Campaign',
            childs: [
                {
                    id: 2,
                    name: 'description',
                    fieldPath: 'description',
                    isEnable: true,
                    isReadOnly: true,
                    objectTypeCode: 'Campaign',
                },
            ],
        },
        {
            id: 3,
            name: 'description',
            fieldPath: 'description',
            isEnable: true,
            isReadOnly: true,
            objectTypeCode: 'Campaign',
            isPrimaryKey: true,
        },
    ]);
    (countEnableFields as jest.Mock).mockReturnValue(2);
    (getFieldChilds as jest.Mock).mockReturnValue([]);
    (getParentNames as jest.Mock).mockReturnValue([]);
});

const initialRecoilState = ({ set }: any) => {
    set(rootSchemaObjectsState, [
        {
            id: 1,
            name: 'name',
            objectTypeCode: 'Campaign',
            isEnable: true,
            isReadOnly: false,
        },
    ]);
    set(rootSchemasState, [
        {
            id: 1,
            name: 'name',
            objectTypeCode: 'Campaign',
            schemaObjectDefinitions: [],
            isRoot: false,
        },
    ]);
    set(fullFieldsState, [
        {
            description: null,
            fieldName: 'id',
            fieldPath: '.id.',
            id: 2,
            isPrimaryKey: true,
            objectTypeCode: 'Campaign',
        },
        {
            id: 2,
            objectTypeCode: 'Campaign',
            fieldName: 'name',
            fieldPath: '.name.',
            fieldType: '',
            description: null,
            isPrimaryKey: null,
        },
    ]);
    set(selectedRootSchemaState, {
        id: 1,
        objectTypeCode: 'Campaign',
        fieldName: 'id',
        fieldPath: '.id.',
        fieldType: '',
        description: null,
        isPrimaryKey: true,
    });
    set(objectTypeCodesState, [
        {
            key: 'Campaign',
            value: 'Campaign',
        },
    ]);
};

export const Component = (props?: any) => {
    return (
        <SchemaContext.Provider
            value={{
                ...props,
            }}
        >
            <SchemaInformation />
        </SchemaContext.Provider>
    );
};

export const Render = () =>
    render(
        <Provider initializeState={initialRecoilState}>
            <Component />
        </Provider>
    );

describe('Render and Actions', () => {
    it('should render schema label', () => {
        Render();
        expect(screen.getByText('Schema.ObjectLabel')).toBeInTheDocument();
        expect(screen.getByText('Schema.FieldLabel *')).toBeInTheDocument();
    });

    it('should show rootSchemaObjects', () => {
        Render();

        expect(screen.queryByTestId('rootSchemaObjects-label')).toBeInTheDocument();
    });

    it('should show rootSchemaObjects', () => {
        Render();
        expect(screen.getByText('ObjectFields')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call rootSchemaObjects changed', () => {
        Render();

        fireEvent.click(screen.getByTestId('rootSchemaObjects-onChange'), {
            target: {
                value: 1,
            },
        });
        waitFor(() => {
            expect(mockTextFieldOnChange).toHaveBeenCalledWith({ target: { value: 1 } });
        });
    });

    it('should call handleChangeName', () => {
        Render();
        fireEvent.click(screen.getByTestId('SchemaName-onChange'));
        waitFor(() => {
            expect(mockTextFieldOnChange).toHaveBeenCalledWith({ target: { value: 'Campaign' } });
        });
    });

    it('should call setObjectTypeCode', () => {
        Render();
        fireEvent.click(screen.getByTestId('objectTypeCode-onChange'), { target: { value: 'Campaign' } });
        waitFor(() => {
            expect(mockTextFieldOnChange).toHaveBeenCalledWith({ target: { value: 'Campaign' } });
        });
    });

    it('should call onSelectAll with checked true', () => {
        Render();
        fireEvent.click(screen.getByTestId('ObjectFields-onSelectAll'), {
            target: {
                checked: true,
            },
        });
        waitFor(() => {
            expect(mockObjectFieldsOnCheckReadOnly).toHaveBeenCalledWith(true);
        });
    });

    it('should call onSelectAll with checked false', () => {
        Render();
        fireEvent.click(screen.getByTestId('ObjectFields-onSelectAll'), {
            target: {
                checked: false,
            },
        });
        waitFor(() => {
            expect(mockObjectFieldsOnCheckReadOnly).toHaveBeenCalledWith(false);
        });
    });

    it('should call onCheckReadOnly', () => {
        Render();
        fireEvent.click(screen.getByTestId('ObjectFields-onCheckReadOnly'), {
            target: {
                checked: true,
                fieldInfo: { id: 2 },
            },
        });
        waitFor(() => {
            expect(mockObjectFieldsOnCheckReadOnly).toHaveBeenCalledWith(true, { id: 2 });
        });
    });

    describe('ObjectFields onSelect with checked true', () => {
        it('should call onSelect with checked true', () => {
            (getParentNames as jest.Mock).mockReturnValue(['id']);

            const initialRecoilCurrent = ({ set }: any) => {
                set(fullFieldsState, [
                    {
                        id: 15,
                        objectTypeCode: 'MEDIA_PLAN',
                        fieldName: 'acceptanceDate',
                        fieldPath: '.acceptanceDate.',
                        fieldType: '',
                        description: null,
                        isPrimaryKey: null,
                        __typename: 'ObjectDefinition',
                    },
                    {
                        id: 62,
                        objectTypeCode: 'MEDIA_PLAN',
                        fieldName: 'mediaPlanAcceptanceFiles',
                        fieldPath: '.mediaPlanAcceptanceFiles.',
                        fieldType: '',
                        description: null,
                        isPrimaryKey: null,
                        __typename: 'ObjectDefinition',
                    },
                    {
                        id: 63,
                        objectTypeCode: 'MEDIA_PLAN',
                        fieldName: '{customerId}',
                        fieldPath: '.mediaPlanAcceptanceFiles.{customerId}.',
                        fieldType: '',
                        description: null,
                        isPrimaryKey: null,
                        __typename: 'ObjectDefinition',
                    },
                ]);
            };
            render(
                <Provider initializeState={initialRecoilCurrent}>
                    <Component />
                </Provider>
            );

            fireEvent.click(screen.getByTestId('ObjectFields-onSelect'), {
                target: {
                    checked: true,
                    fieldInfo: { id: 2, childs: [{ id: 3 }], fieldPath: '.id.' },
                },
            });
            waitFor(() => {
                expect(mockObjectFieldsOnSelect).toHaveBeenCalledWith(true, { id: 2 });
            });
        });

        it('should parentFields empty', () => {
            (getParentNames as jest.Mock).mockReturnValue(['id']);
            Render();
            fireEvent.click(screen.getByTestId('ObjectFields-onSelect'), {
                target: {
                    checked: true,
                    fieldInfo: { id: 2 },
                },
            });
            waitFor(() => {
                expect(mockObjectFieldsOnSelect).toHaveBeenCalledWith(true, { id: 2 });
            });
        });
    });

    describe('ObjectFields onSelect with checked false', () => {
        it('should call onSelect with checked false', () => {
            Render();
            fireEvent.click(screen.getByTestId('ObjectFields-onSelect'), {
                target: {
                    checked: false,
                    fieldInfo: { id: 2, isPrimaryKey: true },
                },
            });
            waitFor(() => {
                expect(mockObjectFieldsOnSelect).toHaveBeenCalledWith(false, { id: 2, isPrimaryKey: true });
            });
        });
    });
});
