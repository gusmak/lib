import { ThemeProvider, createTheme } from '@mui/material';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import DataForm from './container';

const theme = createTheme();

describe('DataForm Component', () => {
    // Mock data
    const mockFields: any = [
        {
            fieldName: 'name',
            label: 'Name',
            required: true,
            type: 'text',
            onChange: () => {},
        },
        {
            fieldName: 'age',
            label: 'Age',
            type: 'number',
            defaultValue: 18,
            onChange: () => {},
        },
        {
            fieldName: 'total',
            label: 'Total',
            type: 'number',
            autoFormula: '{price}*{quantity}',
            onChange: () => {},
        },
    ];

    const defaultProps = {
        fields: mockFields,
        onUpdate: jest.fn(),
    };

    const setup = (props = {}) => {
        return render(
            <ThemeProvider theme={theme}>
                <DataForm {...defaultProps} {...props} />
            </ThemeProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders with basic fields', () => {
        setup();
        expect(screen.getAllByRole('textbox')[0]).toBeInTheDocument();
        expect(screen.getByLabelText('Age')).toBeInTheDocument();
    });

    test('renders with caption and actions', () => {
        const caption = 'Test Form';
        const actions = <button>Save</button>;
        setup({ caption, actions });

        expect(screen.getByText(caption)).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    test('handles field changes', async () => {
        const onUpdate = jest.fn();
        setup({ onUpdate });

        await act(async () => {
            fireEvent.change(screen.getAllByRole('textbox')[0], {
                target: { value: 'John Doe' },
            });
        });

        expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe' }), expect.any(Boolean), 'name');
    });

    test('validates required fields', async () => {
        const onUpdate = jest.fn();
        setup({ onUpdate, checkAllRequiredFields: true });

        await act(async () => {
            fireEvent.change(screen.getAllByRole('textbox')[0], {
                target: { value: '' },
            });
        });

        expect(onUpdate).toHaveBeenCalledWith(expect.any(Object), false, expect.any(String));
    });

    test('handles custom field changes', async () => {
        const customeFieldChange = jest.fn().mockReturnValue({ age: 25 });
        const fieldsWithCustomChange = [
            {
                ...mockFields[0],
                customeFieldChange,
            },
        ];

        const onUpdate = jest.fn();
        setup({ fields: fieldsWithCustomChange, onUpdate });

        await act(async () => {
            fireEvent.change(screen.getAllByRole('textbox')[0], {
                target: { value: 'John Doe' },
            });
        });

        expect(customeFieldChange).toHaveBeenCalled();
        expect(onUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'John Doe',
                age: 25,
            }),
            expect.any(Boolean),
            expect.any(String)
        );
    });

    test('handles auto formula calculations', async () => {
        const fieldsWithFormula = [
            {
                fieldName: 'price',
                label: 'Price',
                type: 'number',
            },
            {
                fieldName: 'quantity',
                label: 'Quantity',
                type: 'number',
            },
            {
                fieldName: 'total',
                label: 'Total',
                type: 'number',
                autoFormula: '{price}*{quantity}',
            },
        ];

        const onUpdate = jest.fn();
        setup({ fields: fieldsWithFormula, onUpdate });

        await act(async () => {
            fireEvent.change(screen.getByLabelText('Price'), {
                target: { value: '10' },
            });
            fireEvent.change(screen.getByLabelText('Quantity'), {
                target: { value: '2' },
            });
        });

        expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ total: 20 }), expect.any(Boolean), expect.any(String));
    });

    test('handles form validation callback', async () => {
        const onValidateForm = jest.fn().mockReturnValue(true);
        const onUpdate = jest.fn();

        setup({ onValidateForm, onUpdate });

        await act(async () => {
            fireEvent.change(screen.getAllByRole('textbox')[0], {
                target: { value: 'John Doe' },
            });
        });

        expect(onValidateForm).toHaveBeenCalled();
        expect(onUpdate).toHaveBeenCalledWith(expect.any(Object), true, expect.any(String));
    });

    test('handles oldValue comparison', async () => {
        const oldValue = { name: 'John Doe', age: 25 };
        const onUpdate = jest.fn();

        setup({ oldValue, onUpdate });

        await act(async () => {
            fireEvent.change(screen.getByDisplayValue('John Doe'), {
                target: { value: 'John Doe' },
            });
        });

        // Should not include unchanged values in fieldsToUpdate
        expect(onUpdate).toHaveBeenCalledWith(expect.not.objectContaining({ name: 'John Doe' }), expect.any(Boolean), expect.any(String));
    });

    test('handles different padding options', () => {
        const { container: normalPadding } = setup({ padding: 'normal' });
        const { container: customPadding } = setup({ padding: 'custom' });

        expect(normalPadding.querySelector('div[class*="MuiPaper-root"]')).toBeInTheDocument();
        expect(customPadding.querySelector('div[class*="MuiPaper-root"]')).not.toBeInTheDocument();
    });
});
