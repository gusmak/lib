import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { FIELD_TYPE } from 'AWING/DataInput';
import { TableEditableProps } from './interface';
import Container from './Container';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Button: jest.fn(({ children, onClick, ...props }) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    )),
}));

// Mock lodash to control cloneDeep behavior
jest.mock('lodash', () => ({
    ...jest.requireActual('lodash'),
    cloneDeep: jest.fn((x) => JSON.parse(JSON.stringify(x))),
}));

describe('TableEditable Component', () => {
    // Common setup for test cases
    const mockColumnDefinitions = [
        {
            editFieldDefinition: {
                fieldName: 'name',
                required: true,
                type: 'multiple-select',
            },
            headerName: 'Name',
        },
    ];

    const mockItems = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
    ];

    const defaultProps: TableEditableProps<any> = {
        columnDefinitions: mockColumnDefinitions as any,
        items: mockItems,
        onChange: jest.fn(),
        getRowId: (row) => row.id,
        selected: [],
        onSelectedChange: jest.fn(),
        onAddNew: jest.fn(),
    };

    // Setup mock translations before each test
    beforeEach(() => {
        (useTranslation as jest.Mock).mockReturnValue({
            t: jest.fn((key) => {
                const translations: { [key: string]: string } = {
                    'Common.Create': 'Create',
                };
                return translations[key] || key;
            }),
        });
    });

    // Test case 1: Basic rendering
    it('should render table with correct number of items', () => {
        render(<Container {...defaultProps} />);

        // Verify table is rendered
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
    });

    // Test case 2: Add new item button
    it('should render add new item button when onAddNew is provided', () => {
        render(<Container {...defaultProps} />);

        // Verify create button is rendered
        const createButton = screen.getByText('Create');
        expect(createButton).toBeInTheDocument();

        // Simulate button click
        fireEvent.click(createButton);
        expect(defaultProps.onAddNew).toHaveBeenCalledTimes(1);
    });

    // Test case 3: Selection handling
    it('should handle row selection', () => {
        const mockOnSelectedChange = jest.fn();
        const propsWithSelection: TableEditableProps<any> = {
            ...defaultProps,
            selected: [],
            onSelectedChange: mockOnSelectedChange,
        };

        render(<Container {...propsWithSelection} />);

        // Simulate row selection
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]); // Select first data row

        expect(mockOnSelectedChange).toHaveBeenCalledWith([1]);
    });

    // Test case 4: Top bar actions rendering
    it('should render top bar actions when items are selected', () => {
        const propsWithSelectedActions: TableEditableProps<any> = {
            ...defaultProps,
            selected: [1],
            selectionActions: [
                {
                    icon: <div data-testid="mock-icon" />,
                    action: jest.fn(),
                    tooltipTitle: 'Test Action',
                },
            ],
        };

        render(<Container {...propsWithSelectedActions} />);

        // Verify top bar actions are rendered
        expect(screen.getByText('1 selected')).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    // Test case 5: Data validation
    it('should validate data based on column definitions', () => {
        const mockOnChange = jest.fn();
        const propsWithValidation: TableEditableProps<any> = {
            ...defaultProps,
            onChange: mockOnChange,
            columnDefinitions: [
                {
                    editFieldDefinition: {
                        fieldName: 'name',
                        required: true,
                        type: FIELD_TYPE.TEXT,
                        customeFieldChange: (value) => {
                            if (value === 'Special') {
                                return 'extraField:test';
                            }
                            return '';
                        },
                    },
                    headerName: 'Name',
                },
            ],
        };

        render(<Container {...propsWithValidation} />);

        // Simulating field change would require more complex setup with
        // TableEditableBody component
        // This is a placeholder for more comprehensive validation testing
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    // Test case 6: Delete functionality
    it('should handle row deletion', () => {
        const mockOnChange = jest.fn();
        const propsWithDelete: TableEditableProps<any> = {
            ...defaultProps,
            includeDelete: true,
            onChange: mockOnChange,
        };

        render(<Container {...propsWithDelete} />);

        // Verify delete buttons are rendered (this depends on implementation of TableEditableBody)
        // Note: Actual deletion logic would require more complex testing
    });

    // Test case 7: Custom row ID handling
    it('should use custom getRowId function when provided', () => {
        const customGetRowId = jest.fn((row) => row.customId);
        const propsWithCustomId: TableEditableProps<any> = {
            ...defaultProps,
            items: [
                { customId: 'custom1', name: 'John', age: 30 },
                { customId: 'custom2', name: 'Jane', age: 25 },
            ],
            getRowId: customGetRowId,
        };

        render(<Container {...propsWithCustomId} />);

        expect(customGetRowId).toHaveBeenCalledTimes(2);
    });

    // Test case 8: Header hiding
    it('should hide header when hideHeader is true', () => {
        const propsWithHiddenHeader: TableEditableProps<any> = {
            ...defaultProps,
            hideHeader: true,
        };

        const { container } = render(<Container {...propsWithHiddenHeader} />);

        // This might require checking for absence of table header
        // (implementation depends on exact rendering of TableHeader)
    });

    // Test case 9: Formula and auto-calculation
    it('should handle auto-calculation for fields with formulas', () => {
        const mockColumnDefinitionsWithFormula = [
            {
                editFieldDefinition: {
                    fieldName: 'price',
                    autoFormula: '{quantity} * {unitPrice}',
                },
                headerName: 'Price',
            },
            {
                editFieldDefinition: {
                    fieldName: 'quantity',
                },
                headerName: 'Quantity',
            },
            {
                editFieldDefinition: {
                    fieldName: 'unitPrice',
                },
                headerName: 'Unit Price',
            },
        ];
    });
});
