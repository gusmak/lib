import { render, screen, fireEvent } from '@testing-library/react';
import { SchemaContext } from '../../context';
import { Provider } from 'jotai';
import { I18nProvider, i18nLib } from 'translate';
import { useParams } from 'react-router';
import { AppProvider } from 'Utils';
import { convertToTreeData, convertToDisplayData } from '../../utils';
import SchemaViewOnly, { type OwnProps } from '../SchemaViewOnly';

const dataDefault: OwnProps = {
    rows: [
        {
            id: 1,
            name: 'name',
            objectTypeCode: 'Campaign',
            schemaObjectDefinitions: [
                {
                    id: 1,
                    isReadOnly: false,
                    objectDefinition: {},
                    objectDefinitionId: 1,
                    schemaId: 1,
                },
            ],
        },
    ],
};

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));

jest.mock('../FieldView', () => ({
    __esModule: true,
    default: (props: any) => (
        <div>
            <p>FieldView</p>
            <p data-testid="FieldView-isReadOnly">{props?.schemaDetails?.map((s: any) => s?.isReadOnly)}</p>
        </div>
    ),
}));

jest.mock('../../utils', () => ({
    convertToTreeData: jest.fn(() => []),
    convertToDisplayData: jest.fn(() => []),
}));

jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => (
        <div>
            <p>{props?.title}</p>
            <button data-testid="ClassicDrawer-onClose" onClick={props?.onClose}>
                onClose
            </button>
            {props?.children}
        </div>
    ),
}));

const Component = (props: OwnProps) => (
    <I18nProvider i18nData={i18nLib}>
        <AppProvider>
            <Provider>
                <SchemaContext.Provider value={{}}>
                    <SchemaViewOnly {...props} />
                </SchemaContext.Provider>
            </Provider>
        </AppProvider>
    </I18nProvider>
);

beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (convertToDisplayData as jest.Mock).mockReturnValue([
        {
            objectTypeCode: 'Campaign',
            fieldPath: 'fieldPath',
            fieldType: 'fieldType',
            description: 'description',
            isPrimaryKey: true,
        },
    ]);
    (convertToTreeData as jest.Mock).mockReturnValue([
        {
            id: 'id',
            name: 'name',
            objectTypeCode: 'Campaign',
            children: [],
        },
    ]);
});

describe('Render', () => {
    it('should show ClassicDrawer label', () => {
        render(<Component {...dataDefault} />);
        expect(screen.getByText('Schema.TitleViewSchema')).toBeInTheDocument();
    });

    it('should show isReadOnly FieldView', () => {
        render(<Component {...dataDefault} />);
        expect(screen.getByText('Schema.TitleViewSchema')).toBeInTheDocument();
    });

    it('should show objectTypeCode title', () => {
        render(
            <Component
                {...dataDefault}
                objectTypeDetail={[
                    {
                        id: 1,
                        objectTypeCode: 'Campaign',
                        description: 'description',
                        isPrimaryKey: true,
                    },
                ]}
            />
        );
        expect(screen.getByText('Schema.TitleViewSchema')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call onDrawerLevelChange ', () => {
        const mockOnDrawerLevelChange = jest.fn();

        render(<Component {...dataDefault} drawerLevel={2} onDrawerLevelChange={mockOnDrawerLevelChange} />);

        fireEvent.click(screen.getByTestId('ClassicDrawer-onClose'));
        expect(mockOnDrawerLevelChange).toHaveBeenCalled();
    });
});
