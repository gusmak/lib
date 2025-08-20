import TagChip from './TagChip';
import { EnumFieldInputType, EnumSelectedPlaceType } from '../../Enum';
import { ITag } from 'AWING/PlaceFilter/interface';
import { render } from '@testing-library/react';

describe('ACM > PlaceFilter > Tag > component > TagChip', () => {
    const tagItem: ITag = {
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
        selectedPlaceIds: ['1'],
        filterPlaceIds: [],
        selectedType: EnumSelectedPlaceType.IDS,
    };

    const mockOnClickTag = jest.fn(() => {});
    const mockOnDeleteTag = jest.fn(() => {});

    it('Case select more place', () => {
        const wrapper = render(
            <TagChip
                tagItem={tagItem}
                isFocused={false}
                numOfPreviousPlaces={0}
                onClickTag={mockOnClickTag}
                onDeleteTag={mockOnDeleteTag}
            />
        );

        const tag = wrapper.getByText('1 (+1)');
        tag.click();
        expect(mockOnClickTag.mock.calls.length).toEqual(1);
        expect(tag).toHaveStyle('color: #3B86FF');
    });

    it('Case no change', () => {
        const wrapper = render(
            <TagChip
                tagItem={tagItem}
                isFocused={false}
                numOfPreviousPlaces={1}
                onClickTag={mockOnClickTag}
                onDeleteTag={mockOnDeleteTag}
            />
        );
        const tag = wrapper.getByText('1');
        tag.click();
        expect(mockOnClickTag.mock.calls.length).toEqual(1);
        expect(tag).toHaveStyle('color: #000000');
    });

    it('Case unselect place', () => {
        const wrapper = render(
            <TagChip
                tagItem={tagItem}
                isFocused={false}
                numOfPreviousPlaces={3}
                onClickTag={mockOnClickTag}
                onDeleteTag={mockOnDeleteTag}
            />
        );
        const tag = wrapper.getByText('1 (-2)');
        tag.click();
        expect(mockOnClickTag.mock.calls.length).toEqual(1);
        expect(tag).toHaveStyle('color: #ED1D25');
    });
});
