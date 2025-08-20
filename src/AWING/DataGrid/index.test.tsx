import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import DataGrid from './index';
import { RowActionDefinition } from './interface';

// Mock translations
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock i18next
jest.mock('../../translate/i18n', () => ({
    changeLanguage: jest.fn(),
}));

describe('DataGrid Component', () => {
    const mockColumns: any[] = [
        { field: 'id', headerName: 'ID', sortable: true, width: 100 },
        { field: 'name', headerName: 'Name', sortable: true },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            sortable: false,
            valueGetter: (row: any) => row.age,
            dynamicTableCellProps: () => {
                return {
                    style: { wordBreak: 'break-all' },
                };
            },
        },
        {
            field: 'phone',
            headerName: 'Phone',
            type: 'number',
            sortable: false,
        },
    ];

    const mockRows = [
        { id: 1, name: 'John Doe', age: 30 },
        { id: 2, name: 'Jane Smith', age: 25 },
        { id: 3, name: 'Bob Johnson', age: 35 },
    ];

    const mockRowActions: RowActionDefinition<any>[] = [
        {
            icon: <EditIcon />,
            tooltipTitle: 'Edit',
            action: jest.fn(),
            isShouldHideActions: jest.fn(),
        },
        {
            icon: <DeleteIcon />,
            tooltipTitle: 'Delete',
            action: jest.fn(),
        },
        {
            icon: jest.fn(),
            tooltipTitle: 'Error',
            action: jest.fn(),
        },
    ];

    it('renders table with correct columns and rows', () => {
        render(<DataGrid columns={mockColumns} rows={mockRows} />);

        // Check column headers
        mockColumns.forEach((column) => {
            expect(screen.getByText(column.headerName)).toBeInTheDocument();
        });

        // Check row data
        mockRows.forEach((row) => {
            expect(screen.getByText(row.name)).toBeInTheDocument();
            expect(screen.getByText(row.age.toString())).toBeInTheDocument();
        });
    });

    it('handles row selection correctly', () => {
        const mockOnSelectedChange = jest.fn();

        render(<DataGrid columns={mockColumns} rows={mockRows} selected={[1]} onSelectedChange={mockOnSelectedChange} />);

        // Select first row
        const firstRowCheckbox = screen.getAllByRole('checkbox')[1];
        fireEvent.click(firstRowCheckbox);

        // expect(mockOnSelectedChange).toHaveBeenCalledWith([1])
    });

    it('handles sorting correctly', () => {
        const mockOnSortModelChange = jest.fn();

        render(
            <DataGrid
                columns={mockColumns}
                rows={mockRows}
                sortModel={[{ field: 'name', sort: 'asc' }]}
                onSortModelChange={mockOnSortModelChange}
            />
        );

        // Click name column header to sort
        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader);

        expect(mockOnSortModelChange).toHaveBeenCalledWith([{ field: 'name', sort: 'desc' }]);
    });

    it('handles multi-sort correctly', () => {
        const mockOnSortModelChange = jest.fn();

        render(<DataGrid columns={mockColumns} rows={mockRows} sortModel={[]} onSortModelChange={mockOnSortModelChange} />);

        // Control + click for multi-sort
        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader, { ctrlKey: true });

        expect(mockOnSortModelChange).toHaveBeenCalledWith([{ field: 'name', sort: 'asc' }]);
    });

    it('sortModel have sort asc by name', () => {
        const mockOnSortModelChange = jest.fn();

        render(
            <DataGrid
                columns={mockColumns}
                rows={mockRows}
                sortModel={[{ field: 'name', sort: 'asc' }]}
                onSortModelChange={mockOnSortModelChange}
            />
        );

        // // Click name column header to sort
        // const nameHeader = screen.getByText('Name')
        // fireEvent.click(nameHeader)

        // expect(mockOnSortModelChange).toHaveBeenCalledWith([
        //     { field: 'name', sort: 'asc' },
        // ])

        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader, { ctrlKey: true });

        const icon = screen.getByRole('columnheader', { name: 'ID' }).querySelector('svg[data-testid="ArrowDownwardIcon"]');

        fireEvent.click(icon as Element);
    });

    it('sortModel have sort desc by name', () => {
        const mockOnSortModelChange = jest.fn();

        render(
            <DataGrid
                columns={mockColumns}
                rows={mockRows}
                sortModel={[{ field: 'name', sort: 'desc' }]}
                onSortModelChange={mockOnSortModelChange}
            />
        );

        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader, { ctrlKey: true });

        const icon = screen.getByRole('columnheader', { name: 'ID' }).querySelector('svg[data-testid="ArrowDownwardIcon"]');

        fireEvent.click(icon as Element);
        // expect(screen.getByTestId('ArrowDownwardIcon')).toBeInTheDocument()
    });
    it('sortModel test', () => {
        const mockOnSortModelChange = jest.fn();

        const mockColumnsTest: any[] = [
            { field: 'id', headerName: 'ID', sortable: true, width: 100 },
            { field: 'name', headerName: 'Name', sortable: true },
            {
                field: 'age',
                headerName: 'Age',
                type: 'number',
                sortable: false,
                valueGetter: (row: any) => row.age,
                dynamicTableCellProps: () => {
                    return {
                        style: { wordBreak: 'break-all' },
                    };
                },
            },
            {
                field: 'phone',
                headerName: 'Phone',
                sortable: true,
            },
        ];

        render(
            <DataGrid
                columns={mockColumnsTest}
                rows={mockRows}
                sortModel={[
                    { field: 'id', sort: 'asc' },
                    { field: 'name', sort: 'asc' },
                    { field: 'address', sort: 'asc' },
                ]}
                onSortModelChange={mockOnSortModelChange}
            />
        );

        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader, { ctrlKey: true });

        const icon = screen.getByRole('columnheader', { name: /Name/i }).querySelector('svg[data-testid="ArrowDownwardIcon"]');

        fireEvent.click(icon as Element);
        // expect(screen.getByTestId('ArrowDownwardIcon')).toBeInTheDocument()
    });

    it('sortModel with not event', () => {
        const mockOnSortModelChange = jest.fn();

        render(
            <DataGrid
                columns={mockColumns}
                rows={mockRows}
                sortModel={[{ field: 'id', sort: 'desc' }]}
                onSortModelChange={mockOnSortModelChange}
            />
        );

        const icon = screen.getByRole('columnheader', { name: 'ID' }).querySelector('svg[data-testid="ArrowDownwardIcon"]');

        fireEvent.click(icon as Element);
    });

    it('handles sorting error', () => {
        const mockOnSortModelChange = jest.fn();

        render(
            <DataGrid
                columns={mockColumns}
                rows={mockRows}
                sortModel={undefined}
                onSortModelChange={mockOnSortModelChange}
                rowActions={undefined}
            />
        );

        // Click name column header to sort
        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader);

        expect(mockOnSortModelChange).toHaveBeenCalledWith([{ field: 'name', sort: 'asc' }]);
    });

    it('handles row actions correctly', async () => {
        render(<DataGrid columns={mockColumns} rows={mockRows} rowActions={mockRowActions} onSortModelChange={jest.fn()} />);

        const icon = screen.getByRole('columnheader', { name: 'ID' }).querySelector('svg[data-testid="ArrowDownwardIcon"]');

        fireEvent.click(icon as Element);
    });

    it('handles pagination correctly', () => {
        const mockOnPageIndexChange = jest.fn();
        const mockOnPageSizeChange = jest.fn();

        render(
            <DataGrid
                columns={mockColumns}
                rows={mockRows}
                pageIndex={0}
                pageSize={10}
                totalOfRows={30}
                onPageIndexChange={mockOnPageIndexChange}
                onPageSizeChange={mockOnPageSizeChange}
            />
        );

        // Change page size
        const pageSizeSelect = screen.getByRole('combobox');
        fireEvent.change(pageSizeSelect, { target: { value: '20' } });

        expect(mockOnPageSizeChange).toHaveBeenCalledWith(20);
    });

    // it('shows NoData component when rows are empty', () => {
    //     render(<DataGrid columns={mockColumns} rows={[]} />)

    //     expect(screen.getByText('No Data')).toBeInTheDocument()
    // })

    it('handles row click correctly', () => {
        const mockOnRowClick = jest.fn();

        render(<DataGrid columns={mockColumns} rows={mockRows} onRowClick={mockOnRowClick} />);

        const firstRow = screen.getAllByRole('row')[1];
        fireEvent.click(firstRow);

        expect(mockOnRowClick).toHaveBeenCalledWith(1, expect.any(Object));
    });

    it('handles select all correctly', () => {
        const mockOnSelectedChange = jest.fn();

        render(
            <DataGrid
                columns={mockColumns}
                rows={mockRows}
                selected={[1, 2, 3]}
                onSelectedChange={mockOnSelectedChange}
                spanningRowsPosition={'top'}
            />
        );

        // Click select all checkbox
        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox);
    });

    it('handleSelect if selected is not includes id', () => {
        const mockOnSelectedChange = jest.fn();

        render(
            <DataGrid
                columns={mockColumns}
                rows={mockRows}
                selected={[]}
                onSelectedChange={mockOnSelectedChange}
                spanningRowsPosition={'top'}
                getRowId={(row) => row.id}
            />
        );

        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox, { target: { checked: true } });
    });
    it('test getid', () => {
        const mockOnSelectedChange = jest.fn();

        const mockRows = [
            { name: 'John Doe', age: 30 },
            { name: 'Jane Smith', age: 25 },
            { name: 'Bob Johnson', age: 35 },
        ];

        render(
            <DataGrid
                columns={mockColumns}
                rows={mockRows}
                selected={[]}
                onSelectedChange={mockOnSelectedChange}
                spanningRowsPosition={'top'}
            />
        );

        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox, { target: { checked: true } });
    });
});
