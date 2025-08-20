import { render, screen } from '@testing-library/react';
import StatisticsContainer from './container';
import { TYPE_CHART } from './Enums';
import { TimelineType } from 'AWING/Chart/Enums';

// Mock các dependencies
jest.mock('@mui/material', () => ({
    Grid: ({ children, ...props }: any) => (
        <div data-testid="grid" {...props}>
            {children}
        </div>
    ),
    Paper: ({ children }: any) => <div data-testid="paper">{children}</div>,
}));

jest.mock('AWING/ContentHeader', () => () => <div data-testid="content-header">Header</div>);
jest.mock('AWING/Chart/BarLine/component', () => () => <div data-testid="bar-line-chart">Chart</div>);
jest.mock('react-helmet-async', () => ({
    HelmetProvider: ({ children }: any) => <div>{children}</div>,
    Helmet: ({ children }: any) => <div data-testid="helmet">{children}</div>,
}));
jest.mock('../../AWING', () => ({
    CircularProgress: () => <div data-testid="circular-progress">Loading</div>,
}));
jest.mock('../ControlPanels', () => () => <div data-testid="control-panel">Control Panel</div>);

describe('StatisticsContainer', () => {
    const defaultProps = {
        dataChart: [],
        onChangeQueryInput: jest.fn(),
        isLoadings: { chartLoading: false },
        initialFilters: [],
        configChart: { type: TYPE_CHART.BAR_LINE, options: {} },
        title: 'Test Title',
        timeline: TimelineType.Day,
        infoSX: {},
    };

    // Test case 1: Kiểm tra render với props cơ bản
    test('renders with basic props and title', () => {
        render(<StatisticsContainer {...defaultProps} />);
        expect(screen.getByTestId('content-header')).toBeInTheDocument();
        expect(screen.getByTestId('paper')).toBeInTheDocument();
        expect(screen.getByTestId('control-panel')).toBeInTheDocument();
    });

    // Test case 2: Hiển thị loading khi dataChart rỗng
    test('shows CircularProgress when dataChart is empty and not loading', () => {
        render(<StatisticsContainer {...defaultProps} />);

        expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
        expect(screen.queryByTestId('bar-line-chart')).not.toBeInTheDocument();
    });

    // Test case 3: Hiển thị BarLineComponent khi có data và không loading
    test('renders BarLineComponent when dataChart has data and not loading', () => {
        const propsWithData = {
            ...defaultProps,
            dataChart: [{ label: 'Test', data: [{ x: '2023', y: 100 }] }],
        };

        render(<StatisticsContainer {...propsWithData} />);

        expect(screen.getByTestId('bar-line-chart')).toBeInTheDocument();
        expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
    });

    // Test case 4: Hiển thị loading khi chart đang load
    test('shows CircularProgress when chart is loading', () => {
        const loadingProps = {
            ...defaultProps,
            dataChart: [{ label: 'Test', data: [{ x: '1', y: 100 }] }],
            isLoadings: { chartLoading: true },
        };

        render(<StatisticsContainer {...loadingProps} />);

        expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
        expect(screen.queryByTestId('bar-line-chart')).not.toBeInTheDocument();
    });
    // Test case 4.1: Hiển thị PieChart
    test('shows CircularProgress when chart is loading', () => {
        const loadingProps = {
            ...defaultProps,
            dataChart: [{ label: 'Test', data: [{ x: '1', y: 100 }] }],
            isLoadings: { chartLoading: false },
            configChart: { type: TYPE_CHART.PIE, options: {} },
        };

        render(<StatisticsContainer {...loadingProps} />);
    });

    // Test case 4.2: Hiển thị loading = undefined
    test('shows CircularProgress when chart is loading', () => {
        const loadingProps = {
            dataChart: [{ label: 'Test', data: [{ x: '1', y: 100 }] }],
            onChangeQueryInput: jest.fn(),
            isLoadings: { chartLoading: false },
            initialFilters: [],
            configChart: { type: TYPE_CHART.PIE, options: {} },
            title: 'Test Title',
            timeline: TimelineType.Day,
            infoSX: {},
        };

        render(<StatisticsContainer {...loadingProps} />);
    });

    // Test case 5: Render children khi được cung cấp
    test('renders children when provided', () => {
        const propsWithChildren = {
            ...defaultProps,
            children: <div data-testid="child-component">Child</div>,
        };

        render(<StatisticsContainer {...propsWithChildren} />);

        expect(screen.getByTestId('child-component')).toBeInTheDocument();
        expect(screen.getAllByTestId('grid')).toHaveLength(3);
    });

    // Test case 6: Không render title khi không được cung cấp
    test('does not render helmet when title is not provided', () => {
        const propsWithoutTitle = {
            ...defaultProps,
            title: '',
        };

        render(<StatisticsContainer {...propsWithoutTitle} />);

        expect(screen.queryByTestId('helmet')).not.toBeInTheDocument();
        expect(screen.getByTestId('content-header')).toBeInTheDocument();
    });
});
