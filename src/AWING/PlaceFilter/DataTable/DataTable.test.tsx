import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as recoil from 'jotai';
import { EnumFieldInputType, EnumSelectedPlaceType } from '../Enum';
import { IFilterField, ITag } from '../interface';
import { isSelectedTagAllState, snapTagsAllState, tagsAllState, tagSelectedState } from '../Recoil/Atom';
import DataTable from './container';

// import DataTableComponent from "./component";
type DataTableComponent = typeof import('./component').default;
jest.mock(
    './component',
    (): DataTableComponent => (props) => {
        props.getId({ id: 1, name: 'Place 1' } as any);
        props.getId({} as any);
        return (
            <div>
                {props.places.map((place) => (
                    <span key={place.id}>
                        {place.id} - {place.name}
                    </span>
                ))}
                <div>
                    Pagination
                    <button
                        onClick={(e) => props.pages.onPageIndexChange && props.pages.onPageIndexChange(Number((e.target as any).value))}
                    >
                        Next Page
                    </button>
                    <button onClick={(e) => props.pages.onPageSizeChange && props.pages.onPageSizeChange(Number((e.target as any).value))}>
                        Change Page Size
                    </button>
                </div>
                <button onClick={(e) => props.onSelectAll((e.target as any).value)}>Select All</button>
                <button
                    onClick={(e) => {
                        props.onSelectFilter(!!(e.target as any).value);
                    }}
                >
                    Select Filter
                </button>
                <button
                    onClick={(e) => {
                        props.onSelect((e.target as any).value, (e.target as any).id);
                        props.onSelect(false, '1');
                        props.onSelect(false, '3');
                    }}
                >
                    Select
                </button>
            </div>
        );
    }
);
const mockTagsAll = {
    selectedPlaceIds: ['1', '2'],
    filterPlaceIds: ['1'],
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
            filterPlaceIds: ['1'],
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
                {
                    label: 'Khu vực',
                    name: 'province',
                    value: [
                        { code: '1', name: 'Area 1', parentUnitCode: '0' },
                        { code: '2', name: 'Area 2', parentUnitCode: '0' },
                        { code: '3', name: 'Area 3', parentUnitCode: '1' },
                    ],
                    type: EnumFieldInputType.SELECT_AREA,
                    inputParameter: [
                        { code: '1', name: 'Area 1', parentUnitCode: '0' },
                        { code: '2', name: 'Area 2', parentUnitCode: '0' },
                        { code: '3', name: 'Area 3', parentUnitCode: '1' },
                    ],
                    isAdvanceField: false,
                    style: {
                        gridSize: 6,
                    },
                },
            ],
            selectedType: 'ByIds',
            selectedPlaceIds: ['1'],
            filterPlaceIds: ['1'],
        },
    ],
};
const mockFilterField: IFilterField[] = [
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
    {
        label: 'Nhóm địa điểm',
        name: 'placeGroup',
        value: '1',
        type: EnumFieldInputType.SELECT,
        inputParameter: [
            {
                name: 'Nhóm địa điểm',
                id: '1',
            },
        ],
        isAdvanceField: true,
        style: {
            gridSize: 6,
        },
    },
    {
        label: 'Khu vực',
        name: 'province',
        value: [],
        placeHolders: ['Chọn tỉnh thành', 'Chọn quận huyện', 'Chọn phường xã'],
        type: EnumFieldInputType.SELECT_AREA,
        inputParameter: [],
        isAdvanceField: false,
        style: {
            gridSize: 6,
        },
    },
];
const mockTagSelected: ITag = {
    filterFields: mockFilterField,
    selectedType: EnumSelectedPlaceType.IDS,
    selectedPlaceIds: [],
    filterPlaceIds: [],
    isTagPrepare: true,
};

const RenderUi = (isErr = false) => {
    return render(
        <DataTable
            isInit={false}
            getPlacesByFilter={
                jest.fn(() =>
                    isErr
                        ? Promise.reject('err')
                        : Promise.resolve({
                              places: [
                                  { id: '1', name: 'Place 1' },
                                  { id: '2', name: 'Place 2' },
                                  { id: '3', name: 'Place 3' },
                              ],
                              total: 13,
                          })
                ) as any
            }
            getPlacesByIds={
                jest.fn(() =>
                    isErr
                        ? Promise.reject('Err')
                        : Promise.resolve([
                              { id: '1', name: 'Place 1' },
                              { id: '2', name: 'Place 2' },
                              { id: '3', name: 'Place 3' },
                              { id: '4', name: 'Place 3' },
                              { id: '5', name: 'Place 3' },
                              { id: '6', name: 'Place 3' },
                          ])
                ) as any
            }
        />
    );
};
describe('ACM > PlaceFilter > DataTable', () => {
    const setSnapTagsAllState = jest.fn();
    const setTagSelected = jest.fn();
    const setMockTagsAll = jest.fn();
    beforeEach(() => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case tagSelectedState:
                    return [mockTagSelected, setTagSelected];
                case tagsAllState:
                    return [mockTagsAll, setMockTagsAll.mockImplementation((fn) => fn(mockTagsAll))];
                case snapTagsAllState:
                    return [mockTagsAll, setSnapTagsAllState];
                default:
                    return [null, jest.fn()];
            }
        });
        jest.spyOn(recoil, 'useAtomValue').mockImplementation((atom) => {
            if (atom === isSelectedTagAllState) {
                return true;
            }
            // case isSelectedTagAllState:
            // return [true];
        });
    });
    it('should render', async () => {
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const changePageSize = screen.getByText('Change Page Size');
            const changePageIndex = screen.getByText('Next Page');
            fireEvent.click(changePageSize, { target: { value: 10 } });
            fireEvent.click(changePageIndex, { target: { value: 10 } });
            // const abc = screen.getByText('Common.Reload');
            // expect(abc).toBeInTheDocument();
        });
    });
    it('should query data when call onSelectAll', async () => {
        jest.spyOn(recoil, 'useAtomValue').mockImplementation((atom) => {
            if (atom === isSelectedTagAllState) {
                return false;
            }
            // case isSelectedTagAllState:
            // return [true];
        });
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const selectAll = screen.getByText('Select All');
            fireEvent.click(selectAll, { target: { value: true } });
            fireEvent.click(selectAll, { target: { value: false } });
        });
    });
    it('should query data err', async () => {
        await act(async () => {
            RenderUi(true);
        });

        await waitFor(() => {
            const selectFilter = screen.getByText('Common.Reload');
            fireEvent.click(selectFilter);
        });
    });
    it('should onSelectFilter check', async () => {
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const selectFilter = screen.getByText('Select Filter');
            fireEvent.click(selectFilter, { target: { value: true } });
        });
    });
    it('should onSelectFilter check with selectedIds', async () => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case tagSelectedState:
                    return [
                        {
                            filterFields: mockFilterField,
                            selectedType: EnumSelectedPlaceType.IDS,
                            selectedPlaceIds: ['1'],
                            filterPlaceIds: ['1'],
                            isTagPrepare: false,
                        },
                        setTagSelected,
                    ];
                case tagsAllState:
                    return [mockTagsAll, setMockTagsAll.mockImplementation((fn) => fn(mockTagsAll))];
                case snapTagsAllState:
                    return [mockTagsAll, setSnapTagsAllState];
                default:
                    return [null, jest.fn()];
            }
        });
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const selectFilter = screen.getByText('Select Filter');
            fireEvent.click(selectFilter, { target: { value: true } });
        });
    });
    it('should onSelectFilter uncheck', async () => {
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const selectFilter = screen.getByText('Select Filter');
            fireEvent.click(selectFilter, { target: { value: undefined } });
        });
    });
    it('should onSelectFilter uncheck withoutPrePare', async () => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case tagSelectedState:
                    return [
                        {
                            filterFields: mockFilterField,
                            selectedType: EnumSelectedPlaceType.IDS,
                            selectedPlaceIds: ['1', '2', '3'],
                            filterPlaceIds: ['1'],
                            isTagPrepare: false,
                        },
                        setTagSelected,
                    ];
                case tagsAllState:
                    return [mockTagsAll, setMockTagsAll.mockImplementation((fn) => fn(mockTagsAll))];
                case snapTagsAllState:
                    return [mockTagsAll, setSnapTagsAllState];
                default:
                    return [null, jest.fn()];
            }
        });
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const selectFilter = screen.getByText('Select Filter');
            fireEvent.click(selectFilter, { target: { value: undefined } });
        });
    });
    it('should onSelect/Checked', async () => {
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const select = screen.getByText('Select');
            fireEvent.click(select, { target: { value: true, id: '1' } });
            fireEvent.click(select, { target: { value: true, id: '2' } });
        });
    });
    it('should onSelect/Checked/Prepare', async () => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case tagSelectedState:
                    return [
                        {
                            filterFields: mockFilterField,
                            selectedType: EnumSelectedPlaceType.IDS,
                            selectedPlaceIds: ['1', '2', '3'],
                            filterPlaceIds: ['1'],
                            isTagPrepare: true,
                        },
                        setTagSelected,
                    ];
                case tagsAllState:
                    return [
                        {
                            selectedPlaceIds: ['1', '2'],
                            filterPlaceIds: ['1'],
                            tags: [],
                        },
                        setMockTagsAll,
                    ];
                case snapTagsAllState:
                    return [mockTagsAll, setSnapTagsAllState];
                default:
                    return [null, jest.fn()];
            }
        });
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const select = screen.getByText('Select');
            fireEvent.click(select, { target: { value: true, id: '1' } });
            fireEvent.click(select, { target: { value: true, id: '2' } });
        });
    });
    it('should onSelect/ unChecked', async () => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case tagSelectedState:
                    return [
                        {
                            filterFields: mockFilterField,
                            selectedType: EnumSelectedPlaceType.IDS,
                            selectedPlaceIds: ['1'],
                            filterPlaceIds: ['1'],
                            isTagPrepare: false,
                        },
                        setTagSelected.mockImplementation((fn) => fn(mockTagsAll)),
                    ];
                case tagsAllState:
                    return [
                        {
                            selectedPlaceIds: ['1', '2'],
                            filterPlaceIds: ['1'],
                            tags: [],
                        },
                        setMockTagsAll.mockImplementation((fn) => fn(mockTagsAll)),
                    ];
                case snapTagsAllState:
                    return [mockTagsAll, setSnapTagsAllState];
                default:
                    return [null, jest.fn()];
            }
        });
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const select = screen.getByText('Select');
            fireEvent.click(select, { target: { value: undefined, id: '1' } });
        });
    });
    it('should onSelect/ unChecked/ prepare', async () => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case tagSelectedState:
                    return [
                        {
                            filterFields: mockFilterField,
                            selectedType: EnumSelectedPlaceType.IDS,
                            selectedPlaceIds: ['1'],
                            filterPlaceIds: ['1'],
                            isTagPrepare: true,
                        },
                        setTagSelected.mockImplementation((fn) => fn(mockTagsAll)),
                    ];
                case tagsAllState:
                    return [mockTagsAll, setMockTagsAll.mockImplementation((fn) => fn(mockTagsAll))];
                case snapTagsAllState:
                    return [mockTagsAll, setSnapTagsAllState];
                default:
                    return [null, jest.fn()];
            }
        });
        await act(async () => {
            RenderUi();
        });

        await waitFor(() => {
            const select = screen.getByText('Select');
            fireEvent.click(select, { target: { value: undefined, id: '1' } });
        });
    });
});
