import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SimpleTreeView } from '@mui/x-tree-view';
import { SchemaContext } from '../../context';
import { BrowserRouter as Router } from 'react-router';
import { I18nProvider, i18nLib } from 'translate';
import { AppProvider } from 'Utils';
import FieldView, { type OwnProps } from '../FieldView';

const dataDefault: OwnProps = {
    fieldInfo: {
        id: 1,
        fieldName: 'id',
        isDisable: false,
        isEnable: true,
        isReadOnly: false,
        objectTypeCode: 'test',
        childs: [
            {
                id: 2,
                fieldName: 'name',
                isDisable: true,
                isEnable: false,
                isReadOnly: false,
                objectTypeCode: 'test',
                childs: [],
            },
        ],
    },
    schemaDetails: [
        {
            id: 1,
            isReadOnly: false,
            objectDefinition: {},
            objectDefinitionId: 1,
        },
    ],
};

const mockCheckBoxOnChange = jest.fn();
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    CheckBox: (props: any) => {
        const { onChange = mockCheckBoxOnChange } = props;
        return (
            <div>
                {props.checked}
                <button data-testid={props['data-testid']} onClick={(e: any) => onChange(e, e.target.checked)}>
                    CheckBox onChange
                </button>
            </div>
        );
    },
}));

const Component = (props: OwnProps) => (
    <I18nProvider i18nData={i18nLib}>
        <AppProvider>
            <SchemaContext.Provider value={{}}>
                <Router>
                    <SimpleTreeView aria-label="controlled" expandedItems={['root']} style={{ paddingBottom: '16px' }}>
                        <FieldView {...props} />
                    </SimpleTreeView>
                </Router>
            </SchemaContext.Provider>
        </AppProvider>
    </I18nProvider>
);

describe('Render', () => {
    it('should render id field label', () => {
        render(<Component {...dataDefault} />);
        expect(screen.getByText('id')).toBeInTheDocument();
    });

    it('should show ReadOnly ', () => {
        render(
            <Component
                schemaDetails={[]}
                fieldInfo={{
                    id: 2,
                    fieldName: 'name',
                    isEnable: true,
                    isReadOnly: true,
                    objectTypeCode: 'Campaign',
                    childs: [],
                }}
                isDefaultSchema={true}
            />
        );
        expect(screen.getByText('Schema.ReadOnly')).toBeInTheDocument();
    });

    it('should show Checkbox ', () => {
        render(
            <Component
                schemaDetails={[]}
                fieldInfo={{
                    id: 2,
                    fieldName: 'name',
                    isEnable: true,
                    isReadOnly: true,
                    objectTypeCode: 'Campaign',
                    childs: [],
                }}
                onCheckReadOnly={() => {}}
            />
        );
        expect(screen.queryByTestId('readOnlyCheckbox')).toBeInTheDocument();
    });

    it('should show isDisable  ', () => {
        render(
            <Component
                schemaDetails={[]}
                fieldInfo={{
                    id: 2,
                    fieldName: 'name',
                    isDisable: true,
                    isReadOnly: true,
                    objectTypeCode: 'Campaign',
                    childs: [],
                }}
                onCheckReadOnly={() => {}}
            />
        );
        expect(screen.queryByTestId('readOnlyCheckbox')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call onCheckReadOnly ', () => {
        const onCheckReadOnly = jest.fn();
        render(
            <Component
                schemaDetails={[]}
                fieldInfo={{
                    id: 2,
                    fieldName: 'name',
                    isEnable: true,
                    isReadOnly: true,
                    objectTypeCode: 'Campaign',
                    childs: [],
                }}
                onCheckReadOnly={onCheckReadOnly}
            />
        );
        fireEvent.change(screen.getByTestId('readOnlyCheckbox'));

        waitFor(() => {
            expect(onCheckReadOnly).toHaveBeenCalled();
        });
    });

    it('should call readOnlyCheckbox', () => {
        render(
            <Component
                schemaDetails={[]}
                fieldInfo={{
                    id: 2,
                    fieldName: 'name',
                    isEnable: true,
                    isReadOnly: true,
                    objectTypeCode: 'Campaign',
                    childs: [],
                }}
                onCheckReadOnly={mockCheckBoxOnChange}
            />
        );
        fireEvent.click(screen.getByTestId('readOnlyCheckbox'), { target: { checked: true } });

        waitFor(() => {
            expect(mockCheckBoxOnChange).toHaveBeenCalled();
        });
    });

    it('should call onCheckbox', () => {
        render(
            <Component
                schemaDetails={[
                    {
                        objectDefinitionId: 2,
                        objectDefinition: {
                            fieldName: 'id',
                            fieldPath: '.id.',
                            id: 2,
                            isPrimaryKey: true,
                            objectTypeCode: 'Campaign',
                        },
                        isReadOnly: false,
                    },
                    {
                        objectDefinitionId: 3,
                        objectDefinition: {
                            fieldName: 'name',
                            fieldPath: '.name.',
                            id: 3,
                            objectTypeCode: 'Campaign',
                        },
                        isReadOnly: true,
                    },
                ]}
                fieldInfo={{
                    id: 2,
                    fieldName: 'name',
                    fieldPath: '.name.',
                    isEnable: true,
                    isReadOnly: true,
                    objectTypeCode: 'Campaign',
                    childs: [],
                }}
                onCheckbox={mockCheckBoxOnChange}
            />
        );
        fireEvent.click(screen.getByTestId('SelectedActionCheckbox'), { target: { checked: true } });

        waitFor(() => {
            expect(mockCheckBoxOnChange).toHaveBeenCalled();
        });
    });
});
