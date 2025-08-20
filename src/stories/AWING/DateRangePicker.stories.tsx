import { Meta, StoryObj } from '@storybook/react';
import DateRangePicker from 'AWING/DateRangePicker';
import Layout from '../common/Layout';
import { useState } from 'react';

// #region Meta
const meta = {
    title: 'AWING/DateRangePicker',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: DateRangePicker,
} satisfies Meta<typeof DateRangePicker>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

const DemoResetValue = () => {
    const [value, setValue] = useState<
        | {
              startDate: Date;
              endDate: Date;
          }
        | undefined
    >(undefined);

    return (
        <>
            <h2>Reset value</h2>
            <button onClick={() => setValue(undefined)}>Click to reset</button>

            <DateRangePicker
                value={value}
                onChange={(dateRange) => setValue(dateRange as any)}
                textFieldProps={{
                    size: 'small',
                }}
            />
        </>
    );
};

export const Simple: Story = {
    args: {
        value: {
            startDate: new Date('2021-10-20'),
            endDate: new Date('2021-10-20'),
        },
        label: 'Date Range',
        onChange: (dateRange) => console.log('dateRange', dateRange),
    },
    render: (args: any) => {
        return (
            <Layout>
                <h2>Default/Medium size</h2>
                <DateRangePicker {...args} />
                <br />
                <h2>Small size</h2>
                <DateRangePicker
                    {...args}
                    textFieldProps={{
                        size: 'small',
                    }}
                />
                <DemoResetValue />
            </Layout>
        );
    },
};

export default meta;
