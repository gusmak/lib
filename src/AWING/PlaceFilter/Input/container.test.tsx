import { render, fireEvent } from '@testing-library/react';
import * as recoil from 'jotai';
import FieldInput from './container';
import { isSelectedTagAllState, tagSelectedState, tagsAllState } from '../Recoil/Atom';
import { IFilterField, ITag, ITagAll } from '../interface';
import { EnumFieldInputType, EnumSelectedPlaceType } from '../Enum';
type FieldInputComponent = typeof import('./component').default;
jest.mock(
    './component',
    (): FieldInputComponent => (props) => (
        <div>
            {props.inputFilters.map((inputFilter) => (
                <div key={inputFilter.name}>
                    <span>{JSON.stringify(inputFilter.value)}</span>
                    <span>{inputFilter.name}</span>
                    <span>{inputFilter.label}</span>
                </div>
            ))}
            <input onChange={(e) => props.onChange(e.target.value, 0, !!(e.target as any).change)} data-testid="inputValue" />
        </div>
    )
);
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
describe('FieldInput Component', () => {
    const mockTagsAll: ITagAll = {
        tags: [
            {
                filterFields: mockFilterField,
                selectedType: EnumSelectedPlaceType.IDS,
                selectedPlaceIds: [],
                filterPlaceIds: [],
                isTagPrepare: false,
            },
        ],
    };

    const mockTagSelected: ITag = {
        filterFields: mockFilterField,
        selectedType: EnumSelectedPlaceType.IDS,
        selectedPlaceIds: [],
        filterPlaceIds: [],
        isTagPrepare: false,
    };
    const setTagSelected = jest.fn();
    beforeEach(() => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case isSelectedTagAllState:
                    return [true, jest.fn()];
                case tagSelectedState:
                    return [mockTagSelected, setTagSelected];
                case tagsAllState:
                    return [mockTagsAll, jest.fn()];
                default:
                    return [null, jest.fn()];
            }
        });
        jest.spyOn(recoil, 'useAtomValue').mockImplementation((atom) => {
            if (atom === tagsAllState) return mockTagsAll;
            return null;
        });
    });

    const renderComponent = () => render(<FieldInput />);

    it('should render FieldInputComponent with initial values', () => {
        const { getByText } = renderComponent();
        expect(getByText('Nhóm địa điểm')).toBeInTheDocument();
    });

    it('should update tagSelected state on input change', () => {
        const { getByTestId } = renderComponent();
        const input = getByTestId('inputValue');
        fireEvent.change(input, { target: { value: 'newValue' } });
        expect(setTagSelected).toHaveBeenCalled();
    });
    it('should update tagSelected state on input change/Change Operator/isSelectedTagAll false', () => {
        jest.spyOn(recoil, 'useAtom').mockImplementation((atom) => {
            switch (atom) {
                case tagSelectedState:
                    return [mockTagSelected, setTagSelected];
                default:
                    return [undefined, jest.fn()];
            }
        });
        const { getByTestId } = renderComponent();
        const input = getByTestId('inputValue');
        fireEvent.change(input, { target: { value: 'newValue', change: true } });
        expect(setTagSelected).toHaveBeenCalled();
    });
});
