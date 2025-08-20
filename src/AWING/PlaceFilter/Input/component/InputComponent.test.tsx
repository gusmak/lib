import { fireEvent, render, screen } from '@testing-library/react';
import { EnumFieldInputType } from 'AWING/PlaceFilter/Enum';
import { IFilterField, IInputProps } from 'AWING/PlaceFilter/interface';
import InputComponent from './index';

jest.mock('./InputFactory', () => (props: IInputProps<EnumFieldInputType>) => (
    <div>
        <div>
            {JSON.stringify(props.filterField)}
            <button onClick={() => props.onChange('123', 0)}>Clear</button>
        </div>
    </div>
));
// ... other mocks ...
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
describe('InputComponent', () => {
    it('renders area select input correctly', () => {
        const mockOnChange = jest.fn();
        const props = {
            inputFilters: mockFilterField,
            onChange: mockOnChange,
        };

        render(<InputComponent {...props} />);

        const button = screen.getAllByText('Clear');
        fireEvent.click(button[0]);

        expect(mockOnChange).toHaveBeenCalledWith('123', 0);
    });
    it('render advanced field correctly', () => {
        const mockOnChange = jest.fn();
        const props = {
            inputFilters: mockFilterField,
            onChange: mockOnChange,
        };

        const { container } = render(<InputComponent {...props} />);

        const button = container.querySelector('[type="button"]')!;
        fireEvent.click(button);

        expect(screen.getByText(JSON.stringify(mockFilterField[1]))).toBeInTheDocument();
    });
});
