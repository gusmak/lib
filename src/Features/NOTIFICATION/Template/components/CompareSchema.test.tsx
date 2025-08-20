import { render, screen } from '@testing-library/react';
import CompareSchema from './CompareSchema';
import type { ObjectDefinition } from '../types';

jest.mock('@mui/material', () => ({
    Grid: ({ children }: { children: React.ReactNode }) => <div data-testid="grid">{children}</div>,
    Typography: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Paper: ({ children }: { children: React.ReactNode }) => <div data-testid="paper">{children}</div>,
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('./Fields', () => ({
    __esModule: true,
    default: ({ treeDatas, label }: { treeDatas: any[]; label: string }) => (
        <div data-testid="fields">
            <span>Label: {label}</span>
            <span>Items: {treeDatas.length}</span>
        </div>
    ),
}));

jest.mock('Features/SYSTEM/Schema/utils', () => ({
    convertToTreeData: (data: any[]) =>
        data.map((item) => ({
            ...item,
            isEnable: true,
            converted: true,
            isReadOnly: false,
        })),
}));

describe('CompareSchema Component', () => {
    const mockFields: ObjectDefinition[] = [
        {
            fieldName: 'test',
            objectTypeCode: 'MEDIA_PLAN',
            fieldPath: '',
            fieldType: '',
            id: 0,
            schemaDetails: [],
        },
    ];

    it('renders component with fields', () => {
        render(<CompareSchema fields={mockFields} />);

        expect(screen.getByText('NotificationTemplate.Schema')).toBeInTheDocument();
        expect(screen.getByTestId('fields')).toBeInTheDocument();
    });

    it('renders component with invalid object type code', () => {
        const mockFieldsWithInvalidObjectTypeCode: ObjectDefinition[] = [
            {
                fieldName: 'test',
                objectTypeCode: 'INVALID_OBJECT_TYPE_CODE',
                fieldPath: '',
                fieldType: '',
                id: 0,
                schemaDetails: [],
            },
        ];
        render(<CompareSchema fields={mockFieldsWithInvalidObjectTypeCode} />);

        expect(screen.getByText('NotificationTemplate.Schema')).toBeInTheDocument();
        expect(screen.getByTestId('fields')).toBeInTheDocument();
    });
    it('renders component with fields', () => {
        render(<CompareSchema fields={mockFields} />);

        expect(screen.getByText('NotificationTemplate.Schema')).toBeInTheDocument();
        expect(screen.getByTestId('fields')).toBeInTheDocument();
    });

    it('capitalizes field names', () => {
        render(<CompareSchema fields={mockFields} />);

        const convertedData = screen.getByTestId('fields');
        expect(convertedData.textContent).toContain('Label: MEDIA_PLANItems: 1');
    });

    it('handles empty fields array', () => {
        render(<CompareSchema fields={[]} />);

        expect(screen.getByTestId('fields')).toBeInTheDocument();
        expect(screen.getByText('Label:')).toBeInTheDocument();
    });

    it('applies correct label value', () => {
        render(<CompareSchema fields={mockFields} />);

        expect(screen.getByText(/Label: MEDIA_PLAN/)).toBeInTheDocument();
    });
});
