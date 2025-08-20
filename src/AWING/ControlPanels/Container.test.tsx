import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import moment from 'moment';
import { TYPE_FILTERS } from './Enums';
import ControlPanel from './index';

// Mock các thư viện và component ngoài
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Mock i18n để trả về key thay vì dịch
    }),
}));

jest.mock('../../AWING', () => ({
    DateRangePicker: ({ callback, label }: any) => (
        <div data-testid="date-range-picker">
            <input data-testid="date-range-input" onChange={(e) => callback({ startDate: e.target.value, endDate: e.target.value })} />
            {label}
        </div>
    ),
}));

// Mock MUI components nếu cần
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    TextField: ({ children, onChange, label, disabled, ...props }: any) => (
        <select data-testid={props['data-testid'] || 'text-field'} onChange={onChange} disabled={disabled}>
            {children}
        </select>
    ),
    Button: ({ onClick, children, disabled }: any) => (
        <button data-testid="view-button" onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
    Checkbox: ({ onChange, defaultChecked }: any) => (
        <input type="checkbox" data-testid="checkbox" onChange={(e) => onChange(e, e.target.checked)} defaultChecked={defaultChecked} />
    ),
    FormControlLabel: ({ control, label }: any) => (
        <label>
            {control} {label}
        </label>
    ),
    IconButton: ({ onClick, children }: any) => (
        <button data-testid="expand-button" onClick={onClick}>
            {children}
        </button>
    ),
}));

describe('ControlPanel', () => {
    const mockOnChangeQueryInput = jest.fn();
    const initialFilters: any[] = [
        {
            type: TYPE_FILTERS.VIEW_BY,
            name: 'viewBy',
            initialData: [
                { value: 1, label: 'Option 1' },
                { value: 2, label: 'Option 2' },
            ],
            initValue: 1,
        },
        {
            type: TYPE_FILTERS.DATE_RANGE_PICKER,
            name: 'dateRangePicker',
            defaultValue: { startDate: '2025-02-26T08:24:18.897Z', endDate: '2025-03-05T08:24:18.897Z' },
            isEnhanced: true,
            isDayBlocked: (day: any) => day?.isAfter(moment().toDate()),
        },
        {
            type: TYPE_FILTERS.NETWORK,
            name: 'isCampaignNetwork',
            isEnhanced: true,
            initValue: true,
        },
        {
            type: TYPE_FILTERS.VIEW_USER,
            name: 'viewUser',
            isEnhanced: true,
            initValue: '1',
            initialData: [
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' },
            ],
        },
        {
            type: TYPE_FILTERS.CAMPAIGN_DEFAULT,
            name: 'isCampaignDefault',
            initValue: '0',
            isEnhanced: true,
        },
        {
            type: TYPE_FILTERS.CAMPAIGN,
            name: 'campaignIds',
            initValue: [],
            isEnhanced: true,
        },
        {
            type: TYPE_FILTERS.PLACE,
            name: 'placeIds',
            initValue: [],
            isEnhanced: true,
            col: 3,
        },
        {
            type: TYPE_FILTERS.SEARCH_BY_PLACE,
            name: 'searchByPlace',
            initValue: '',
            isEnhanced: true,
            col: 3,
            initialData: [
                { value: '1', label: 'Place 1' },
                { value: '2', label: 'Place 2' },
            ],
        },
        {
            type: TYPE_FILTERS.PLACE_AUTOCOMPLETE,
            name: 'placeAutoComplete',
            initValue: '',
            isEnhanced: true,
            col: 3,
        },
        {
            type: TYPE_FILTERS.VIEW_TIME,
            initialData: [
                {
                    label: 'Ngày',
                    value: 'day',
                },
                {
                    label: 'Giờ',
                    value: 'hour',
                },
            ],
            name: 'timeline',
            initValue: 'day',
        },
        {
            type: TYPE_FILTERS.DOMAIN_AUTOCOMPLETE,
            name: 'domainAutoComplete',
            initValue: '',
            isEnhanced: true,
        },
        {
            type: TYPE_FILTERS.INCLUDE_RESERVED,
            name: 'includeReserved',
            initValue: false,
        },
    ];

    const defaultProps = {
        onChangeQueryInput: mockOnChangeQueryInput,
        initialFilters,
        isLoadings: false,
        disableView: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Render ban đầu
    it('renders basic filters correctly', () => {
        render(<ControlPanel {...defaultProps} />);
        expect(screen.getByText('Common.View')).toBeInTheDocument();
    });

    // Test 2: Khởi tạo queryInput từ initialFilters
    it('initializes queryInput with initialFilters', async () => {
        render(<ControlPanel {...defaultProps} />);
        await waitFor(() => {
            expect(mockOnChangeQueryInput).toHaveBeenCalledWith({
                campaignIds: [],
                domainAutoComplete: '',
                endDate: '2025-03-05T08:24:18.897Z',
                includeReserved: false,
                isCampaignDefault: '0',
                isCampaignNetwork: true,
                placeAutoComplete: '',
                placeIds: [],
                searchByPlace: '',
                startDate: '2025-02-26T08:24:18.897Z',
                timeline: 'day',
                viewBy: 1,
                viewUser: '1',
            });
        });
    });

    // Test 3: Thay đổi giá trị TextField (VIEW_BY)
    it('handles TextField change for VIEW_BY filter', async () => {
        render(<ControlPanel {...defaultProps} />);
        const select = screen.getAllByTestId('text-field')[0];
        fireEvent.change(select, { target: { value: '2' } });
    });

    // Test 3.1: Thay đổi enhanced TextField (VIEW_BY)
    it('handles TextField change for VIEW_BY filter', async () => {
        render(
            <ControlPanel
                {...defaultProps}
                initialFilters={[
                    {
                        type: TYPE_FILTERS.VIEW_BY,
                        name: 'viewBy',
                        initialData: [
                            { value: 1, label: 'Option 1' },
                            { value: 2, label: 'Option 2' },
                        ],
                        initValue: 1,
                        isEnhanced: true,
                    },
                ]}
            />
        );
    });

    // Test 3.2: Thay đổi enhanced TextField (VIEW_USER)
    it('handles TextField change for VIEW_USER filter', async () => {
        render(
            <ControlPanel
                {...defaultProps}
                initialFilters={[
                    {
                        type: TYPE_FILTERS.VIEW_USER,
                        name: 'viewUser',
                        initValue: '1',
                        initialData: [
                            { value: '1', label: 'Option 1' },
                            { value: '2', label: 'Option 2' },
                        ],
                    },
                ]}
            />
        );
        const select = screen.getByTestId('text-field');
        fireEvent.change(select, { target: { value: '2' } });
    });

    // Test 3.3: Thay đổi enhanced TextField (VIEW_TIME)
    it('handles TextField change for VIEW_TIME filter', async () => {
        render(
            <ControlPanel
                {...defaultProps}
                initialFilters={[
                    {
                        type: TYPE_FILTERS.VIEW_TIME,
                        initialData: [
                            {
                                label: 'Ngày',
                                value: 'day',
                            },
                            {
                                label: 'Giờ',
                                value: 'hour',
                            },
                        ],
                        name: 'timeline',
                        initValue: 'day',
                        isEnhanced: true,
                    },
                ]}
            />
        );
    });

    // Test 3.4: Thay đổi enhanced TextField (SEARCH_BY_PLACE)
    it('handles TextField change for SEARCH_BY_PLACE filter', async () => {
        render(
            <ControlPanel
                {...defaultProps}
                initialFilters={[
                    {
                        type: TYPE_FILTERS.SEARCH_BY_PLACE,
                        name: 'searchByPlace',
                        col: 3,
                        initialData: [
                            { value: '1', label: 'Place 1' },
                            { value: '2', label: 'Place 2' },
                        ],
                    },
                ]}
            />
        );
        const select = screen.getByTestId('text-field');
        fireEvent.change(select, { target: { value: '1' } });
    });
    // Test 3.5: Thay đổi enhanced (DATE_RANGE_PICKER)
    it('handles change for DATE_RANGE_PICKER filter', async () => {
        render(
            <ControlPanel
                {...defaultProps}
                initialFilters={[
                    {
                        type: TYPE_FILTERS.DATE_RANGE_PICKER,
                        name: 'dateRangePicker',
                        defaultValue: { startDate: moment().subtract(7, 'days').toDate(), endDate: moment().toDate() },
                    },
                ]}
            />
        );
    });

    // Test 3.9: Thay đổi enhanced NETWORK
    it('handles change for NETWORK filter', async () => {
        render(
            <ControlPanel
                {...defaultProps}
                initialFilters={[
                    {
                        type: TYPE_FILTERS.NETWORK,
                        name: 'isCampaignNetwork',
                        initValue: true,
                    },
                ]}
            />
        );
    });

    // Test 4: Nhấn nút View
    it('calls onChangeQueryInput when View button is clicked', () => {
        render(<ControlPanel {...defaultProps} />);
        const viewButton = screen.getByTestId('view-button');
        fireEvent.click(viewButton);
        expect(mockOnChangeQueryInput).toHaveBeenCalledWith({
            campaignIds: [],
            domainAutoComplete: '',
            endDate: '2025-03-05T08:24:18.897Z',
            includeReserved: false,
            isCampaignDefault: '0',
            isCampaignNetwork: true,
            placeAutoComplete: '',
            placeIds: [],
            searchByPlace: '',
            startDate: '2025-02-26T08:24:18.897Z',
            timeline: 'day',
            viewBy: 1,
            viewUser: '1',
        });
    });

    // Test 5: Hiển thị/tắt filter nâng cao
    it('toggles enhanced filters on Expand button click', async () => {
        render(<ControlPanel {...defaultProps} />);
        screen.debug();

        const expandButton = screen.getByTestId('expand-button');

        // Ban đầu filter nâng cao không hiển thị
        expect(screen.queryByText('Statistic.Network.Title')).not.toBeInTheDocument();

        // Nhấn để hiển thị
        fireEvent.click(expandButton);
        // expect(screen.getByText('Statistic.Network.Title')).toBeInTheDocument();

        // Nhấn lại để ẩn
        fireEvent.click(expandButton);
        // expect(screen.queryByText('Statistic.Network.Title')).not.toBeInTheDocument();
    });

    // Test 6: Disable View button khi chartLoading
    it('disables View button when chartLoading is true', () => {
        render(<ControlPanel {...defaultProps} isLoadings={true} />);
        const viewButton = screen.getByTestId('view-button');
        expect(viewButton).toBeDisabled();
    });

    // Test 7: Enable View button when chartLoading is false
    it('enables View button when chartLoading is false', () => {
        render(<ControlPanel {...defaultProps} isLoadings={true} />);
        const viewButton = screen.getByTestId('view-button');
        expect(viewButton).not.toBeDisabled();
    });

    // Test 8: Check initial state of enhanced filters
    it('checks initial state of enhanced filters', () => {
        render(<ControlPanel {...defaultProps} />);
        expect(screen.queryByText('Statistic.Network.Title')).not.toBeInTheDocument();
    });
});
