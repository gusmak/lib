import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomRow from '../CustomRow';

export interface HeadCell {
    label: string;
    field: string;
    isGrouping: boolean;
    isFixed: boolean;
    getDisplay?: (info: any) => any;
    isDisplayTotal?: boolean;
    sort?: 'ready' | 'asc' | 'desc';
    numberic?: boolean;
}

describe('CustomRow Component', () => {
    // Mock data
    const mockInfo = {
        rowIndex: 0,
        id: 1,
        name: 'Test Name',
        age: 25,
        score: 0,
        empty: '',
    };

    const mockHeadCells: HeadCell[] = [
        { field: 'id', label: 'ID', isGrouping: false, isFixed: false },
        { field: 'name', label: 'Name', isGrouping: false, isFixed: false },
        { field: 'age', label: 'Age', isGrouping: false, isFixed: false, numberic: true },
        { field: 'group', label: 'Group', isGrouping: true, isFixed: false },
        { field: 'score', label: 'Score', isGrouping: false, isFixed: false, numberic: true },
        { field: 'empty', label: 'Empty', isGrouping: false, isFixed: false },
        {
            field: 'custom',
            label: 'Custom',
            isGrouping: false,
            isFixed: false,
            getDisplay: (info) => `Custom ${info.name}`,
        },
    ];

    const mockOnRowClicked = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders row index correctly', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} />
                </tbody>
            </table>
        );
        expect(screen.getByText('1')).toBeInTheDocument(); // rowIndex + 1
    });

    it('renders non-grouping cells correctly', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} />
                </tbody>
            </table>
        );
        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('displays N/A for empty values', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} />
                </tbody>
            </table>
        );
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('displays 0 correctly', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} />
                </tbody>
            </table>
        );
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('uses getDisplay function when provided', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} />
                </tbody>
            </table>
        );
        expect(screen.getByText('Custom Test Name')).toBeInTheDocument();
    });

    it('calls onRowClicked when row is clicked', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} onRowClicked={mockOnRowClicked} />
                </tbody>
            </table>
        );

        const row = screen.getByText('Test Name').closest('tr');
        fireEvent.click(row!);
        expect(mockOnRowClicked).toHaveBeenCalledWith(mockInfo);
    });

    it('sets correct cursor style when onRowClicked is provided', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} onRowClicked={mockOnRowClicked} />
                </tbody>
            </table>
        );

        const row = screen.getByText('Test Name').closest('tr');
        expect(row).toHaveStyle({ cursor: 'pointer' });
    });

    it('sets cursor style to text when onRowClicked is not provided', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} />
                </tbody>
            </table>
        );

        const row = screen.getByText('Test Name').closest('tr');
        expect(row).toHaveStyle({ cursor: 'text' });
    });

    it('skips rendering grouping cells', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} />
                </tbody>
            </table>
        );

        const cells = screen.getAllByRole('cell');
        // Number of cells should be: non-grouping cells + 1 (for row index)
        const expectedCellCount = mockHeadCells.filter((cell) => !cell.isGrouping).length + 1;
        expect(cells).toHaveLength(expectedCellCount);
    });

    it('applies correct alignment based on numberic property', () => {
        render(
            <table>
                <tbody>
                    <CustomRow info={mockInfo} headCells={mockHeadCells} />
                </tbody>
            </table>
        );

        const numericCell = screen.getByText('25').closest('td');
        const textCell = screen.getByText('Test Name').closest('td');

        expect(numericCell).toHaveStyle({ textAlign: 'right' });
        expect(textCell).toHaveStyle({ textAlign: 'left' });
    });
});
