import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ChartTypeRegistry } from 'chart.js';
import { TimelineType } from '../Enums';
import BarLineComponent, { getOrCreateLegendList, htmlLegendPlugin, labelCallback, titleCallback } from './component';
import moment from 'moment';
import { roundDecimalNumber } from '../../../Utils';
import { IChartJsContainer } from '../Types';

// Mock các dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: any) => key }),
}));

jest.mock('react-chartjs-2', () => ({
    Chart: () => null,
}));

jest.mock('../../../translate/i18n', () => ({
    changeLanguage: jest.fn(),
}));

const mockDataChart = [
    {
        type: 'line' as keyof ChartTypeRegistry,
        data: [1, 2, 3],
        label: 'Line Data',
        variant: 'primary',
    },
    {
        type: 'bar' as keyof ChartTypeRegistry,
        data: [3, 2, 1],
        label: 'Bar Data',
        variant: 'secondary',
    },
    {
        type: 'line-fill' as keyof ChartTypeRegistry,
        data: [3, 2, 1],
        label: 'Bar Data',
        variant: 'secondary',
    },
    {
        type: 'pie' as keyof ChartTypeRegistry,
        data: [3, 2, 1],
        label: 'Bar Data',
        variant: 'secondary',
    },
];

const defaultProps = {
    dataChart: mockDataChart,
    type: 'bar' as keyof ChartTypeRegistry,
    width: 500,
    height: 300,
    timeline: TimelineType.Day,
    optionCustom: {},
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    title(tooltipItems: any) {
                        //Sửa lại với thời gian theo giờ
                        const timeFormat = (tooltipItems[0].raw as any)?.x;
                        const isTimelineHour = timeFormat?.length > 8;
                        if (isTimelineHour) {
                            const timeText = moment(timeFormat, 'YYYYMMDDHH').format('HH[h] DD-MM-YYYY');
                            return 'Giờ' + ': ' + timeText;
                        } else {
                            const timeText = moment(timeFormat, 'YYYYMMDD').format('DD-MM-YYYY');
                            return 'Ngày' + ': ' + timeText;
                        }
                    },
                    label(tooltipItem: any) {
                        let labels = tooltipItem.dataset.label || '';
                        if (labels) {
                            labels = labels.split(' ').slice(0, -1).join(' ');
                        }

                        labels += ': ' + tooltipItem.formattedValue;

                        return ' ' + labels;
                    },
                },
            },
        },
        scales: {
            x: {
                time: {
                    parser: 'YYYYMMDDHH',
                },
            },
            y: {
                ticks: {
                    callback(tickValue: string | number) {
                        return roundDecimalNumber(tickValue);
                    },
                },
            },
        },
    },

    data: {
        labels: ['January', 'February', 'March'],
        datasets: [
            {
                label: 'News user',
                type: 'line' as keyof ChartTypeRegistry,
                data: [
                    { x: 0, y: 42 },
                    { x: 4, y: 32 },
                    { x: 33, y: 22 },
                ],
                fill: true,
                pointStyle: 'circle',
                yAxisID: 'y',
            },
        ],
    },
    optionsDefault: true,
};

const renderUi = () => {
    return render(<BarLineComponent {...defaultProps} />);
};

describe('BarLineComponent', () => {
    let legendContainer: any;
    beforeEach(() => {
        // Mock localStorage
        Storage.prototype.getItem = jest.fn(() => 'vi');
        document.body.innerHTML = '';
        legendContainer = document.createElement('div');
        legendContainer.id = 'legend-container';
        document.body.appendChild(legendContainer);
    });

    it('renders without crashing', () => {
        renderUi();
        expect(document.getElementById('legend-container')).toBeInTheDocument();
    });

    it('creates legend list container when component mounts', () => {
        const { container } = renderUi();

        // Create legend container
        const legendContainer = document.createElement('div');
        legendContainer.id = 'legend-container';
        container.appendChild(legendContainer);

        // Call getOrCreateLegendList
        const list = getOrCreateLegendList('legend-container');

        expect(list).toBeInTheDocument();
        expect(list.tagName).toBe('UL');
        expect(list).toHaveStyle({
            display: 'flex',
            flexDirection: 'row',
            margin: '0',
            padding: '0',
        });
    });

    it('creates new list if not exists', () => {
        const div = document.createElement('div');
        div.id = 'test-legend';
        document.body.appendChild(div);

        const list = getOrCreateLegendList('test-legend');

        expect(list.tagName).toBe('UL');
        expect(div.contains(list)).toBeTruthy();
    });
});
describe('htmlLegendPlugin', () => {
    let chart: any;
    let legendContainer: any;
    beforeEach(() => {
        // Mock localStorage
        Storage.prototype.getItem = jest.fn(() => 'vi');
        document.body.innerHTML = '';
        legendContainer = document.createElement('div');
        legendContainer.id = 'legend-container';
        document.body.appendChild(legendContainer);

        // Mock chart object
        chart = {
            legend: {
                options: {
                    containerID: 'legend-container',
                },
            },
            data: {
                datasets: [
                    {
                        label: 'Dataset 1',
                        backgroundColor: 'red',
                        borderColor: 'red',
                        type: 'line',
                        pointStyle: 'circle',
                    },
                    {
                        label: 'Dataset 2',
                        backgroundColor: 'blue',
                        borderColor: 'blue',
                        type: 'bar',
                    },
                ],
            },
            canvas: document.createElement('canvas'),
            getDatasetMeta: jest.fn().mockReturnValue({
                hidden: false,
            }),
            update: jest.fn(),
            isDatasetVisible: jest.fn().mockReturnValue(true),
            toggleDataVisibility: jest.fn(),
            setDatasetVisibility: jest.fn(),
            config: {
                type: 'bar', // Add this line to mock the config property
            },
        };
    });

    it('should create legend items for each dataset', () => {
        // Mock generateLabels to return items
        chart.options = {
            plugins: {
                legend: {
                    labels: {
                        generateLabels: jest.fn().mockReturnValue([
                            {
                                text: 'Dataset 1',
                                fillStyle: 'red',
                                strokeStyle: 'red',
                                lineWidth: 1,
                                datasetIndex: 0,
                                hidden: false,
                                pointStyle: 'circle',
                            },
                            {
                                text: 'Dataset 2',
                                fillStyle: 'blue',
                                strokeStyle: 'blue',
                                lineWidth: 1,
                                datasetIndex: 1,
                                hidden: false,
                                pointStyle: 'circle',
                            },
                        ]),
                    },
                },
            },
        };

        htmlLegendPlugin.afterUpdate(chart, null, {
            containerID: 'legend-container',
        });

        const items = legendContainer.querySelectorAll('li');
        expect(items).toHaveLength(2);

        // Check first item
        expect(items[0]).toHaveTextContent('Dataset 1');
        expect(items[0].querySelector('div')).toHaveStyle({
            background: 'red',
            borderColor: 'red',
        });

        // Check second item
        expect(items[1]).toHaveTextContent('Dataset 2');
        expect(items[1].querySelector('div')).toHaveStyle({
            background: 'blue',
            borderColor: 'blue',
        });
    });

    it('should handle click events on legend items', () => {
        // Mock generateLabels to return items
        chart.options = {
            plugins: {
                legend: {
                    labels: {
                        generateLabels: jest.fn().mockReturnValue([
                            {
                                text: 'Dataset 1',
                                fillStyle: 'red',
                                strokeStyle: 'red',
                                lineWidth: 1,
                                datasetIndex: 0,
                                hidden: false,
                                pointStyle: 'circle',
                            },
                        ]),
                    },
                },
            },
        };

        htmlLegendPlugin.afterUpdate(chart, null, {
            containerID: 'legend-container',
        });

        const items = legendContainer.querySelectorAll('li');
        items[0].click();

        expect(chart.setDatasetVisibility).toHaveBeenCalled();
        expect(chart.update).toHaveBeenCalled();
    });

    it('should apply correct styles to legend items', () => {
        // Mock generateLabels to return items
        chart.options = {
            plugins: {
                legend: {
                    labels: {
                        generateLabels: jest.fn().mockReturnValue([
                            {
                                text: 'Dataset 1',
                                fillStyle: 'red',
                                strokeStyle: 'red',
                                lineWidth: 1,
                                datasetIndex: 0,
                                hidden: false,
                            },
                        ]),
                    },
                },
            },
        };

        htmlLegendPlugin.afterUpdate(chart, null, {
            containerID: 'legend-container',
        });

        const items = legendContainer.querySelectorAll('li');

        items.forEach((item: any) => {
            expect(item).toHaveStyle({
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '10px',
            });

            const boxSpan = item.querySelector('div');
            expect(boxSpan).toHaveStyle({
                display: 'inline-block',
                flexShrink: '0',
                height: '15px',
                marginRight: '15px',
                width: '15px',
            });
        });
    });

    it('should handle hidden datasets', () => {
        // Mock generateLabels to return items
        chart.options = {
            plugins: {
                legend: {
                    labels: {
                        generateLabels: jest.fn().mockReturnValue([
                            {
                                text: 'Dataset 1',
                                fillStyle: 'red',
                                strokeStyle: 'red',
                                lineWidth: 1,
                                datasetIndex: 0,
                                hidden: true,
                            },
                        ]),
                    },
                },
            },
        };

        htmlLegendPlugin.afterUpdate(chart, null, {
            containerID: 'legend-container',
        });

        const items = legendContainer.querySelectorAll('li');
        const firstItemText = items[0].querySelector('p');

        // Hidden dataset should have line-through text decoration
        expect(firstItemText).toHaveStyle({
            textDecoration: 'line-through',
        });
    });

    it('should update legend when datasets change', () => {
        // Mock generateLabels to return items
        chart.options = {
            plugins: {
                legend: {
                    labels: {
                        generateLabels: jest.fn().mockReturnValue([
                            {
                                text: 'Dataset 1',
                                fillStyle: 'red',
                                strokeStyle: 'red',
                                lineWidth: 1,
                                datasetIndex: 0,
                                hidden: false,
                            },
                            {
                                text: 'Dataset 2',
                                fillStyle: 'blue',
                                strokeStyle: 'blue',
                                lineWidth: 1,
                                datasetIndex: 1,
                                hidden: false,
                            },
                        ]),
                    },
                },
            },
        };

        // First render
        htmlLegendPlugin.afterUpdate(chart, null, {
            containerID: 'legend-container',
        });
        expect(legendContainer.querySelectorAll('li')).toHaveLength(2);

        // Update chart with new dataset
        chart.data.datasets.push({
            label: 'Dataset 3',
            backgroundColor: 'green',
            borderColor: 'green',
            type: 'line',
        });

        htmlLegendPlugin.afterUpdate(chart, null, {
            containerID: 'legend-container',
        });

        const items = legendContainer.querySelectorAll('li');
        expect(items).toHaveLength(2);
        expect(items[1]).toHaveTextContent('Dataset 2');
    });
    it('should handle click events on legend items for pie/doughnut charts', () => {
        // Mock generateLabels to return items
        chart.config = { type: 'pie' };
        chart.options = {
            plugins: {
                legend: {
                    labels: {
                        generateLabels: jest.fn().mockReturnValue([
                            {
                                text: 'Dataset 1',
                                fillStyle: 'red',
                                strokeStyle: 'red',
                                lineWidth: 1,
                                datasetIndex: 0,
                                hidden: false,
                                index: 0,
                            },
                        ]),
                    },
                },
            },
        };

        htmlLegendPlugin.afterUpdate(chart, null, {
            containerID: 'legend-container',
        });

        const items = legendContainer.querySelectorAll('li');
        items[0].click();

        expect(chart.toggleDataVisibility).toHaveBeenCalledWith(0);
        expect(chart.update).toHaveBeenCalled();
    });

    it('should handle click events on legend items for non-pie/doughnut charts', () => {
        // Mock generateLabels to return items
        chart.config = { type: 'bar' };
        chart.options = {
            plugins: {
                legend: {
                    labels: {
                        generateLabels: jest.fn().mockReturnValue([
                            {
                                text: 'Dataset 1',
                                fillStyle: 'red',
                                strokeStyle: 'red',
                                lineWidth: 1,
                                datasetIndex: 0,
                                hidden: false,
                            },
                        ]),
                    },
                },
            },
        };

        htmlLegendPlugin.afterUpdate(chart, null, {
            containerID: 'legend-container',
        });

        const items = legendContainer.querySelectorAll('li');
        items[0].click();

        expect(chart.setDatasetVisibility).toHaveBeenCalledWith(0, false);
        expect(chart.update).toHaveBeenCalled();
    });
});
describe('Tooltip title callback', () => {
    it('should return formatted title based on day timeline', () => {
        const tooltipItems = [{ raw: { x: '20240101' } }];
        const titleCallback = defaultProps.options.plugins.tooltip.callbacks.title;

        renderUi();

        // Call the title callback
        const titleResult = titleCallback(tooltipItems);

        // Expect the result to match the date format for day timeline
        expect(titleResult).toBe('Ngày: 01-01-2024');
    });
});
describe('Tooltip Callbacks', () => {
    it('should return formatted title for day timeline', () => {
        // const tooltipItems = [{ raw: { x: '20240101' } }]
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

        const result = titleCallback(tooltipItems);

        // Check if the formatted output matches
        expect(result).toBe('Day: 01-01-2024');
    });

    it('should return formatted title for hour timeline', () => {
        const tooltipItems = [{ raw: { x: '2024010108' } }] as any;
        const result = titleCallback(tooltipItems);

        expect(result).toBe('Hour: 08h 01-01-2024');
    });

    it('should return formatted label with dataset label', () => {
        const tooltipItem = {
            dataset: { label: 'Sample Data 1 Total' },
            formattedValue: '100',
        } as any;
        const result = labelCallback(tooltipItem);

        expect(result).toBe(' Sample Data 1: 100');
    });
    it('should return formatted label with dataset label is undefined', () => {
        const tooltipItem = {
            dataset: { label: undefined },
            formattedValue: '100',
        } as any;
        const result = labelCallback(tooltipItem);

        expect(result).toBe(' : 100');
    });
});
describe('BarLineComponent Props', () => {
    it('renders with empty dataChart', () => {
        const customProps = { ...defaultProps, dataChart: [] };
        const { container } = render(<BarLineComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });

    it('renders with different chart types', () => {
        const customProps = {
            ...defaultProps,
            type: 'line' as keyof ChartTypeRegistry,
        };
        const { container } = render(<BarLineComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });

    it('renders with custom optionCustom', () => {
        const customOptionCustom = { maintainAspectRatio: true };
        const customProps = {
            ...defaultProps,
            optionCustom: customOptionCustom,
        };
        const { container } = render(<BarLineComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });
    it('renders with undefined width and undefined height', () => {
        const customProps = {
            ...defaultProps,
            width: undefined,
            height: undefined,
            timeline: undefined,
            optionCustom: undefined,
            options: undefined,
        };
        const { container } = render(<BarLineComponent {...customProps} />);
        expect(container).toBeInTheDocument();
    });
});
describe('Y-axis ticks callback', () => {
    let yAxisTicks: any;

    beforeEach(() => {
        yAxisTicks = {
            minRotation: 0,
            stepSize: 10,
            maxTicksLimit: 6,
            callback(tickValue: any) {
                return roundDecimalNumber(tickValue);
            },
        };
    });

    test('should round decimal numbers through callback', () => {
        // Test integer values
        expect(yAxisTicks.callback(10)).toBe('10');
        expect(yAxisTicks.callback(0)).toBe('0');
        expect(yAxisTicks.callback(-5)).toBe('-5');
    });
});
