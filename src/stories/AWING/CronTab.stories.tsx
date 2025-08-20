import CronTab, { CronTabValue } from 'AWING/CronTab';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';
import { DEFAULT_SCHEDULE_FREE_PERMISSION } from 'AWING/CronTab/constants';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/CronTab',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: CronTab,
} satisfies Meta<typeof CronTab>;
// #endregion Meta

export const Simple: Story = {
    args: {
        onChange: (value: CronTabValue, isValid: boolean) => {
            console.log('first');
        },
        schedulePermissions: DEFAULT_SCHEDULE_FREE_PERMISSION,
    },
    render: (args) => {
        return (
            <Layout>
                <CronTab {...args} />
            </Layout>
        );
    },
};

export default meta;
