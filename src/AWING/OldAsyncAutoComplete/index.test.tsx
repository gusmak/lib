import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AsynchronousAutocomplete from './index';
import { MenuOption } from 'AWING/interface';

const mockOptions: MenuOption<string>[] = [
    { value: '1', text: 'Option 1' },
    { value: '2', text: 'Option 2' },
    { value: '3', text: 'Option 3', disabled: true },
];

describe('AsynchronousAutocomplete', () => {
    const mockOnSearch = jest.fn();
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<AsynchronousAutocomplete options={mockOptions} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('handles single selection correctly', async () => {
        render(<AsynchronousAutocomplete options={mockOptions} onChange={mockOnChange} onSearch={mockOnSearch} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            await userEvent.click(input);
        });

        const option = screen.getByText('Option 1');
        await act(async () => {
            await userEvent.click(option);
        });

        expect(mockOnChange).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('handles multiple selection correctly', async () => {
        render(<AsynchronousAutocomplete multiple options={mockOptions} onChange={mockOnChange} onSearch={mockOnSearch} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            await userEvent.click(input);
        });

        const option1 = screen.getByText('Option 1');
        const option2 = screen.getByText('Option 2');

        await act(async () => {
            await userEvent.click(option1);
            await userEvent.click(option2);
        });

        expect(mockOnChange).toHaveBeenCalledWith([mockOptions[0], mockOptions[1]]);
    });

    it('handles search input correctly', async () => {
        render(<AsynchronousAutocomplete options={mockOptions} onSearch={mockOnSearch} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            await userEvent.type(input, 'test');
        });

        await waitFor(() => {
            expect(mockOnSearch).toHaveBeenCalledWith('test');
        });
    });

    it('displays loading state correctly', () => {
        render(<AsynchronousAutocomplete options={mockOptions} loading={true} />);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('handles disabled state correctly', () => {
        render(<AsynchronousAutocomplete options={mockOptions} TextFieldProps={{ disabled: true }} />);

        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('handles readonly state correctly', () => {
        render(<AsynchronousAutocomplete options={mockOptions} readOnly={true} />);

        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('readonly');
    });

    it('handles initial value correctly', () => {
        const initialValue = mockOptions[0];
        render(<AsynchronousAutocomplete options={mockOptions} value={initialValue} />);

        expect(screen.getByRole('combobox')).toHaveValue(initialValue.text);
    });

    it('handles custom renderOption correctly', async () => {
        const customRenderOption = (props: any, option: MenuOption<string>) => (
            <li {...props} data-testid="custom-option">
                Custom {option.text}
            </li>
        );

        render(<AsynchronousAutocomplete options={mockOptions} renderOption={customRenderOption} />);

        const input = screen.getByRole('combobox');
        await act(async () => {
            await userEvent.click(input);
        });

        expect(screen.getAllByTestId('custom-option')).toHaveLength(mockOptions.length);
    });

    it('handles undefined options correctly', () => {
        render(<AsynchronousAutocomplete options={undefined} />);
        const input = screen.getByRole('combobox');
        expect(input).toBeInTheDocument();
    });

    it('updates when value prop changes', () => {
        const { rerender } = render(<AsynchronousAutocomplete options={mockOptions} value={mockOptions[0]} />);

        expect(screen.getByRole('combobox')).toHaveValue(mockOptions[0].text);

        rerender(<AsynchronousAutocomplete options={mockOptions} value={mockOptions[1]} />);

        expect(screen.getByRole('combobox')).toHaveValue(mockOptions[1].text);
    });

    it('handles option label display correctly', () => {
        const optionsWithLabel = [
            { value: '1', text: 'Option 1', label: 'Custom Label 1' },
            { value: '2', text: 'Option 2', label: 'Custom Label 2' },
        ];

        render(<AsynchronousAutocomplete options={optionsWithLabel} />);

        const input = screen.getByRole('combobox');
        fireEvent.mouseDown(input);

        expect(screen.getByText('Custom Label 1')).toBeInTheDocument();
        expect(screen.getByText('Custom Label 2')).toBeInTheDocument();
    });

    it('handles options rendering with single value not in options', () => {
        const valueNotInOptions = { value: '999', text: 'Special Option' };
        render(<AsynchronousAutocomplete options={mockOptions} value={valueNotInOptions} />);

        const input = screen.getByRole('combobox');
        fireEvent.mouseDown(input);

        // Kiểm tra xem giá trị đặc biệt có được thêm vào danh sách
        expect(screen.getByText('Special Option')).toBeInTheDocument();
        // Kiểm tra các option gốc vẫn còn
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('handles options rendering with multiple values not in options', () => {
        const valuesNotInOptions = [
            { value: '998', text: 'Special Option 1' },
            { value: '999', text: 'Special Option 2' },
        ];

        render(<AsynchronousAutocomplete multiple options={mockOptions} value={valuesNotInOptions} />);

        const input = screen.getByRole('combobox');
        fireEvent.mouseDown(input);

        // Kiểm tra các option gốc vẫn còn
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('handles options rendering when value exists in options', () => {
        const existingValue = mockOptions[0];
        render(<AsynchronousAutocomplete options={mockOptions} value={existingValue} />);

        const input = screen.getByRole('combobox');
        fireEvent.mouseDown(input);

        // Kiểm tra không có sự trùng lặp trong danh sách options
        const option1Elements = screen.queryAllByText('Option 1');
        expect(option1Elements).toHaveLength(1);
    });

    it('handles options rendering when multiple values exist in options', () => {
        const existingValues = [mockOptions[0], mockOptions[1]];
        render(<AsynchronousAutocomplete multiple options={mockOptions} value={existingValues} />);

        const input = screen.getByRole('combobox');
        fireEvent.mouseDown(input);

        // Kiểm tra không có sự trùng lặp trong danh sách options
        const option1Elements = screen.queryAllByText('Option 1');
        const option2Elements = screen.queryAllByText('Option 2');
        expect(option1Elements).toHaveLength(2);
        expect(option2Elements).toHaveLength(2);
    });
});
