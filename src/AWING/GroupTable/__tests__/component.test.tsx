// import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import GroupComponent from './component';
// import { HeadCell } from 'AWING';

// describe('GroupComponent', () => {
//     const mockHeadCells: HeadCell[] = [
//         {
//             field: 'name',
//             label: 'Name',
//             isGrouping: true,
//             isFixed: false,
//         },
//         {
//             field: 'age',
//             label: 'Age',
//             numberic: true,
//             isGrouping: false,
//             isFixed: false,
//         },
//         {
//             field: 'total',
//             label: 'Total',
//             numberic: true,
//             isDisplayTotal: true,
//             isGrouping: false,
//             isFixed: false,
//         },
//         {
//             field: 'custom',
//             label: 'Custom',
//             getDisplay: (data) => `Custom ${data.custom}`,
//             isGrouping: false,
//             isFixed: false,
//         }
//     ];

//     const mockDisplayData = jest.fn(() => ({
//         name: 'Test Name',
//         age: 25,
//         total: 1000,
//         custom: 'Value',
//         groupIndex: 0
//     })) as unknown as jest.Mock & { groupIndex: number };

//     const mockFilters = ['filter1', 'filter2'];
//     const mockOnGetData = jest.fn();
//     const mockOnRowClicked = jest.fn();
//     const mockCustomRow = jest.fn();

//     const defaultProps = {
//         headCells: mockHeadCells,
//         filters: mockFilters,
//         displayData: mockDisplayData,
//         onGetData: mockOnGetData,
//         onRowClicked: mockOnRowClicked,
//         customRow: mockCustomRow
//     };

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('renders initial state correctly', () => {
//         render(<GroupComponent {...defaultProps} />);

//         // Check if group index is displayed
//         expect(screen.getByText('1')).toBeInTheDocument();

//         // Check if ArrowDropDown is initially rendered
//         expect(document.querySelector('.MuiSvgIcon-root')).toBeInTheDocument();
//     });

//     it('toggles expansion when clicked', () => {
//         render(<GroupComponent {...defaultProps} />);

//         const row = screen.getByRole('row');
//         fireEvent.click(row);

//         // Check if GroupContainer is rendered after expansion
//         expect(screen.getByTestId('group-container')).toBeInTheDocument();

//         // Click again to collapse
//         fireEvent.click(row);
//         expect(screen.queryByTestId('group-container')).not.toBeInTheDocument();
//     });

//     it('applies gray background correctly based on filters and groupings', () => {
//         const propsWithMoreGroupings = {
//             ...defaultProps,
//             headCells: mockHeadCells.map(cell => ({ ...cell, isGrouping: true }))
//         };

//         const { container } = render(<GroupComponent {...propsWithMoreGroupings} />);
//         const row = container.querySelector('tr');

//         expect(row).toHaveStyle({ background: '#F9F9F9' });
//     });

//     it('renders custom display values correctly', () => {
//         render(<GroupComponent {...defaultProps} />);

//         // Check if custom display function is working
//         expect(screen.getByText('Custom Value')).toBeInTheDocument();
//     });

//     it('handles undefined display data gracefully', () => {
//         const propsWithUndefinedData = {
//             ...defaultProps,
//             displayData: {
//                 ...mockDisplayData,
//                 custom: undefined
//             }
//         };

//         const { container } = render(<GroupComponent {...propsWithUndefinedData} />);
//         const emptyCells = container.querySelectorAll('td:empty');

//         expect(emptyCells.length).toBeGreaterThan(0);
//     });

//     it('applies correct styling for numeric and total cells', () => {
//         render(<GroupComponent {...defaultProps} />);

//         const cells = screen.getAllByRole('cell');

//         // Check numeric alignment
//         const numericCell = cells.find(cell => cell.textContent === '25');
//         expect(numericCell).toHaveStyle({ textAlign: 'right' });

//         // Check total cell styling
//         const totalCell = cells.find(cell => cell.textContent === '1000');
//         expect(totalCell).toHaveStyle({ fontWeight: 'bold' });
//     });

//     it('renders correct number of columns', () => {
//         const { container } = render(<GroupComponent {...defaultProps} />);
//         const cells = container.querySelectorAll('td');

//         // Expected number of cells: filters.length + (headCells.length - (filters.length - 1))
//         const expectedCells = mockFilters.length + (mockHeadCells.length - (mockFilters.length - 1));
//         expect(cells.length).toBe(expectedCells);
//     });

//     it('handles empty filters array', () => {
//         const propsWithNoFilters = {
//             ...defaultProps,
//             filters: []
//         };

//         render(<GroupComponent {...propsWithNoFilters} />);

//         // Component should still render without errors
//         expect(screen.getByRole('row')).toBeInTheDocument();
//     });
// });
