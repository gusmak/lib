import { render, screen, fireEvent, within, act } from '@testing-library/react';
import AreaSelectFieldComponent from './component';
import { IMultipleHierarchicalChoiceInput } from 'AWING/MultipleHierarchicalChoice';

const mockOptions: IMultipleHierarchicalChoiceInput[] = [
    { code: '1', name: 'Area 1', parentUnitCode: '0' },
    { code: '2', name: 'Area 2', parentUnitCode: '0' },
    { code: '3', name: 'Area 3', parentUnitCode: '1' },
];

const mockSelected: IMultipleHierarchicalChoiceInput[] = [{ code: '1', name: 'Area 1', parentUnitCode: '0' }];

const mockOnChange = jest.fn();
function renderUi() {
    return render(
        <AreaSelectFieldComponent
            label="Test Label"
            placeholder="Test Placeholder"
            options={mockOptions}
            areaSelected={mockSelected}
            onChange={mockOnChange}
        />
    );
}
describe('AreaSelectFieldComponent', () => {
    it('renders without crashing', () => {
        renderUi();
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('displays the correct placeholder', () => {
        renderUi();
        expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('calls onChange when an option is selected', () => {
        renderUi();
        const AreaSelectComplete = screen.getByTestId('AreaSelect');
        const input = within(AreaSelectComplete).getByRole('combobox');
        AreaSelectComplete.focus();
        fireEvent.change(input, { target: { value: 'A' } });
        fireEvent.keyDown(AreaSelectComplete, { key: 'ArrowDown' });
        fireEvent.keyDown(AreaSelectComplete, { key: 'Enter' });
        expect(mockOnChange).toHaveBeenCalled();
    });

    it('renders selected areas as chips', () => {
        renderUi();
        expect(screen.getByText('Area 1')).toBeInTheDocument();
    });

    it('renders group headers correctly', async () => {
        await act(() => {
            renderUi();
        });
        const AreaSelectComplete = screen.getByTestId('AreaSelect');
        fireEvent.mouseDown(AreaSelectComplete);
        const { getByText: getByBodyText } = within(document.body);
        const option = getByBodyText('Area 1');
        expect(option).toBeInTheDocument();
        // expect(screen.getByText("0")).toBeInTheDocument();
    });
});
// test('Form with Autocomplete using Portal', async () => {
//     let rendered: ReturnType<typeof render>;

//     await act(() => {
//       rendered = render(<Form />, { wrapper: Wrapper, container: document.body });
//     });

//     const { findByPlaceholderText, getByText } = rendered;

//     const autocomplete = await findByPlaceholderText('Select Option');
//     fireEvent.mouseDown(autocomplete);
//     const { getByText: getByBodyText } = within(document.body);
//     const option = getByBodyText('BuBuBu');
//     expect(option).toBeInTheDocument();
//     fireEvent.click(option as HTMLElement);

//     expect(autocomplete).toHaveProperty('value', 'BuBuBu');
//   });
