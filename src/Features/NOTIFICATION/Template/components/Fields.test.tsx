import { render, screen, fireEvent } from '@testing-library/react';
import Fields from './Fields';
import { type ConvertObjectDefinition } from 'Features/SYSTEM/Schema';

jest.mock('@mui/material', () => ({
    Grid: ({ children }: { children: React.ReactNode }) => <div data-testid="grid">{children}</div>,
    Typography: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Box: ({ children }: { children: React.ReactNode }) => <div data-testid="box">{children}</div>,
}));

jest.mock('@mui/x-tree-view', () => ({
    SimpleTreeView: ({ children, onExpandedItemsChange }: { children: React.ReactNode; onExpandedItemsChange: Function }) => (
        <div data-testid="tree-view" onClick={() => onExpandedItemsChange(null, ['test-id'])}>
            {children}
        </div>
    ),
    TreeItem: ({ label, children }: { label: React.ReactNode; children?: React.ReactNode }) => (
        <div data-testid="tree-item">
            <div data-testid="tree-label">{label}</div>
            <div data-testid="tree-children">{children}</div>
        </div>
    ),
}));

jest.mock('./TemplateFieldView', () => ({
    __esModule: true,
    default: ({ fieldInfo }: { fieldInfo: any }) => <div data-testid="field-view">{fieldInfo.fieldName}</div>,
}));

describe('Fields Component', () => {
    const mockTreeData: ConvertObjectDefinition[] = [
        {
            fieldPath: 'test.path1',
            fieldName: 'Test Field 1',
            isDisable: false,
            childs: [],
            fieldType: '',
            id: 0,
            objectTypeCode: '',
            // schemaDetails: [],
        },
        {
            fieldPath: 'test.path2',
            fieldName: 'Test Field 2',
            isDisable: false,
            childs: [],
            fieldType: '',
            id: 0,
            objectTypeCode: '',
            // schemaDetails: [],
        },
    ];

    it('renders with label and tree data', () => {
        render(<Fields treeDatas={mockTreeData} label="Test Label" />);

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getAllByTestId('field-view')).toHaveLength(2);
    });

    it('handles tree expansion', () => {
        const { container } = render(<Fields treeDatas={mockTreeData} label="Test Label" />);

        const treeView = screen.getByTestId('tree-view');
        fireEvent.click(treeView);

        expect(container).toMatchSnapshot();
    });

    it('renders empty tree', () => {
        render(<Fields treeDatas={[]} label="Empty Tree" />);

        expect(screen.getByText('Empty Tree')).toBeInTheDocument();
        expect(screen.queryByTestId('field-view')).not.toBeInTheDocument();
    });

    it('renders complex tree structure', () => {
        const complexData: ConvertObjectDefinition[] = [
            {
                fieldPath: 'test.path1',
                fieldName: 'Parent',
                isDisable: false,
                childs: [
                    {
                        fieldPath: 'test.path1.child',
                        fieldName: 'Child',
                        isDisable: false,
                        childs: [],
                        fieldType: '',
                        id: 0,
                        objectTypeCode: '',
                        // schemaDetails: [],
                    },
                ],
                fieldType: '',
                id: 0,
                objectTypeCode: '',
                // schemaDetails: [],
            },
        ];

        render(<Fields treeDatas={complexData} label="Complex Tree" />);

        expect(screen.getByText('Complex Tree')).toBeInTheDocument();
        expect(screen.getAllByTestId('field-view')).toHaveLength(1);
    });
});
