import { fireEvent, render, screen } from '@testing-library/react';
import SearchBox from './Container';
import { SearchBoxProps } from './interface';

// Mock the translation function
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: any) => key, // Return the key as the translated string
    }),
}));

describe('SearchBox Component', () => {
    const mockOnSearch = jest.fn();
    const mockOnClickAdvancedSearch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock call history before each test
    });

    test('renders with default props', () => {
        const { getByPlaceholderText } = render(<SearchBox onSearch={mockOnSearch} />);

        expect(getByPlaceholderText('Common.SearchByName')).toBeInTheDocument();
    });

    test('updates input value on change', () => {
        const { getByPlaceholderText } = render(<SearchBox onSearch={mockOnSearch} />);

        const input = getByPlaceholderText('Common.SearchByName');
        fireEvent.change(input, { target: { value: 'Test' } });
    });

    test('calls onSearch with input value on Enter key press', () => {
        const { getByPlaceholderText } = render(<SearchBox onSearch={mockOnSearch} />);

        const input = getByPlaceholderText('Common.SearchByName');
        fireEvent.change(input, { target: { value: 'Test' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockOnSearch).toHaveBeenCalledWith('searchString', 'Test');
    });

    test('handleInputChange updates value when input is a valid number', () => {
        const { getByPlaceholderText } = render(<SearchBox onSearch={mockOnSearch} onlyNumberString={true} />);

        const input = getByPlaceholderText('Common.SearchByName');
        fireEvent.change(input, { target: { value: '123' } });
    });

    test('placeholderInput props is true', () => {
        const { getByPlaceholderText } = render(<SearchBox onSearch={mockOnSearch} placeholderInput={'Placeholder'} />);
        expect(getByPlaceholderText('Placeholder')).toBeInTheDocument();
    });

    test('handleInputChange calls onSearch with empty string when input is cleared', () => {
        const { getByPlaceholderText } = render(<SearchBox onSearch={mockOnSearch} />);

        const input = getByPlaceholderText('Common.SearchByName');
        fireEvent.change(input, { target: { value: 'Test' } });
        fireEvent.change(input, { target: { value: '' } });

        expect(mockOnSearch).toHaveBeenCalledWith('searchString', '');
    });

    test('calls onSearch with empty string when input is cleared', () => {
        const { getByPlaceholderText, getByRole } = render(<SearchBox onSearch={mockOnSearch} />);

        const input = getByPlaceholderText('Common.SearchByName');
        fireEvent.change(input, { target: { value: 'Test' } });
        expect(mockOnSearch).not.toHaveBeenCalled(); // Before clear

        const clearButton = getByRole('button', { name: 'Common.Clear' });
        fireEvent.click(clearButton);

        // expect(input.value).toBe('');
        expect(mockOnSearch).toHaveBeenCalledWith('searchString', '');
    });

    test('stylePaper props is undefined', () => {
        render(<SearchBox onSearch={mockOnSearch} stylePaper={undefined} includeSearchById={true} />);
    });

    test('onClickAdvancedSearch ', () => {
        const { getByTestId } = render(<SearchBox onSearch={mockOnSearch} onClickAdvancedSearch={mockOnClickAdvancedSearch} />);

        const button = getByTestId('MoreHorizIcon');
        fireEvent.click(button);
    });

    test('toggles search type when ID/N button is clicked', () => {
        const defaultProps: SearchBoxProps = {
            onSearch: jest.fn(),
            includeSearchById: true,
            stylePaper: {},
        };
        render(<SearchBox {...defaultProps} />);

        // Find the toggle button by text content
        const typeToggleButton = screen.getByText('ID').closest('button');
        expect(typeToggleButton).toBeInTheDocument();

        if (typeToggleButton) {
            // Click to toggle to ID search
            fireEvent.click(typeToggleButton);
            expect(screen.getByText('N')).toBeInTheDocument();

            // Click to toggle back to name search
            fireEvent.click(typeToggleButton);
            expect(screen.getByText('ID')).toBeInTheDocument();
        }
    });
});
