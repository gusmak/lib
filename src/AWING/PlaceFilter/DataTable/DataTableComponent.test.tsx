import { fireEvent, render, screen } from '@testing-library/react';
import DataTableComponent from './component';
import { EnumFieldInputType, EnumSelectedPlaceType } from '../Enum';
// import Pagination from "./Pagination";
jest.mock('AWING/DataGrid', () => (props: any) => {
    props.getRowId({ id: '1' });
    return (
        <div>
            <span>{JSON.stringify(props.rows)}</span>
            <button data-testid="onSelectedChange" onClick={(e) => props.onSelectedChange((e.target as any).value)}></button>
            <button onClick={props.onPageIndexChange}>Next Page</button>
            <button onClick={props.onPageSizeChange}>Change Page Size</button>
        </div>
    );
});
describe('ACM > PlaceFilter > DataTable > component', () => {
    const tagsAll = {
        selectedPlaceIds: ['1', '2'],
        filterPlaceIds: [],
        tags: [
            {
                filterFields: [
                    {
                        label: 'Từ khóa',
                        name: 'searchString',
                        value: '',
                        placeHolders: ['Nhập từ khóa tìm kiếm'],
                        type: EnumFieldInputType.TEXT,
                        isAdvanceField: false,
                        style: {
                            gridSize: 12,
                        },
                    },
                ],
                selectedType: 'ByIds',
                selectedPlaceIds: ['1'],
                filterPlaceIds: [],
            },
            {
                filterFields: [
                    {
                        label: 'Từ khóa',
                        name: 'searchString',
                        value: 'Search key',
                        placeHolders: ['Nhập từ khóa tìm kiếm'],
                        type: EnumFieldInputType.TEXT,
                        isAdvanceField: false,
                        style: {
                            gridSize: 12,
                        },
                    },
                ],
                selectedType: 'ByIds',
                selectedPlaceIds: ['2'],
                filterPlaceIds: [],
            },
        ],
    };

    const tagSelected = {
        filterFields: [
            {
                label: 'Từ khóa',
                name: 'searchString',
                value: 'Search key',
                placeHolders: ['Nhập từ khóa tìm kiếm'],
                type: EnumFieldInputType.TEXT,
                isAdvanceField: false,
                style: {
                    gridSize: 12,
                },
            },
        ],
        selectedType: 'ByIds',
        selectedPlaceIds: ['2'],
        filterPlaceIds: [],
    };

    const mockOnPageIndexChange = jest.fn((pageIndex) => {});
    const mockOnPageSizeChange = jest.fn((pageSize) => {});

    const pages = {
        pageIndex: 0,
        pageSize: 10,
        total: 0,
        onPageIndexChange: mockOnPageIndexChange,
        onPageSizeChange: mockOnPageSizeChange,
    };
    const mockOnSelectAll = jest.fn(() => {});
    const mockOnSelectFilter = jest.fn();
    const mockOnSelect = jest.fn(() => {});
    const getId = (row: any) => {
        return row.id;
    };
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('Case empty', () => {
        const wrapper = render(
            <DataTableComponent
                tagsAll={{ selectedPlaceIds: [], filterPlaceIds: [], tags: [] }}
                tagSelected={{
                    filterFields: [
                        {
                            label: 'Từ khóa',
                            name: 'searchString',
                            value: '',
                            placeHolders: ['Nhập từ khóa tìm kiếm'],
                            type: EnumFieldInputType.TEXT,
                            isAdvanceField: false,
                            style: {
                                gridSize: 12,
                            },
                        },
                    ],
                    selectedType: EnumSelectedPlaceType.IDS,
                    selectedPlaceIds: [],
                    filterPlaceIds: [],
                }}
                isShowTotalSelected={false}
                pages={pages}
                places={[]}
                totalSelected={2}
                onSelectAll={mockOnSelectAll}
                onSelectFilter={mockOnSelectFilter}
                onSelect={mockOnSelect}
                getId={getId}
            />
        );
        expect(screen.getByText('[]')).toBeInTheDocument();
        // const rows = wrapper.find(".MuiTableRow-hover");
        // expect(rows.length).toEqual(0);
        // const empty = wrapper.find("NoData");
        // expect(empty.length).toEqual(1);
    });

    it('Case focus tag is tagAll', () => {
        const wrapper = render(
            <DataTableComponent
                tagsAll={tagsAll as any}
                tagSelected={tagSelected as any}
                isShowTotalSelected={false}
                pages={{ ...pages, total: 2 }}
                places={
                    [
                        { id: 1, name: 'Place 1' },
                        { id: 2, name: 'Place 2' },
                    ] as any
                }
                totalSelected={2}
                onSelectAll={mockOnSelectAll}
                onSelectFilter={mockOnSelectFilter}
                onSelect={mockOnSelect}
                getId={getId}
            />
        );
        const CheckBoxOutlineBlankIcon = wrapper.getByTestId('CheckBoxOutlineBlankIcon');
        fireEvent.click(CheckBoxOutlineBlankIcon);
        expect(mockOnSelectAll.mock.calls.length).toEqual(1);
    });

    it('Case focus tag is not tagAll', () => {
        const wrapper = render(
            <DataTableComponent
                tagsAll={tagsAll as any}
                tagSelected={tagSelected as any}
                isShowTotalSelected={false}
                pages={{ ...pages, total: 1 }}
                places={[{ id: 1, name: 'Place 1' } as any]}
                totalSelected={2}
                onSelectAll={mockOnSelectAll}
                onSelectFilter={mockOnSelectFilter}
                onSelect={mockOnSelect}
                getId={getId}
            />
        );

        const rows = wrapper.getAllByTestId('onSelectedChange');
        rows.forEach((row) => {
            fireEvent.click(row, { target: { value: ['1', '2', '3'] } });
        });
        expect(mockOnSelect.mock.calls.length).toEqual(2);
    });
    it('should be change page size', () => {
        const wrapper = render(
            <DataTableComponent
                tagsAll={tagsAll as any}
                tagSelected={tagSelected as any}
                isShowTotalSelected={false}
                pages={{ ...pages, total: 3 }}
                places={[
                    { id: 1, name: 'Place 1' },
                    { id: 2, name: 'Place 1' },
                    { id: 3, name: 'Place 1' },
                    { id: 4, name: 'Place 1' },
                    { id: 5, name: 'Place 1' },
                    { id: 6, name: 'Place 1' },
                    { id: 7, name: 'Place 1' },
                    { id: 8, name: 'Place 1' },
                    { id: 9, name: 'Place 1' },
                    { id: 10, name: 'Place 1' } as any,
                ]}
                totalSelected={2}
                onSelectAll={mockOnSelectAll}
                onSelectFilter={mockOnSelectFilter}
                onSelect={mockOnSelect}
                getId={getId}
            />
        );
        const next = wrapper.getByText('Next Page');
        const size = wrapper.getByText('Change Page Size');
        fireEvent.click(next, { target: { value: 2 } });
        fireEvent.click(size, { target: { value: 20 } });
        const ab = wrapper.getByText('Common.SelectAll');
        fireEvent.click(ab);
        fireEvent.click(wrapper.getByText('PlaceFilter.SelectAllByFilter'));
        expect(mockOnPageIndexChange.mock.calls.length).toEqual(1);
        expect(mockOnPageSizeChange.mock.calls.length).toEqual(1);
        // const select = wrapper.container.querySelectorAll('[aria-label="next page"]');
        // const changePageSize = wrapper.container.querySelectorAll('.MuiTablePagination-menuItem');
        // changePageSize[1].click();
        // select.forEach((item) => {
        //     item.click();
        //     fireEvent.click(item);
        // });
        // expect(mockOnPageSizeChange.mock.calls.length).toEqual(1);
    });
});
