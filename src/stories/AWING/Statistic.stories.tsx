import { Meta, StoryObj } from '@storybook/react';
import { TimelineType } from 'AWING/Chart/Enums';
import { TYPE_FILTERS } from 'AWING/ControlPanels';
import { FiltersType } from 'AWING/ControlPanels/interfaces';
import Statistics, { TYPE_CHART } from 'AWING/Statistics';
import moment from 'moment';
import Layout from '../common/Layout';

// #region Meta
const meta = {
    title: 'AWING/Statistics',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Statistics,
} satisfies Meta<typeof Statistics>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

const dataChart = [
    {
        label: 'Impression 49',
        type: 'line',
        data: [
            {
                x: '20250220',
                y: 5,
            },
            {
                x: '20250221',
                y: 4,
            },
            {
                x: '20250222',
                y: 0,
            },
            {
                x: '20250223',
                y: 0,
            },
            {
                x: '20250224',
                y: 4,
            },
            {
                x: '20250225',
                y: 3,
            },
            {
                x: '20250226',
                y: 30,
            },
            {
                x: '20250227',
                y: 3,
            },
        ],
        fill: false,
        pointStyle: 'circle',
        yAxisID: 'y',
        variant: 'Impression',
    },
    {
        label: 'Common.Engagement 37',
        type: 'line',
        data: [
            {
                x: '20250220',
                y: 4,
            },
            {
                x: '20250221',
                y: 4,
            },
            {
                x: '20250222',
                y: 0,
            },
            {
                x: '20250223',
                y: 0,
            },
            {
                x: '20250224',
                y: 4,
            },
            {
                x: '20250225',
                y: 3,
            },
            {
                x: '20250226',
                y: 19,
            },
            {
                x: '20250227',
                y: 3,
            },
        ],
        fill: false,
        pointStyle: 'circle',
        yAxisID: 'y',
        variant: 'Engagement',
    },
    {
        label: 'Statistics.Click 29',
        type: 'line',
        data: [
            {
                x: '20250220',
                y: 3,
            },
            {
                x: '20250221',
                y: 4,
            },
            {
                x: '20250222',
                y: 0,
            },
            {
                x: '20250223',
                y: 0,
            },
            {
                x: '20250224',
                y: 4,
            },
            {
                x: '20250225',
                y: 3,
            },
            {
                x: '20250226',
                y: 12,
            },
            {
                x: '20250227',
                y: 3,
            },
        ],
        fill: false,
        pointStyle: 'circle',
        yAxisID: 'y',
        variant: 'Click',
    },
    {
        type: 'bar',
        label: 'ER 75.51%',
        data: [
            {
                x: '20250220',
                y: 80,
            },
            {
                x: '20250221',
                y: 100,
            },
            {
                x: '20250222',
                y: 0,
            },
            {
                x: '20250223',
                y: 0,
            },
            {
                x: '20250224',
                y: 100,
            },
            {
                x: '20250225',
                y: 100,
            },
            {
                x: '20250226',
                y: 63.33333333333333,
            },
            {
                x: '20250227',
                y: 100,
            },
        ],
        fill: true,
        borderWidth: 0,
        yAxisID: 'yAxis',
        variant: 'ER',
    },
    {
        type: 'bar',
        label: 'CTR 59.18%',
        data: [
            {
                x: '20250220',
                y: 60,
            },
            {
                x: '20250221',
                y: 100,
            },
            {
                x: '20250222',
                y: 0,
            },
            {
                x: '20250223',
                y: 0,
            },
            {
                x: '20250224',
                y: 100,
            },
            {
                x: '20250225',
                y: 100,
            },
            {
                x: '20250226',
                y: 40,
            },
            {
                x: '20250227',
                y: 100,
            },
        ],
        fill: true,
        borderWidth: 0,
        yAxisID: 'yAxis',
        variant: 'CTR',
    },
];

const fieldsFilter: Array<FiltersType<any>> = [
    {
        type: TYPE_FILTERS.DATE_RANGE_PICKER,
        name: 'dateRangePicker',
        defaultValue: {
            startDate: moment().subtract(7, 'days'),
            endDate: moment(),
        },
        col: 4,
    },
    // {
    //     type: TYPE_FILTERS.PLACE,
    //     nodeElement: PlaceFilter,
    //     name: 'placeIds',
    //     initValue: [],
    //     col: 3,
    // },
    {
        type: TYPE_FILTERS.VIEW_TIME,
        initialData: [
            {
                label: 'Ngày',
                value: TimelineType.Day,
            },
            {
                label: 'Giờ',
                value: TimelineType.Hour,
            },
        ],
        name: 'timeline',
        initValue: TimelineType.Day,
        col: 3,
        isEnhanced: true,
    },
    {
        type: TYPE_FILTERS.CAMPAIGN_DEFAULT,
        name: 'isCampaignDefault',
        initValue: '0',
        col: 6,
        isEnhanced: true,
    },
];

export const Simple: Story = {
    args: {
        dataChart: dataChart,
        title: 'Sample Statistics',
        configChart: {
            type: TYPE_CHART.BAR_LINE,
            options: {},
        },
        onChangeQueryInput: (input) => {
            console.log('input', input);
        },
        initialFilters: fieldsFilter,
        children: <></>,
        isLoadings: false,
    },
    render: (args) => {
        return (
            <Layout>
                <Statistics {...args} />
            </Layout>
        );
    },
};

export default meta;
