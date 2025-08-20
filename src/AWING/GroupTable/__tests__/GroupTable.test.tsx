import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GroupTable } from '../GroupTable';

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

describe('GroupTable Component', () => {
    // Mock data and props
    const mockData = [
        { id: 1, name: 'Test 1', group: 'A', subgroup: 'X' },
        { id: 2, name: 'Test 2', group: 'A', subgroup: 'Y' },
    ];

    const mockHeadCells: HeadCell[] = [
        { field: 'id', label: 'ID', isGrouping: false, isFixed: false },
        { field: 'name', label: 'Name', isGrouping: false, isFixed: false },
        { field: 'group', label: 'Group', isGrouping: true, isFixed: false },
        { field: 'subgroup', label: 'Subgroup', isGrouping: true, isFixed: false },
    ];

    const mockOnGetData = jest.fn().mockResolvedValue({
        data: mockData,
        totalCount: 2,
    });

    const mockOnRowClicked = jest.fn();

    const defaultProps = {
        headCells: mockHeadCells,
        filters: [],
        onGetData: mockOnGetData,
        onRowClicked: mockOnRowClicked,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        render(
            <table>
                <tbody>
                    <GroupTable {...defaultProps} />
                </tbody>
            </table>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders data after loading', async () => {
        render(
            <table>
                <tbody>
                    <GroupTable {...defaultProps} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
        expect(mockOnGetData).toHaveBeenCalled();
    });

    it('renders NoData component when data is empty', async () => {
        const emptyDataProps = {
            ...defaultProps,
            onGetData: jest.fn().mockResolvedValue({ data: [], totalCount: 0 }),
        };

        render(
            <table>
                <tbody>
                    <GroupTable {...emptyDataProps} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(screen.getByTestId('no-data')).toBeInTheDocument();
        });
    });

    it('handles page change correctly', async () => {
        render(
            <table>
                <tbody>
                    <GroupTable {...defaultProps} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        const nextPageButton = screen.getByLabelText('Go to next page');
        fireEvent.click(nextPageButton);

        expect(mockOnGetData).toHaveBeenCalledWith([], 1, 10); // Default page size is 10
    });

    it('handles rows per page change correctly', async () => {
        render(
            <table>
                <tbody>
                    <GroupTable {...defaultProps} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '25' } });

        expect(mockOnGetData).toHaveBeenCalledWith([], 0, 25);
    });

    it('renders group components when filters length is less than group keys', async () => {
        const propsWithFilter = {
            ...defaultProps,
            filters: [{ field: 'group', value: 'A' }],
        };

        render(
            <table>
                <tbody>
                    <GroupTable {...propsWithFilter} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        // Verify GroupComponent rendering
        expect(mockOnGetData).toHaveBeenCalledWith([{ field: 'group', value: 'A' }], 0, 10);
    });

    it('renders custom row component when provided', async () => {
        const CustomRow = jest.fn(() => <tr data-testid="custom-row" />);
        const propsWithCustomRow = {
            ...defaultProps,
            customRow: CustomRow,
            filters: [
                { field: 'group', value: 'A' },
                { field: 'subgroup', value: 'X' },
            ],
        };

        render(
            <table>
                <tbody>
                    <GroupTable {...propsWithCustomRow} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        expect(screen.getAllByTestId('custom-row')).toHaveLength(mockData.length);
    });

    it('resets page index when headCells change', async () => {
        const { rerender } = render(
            <table>
                <tbody>
                    <GroupTable {...defaultProps} />
                </tbody>
            </table>
        );

        // Change page
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        const nextPageButton = screen.getByLabelText('Go to next page');
        fireEvent.click(nextPageButton);

        // Change headCells
        const newHeadCells = [...mockHeadCells];
        rerender(
            <table>
                <tbody>
                    <GroupTable {...defaultProps} headCells={newHeadCells} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(mockOnGetData).toHaveBeenCalledWith([], 0, 10);
        });
    });

    it('handles data updates correctly', async () => {
        const newData = [{ id: 3, name: 'Test 3', group: 'B', subgroup: 'Z' }];

        const mockOnGetDataWithUpdate = jest
            .fn()
            .mockResolvedValueOnce({ data: mockData, totalCount: 2 })
            .mockResolvedValueOnce({ data: newData, totalCount: 1 });

        const propsWithUpdatingData = {
            ...defaultProps,
            onGetData: mockOnGetDataWithUpdate,
        };

        const { rerender } = render(
            <table>
                <tbody>
                    <GroupTable {...propsWithUpdatingData} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        // Trigger a re-render with new data
        rerender(
            <table>
                <tbody>
                    <GroupTable {...propsWithUpdatingData} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(mockOnGetDataWithUpdate).toHaveBeenCalledTimes(2);
        });
    });

    it('maintains pagination state between renders', async () => {
        render(
            <table>
                <tbody>
                    <GroupTable {...defaultProps} />
                </tbody>
            </table>
        );

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        // Change page size
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '25' } });

        // Verify the page size change is maintained
        expect(mockOnGetData).toHaveBeenCalledWith([], 0, 25);

        // Change page
        const nextPageButton = screen.getByLabelText('Go to next page');
        fireEvent.click(nextPageButton);

        // Verify the page change is maintained
        expect(mockOnGetData).toHaveBeenCalledWith([], 1, 25);
    });
});
