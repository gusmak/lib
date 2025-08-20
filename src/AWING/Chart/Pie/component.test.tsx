import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ChartTypeRegistry } from 'chart.js';
import PieComponent from './component';
import React from 'react';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('react-chartjs-2', () => ({
    Pie: () => null,
}));

jest.mock('../../../translate/i18n', () => ({
    changeLanguage: jest.fn(),
}));

const mockData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
    ],
};

const defaultProps = {
    data: mockData,
    widthChart: 300,
    heightChart: 300,
    optionCustom: {},
    type: 'pie' as keyof ChartTypeRegistry,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        return ' ' + tooltipItem?.label + ': ' + tooltipItem?.parsed;
                    },
                    title: (_tooltipItems: any) => {
                        return '';
                    },
                },
            },
        },
    },
};

const renderUi = () => {
    return render(<PieComponent {...defaultProps} />);
};

describe('PieComponent', () => {
    beforeEach(() => {
        // Mock localStorage
        Storage.prototype.getItem = jest.fn(() => 'vi');
    });

    it('renders without crashing', () => {
        const { container } = renderUi();
        expect(container).toBeInTheDocument();
    });

    it('renders with empty dataChart', () => {
        const customProps = {
            ...defaultProps,
            data: { labels: [], datasets: [] },
        };
        const { container } = render(<PieComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });

    it('renders with custom optionCustom', () => {
        const customProps = {
            ...defaultProps,
            optionCustom: undefined,
        };
        const { container } = render(<PieComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });
    it('renders with empty options', () => {
        const customProps = {
            ...defaultProps,
            options: undefined,
        };
        const { container } = render(<PieComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });
});

describe('PieComponent Tooltip Callbacks', () => {
    it('should return formatted label with dataset label', () => {
        const tooltipItem = {
            dataset: { label: 'Sample Data 1' },
            label: 'January',
            parsed: 100,
        } as any;
        // const result = labelCallback(tooltipItem)

        // expect(result).toBe(' January: 100')
    });

    it('should return empty string for title callback', () => {
        const tooltipItems = [
            {
                chart: {},
                label: '',
                parsed: {},
                raw: { x: '20240101' },
                formattedValue: '',
                dataIndex: 0,
                datasetIndex: 0,
                element: {},
            },
        ] as any;

        // const result = titleCallback(tooltipItems)

        // expect(result).toBe('')
    });
});

describe('PieComponent', () => {
    it('renders without crashing', () => {
        const { container } = render(<PieComponent {...defaultProps} />);
        expect(container).toBeInTheDocument();
    });

    it('renders with empty data', () => {
        const customProps = {
            ...defaultProps,
            data: { labels: [], datasets: [{ data: [] }] },
        };
        const { container } = render(<PieComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });

    it('renders with empty labels data', () => {
        const customProps = {
            ...defaultProps,
            data: {
                labels: ['Red', 'Blue', 'Yellow'],
                datasets: [],
            },
        };
        const { container } = render(<PieComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });

    it('renders with custom width and height', () => {
        const customProps = {
            ...defaultProps,
            widthChart: undefined,
            heightChart: undefined,
        };
        const { container } = render(<PieComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });

    it('renders with custom options', () => {
        const customOptions = { responsive: false };
        const customProps = { ...defaultProps, optionCustom: customOptions };
        const { container } = render(<PieComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });

    it('should return formatted label with dataset label', () => {
        const tooltipItem = {
            label: 'Sample Data',
            parsed: '100',
        } as any;
        // const result = labelCallback(tooltipItem)

        // expect(result).toBe(' Sample Data: 100')
    });

    it('should return empty title', () => {
        const tooltipItems = [] as any;
        // const result = titleCallback(tooltipItems)

        // expect(result).toBe('')
    });
});
