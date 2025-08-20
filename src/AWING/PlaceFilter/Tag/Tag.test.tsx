import { render, screen } from '@testing-library/react';
import Container from './container';
import * as recoil from 'jotai';
import { isSelectedTagAllState, snapTagsAllState, tagsAllState, tagSelectedState } from '../Recoil/Atom';
import { EnumFieldInputType, EnumSelectedPlaceType } from '../Enum';
import { IFilterField, ITag } from '../interface';
type TagChip = typeof import('./component/TagChip').default;
type TagAll = typeof import('./component/TagAll').default;
// import { debounce } from "lodash";
jest.mock('lodash', () => ({
    ...jest.requireActual('lodash'),
    debounce: jest.fn((fn) => fn),
}));
jest.mock(
    './component/TagAll',
    (): TagAll => (props) => (
        <button data-testid="tag-all" onClick={props.onClickTagAll}>
            Tag All Component
        </button>
    )
);

jest.mock(
    './component/TagChip',
    (): TagChip => (props) => (
        <div>
            {props.numOfPreviousPlaces}
            {JSON.stringify(props.tagItem)}
            <div
                onClick={() => {
                    props.onClickTag();
                }}
            >
                Tag Chip Component
            </div>
            <div
                onClick={() => {
                    props.onDeleteTag();
                }}
            >
                Delete Tag
            </div>
        </div>
    )
);
const RenderUi = () => {
    return render(<Container />);
};
const mockTagsAll = {
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
            filterPlaceIds: [],
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
    isTagPrepare: false,
};
describe('Container Component', () => {
    const fn = {
        setSnapTagsAllState: (p: any) => {
            p(mockTagsAll);
        },
    };
    const setTagSelected = jest.fn();
    const setIsSelectedTagAll = jest.fn();
    const setMockTagsAll = jest.fn();
    const setSnapTagsAllState = jest.fn();

    beforeEach(() => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case isSelectedTagAllState:
                    return [true, setIsSelectedTagAll];
                case tagSelectedState:
                    return [mockTagSelected, setTagSelected];
                case tagsAllState:
                    return [mockTagsAll, setMockTagsAll.mockImplementation(fn.setSnapTagsAllState)];
                case snapTagsAllState:
                    return [mockTagsAll, setSnapTagsAllState];
                default:
                    return [null, jest.fn()];
            }
        });

        RenderUi();
    });
    test('renders Container component', () => {
        const containerElement = screen.getByTestId('tag-all');
        expect(containerElement).toBeInTheDocument();
    });

    test('renders children inside Container component', () => {
        const childElement = screen.getAllByText('Tag Chip Component');
        expect(childElement.length).toBeGreaterThan(1);
    });
    test('should call onClickTagAll when click on TagAll', () => {
        const tagAllElement = screen.getByTestId('tag-all');
        tagAllElement.click();
        expect(setIsSelectedTagAll).toHaveBeenCalled();
    });
    test('should call onClickTag when click on TagChip', () => {
        const tagChipElement = screen.getAllByText('Tag Chip Component')[0];
        tagChipElement.click();
        expect(setTagSelected).toHaveBeenCalled();
    });
    test('should call onDeleteTag when click on Delete one Tag', () => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case isSelectedTagAllState:
                    return [true, setIsSelectedTagAll];
                case tagSelectedState:
                    return [mockTagSelected, setTagSelected];
                case tagsAllState:
                    return [
                        {
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
                            ],
                        },
                        setMockTagsAll.mockImplementation(fn.setSnapTagsAllState),
                    ];
                case snapTagsAllState:
                    return [mockTagsAll, setSnapTagsAllState];
                default:
                    return [null, jest.fn()];
            }
        });
        RenderUi();

        const deleteTagElement = screen.getAllByText('Delete Tag');
        deleteTagElement.forEach((element) => {
            element.click();
        });
        expect(setMockTagsAll).toHaveBeenCalled();
    });
    test('should call onDeleteTag when click on Delete all Tag', () => {
        const deleteTagElement = screen.getAllByText('Delete Tag');
        deleteTagElement.forEach((element) => {
            element.click();
        });
        expect(setMockTagsAll).toHaveBeenCalled();
    });
});
