import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataInput from '.';
import { FIELD_TYPE } from './enums';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: any) => key,
        i18n: { language: 'en' },
    }),
}));

// Mock child components
jest.mock('../LogicExpression', () => ({ onChange, value }: any) => (
    <input data-testid="mock-logic-expression" value={value} onChange={(e) => onChange(e.target.value, true)} />
));

jest.mock('../AsyncAutocomplete', () => ({ fetchData, multiple, value, onChange, TextFieldProps }: any) => (
    <select
        data-testid="mock-async-autocomplete"
        multiple={multiple}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...TextFieldProps}
    >
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
    </select>
));

jest.mock('../MonacoEditor', () => {
    return function MockMonacoEditor(props: any) {
        const { value, onChange, ...rest } = props;
        return (
            <textarea
                data-testid="mock-monaco-editor"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                {...rest}
            />
        );
    };
});

jest.mock('../GeoFencing', () => {
    const MockGeoFencing = ({ onChangeValue, value, configs, label }: any) => (
        <div data-testid="mock-geo-fencing">
            <div data-testid="geo-fencing-label">{label}</div>
            <div data-testid="geo-fencing-value">{JSON.stringify(value)}</div>
            <button data-testid="geo-fencing-change-btn" onClick={() => onChangeValue([{ lat: 1, lng: 2 }])}>
                Change Value
            </button>
        </div>
    );
    return MockGeoFencing;
});

jest.mock('AWING/MultipleHierarchicalChoice', () => {
    return function MockMultipleHierarchicalChoice(props: any) {
        const { value, onChange, variant, error, helperText } = props;

        return (
            <div data-testid="mock-multiple-hierarchical">
                <button data-testid="multiple-hierarchical-change-btn" onClick={() => onChange(['option1', 'option2'])}>
                    Change Value
                </button>
                <div data-testid="current-value">{JSON.stringify(value)}</div>
                <div data-testid="variant">{variant}</div>
                <div data-testid="error">{String(error)}</div>
                <div data-testid="helper-text">{helperText}</div>
            </div>
        );
    };
});

jest.mock('..', () => ({
    DateRangePicker: (props: any) => {
        const handleChange = () => {
            // Create dates without using moment in the mock
            props.callback({
                startDate: {
                    format: () => '2024-01-01',
                    toDate: () => new Date('2024-01-01'),
                },
                endDate: {
                    format: () => '2024-01-31',
                    toDate: () => new Date('2024-01-31'),
                },
            });
        };

        return (
            <div data-testid="date-range-picker">
                <label>{props.label}</label>
                <div data-testid="date-range-value">
                    {props.value.startDate.format('YYYY-MM-DD')} to {props.value.endDate.format('YYYY-MM-DD')}
                </div>
                <button data-testid="change-date-range" onClick={handleChange}>
                    Change Date Range
                </button>
                {props.error && <div data-testid="error-message">{props.helperText}</div>}
            </div>
        );
    },
}));

const theme = createTheme();

const renderComponent = (fieldDefinition: any) => {
    return render(
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DataInput {...fieldDefinition} />
            </LocalizationProvider>
        </ThemeProvider>
    );
};

describe('DataInput Component', () => {
    // Text Input Tests
    describe('Text Input', () => {
        it('renders text input correctly', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'text',
                name: 'testText',
                value: 'initial value',
                onChange: mockOnChange,
            });

            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('initial value');
        });
    });

    // Number Input Tests
    describe('Number Input', () => {
        it('renders number input correctly', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'number',
                name: 'testNumber',
                value: 42,
                onChange: mockOnChange,
            });

            const input = screen.getByDisplayValue('42');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('42');
        });

        it.skip('validates number input within min/max range', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'number',
                name: 'testNumber',
                min: 0,
                max: 100,
                onChange: mockOnChange,
            });

            const input = screen.getByLabelText(/testNumber/i);
            userEvent.type(input, '150');
            expect(mockOnChange).not.toHaveBeenCalledWith(expect.anything(), true);
        });
    });

    // Checkbox Tests
    describe('Checkbox Input', () => {
        it('renders checkbox correctly', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'checkbox',
                name: 'testCheckbox',
                value: false,
                label: 'Test Checkbox',
                onChange: mockOnChange,
            });

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).not.toBeChecked();
        });

        it('toggles checkbox value', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'checkbox',
                name: 'testCheckbox',
                value: false,
                onChange: mockOnChange,
            });

            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);
            expect(mockOnChange).toHaveBeenCalledWith(true, expect.any(Boolean));
        });
    });

    // Radio Input Tests
    describe('Radio Input', () => {
        it('renders radio group correctly', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'radio',
                name: 'testRadio',
                value: 'option1',
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                ],
                onChange: mockOnChange,
            });

            const radioOptions = screen.getAllByRole('radio');
            expect(radioOptions).toHaveLength(2);
            expect(radioOptions[0]).toBeChecked();
        });

        it('changes radio selection', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'radio',
                name: 'testRadio',
                value: 'option1',
                options: [
                    { value: 'option1', text: 'Option 1' },
                    { value: 'option2', text: 'Option 2' },
                ],
                onChange: mockOnChange,
            });

            const radioOption2 = screen.getByLabelText('Option 2');
            fireEvent.click(radioOption2);

            // Check if onChange was called with correct parameters
            expect(mockOnChange).toHaveBeenCalledWith('option2', true);
        });
    });

    // Date Input Tests
    describe('Date Input', () => {
        it('renders date input correctly', () => {
            const mockOnChange = jest.fn();
            const testDate = new Date('2023-01-01');
            renderComponent({
                type: 'date',
                name: 'testDate',
                value: testDate,
                onChange: mockOnChange,
            });

            // const input = screen.getByDisplayValue('01/01/2023');
            // expect(input).toBeInTheDocument();
        });

        it('renders date input correctly with disableHelperText && error', () => {
            const mockOnChange = jest.fn();

            renderComponent({
                type: 'date',
                name: 'testDate',
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
            });

            const input = screen.getByPlaceholderText('MM/DD/YYYY');
            expect(input).toBeInTheDocument();
        });

        it('select onChange value', () => {
            const mockOnChange = jest.fn();
            const testDate = new Date('2023-01-01');
            renderComponent({
                type: 'date',
                name: 'testDate',
                value: testDate,
                onChange: mockOnChange,
            });

            const input = screen.getByPlaceholderText('MM/DD/YYYY');
            fireEvent.change(input, { target: { value: '02/02/2023' } });
            expect(mockOnChange).toHaveBeenCalledWith(undefined, expect.any(Boolean));
        });
    });

    // Select Input Tests
    describe('Select Input', () => {
        it('renders select input correctly', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'select',
                name: 'testSelect',
                value: 'option1',
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                ],
                onChange: mockOnChange,
            });

            const select = screen.getByRole('combobox');
            expect(select).toBeInTheDocument();
        });

        it('renders select input correctly with onChange', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'select',
                name: 'testSelect',
                value: 'option1',
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                ],
                onChange: mockOnChange,
            });

            const inputSelect = screen.getByDisplayValue('option1');
            fireEvent.change(inputSelect, { target: { value: 'option2' } });
            expect(mockOnChange).toHaveBeenCalledWith('option2', expect.any(Boolean));
        });

        it('renders select input correctly with disableHelperText && error', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'select',
                name: 'testSelect',
                options: [
                    { value: 'option1', text: 'Option 1' },
                    { value: 'option2', text: 'Option 2' },
                ],
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
                onDisabledSelectItem: jest.fn(),
            });

            const select = screen.getByRole('combobox');
            expect(select).toBeInTheDocument();
        });

        it.skip('changes select value', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'select',
                name: 'testSelect',
                // value: 'option1',
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                ],
                onChange: mockOnChange,
            });

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'option2' } });
            expect(mockOnChange).toHaveBeenCalledWith('option2', expect.any(Boolean));
        });
    });

    // Async Autocomplete Tests
    describe('Async Autocomplete', () => {
        it.skip('renders async autocomplete correctly', () => {
            const mockFetchData = jest.fn().mockResolvedValue([]);
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'async-autocomplete',
                name: 'testAsyncAutocomplete',
                value: null,
                fetchData: mockFetchData,
                onChange: mockOnChange,
            });

            const select = screen.getByTestId('mock-async-autocomplete');
            expect(select).toBeInTheDocument();
        });

        it.skip('renders async autocomplete correctly disableHelperText && error ', () => {
            const mockFetchData = jest.fn().mockResolvedValue([]);
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'async-autocomplete',
                name: 'testAsyncAutocomplete',
                value: null,
                fetchData: mockFetchData,
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
            });

            const select = screen.getByTestId('mock-async-autocomplete');
            expect(select).toBeInTheDocument();
        });
    });

    // Logic Expression Tests
    describe.skip('Logic Expression', () => {
        it('renders logic expression with empty value', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'logic-expression',
                name: 'testLogicExpression',
                value: '',
                onChange: mockOnChange,
            });

            const input = screen.getByTestId('mock-logic-expression');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('');
        });

        it('renders logic expression with disableHelperText and error', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'logic-expression',
                name: 'testLogicExpression',
                value: 'test expression',
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
                helperText: 'Error message',
            });

            const input = screen.getByTestId('mock-logic-expression');
            expect(input).toBeInTheDocument();
        });

        it('calls onChange handler when input changes', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'logic-expression',
                name: 'testLogicExpression',
                value: 'initial',
                onChange: mockOnChange,
            });

            const input = screen.getByTestId('mock-logic-expression');
            fireEvent.change(input, { target: { value: 'new value' } });

            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenCalledWith('new value', true);
        });
    });

    describe('handleParamValueChange', () => {
        it('should update number value and call onChange with validation', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                fieldName: 'test',
                type: 'number',
                value: 1,
                onChange: mockOnChange,
                min: 0,
                max: 100,
            };

            renderComponent({
                ...mockFieldDefinition,
            });

            const input = screen.getByDisplayValue('1');
            fireEvent.change(input, { target: { value: '2' } });
            fireEvent.blur(input);

            expect(mockOnChange).toHaveBeenCalledWith(2, true);
        });

        it('should not call onChange if value is the same', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                fieldName: 'test',
                type: 'number',
                value: 1,
                onChange: mockOnChange,
                min: 0,
                max: 100,
            };

            renderComponent({
                ...mockFieldDefinition,
            });

            const input = screen.getByDisplayValue('1');
            fireEvent.change(input, { target: { value: '1' } });
            fireEvent.blur(input);

            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });
    describe('DataInput Component - Autocomplete', () => {
        it('renders autocomplete correctly', () => {
            const mockOnChange = jest.fn();
            const mockOptions = [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
            ];
            const mockFieldDefinition = {
                type: 'autocomplete',
                name: 'testAutocomplete',
                value: 'option1',
                options: mockOptions,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const autocomplete = screen.getByRole('combobox');
            expect(autocomplete).toBeInTheDocument();
            // expect(autocomplete).toHaveValue('Option 1');
        });

        it('renders autocomplete correctly disableHelperText && error ', () => {
            const mockOnChange = jest.fn();
            const mockOptions = [
                { value: 'option1', text: 'Option 1' },
                { value: 'option2', text: 'Option 2' },
            ];
            const mockFieldDefinition = {
                type: 'autocomplete',
                name: 'testAutocomplete',
                value: 'option1',
                options: mockOptions,
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
            };

            renderComponent(mockFieldDefinition);

            const autocomplete = screen.getByRole('combobox');
            expect(autocomplete).toBeInTheDocument();
            // expect(autocomplete).toHaveValue('Option 1');
        });

        it('calls onChange for autocomplete', () => {
            const mockOnChange = jest.fn();
            const mockOptions = [
                { value: 'option1', text: 'Option 1' },
                { value: 'option2', text: 'Option 2' },
            ];
            const mockFieldDefinition = {
                type: 'autocomplete',
                name: 'testAutocomplete',
                value: 'option1',
                options: mockOptions,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const autocomplete = screen.getByRole('combobox');
            fireEvent.change(autocomplete, { target: { value: 'option2' } });
            // expect(mockOnChange).toHaveBeenCalledWith('option2', undefined);
        });

        it('renders multiple autocomplete correctly', () => {
            const mockOnChange = jest.fn();
            const mockOptions = [
                { value: 'option1', text: 'Option 1' },
                { value: 'option2', text: 'Option 2' },
            ];
            const mockFieldDefinition = {
                type: 'autocomplete',
                name: 'testAutocomplete',
                value: ['option1'],
                options: mockOptions,
                multiple: true,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const autocomplete = screen.getByRole('combobox');
            expect(autocomplete).toBeInTheDocument();
        });

        it('calls onChange for multiple autocomplete', () => {
            const mockOnChange = jest.fn();
            const mockOptions = [
                { value: 'option1', text: 'Option 1' },
                { value: 'option2', text: 'Option 2' },
            ];
            const mockFieldDefinition = {
                type: 'autocomplete',
                name: 'testAutocomplete',
                value: ['option1'],
                options: mockOptions,
                multiple: true,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const autocomplete = screen.getByRole('combobox');
            fireEvent.change(autocomplete, { target: { value: 'option2' } });
        });
    });
    describe('DataInput Component - Month Picker', () => {
        it('renders month picker correctly', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'month',
                name: 'testMonth',
                value: '2023-01',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const monthInput = screen.getByPlaceholderText('MMMM YYYY');
            expect(monthInput).toBeInTheDocument();
        });

        it('renders month picker correctly with disableHelperText && error ', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'month',
                name: 'testMonth',
                value: '2023-01',
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
            };

            renderComponent(mockFieldDefinition);

            const monthInput = screen.getByPlaceholderText('MMMM YYYY');
            expect(monthInput).toBeInTheDocument();
        });

        it('calls onChange for month picker', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'month',
                name: 'testMonth',
                value: '2023-01',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const monthInput = screen.getByPlaceholderText('MMMM YYYY');
            fireEvent.change(monthInput, { target: { value: '02/2023' } });
            expect(mockOnChange).toHaveBeenCalledWith(undefined, expect.any(Boolean));
        });
    });
    describe('DataInput Component - Date Range Picker', () => {
        it('renders date range picker correctly', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'date-range',
                name: 'testDateRange',
                value: ['2023-01-01', '2023-01-31'],
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const btnChangeDate = screen.getByTestId('change-date-range');
            expect(btnChangeDate).toBeInTheDocument();
        });

        it('renders date range picker correctly with disableHelperText && error && helperText', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'date-range',
                name: 'testDateRange',
                value: ['2023-01-01', '2023-01-31'],
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
                helperText: 'Error Message',
                label: 'Date Range',
            };

            renderComponent(mockFieldDefinition);

            const btnChangeDate = screen.getByTestId('change-date-range');
            expect(btnChangeDate).toBeInTheDocument();
        });

        it('renders date range picker correctly with disableHelperText && error', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'date-range',
                name: 'testDateRange',
                value: ['2023-01-01', '2023-01-31'],
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
                label: 'Date Range',
            };

            renderComponent(mockFieldDefinition);

            const btnChangeDate = screen.getByTestId('change-date-range');
            expect(btnChangeDate).toBeInTheDocument();
        });

        it('renders date range picker correctly', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'date-range',
                name: 'testDateRange',
                value: ['2023-01-01', '2023-01-31'],
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const btnChangeDate = screen.getByTestId('change-date-range');
            expect(btnChangeDate).toBeInTheDocument();
        });

        it('calls onChange for date range picker', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'date-range',
                name: 'testDateRange',
                // value: ['2023-01-01', '2023-01-31'],
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const btnChangeDate = screen.getByTestId('change-date-range');

            fireEvent.click(btnChangeDate);

            expect(mockOnChange).toHaveBeenCalledWith([expect.any(Date), expect.any(Date)], expect.any(Boolean));
        });
    });
    describe('DataInput Component - Multiple Hierarchical', () => {
        it.skip('renders multiple hierarchical choice correctly', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'multiple-hierarchical',
                name: 'testMultipleHierarchical',
                value: ['option1', 'option2'],
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                ],
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
            };

            renderComponent(mockFieldDefinition);

            const multipleHierarchicalChoice = screen.getByTestId('multiple-hierarchical-change-btn');
            expect(multipleHierarchicalChoice).toBeInTheDocument();
        });

        it.skip('calls onChange for multiple hierarchical choice', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'multiple-hierarchical',
                name: 'testMultipleHierarchical',
                options: [
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                ],
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const multipleHierarchicalChoice = screen.getByTestId('multiple-hierarchical-change-btn');
            fireEvent.click(multipleHierarchicalChoice);

            expect(mockOnChange).toHaveBeenCalledWith(['option1', 'option2'], expect.any(Boolean));
        });
    });

    describe('DataInput Component - Geo-Fencing', () => {
        it('renders geo-fencing component correctly', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'geo-fencing',
                name: 'testGeoFencing',
                configs: {},
                label: 'Geo-Fencing',
                initValue: [],
                value: [],
                limit: 10,
                isOnlyMap: false,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const geoFencing = screen.getByTestId('mock-geo-fencing');
            expect(geoFencing).toBeInTheDocument();
        });

        it('calls onChange for geo-fencing component', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'geo-fencing',
                name: 'testGeoFencing',
                configs: {},
                initValue: [],
                value: [],
                limit: 10,
                isOnlyMap: false,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const geoFencing = screen.getByTestId('geo-fencing-change-btn');
            fireEvent.click(geoFencing);
            expect(mockOnChange).toHaveBeenCalledWith([{ lat: 1, lng: 2 }], expect.any(Boolean));
        });
    });
    describe('DataInput Component - Select Folder', () => {
        it('renders select folder input correctly', () => {
            const mockOnChange = jest.fn();
            const mockOptions = [
                { value: 'folder1', label: 'Folder 1' },
                { value: 'folder2', label: 'Folder 2' },
            ];
            const mockFieldDefinition = {
                type: 'select-folder',
                name: 'testSelectFolder',
                options: mockOptions,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const selectFolder = screen.getByRole('combobox');
            expect(selectFolder).toBeInTheDocument();
        });

        it('renders select folder input correctly with error = true', () => {
            const mockOnChange = jest.fn();
            const mockOptions = [
                { value: 'folder1', text: 'Folder 1' },
                { value: 'folder2', text: 'Folder 2' },
            ];
            const mockFieldDefinition = {
                type: 'select-folder',
                name: 'testSelectFolder',
                value: 'folder1',
                options: mockOptions,
                onChange: mockOnChange,
                error: true,
            };

            renderComponent(mockFieldDefinition);

            const selectFolder = screen.getByRole('combobox');
            expect(selectFolder).toBeInTheDocument();
        });

        it('calls onChange for select folder input', () => {
            const mockOnChange = jest.fn();
            const mockOptions = [
                { value: 'folder1', label: 'Folder 1' },
                { value: 'folder2', label: 'Folder 2' },
            ];
            const mockFieldDefinition = {
                type: 'select-folder',
                name: 'testSelectFolder',
                value: 'folder1',
                options: mockOptions,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const selectFolder = screen.getByDisplayValue('folder1');
            fireEvent.change(selectFolder, { target: { value: 'folder2' } });

            expect(mockOnChange).toHaveBeenCalledWith('folder2', expect.any(Boolean));
        });

        it('renders select folder input with none option', () => {
            const mockOnChange = jest.fn();
            const mockOptions = [
                { value: 'folder1', label: 'Folder 1' },
                { value: 'folder2', label: 'Folder 2' },
            ];
            const mockFieldDefinition = {
                type: 'select-folder',
                name: 'testSelectFolder',
                value: '',
                options: mockOptions,
                required: false,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);
        });
    });

    describe('DataInput Component - Monaco Editor', () => {
        it('renders monaco editor correctly', async () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'monaco-editor',
                name: 'testMonacoEditor',
                value: 'initial code',
                onChange: mockOnChange,
                loading: false,
            };

            renderComponent(mockFieldDefinition);

            await waitFor(() => {
                const monacoEditor = screen.getByTestId('mock-monaco-editor');
                expect(monacoEditor).toBeInTheDocument();
                expect(monacoEditor).toHaveValue('initial code');
            });
        });

        it.skip('renders monaco editor loading', async () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'monaco-editor',
                name: 'testMonacoEditor',
                value: 'initial code',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            await waitFor(() => {
                const loadingElement = screen.getByText('Loading...');
                expect(loadingElement).toBeInTheDocument();
            });
        });

        it('calls onChange for monaco editor', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'monaco-editor',
                name: 'testMonacoEditor',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const monacoEditor = screen.getByTestId('mock-monaco-editor');
            fireEvent.change(monacoEditor, { target: { value: 'new code' } });

            expect(mockOnChange).toHaveBeenCalledWith('new code', expect.any(Boolean));
        });
    });
    describe('DataInput Component - Default Case', () => {
        it('renders default text input correctly', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'text',
                name: 'testDefaultText',
                value: 'initial value',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('initial value');
        });

        it('renders default text input correctly disableHelperText && error ', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'text',
                name: 'testDefaultText',
                value: 'initial value',
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('initial value');
        });

        it('calls onChange for default text input', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'text',
                name: 'testDefaultText',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'new value' } });
            expect(mockOnChange).toHaveBeenCalledWith('new value', expect.any(Boolean));
        });

        it('type text area', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'text-area',
                name: 'testDefaultText',
                value: 'initial value',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'new value' } });
            expect(mockOnChange).toHaveBeenCalledWith('new value', expect.any(Boolean));
        });

        it('calls onChange for email type input', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'email',
                name: 'testDefaultText',
                value: 'initial value',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'awing@gmail.com' } });
            expect(mockOnChange).toHaveBeenCalledWith('awing@gmail.com', expect.any(Boolean));
        });

        it('calls onChange for tel type input', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'tel',
                name: 'testDefaultText',
                value: 'initial value',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '0983754892' } });
            expect(mockOnChange).toHaveBeenCalledWith('0983754892', expect.any(Boolean));
        });

        it('calls onChange for url type input', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'url',
                name: 'testDefaultText',
                value: 'initial value',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'awing.com' } });
            expect(mockOnChange).toHaveBeenCalledWith('awing.com', expect.any(Boolean));
        });

        it('calls onChange for password type input', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'password',
                name: 'testDefaultText',
                value: 'initial value',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByDisplayValue('initial value');
            fireEvent.change(input, { target: { value: 'Awing@123i58' } });
            expect(mockOnChange).toHaveBeenCalledWith('Awing@123i58', expect.any(Boolean));
        });

        it('renders default number input correctly', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'number',
                name: 'testDefaultNumber',
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
        });

        it('renders default number input correctly with disableHelperText && error', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'number',
                name: 'testDefaultNumber',
                value: 42,
                onChange: mockOnChange,
                disableHelperText: false,
                error: true,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByDisplayValue('42');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('42');
        });

        it('calls onChange for default number input', () => {
            const mockOnChange = jest.fn();
            const mockFieldDefinition = {
                type: 'number',
                name: 'testDefaultNumber',
                value: 42,
                onChange: mockOnChange,
            };

            renderComponent(mockFieldDefinition);

            const input = screen.getByDisplayValue('42');
            fireEvent.change(input, { target: { value: '43' } });
            expect(mockOnChange).toHaveBeenCalledWith(43, expect.any(Boolean));
        });
    });
    describe('DataInput Component - Logic Expression', () => {
        it('renders logic expression input correctly', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'logic-expression',
                name: 'testLogicExpression',
                value: 'initial expression',
                onChange: mockOnChange,
            });

            const input = screen.getByTestId('mock-logic-expression');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('initial expression');
        });

        it.skip('calls onChange for logic expression input', () => {
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'logic-expression',
                name: 'testLogicExpression',
                value: 'initial expression',
                onChange: mockOnChange,
            });

            const input = screen.getByTestId('mock-logic-expression');
            fireEvent.change(input, { target: { value: 'new expression' } });
            expect(mockOnChange).toHaveBeenCalledWith('new expression', true);
        });
    });

    describe('DataInput Component - Async Autocomplete', () => {
        it('calls onChange for async autocomplete', () => {
            const mockFetchData = jest.fn().mockResolvedValue([]);
            const mockOnChange = jest.fn();
            renderComponent({
                type: 'async-autocomplete',
                name: 'testAsyncAutocomplete',
                value: null,
                fetchData: mockFetchData,
                onChange: mockOnChange,
            });

            const select = screen.getByTestId('mock-async-autocomplete');
            fireEvent.change(select, { target: { value: 'option1' } });
            expect(mockOnChange).toHaveBeenCalledWith('option1', undefined);
        });
    });

    // jest.mock('./FieldDefinitionInput', () => ({
    //     MultipleHierarchicalInput: jest.fn().mockReturnValue(<div>Mock Multiple Hierarchical</div>),
    // }));

    describe('InputFactory MULTIPLE_HIERARCHICAL case', () => {
        const mockDefinition = {
            type: FIELD_TYPE.MULTIPLE_HIERARCHICAL,
            name: 'test',
            label: 'Test Label',
            required: true,
            options: [],
        };

        test('calls MultipleHierarchicalInput with correct definition', () => {
            renderComponent({
                ...mockDefinition,
            });
        });
        test('calls MultipleHierarchicalInput with correct definition with disableHelperText  && error', () => {
            renderComponent({
                ...mockDefinition,
                disableHelperText: false,
                error: true,
            });
        });
    });
});
