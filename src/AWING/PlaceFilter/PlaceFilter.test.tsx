import { render } from '@testing-library/react';
import PlaceFilter from './container';
import { isSelectedTagAllState, snapTagsAllState, tagsAllState, tagSelectedState } from './Recoil/Atom';
import { EnumFieldInputType, EnumSelectedPlaceType } from './Enum';
import { IFilterField, ITag } from './interface';
import { Provider } from 'recoil';

// import Tag from "./Tag";
jest.mock('./Tag', () => () => <div>Tag</div>);
// import FieldInput from "./Input";
jest.mock('./Input', () => () => <div>FieldInput</div>);
// import DataTable from "./DataTable";
jest.mock('./DataTable', () => () => <div>DataTable</div>);
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
describe('ACM > PlaceFilter', () => {
    const mockFilterFields = [];
    const getPlacesByFilter = (filterFields: any, pageSize: any, pageIndex: any) => {
        return new Promise((resolve, reject) => {
            resolve({ places: [], total: 0 });
        });
    };
    const getPlacesByIds = (placeIds: any) => {
        return new Promise((resolve, reject) => {
            resolve({ places: [], total: 0 });
        });
    };
    const mockCallbackFunction = jest.fn((selectedPlaceIds, filterPlaceIds, tags) => {});
    const Wrapper = (tags: ITag[] = []) => {
        return render(
            <div>
                <PlaceFilter
                    filterFields={[]}
                    getPlacesByFilter={getPlacesByFilter as any}
                    getPlacesByIds={getPlacesByIds as any}
                    callbackFunction={mockCallbackFunction}
                    tags={tags}
                />
            </div>,
            {
                wrapper: Provider,
            }
        );
    };
    it('Case empty', () => {
        const wrapper = Wrapper();
        expect(wrapper.getByText('Tag')).toBeInTheDocument();
        expect(wrapper.getByText('FieldInput')).toBeInTheDocument();
    });
    it('case have tags', () => {
        const wrapper = Wrapper([mockTagsAll]);
        expect(wrapper.getByText('Tag')).toBeInTheDocument();
        expect(wrapper.getByText('FieldInput')).toBeInTheDocument();
    });
});
