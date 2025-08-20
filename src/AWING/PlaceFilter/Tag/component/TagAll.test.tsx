import TagAll from './TagAll';
import { EnumFieldInputType, EnumSelectedPlaceType } from '../../Enum';
import { render } from '@testing-library/react';
import { ITagAll } from 'AWING/PlaceFilter/interface';

describe('ACM > PlaceFilter > Tag > component > TagAll', () => {
    const tagsAll: ITagAll = {
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
                selectedType: EnumSelectedPlaceType.IDS,
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
                selectedType: EnumSelectedPlaceType.IDS,
                selectedPlaceIds: ['2'],
                filterPlaceIds: [],
            },
        ],
    };
    const snapTagsAll: ITagAll = {
        selectedPlaceIds: [],
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
                selectedType: EnumSelectedPlaceType.IDS,
                selectedPlaceIds: [],
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
                selectedType: EnumSelectedPlaceType.IDS,
                selectedPlaceIds: [],
                filterPlaceIds: [],
            },
        ],
    };

    const mockOnClickTagAll = jest.fn(() => {});

    it('Case select more place', () => {
        const wrapper = render(<TagAll tagsAll={tagsAll} snapTagsAll={snapTagsAll} isFocused={false} onClickTagAll={mockOnClickTagAll} />);

        const tag = wrapper.container.querySelector('[role="button"]')! as HTMLButtonElement;
        tag.click();
        expect(mockOnClickTagAll.mock.calls.length).toEqual(1);
        const amount = wrapper.getByText('2 (+2)');
        expect(amount).toHaveStyle('color: #3B86FF');
    });

    it('Case no change', () => {
        const wrapper = render(<TagAll tagsAll={tagsAll} snapTagsAll={tagsAll} isFocused={false} onClickTagAll={mockOnClickTagAll} />);
        const amount = wrapper.getByText('2');
        expect(amount).toHaveStyle('color: #000000');
        expect(amount).toHaveTextContent('2');
    });

    it('Case unselect place', () => {
        const wrapper = render(<TagAll tagsAll={snapTagsAll} snapTagsAll={tagsAll} isFocused={false} onClickTagAll={mockOnClickTagAll} />);
        const amount = wrapper.getByText('0 (-2)');
        expect(amount).toHaveStyle('color: #ED1D25');
        expect(amount).toHaveTextContent('0 (-2)');
    });
});
