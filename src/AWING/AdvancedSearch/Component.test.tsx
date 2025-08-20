import { fireEvent, render, screen } from '@testing-library/react';
import AdvancedSearch from './Container';
import { AdvancedSearchProps } from './Types';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../ButtonSelect', () => ({
    __esModule: true,
    default: ({ onChangeSelected, children }: any) => {
        return (
            <div>
                <button onClick={onChangeSelected} data-testid="ButtonSelect-onChangeSelected" />
                {children}
            </div>
        );
    },
}));

jest.mock('../ButtonDateRangePicker', () => ({
    __esModule: true,
    default: ({ onChangeDate, children }: any) => {
        return (
            <div>
                <button onClick={onChangeDate} data-testid="ButtonSelect-onChangeSelected" />
                {children}
            </div>
        );
    },
}));

jest.mock('../EnhancedAutoComplete', () => ({
    __esModule: true,
    default: ({ onChangeValue }: any) => {
        return <div>{onChangeValue()}</div>;
    },
}));

jest.mock('../DirectoryTree', () => ({
    __esModule: true,
    default: ({ onChange }: any) => {
        return <div>{onChange()}</div>;
    },
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Chip: ({ label, onDelete }: any) => (
        <span>
            {label} {onDelete()}
        </span>
    ),
}));

describe('AdvancedSearch', () => {
    const defaultProps: AdvancedSearchProps<string> = {
        expanded: true,
        value: {},
        fields: [],
        onChangeValue: jest.fn(),
        onClear: jest.fn(),
    };

    jest.mock('Helpers', () => ({
        dateToString: jest.fn((date) => date.toISOString().split('T')[0]),
    }));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when expanded is false', () => {
        render(<AdvancedSearch {...defaultProps} expanded={false} />);
        expect(screen.queryByRole('header')).not.toBeInTheDocument();
    });

    it('should render clear button when onClear prop is provided', () => {
        render(<AdvancedSearch {...defaultProps} />);
        const clearButton = screen.getByText('Common.Clear');
        expect(clearButton).toBeInTheDocument();
    });

    it('should not render clear button when onClear prop is not provided', () => {
        render(<AdvancedSearch {...defaultProps} onClear={undefined} />);
        expect(screen.queryByText('Common.Clear')).not.toBeInTheDocument();
    });

    test('renders select field error', () => {
        const selectField = {
            fieldName: 'status',
            type: 'select' as 'select',
            label: 'Status',
            options: undefined,
        };

        render(
            <AdvancedSearch
                {...defaultProps}
                fields={[selectField]}
                value={{
                    status: {
                        value: 'active',
                    },
                }}
            />
        );
        expect(screen.getByText('Common.Clear')).toBeInTheDocument();
    });

    test('renders directory field correctly', () => {
        const directoryField = {
            fieldName: 'directory',
            type: 'directory' as 'directory',
            label: 'Directory',
            rootId: '1',
            options: [
                { value: '1', text: 'Root' },
                { value: '2', text: 'Child' },
            ],
        };

        render(
            <AdvancedSearch
                {...defaultProps}
                fields={[directoryField]}
                value={{
                    directory: {
                        value: '1',
                    },
                }}
            />
        );

        expect(screen.getByText('directory')).toBeInTheDocument();
    });

    test('renders directory field with undefined option', () => {
        const directoryField = {
            fieldName: 'directory',
            type: 'directory' as 'directory',
            label: 'Directory',
            rootId: '',
            options: undefined,
        };

        render(<AdvancedSearch {...defaultProps} fields={[directoryField]} value={{ directory: { value: '1' } }} />);
    });
    test('renders text field correctly', () => {
        const directoryField = {
            fieldName: 'text',
            type: 'text' as 'text',
            label: 'Directory',
            rootId: '',
            options: undefined,
        };

        render(<AdvancedSearch {...defaultProps} fields={[directoryField]} value={{ directory: { value: '1' } }} />);
    });

    it('should render autocomplete with value is undefined', () => {
        const autocompleteField = {
            fieldName: 'user',
            type: 'autocomplete' as const,
            label: 'User',
            options: [
                { value: '1', text: 'User 1' },
                { value: '2', text: 'User 2' },
            ],
        };

        render(
            <AdvancedSearch
                {...defaultProps}
                fields={[autocompleteField]}
                // value={undefined}
            />
        );
    });
    it('should render autocomplete with option is undefined', () => {
        const autocompleteField = {
            fieldName: 'user',
            type: 'autocomplete' as const,
            label: 'User',
            options: undefined,
        };

        render(<AdvancedSearch {...defaultProps} fields={[autocompleteField]} value={{ user: { value: '1' } }} />);
    });

    it('should render autocomplete', () => {
        const autocompleteField = {
            fieldName: 'user',
            type: 'autocomplete' as const,
            label: 'User',
            options: [
                { value: '1', text: 'User 1' },
                { value: '2', text: 'User 2' },
            ],
        };

        render(<AdvancedSearch {...defaultProps} fields={[autocompleteField]} value={{ user: { value: '' } }} />);
    });

    test('renders date-range field correctly', () => {
        const dateRangeField = {
            fieldName: 'dateRange',
            type: 'date-range' as 'date-range',
            label: 'Date Range',
        };

        render(
            <AdvancedSearch {...defaultProps} fields={[dateRangeField]} value={{ dateRange: { value: ['2023-01-01', '2023-12-31'] } }} />
        );
    });
    test('renders date-range field with undefined value', () => {
        const dateRangeField = {
            fieldName: 'dateRange',
            type: 'date-range' as 'date-range',
            label: 'Date Range',
        };

        render(<AdvancedSearch {...defaultProps} fields={[dateRangeField]} value={undefined} />);
    });

    describe('Field Types', () => {
        it('should render select field correctly', () => {
            const selectField = {
                fieldName: 'status',
                type: 'select' as const,
                label: 'Status',
                options: [
                    { value: 'active', text: 'Active' },
                    { value: 'inactive', text: 'Inactive' },
                ],
            };

            render(<AdvancedSearch {...defaultProps} fields={[selectField]} />);
        });

        it('should render autocomplete field correctly', () => {
            const autocompleteField = {
                fieldName: 'user',
                type: 'autocomplete' as const,
                label: 'User',
                options: [
                    { value: '1', text: 'User 1' },
                    { value: '2', text: 'User 2' },
                ],
            };

            render(<AdvancedSearch {...defaultProps} fields={[autocompleteField]} />);
        });

        it('should render date-range field correctly', () => {
            const dateRangeField = {
                fieldName: 'dateRange',
                type: 'date-range' as const,
                label: 'Date Range',
            };

            render(<AdvancedSearch {...defaultProps} fields={[dateRangeField]} />);
        });

        it('should render directory field correctly', () => {
            const directoryField = {
                fieldName: 'directory',
                type: 'directory' as const,
                label: 'Directory',
                rootId: '1',
                options: [
                    { value: '1', text: 'Dir 1' },
                    { value: '2', text: 'Dir 2' },
                ],
            };

            render(<AdvancedSearch {...defaultProps} fields={[directoryField]} />);
        });
    });

    describe('Chips', () => {
        it('should render chips for selected values', () => {
            const fields = [
                {
                    fieldName: 'status',
                    type: 'select' as const,
                    label: 'Status',
                    options: [
                        { value: 'active', text: 'Active' },
                        { value: 'inactive', text: 'Inactive' },
                    ],
                },
            ];
            const value = { status: 'active' };

            render(<AdvancedSearch {...defaultProps} fields={fields} value={{ status: { value: 'active' } }} />);
            expect(screen.getByText('Status')).toBeInTheDocument();
        });
    });

    describe('Value Changes', () => {
        it('should handle select field value changes', () => {
            const fields = [
                {
                    fieldName: 'status',
                    type: 'select' as const,
                    label: 'Status',
                    options: [
                        { value: 'active', text: 'Active' },
                        { value: 'inactive', text: 'Inactive' },
                    ],
                },
            ];
            const onChangeValue = jest.fn();

            render(<AdvancedSearch {...defaultProps} fields={fields} onChangeValue={onChangeValue} />);
        });

        it('should handle clear button click', () => {
            const onClear = jest.fn();
            render(<AdvancedSearch {...defaultProps} onClear={onClear} />);

            const clearButton = screen.getByText('Common.Clear');
            fireEvent.click(clearButton);

            expect(onClear).toHaveBeenCalled();
        });
    });
});
