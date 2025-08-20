import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import { fullFieldsState, objectTypeCodeState, currentSchemaDetailsState } from '../../Atoms';
import { SchemaContext } from '../../context';
import { I18nProvider, i18nLib } from 'translate';
import { AppProvider } from 'Utils';
import ObjectFields, { type OwnProps } from '../ObjectFields';
import { SchemaContextType } from '../../context';

const dataDefault: OwnProps = {
    displayFields: [
        {
            id: 1,
            fieldName: 'id',
            fieldPath: '.id.',
            isDisable: false,
            isEnable: true,
            isReadOnly: false,
            objectTypeCode: 'Campaign',
            isPrimaryKey: true,
            childs: [
                {
                    id: 2,
                    fieldName: 'name',
                    isDisable: true,
                    isEnable: false,
                    isReadOnly: false,
                    objectTypeCode: 'Campaign',
                    childs: [],
                },
            ],
        },
        {
            id: 2,
            fieldName: 'name',
            fieldPath: '.name.',
        },
    ],
};

const mockCheckboxOnChange = jest.fn();
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Checkbox: (props: any) => {
        const { disabled, onChange = mockCheckboxOnChange, onClick } = props;
        return (
            <div>
                <p data-testid="Checkbox-isDisabled">{disabled}</p>
                <button data-testid="Checkbox-onChange" onClick={(e: any) => onChange(e, e.target.checked)}>
                    Tabs onChange
                </button>
                <button data-testid="Checkbox-onClick" onClick={onClick}>
                    Tabs onChange
                </button>
            </div>
        );
    },
}));

const mockOnCheckReadOnly = jest.fn();
const mockOnCheckbox = jest.fn();
jest.mock('../FieldView', () => {
    return {
        __esModule: true,
        default: (props: any) => {
            const { onCheckReadOnly = mockOnCheckReadOnly, onCheckbox = mockOnCheckbox } = props;
            return (
                <div>
                    FieldView
                    <button
                        data-testid="FieldView-onCheckReadOnly"
                        onClick={(e: any) => onCheckReadOnly(e.target.checked, e.target.fieldInfo)}
                    >
                        onCheckReadOnly
                    </button>
                    <button data-testid="FieldView-onCheckbox" onClick={(e: any) => onCheckbox(e.target.checked, e.target.fieldInfo)}>
                        onCheckbox
                    </button>
                </div>
            );
        },
    };
});

const initialRecoilState = ({ set }: any) => {
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
        {
            id: 2,
            objectTypeCode: 'Campaign',
            fieldName: 'ab',
            fieldPath: '.ab.',
            fieldType: '',
            description: null,
            isPrimaryKey: null,
        },
    ]);
    set(currentSchemaDetailsState, [
        {
            objectDefinitionId: 3,
            objectDefinition: {
                id: 3,
                fieldName: 'ab',
                fieldPath: '.ab.',
            },
        },
        {
            objectDefinitionId: 4,
            objectDefinition: {
                id: 4,
                fieldPath: '.ab.ac.',
                fieldName: 'ac',
            },
        },
        {
            objectDefinitionId: 2,
            objectDefinition: {
                id: 2,
                fieldName: 'cd',
            },
        },
    ]);
    set(objectTypeCodeState, 'Campaign');
};
const Component = (props: { objectFields?: OwnProps; schemaContext?: SchemaContextType }) => (
    <I18nProvider i18nData={i18nLib}>
        <AppProvider>
            <Provider initializeState={initialRecoilState}>
                <SchemaContext.Provider
                    value={{
                        ...props.schemaContext,
                    }}
                >
                    <ObjectFields {...dataDefault} {...props.objectFields} />
                </SchemaContext.Provider>
            </Provider>
        </AppProvider>
    </I18nProvider>
);

describe('Render', () => {
    it('should render id field label', () => {
        render(<Component />);
        expect(screen.getByText('Schema.ReadOnly')).toBeInTheDocument();
    });

    it('should show checkbox isDisabled', () => {
        render(<Component />);
        expect(screen.queryByTestId('Checkbox-isDisabled')).toBeInTheDocument();
    });

    it('should show FieldView component', () => {
        render(
            <Component
                objectFields={{
                    ...dataDefault,
                    displayFields: [
                        {
                            id: 1,
                            fieldName: 'id',
                            isDisable: false,
                            isEnable: true,
                            isReadOnly: false,
                            objectTypeCode: 'Campaign',
                        },
                    ],
                }}
            />
        );
        expect(screen.getByText('FieldView')).toBeInTheDocument();
    });
});

describe(' Actions', () => {
    it('should stopPropagation', () => {
        const mockStopPropagation = jest.fn();
        render(<Component />);
        fireEvent.click(screen.getByTestId('Checkbox-onClick'), { stopPropagation: mockStopPropagation });

        waitFor(() => {
            expect(mockStopPropagation).toHaveBeenCalled();
        });
    });

    it('should call onChange with checked is true', () => {
        const mockStopPropagation = jest.fn();
        render(<Component />);
        fireEvent.click(screen.getByTestId('Checkbox-onChange'), { target: { checked: true }, stopPropagation: mockStopPropagation });

        waitFor(() => {
            expect(mockStopPropagation).toHaveBeenCalled();
            expect(mockCheckboxOnChange).toHaveBeenCalledWith({ checked: true }, true);
        });
    });
    it('should call onChange with checked is false', () => {
        const mockStopPropagation = jest.fn();
        render(<Component />);
        fireEvent.click(screen.getByTestId('Checkbox-onChange'), { target: { checked: false }, stopPropagation: mockStopPropagation });

        waitFor(() => {
            expect(mockStopPropagation).toHaveBeenCalled();
            expect(mockCheckboxOnChange).toHaveBeenCalledWith({ checked: false }, true);
        });
    });

    it('should call FieldView onCheckReadOnly', () => {
        render(<Component />);
        fireEvent.click(screen.getByTestId('FieldView-onCheckReadOnly'), {
            target: {
                checked: true,
                fieldInfo: {
                    id: 3,
                },
            },
        });

        waitFor(() => {
            expect(mockOnCheckReadOnly).toHaveBeenCalledWith({
                checked: true,
                fieldInfo: {
                    id: 3,
                },
            });
        });
    });

    describe('should call FieldView onCheckbox', () => {
        it('should call FieldView onCheckbox with isPrimaryKey is true', () => {
            render(<Component />);
            fireEvent.click(screen.getByTestId('FieldView-onCheckbox'), {
                target: {
                    checked: true,
                    fieldInfo: {
                        isPrimaryKey: true,
                    },
                },
            });

            waitFor(() => {
                expect(mockOnCheckbox).toHaveBeenCalledWith({
                    checked: true,
                    fieldInfo: {
                        isPrimaryKey: true,
                    },
                });
            });
        });

        it('should call FieldView onCheckbox with isPrimaryKey is false', () => {
            render(<Component />);
            fireEvent.click(screen.getByTestId('FieldView-onCheckbox'), {
                target: {
                    checked: true,
                    fieldInfo: {
                        id: 2,
                        fieldPath: '.name.',
                        fieldName: 'name',
                        childs: [
                            {
                                id: 3,
                                fieldName: 'last',
                                fieldPath: '.name.last.',
                            },
                        ],
                    },
                },
            });

            waitFor(() => {
                expect(mockOnCheckbox).toHaveBeenCalledWith({ checked: true, fieldInfo: {} });
            });
        });

        it('call onCheckbox', () => {
            render(<Component />);
            fireEvent.click(screen.getByTestId('FieldView-onCheckbox'), {
                target: {
                    checked: false,
                    fieldInfo: {
                        id: 2,
                        fieldPath: '.ac.',
                        fieldName: 'ac',
                    },
                },
            });

            waitFor(() => {
                expect(mockOnCheckbox).toHaveBeenCalledWith({
                    checked: false,
                    fieldInfo: {
                        id: 2,
                        fieldPath: '.ac.',
                        fieldName: 'ac',
                    },
                });
            });
        });
    });
});
