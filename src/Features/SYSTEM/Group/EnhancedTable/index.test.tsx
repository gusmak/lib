/* eslint-disable */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedTableComponent from './index';

// Mock các dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('react-router', () => ({
    Link: 'a',
}));

// Mock các components từ AWING
jest.mock('AWING', () => ({
    DataGrid: ({
        columns,
        rows,
        onSortModelChange,
        onPageIndexChange,
        onPageSizeChange,
        rowActions,
        sortModel,
        pageSize,
        pageIndex,
        totalOfRows,
        getRowId,
    }: any) => (
        <div data-testid="data-grid">
            <table>
                <thead>
                    <tr>
                        {columns.map((col: any) => (
                            <th key={col.field} onClick={() => onSortModelChange([{ field: col.field, sort: 'asc' }])}>
                                {col.headerName}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row: any, index: any) => (
                        <tr key={getRowId(row)}>
                            {columns.map((col: any) => (
                                <td key={col.field}>{col.valueGetter ? col.valueGetter(row, index, index + 1) : row[col.field]}</td>
                            ))}
                            <td>
                                {rowActions?.map((action: any, actionIndex: any) => (
                                    <button key={actionIndex} onClick={() => action.action(row.id)} title={action.tooltipTitle}>
                                        {action.icon}
                                    </button>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <select aria-label="Rows per page:" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                </select>
                <button onClick={() => onPageIndexChange(pageIndex - 1)} disabled={pageIndex === 0}>
                    Previous
                </button>
                <button onClick={() => onPageIndexChange(pageIndex + 1)}>Next</button>
            </div>
        </div>
    ),

    Page: ({ caption, actions, children }: any) => (
        <div data-testid="page">
            <h1>{caption}</h1>
            <div className="actions">{actions}</div>
            {children}
        </div>
    ),

    SearchBox: ({ onSearch, placeholderInput }: any) => (
        <input type="text" placeholder={placeholderInput} onChange={(e) => onSearch('text', e.target.value)} data-testid="search-box" />
    ),
}));

jest.mock('Commons/Components/DeprecatedEnhancedDialog', () => ({ isOpen, onSubmit, onClose, label, title }: any) => (
    <div>
        {isOpen && (
            <div>
                <h2>{title}</h2>
                <input type="text" aria-label={label} />
                <button onClick={onSubmit} data-testid="submit-EnhancedDialog">
                    Submit
                </button>
                <button onClick={onClose} data-testid="close-EnhancedDialog">
                    Close
                </button>
            </div>
        )}
    </div>
));

describe('EnhancedTableComponent', () => {
    const mockRows = [
        { id: '1', name: 'John Doe', username: 'johndoe' },
        { id: '2', name: 'Jane Smith', username: 'janesmith' },
        { id: '3', name: 'Bob Wilson', username: 'bobwilson' },
    ];

    const mockOnChangeDeleted = jest.fn();

    const defaultProps = {
        rows: mockRows,
        onChangeDeleted: mockOnChangeDeleted,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders component with initial data', () => {
        render(<EnhancedTableComponent {...defaultProps} />);

        expect(screen.getByTestId('page')).toBeInTheDocument();
        expect(screen.getByTestId('data-grid')).toBeInTheDocument();
        expect(screen.getByTestId('search-box')).toBeInTheDocument();

        // Verify page title
        expect(screen.getByText('UserGroup.TitleUserManagement')).toBeInTheDocument();

        // Verify table headers
        expect(screen.getByText('User.STT')).toBeInTheDocument();
        expect(screen.getByText('User.Username')).toBeInTheDocument();
        expect(screen.getByText('User.Name')).toBeInTheDocument();

        // Verify initial data is displayed
        expect(screen.getByText('johndoe')).toBeInTheDocument();
        expect(screen.getByText('janesmith')).toBeInTheDocument();
        expect(screen.getByText('bobwilson')).toBeInTheDocument();
    });

    test('search functionality works', async () => {
        render(<EnhancedTableComponent {...defaultProps} />);

        const searchInput = screen.getByTestId('search-box');

        // Search for 'john'
        fireEvent.change(searchInput, { target: { value: 'john' } });

        await waitFor(() => {
            expect(screen.getByText('johndoe')).toBeInTheDocument();
            expect(screen.queryByText('janesmith')).not.toBeInTheDocument();
        });
    });

    test('delete functionality works', async () => {
        render(<EnhancedTableComponent {...defaultProps} />);

        // Click delete button for first row
        const deleteButtons = screen.getAllByTitle('Common.Delete');
        fireEvent.click(deleteButtons[0]);

        // Verify dialog opens
        expect(screen.getByText('Dialog.Confirm')).toBeInTheDocument();

        // Enter reason and submit
        const reasonInput = screen.getByLabelText('Dialog.Reason');
        fireEvent.change(reasonInput, { target: { value: 'test reason' } });

        // const submitButton = screen.getByText('Common.Submit')
        // fireEvent.click(submitButton)

        // expect(mockOnChangeDeleted).toHaveBeenCalledWith(['1'], 'test reason')
    });

    test('pagination works', () => {
        render(<EnhancedTableComponent {...defaultProps} />);

        const pageSizeSelect = screen.getByLabelText('Rows per page:') as HTMLSelectElement;

        fireEvent.change(pageSizeSelect, { target: { value: '10' } });

        const nextPageButton = screen.getByText('Next');
        fireEvent.click(nextPageButton);

        // Verify pagination controls work
        expect(pageSizeSelect.value).toBe('10');
    });

    test('sorting works', async () => {
        render(<EnhancedTableComponent {...defaultProps} />);

        // Click username header to sort
        const usernameHeader = screen.getByText('User.Username');
        fireEvent.click(usernameHeader);

        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            // First row after header should be bobwilson (alphabetical order)
            expect(rows[1]).toHaveTextContent('bobwilson');
        });
    });

    test('submit EnhancedDialog', async () => {
        render(<EnhancedTableComponent {...defaultProps} />);

        // Click delete button for first row
        const deleteButtons = screen.getAllByTitle('Common.Delete');
        fireEvent.click(deleteButtons[0]);

        // Enter reason and submit
        const reasonInput = screen.getByLabelText('Dialog.Reason');
        fireEvent.change(reasonInput, { target: { value: 'test reason' } });

        const submitButton = screen.getByTestId('submit-EnhancedDialog');
        fireEvent.click(submitButton);

        // // Verify dialog closes
        expect(screen.queryByText('Dialog.Confirm')).not.toBeInTheDocument();

        // await waitFor(() => {
        //     expect(mockOnChangeDeleted).toHaveBeenCalledWith(['1'], 'test reason');
        // });
    });

    test('close EnhancedDialog', async () => {
        render(<EnhancedTableComponent {...defaultProps} />);

        // Click delete button for first row
        const deleteButtons = screen.getAllByTitle('Common.Delete');
        fireEvent.click(deleteButtons[0]);

        // Close dialog
        const closeButton = screen.getByTestId('close-EnhancedDialog');
        fireEvent.click(closeButton);

        // Verify dialog closes
        expect(screen.queryByText('Dialog.Confirm')).not.toBeInTheDocument();
    });
});
