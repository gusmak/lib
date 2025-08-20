import { render, fireEvent } from '@testing-library/react';
import TableHeader from '../TableHeader';

describe('TableHeader', () => {
    const mockSelected: number[] | undefined = [];
    const mockOnSelectedChange = jest.fn();
    const mockNumOfRows = 10;
    const mockOnSelectAll = jest.fn();
    const mockIncludeDelete = true;
    const mockColumnDefinitions = [{ headerName: 'Name' }, { headerName: 'Age' }];

    it('renders the correct number of columns', () => {
        const { getAllByRole } = render(
            <TableHeader
                columnDefinitions={mockColumnDefinitions}
                numOfRows={mockNumOfRows}
                onSelectAll={mockOnSelectAll}
            />
        );
        const columnHeaders = getAllByRole('columnheader');
        expect(columnHeaders).toHaveLength(mockColumnDefinitions.length);
        expect(columnHeaders[0]).toHaveTextContent(mockColumnDefinitions[0].headerName);
        expect(columnHeaders[1]).toHaveTextContent(mockColumnDefinitions[1].headerName);
    });

    it('renders the delete column', () => {
        const { getAllByRole } = render(
            <TableHeader
                columnDefinitions={mockColumnDefinitions}
                numOfRows={mockNumOfRows}
                onSelectAll={mockOnSelectAll}
                includeDelete={mockIncludeDelete}
            />
        );
        const columnHeaders = getAllByRole('columnheader');
        expect(columnHeaders).toHaveLength(mockColumnDefinitions.length + 1);
    });

    it('calls onSelectAll when a checkbox is clicked', () => {
        const { getAllByRole } = render(
            <TableHeader
                columnDefinitions={mockColumnDefinitions}
                numOfRows={mockNumOfRows}
                onSelectAll={mockOnSelectAll}
                selected={mockSelected}
                onSelectedChange={mockOnSelectedChange}
            />
        );
        const checkboxes = getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
    });
});
