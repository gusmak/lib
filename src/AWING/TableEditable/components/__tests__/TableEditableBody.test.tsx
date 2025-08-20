import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableEditableBody from '../TableEditableBody';
import { TableEditableBodyProps } from '../../interface';
import { FIELD_TYPE } from 'AWING/DataInput';

// Mock MUI components
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    TableBody: (props: any) => <tbody {...props} />,
    TableRow: (props: any) => <tr {...props} />,
    TableCell: (props: any) => <td {...props} />,
    Checkbox: (props: any) => <input type="checkbox" {...props} />,
    IconButton: (props: any) => <button {...props} />,
}));

jest.mock('@mui/icons-material', () => ({
    Delete: () => 'DeleteIcon',
}));

jest.mock('../TableCellEditable', () => ({ onChange, value }: any) => (
    <input data-testid="mock-logic-expression" value={value} onChange={(e) => onChange(e.target.value, true)} />
));

describe('TableEditableBody', () => {
    const mockData = [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        { id: 3, name: 'Item 3', value: 300 },
    ];

    const defaultProps: TableEditableBodyProps<(typeof mockData)[0]> = {
        items: mockData,
        getId: (row) => row.id,
        columnDefinitions: [
            {
                contentGetter: (row) => row.name,
                fieldName: 'name',
                headerName: 'Name',
                editFieldDefinition: {
                    fieldName: 'name',
                    title: 'Name',
                    type: FIELD_TYPE.SELECT_FOLDER,
                    onChange: () => {},
                },
                isTooltip: true,
                getTitleTooltip: (value) => <div>{value}</div>,
            },
        ],
        onChange: jest.fn(),
        onDelete: jest.fn(),
        onSelect: jest.fn(),
        dataValidation: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders table body with correct number of rows', () => {
        render(<TableEditableBody {...defaultProps} />);
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(mockData.length);
    });

    test('isTooltip props is false', () => {
        render(
            <TableEditableBody
                {...defaultProps}
                columnDefinitions={[{ contentGetter: (row) => row.name, headerName: 'Name', isTooltip: false }]}
            />
        );
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(mockData.length);
    });

    test('renders checkbox column when selected prop is provided', () => {
        const selected = [1];
        const onSelectedChange = jest.fn();
        const onSelect = jest.fn();

        render(
            <TableEditableBody
                {...defaultProps}
                selected={selected}
                onSelectedChange={onSelectedChange}
                onSelect={onSelect}
            />
        );

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(mockData.length);

        // Test checkbox interaction
        fireEvent.click(checkboxes[0]);
        expect(onSelect).toHaveBeenCalledWith(1);
    });

    test('renders delete button when includeDelete is true', () => {
        render(<TableEditableBody {...defaultProps} includeDelete={true} />);
        const deleteButtons = screen.getAllByRole('button');
        expect(deleteButtons).toHaveLength(mockData.length);

        // Test delete interaction
        fireEvent.click(deleteButtons[0]);
        expect(defaultProps.onDelete).toHaveBeenCalledWith(0);
    });

    test('have mergeRowsBy props', () => {
        render(<TableEditableBody {...defaultProps} includeDelete={true} mergeRowsBy="name" />);
        const deleteButtons = screen.getAllByRole('button');
        expect(deleteButtons).toHaveLength(mockData.length);

        // Test delete interaction
        fireEvent.click(deleteButtons[0]);
        expect(defaultProps.onDelete).toHaveBeenCalledWith(0);
    });

    test.skip('handles cell value changes', () => {
        render(<TableEditableBody {...defaultProps} />);
        const editableCells = screen.getAllByRole('textbox');

        fireEvent.change(editableCells[0], { target: { value: '400' } });
        expect(defaultProps.onChange).toHaveBeenCalledWith([0], 'value', 400, true);
    });

    test('renders spanning rows correctly', () => {
        const spanningRow = (
            <tr>
                <td colSpan={3}>Spanning Row</td>
            </tr>
        );
        render(<TableEditableBody {...defaultProps} spanningRows={[spanningRow]} />);

        expect(screen.getByText('Spanning Row')).toBeInTheDocument();
    });

    test('handles empty data set', () => {
        render(<TableEditableBody {...defaultProps} items={[]} />);

        const tbody = screen.getByRole('rowgroup');
        expect(tbody.children.length).toBe(0);
    });
    test.skip('renders editable cell with correct props', () => {
        const onChange = jest.fn();
        const dataValidation = [{ name: true }];
        const columnDefinitions = [
            {
                fieldName: 'name',
                headerName: 'Name',
                editFieldDefinition: {
                    fieldName: 'name',
                    title: 'Name',
                    type: 'text',
                },
                isTooltip: true,
                getTitleTooltip: (value: any) => <div>{value}</div>,
            },
        ];

        render(
            <TableEditableBody
                {...defaultProps}
                columnDefinitions={columnDefinitions as any}
                onChange={onChange}
                dataValidation={dataValidation}
            />
        );

        const editableCells = screen.getAllByRole('textbox');
        expect(editableCells).toHaveLength(1);

        fireEvent.change(editableCells[0], { target: { value: 'New Name' } });
        expect(onChange).toHaveBeenCalledWith([0], 'name', 'New Name', true);
    });

    test('renders merged cells correctly', () => {
        const mockData = [
            { id: 1, name: 'Item 1', value: 100 },
            { id: 2, name: 'Item 1', value: 200 },
            { id: 3, name: 'Item 2', value: 300 },
        ];

        const defaultPropsNew: TableEditableBodyProps<(typeof mockData)[0]> = {
            items: mockData,
            getId: (row) => row.id,
            columnDefinitions: [
                {
                    fieldName: 'name',
                    headerName: 'Name',
                    contentGetter: (row) => row.name,
                    isTooltip: true,
                },
            ],
            onChange: jest.fn(),
            onDelete: jest.fn(),
            onSelect: jest.fn(),
            dataValidation: [{ name: true }],
        };

        render(<TableEditableBody {...defaultPropsNew} items={mockData} mergeRowsBy="name" />);

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(mockData.length);

        const mergedCells = screen.getAllByRole('cell', { name: 'Item 1' });
        expect(mergedCells).toHaveLength(1);
        expect(mergedCells[0]).toHaveAttribute('rowspan', '2');
    });

    test('renders merged cells correctly', () => {
        const mockData = [
            { id: 1, name: 'Item 1', value: 100 },
            { id: 2, name: 'Item 1', value: 200 },
            { id: 3, name: 'Item 2', value: 300 },
        ];

        const mockOnChange = jest.fn();
        const defaultPropsNew: TableEditableBodyProps<(typeof mockData)[0]> = {
            items: mockData,
            getId: (row) => row.id,
            columnDefinitions: [
                {
                    fieldName: 'name',
                    headerName: 'Name',
                    editFieldDefinition: {
                        fieldName: 'name',
                        title: 'Name',
                        type: FIELD_TYPE.SELECT_FOLDER,
                        onChange: () => {},
                    },
                    isTooltip: true,
                },
            ],
            onChange: mockOnChange,
            onDelete: jest.fn(),
            onSelect: jest.fn(),
            dataValidation: [{ name: true }],
        };

        render(<TableEditableBody {...defaultPropsNew} items={mockData} mergeRowsBy="name" />);

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(mockData.length);
    });

    test.skip('handles cell value changes with merged rows', () => {
        const onChange = jest.fn();
        const mockData = [
            { id: 1, name: 'Item 1', value: 100 },
            { id: 2, name: 'Item 1', value: 200 },
            { id: 3, name: 'Item 2', value: 300 },
        ];

        render(<TableEditableBody {...defaultProps} items={mockData} mergeRowsBy="name" onChange={onChange} />);

        const editableCells = screen.getAllByRole('textbox');
        expect(editableCells).toHaveLength(2);

        fireEvent.change(editableCells[0], { target: { value: 'New Value' } });
        expect(onChange).toHaveBeenCalledWith([0, 1], 'name', 'New Value', true);
    });

    test.skip('calls onChange with correct indexes for merged columns', () => {
        const onChange = jest.fn();
        const mockData = [
            { id: 1, name: 'Item 1', value: 100 },
            { id: 2, name: 'Item 1', value: 200 },
            { id: 3, name: 'Item 2', value: 300 },
        ];

        const columnDefinitions = [
            {
                fieldName: 'name',
                headerName: 'Name',
                editFieldDefinition: {
                    fieldName: 'name',
                    title: 'Name',
                    type: 'text',
                },
                isTooltip: true,
                getTitleTooltip: (value: any) => <div>{value}</div>,
            },
        ];

        render(
            <TableEditableBody
                {...defaultProps}
                items={mockData}
                columnDefinitions={columnDefinitions as any}
                mergeRowsBy="name"
                onChange={onChange}
            />
        );

        const editableCells = screen.getAllByRole('textbox');
        expect(editableCells).toHaveLength(2);

        fireEvent.change(editableCells[0], { target: { value: 'New Name' } });
        expect(onChange).toHaveBeenCalledWith([0, 1], 'name', 'New Name', true);
    });

    test.skip('calls onChange with correct indexes for non-merged columns', () => {
        const onChange = jest.fn();
        const mockData = [
            { id: 1, name: 'Item 1', value: 100 },
            { id: 2, name: 'Item 2', value: 200 },
            { id: 3, name: 'Item 3', value: 300 },
        ];

        const columnDefinitions = [
            {
                fieldName: 'name',
                headerName: 'Name',
                editFieldDefinition: {
                    fieldName: 'name',
                    title: 'Name',
                    type: 'text',
                },
                isTooltip: true,
                getTitleTooltip: (value: any) => <div>{value}</div>,
            },
        ];

        render(
            <TableEditableBody
                {...defaultProps}
                items={mockData}
                columnDefinitions={columnDefinitions as any}
                onChange={onChange}
            />
        );

        const editableCells = screen.getAllByRole('textbox');
        expect(editableCells).toHaveLength(3);

        fireEvent.change(editableCells[0], { target: { value: 'New Name' } });
        expect(onChange).toHaveBeenCalledWith([0], 'name', 'New Name', true);
    });
});
