import { render, screen } from '@testing-library/react';
import TemplateFieldView from './TemplateFieldView';
import { type ConvertObjectDefinition } from 'Features/SYSTEM/Schema';

jest.mock('@mui/material', () => ({
    Grid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Typography: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('@mui/x-tree-view', () => ({
    TreeItem: ({ label, children }: { label: React.ReactNode; children?: React.ReactNode }) => (
        <div data-testid="tree-item">
            {label}
            {children}
        </div>
    ),
}));

describe('TemplateFieldView', () => {
    const mockField: ConvertObjectDefinition = {
        fieldPath: 'test.path',
        fieldName: 'Test Field',
        isDisable: false,
        childs: [],
        fieldType: '',
        id: 0,
        objectTypeCode: '',
        // schemaDetails: [],
    };

    const mockFieldWithChildren: ConvertObjectDefinition = {
        ...mockField,
        childs: [
            {
                fieldPath: 'test.path.child1',
                fieldName: 'Child Field 1',
                isDisable: false,
                childs: [],
                fieldType: '',
                id: 0,
                objectTypeCode: '',
                // schemaDetails: [],
            },
            {
                fieldPath: 'test.path.child2',
                fieldName: 'Child Field 2',
                isDisable: true,
                childs: [],
                fieldType: '',
                id: 0,
                objectTypeCode: '',
                // schemaDetails: [],
            },
        ],
    };

    it('renders single field correctly', () => {
        render(<TemplateFieldView fieldInfo={mockField} />);

        expect(screen.getByText('Test Field')).toBeInTheDocument();
        expect(screen.getByTestId('tree-item')).toBeInTheDocument();
    });

    it('renders disabled field with reduced opacity', () => {
        const disabledField = { ...mockField, isDisable: true };
        render(<TemplateFieldView fieldInfo={disabledField} />);

        const label = screen.getByText('Test Field').parentElement;
        expect(label).toHaveStyle({ opacity: '0.5' });
    });

    it('renders field with children correctly', () => {
        render(<TemplateFieldView fieldInfo={mockFieldWithChildren} />);

        expect(screen.getByText('Test Field')).toBeInTheDocument();
        expect(screen.getByText('Child Field 1')).toBeInTheDocument();
        expect(screen.getByText('Child Field 2')).toBeInTheDocument();
    });

    it('renders deeply nested fields correctly', () => {
        const deeplyNested: ConvertObjectDefinition = {
            ...mockField,
            childs: [
                {
                    fieldPath: 'test.path.deep',
                    fieldName: 'Deep Field',
                    isDisable: false,
                    childs: [
                        {
                            fieldPath: 'test.path.deep.deeper',
                            fieldName: 'Deeper Field',
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
            ],
        };

        render(<TemplateFieldView fieldInfo={deeplyNested} />);

        expect(screen.getByText('Test Field')).toBeInTheDocument();
        expect(screen.getByText('Deep Field')).toBeInTheDocument();
        expect(screen.getByText('Deeper Field')).toBeInTheDocument();
    });
});
