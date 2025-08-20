import { BarLineChart } from 'AWING/Chart';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/BarLineChart',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: BarLineChart,
} satisfies Meta<typeof BarLineChart>;
// #endregion Meta

const dataTest = [
    {
        label: 'Chưa sử dụng 9,484.56',
        type: 'line-fill',
        data: [
            {
                x: '20250312',
                y: 3844.111,
            },
            {
                x: '20250313',
                y: 576.4444,
            },
            {
                x: '20250314',
                y: 603,
            },
            {
                x: '20250315',
                y: 680,
            },
            {
                x: '20250316',
                y: 705,
            },
            {
                x: '20250317',
                y: 658,
            },
            {
                x: '20250318',
                y: 713,
            },
            {
                x: '20250319',
                y: 1705,
            },
        ],
        fill: true,
        pointStyle: 'circle',
        yAxisID: 'y',
        variant: 'primary',
    },
];

export const Simple: Story = {
    args: {
        type: 'bar',
        dataChart: dataTest,
    },
    render: (args) => {
        return (
            <Layout>
                <BarLineChart {...args} />
            </Layout>
        );
    },
};

export default meta;
