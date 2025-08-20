import { render, fireEvent, screen, waitFor, within } from '@testing-library/react';
import AreaSelectField from './container';
import { act } from 'react';

describe('AreaSelectField', () => {
    const mockOnChange = jest.fn((...p: any) => {
        console.log('dfsdfsd', p);
    });
    const initValue = [
        { code: '1', name: 'Area 1', type: 1, parentUnitCode: '' },
        { code: '2', name: 'Area 2', type: 2, parentUnitCode: '' },
        { code: '3', name: 'Area 3', type: 3, parentUnitCode: '' },
        { code: '4', name: 'Area 4', type: 2, parentUnitCode: '2' },
    ];
    const inputParameter = [
        { code: '1', name: 'Area 1', type: 1, parentUnitCode: '' },
        { code: '2', name: 'Area 2', type: 2, parentUnitCode: '' },
        { code: '3', name: 'Area 3', type: 3, parentUnitCode: '' },
    ];
    const placeholders = ['Select Area 1', 'Select Area 2', 'Select Area 3'];

    const defaultProps = {
        initValue,
        label: 'Test Label',
        placeholders,
        inputParameter,
        onChange: mockOnChange,
    };
    const renderUi = async () =>
        await act(async () => {
            render(<AreaSelectField {...defaultProps} />);
        });
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with initial values', async () => {
        await renderUi();
        await waitFor(() => {
            expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
            expect(screen.getByText('Area 1')).toBeInTheDocument();
        });
    });

    it('handles removing an option', async () => {
        await renderUi();
        const autocomplete = screen.getByRole('combobox');
        fireEvent.change(autocomplete, { target: { value: '' } });
        fireEvent.keyDown(autocomplete, { key: 'Backspace' });
        expect(mockOnChange).toHaveBeenCalled();
    });

    it('handles clearing all options', async () => {
        await renderUi();
        const clearButton = screen.getByLabelText('Clear');
        fireEvent.click(clearButton);
        expect(mockOnChange).toHaveBeenCalledWith([]);
    });

    it('handles selecting a new option', async () => {
        await renderUi();
        const autocomplete = screen.getByRole('combobox');
        fireEvent.change(autocomplete, { target: { value: 'Area' } });
        fireEvent.click(screen.getAllByRole('option')[2]);
        expect(mockOnChange).toHaveBeenCalled();
    });

    it('updates placeholder based on selection level', async () => {
        await renderUi();
        screen.getAllByTestId('CancelIcon').forEach((icon) => {
            fireEvent.click(icon);
        });
    });
});
