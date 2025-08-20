import ControlPanels, { TYPE_FILTERS } from 'AWING/ControlPanels';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';
import moment from 'moment';

// #region Meta
const meta = {
    title: 'AWING/ControlPanels',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: ControlPanels,
} satisfies Meta<typeof ControlPanels>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {
        initialFilters: [
            {
                type: TYPE_FILTERS.DATE_RANGE_PICKER,
                name: 'dateRangePicker',
                defaultValue: {
                    startDate: moment().subtract(7, 'days'),
                    endDate: moment(),
                },
            },
            {
                type: TYPE_FILTERS.VIEW_TIME,
                initialData: [
                    {
                        label: 'Common.Impression',
                        value: 'login',
                    },
                    {
                        label: 'Common.FinalClick',
                        value: 'welcome',
                    },
                ],
                name: 'pageCode',
                initValue: 'login',
                isEnhanced: true,
            },
        ],
        onChangeQueryInput(input) {
            console.log('input', input);
        },
        isLoadings: false,
    },
    render: (args) => {
        return (
            <Layout>
                <ControlPanels {...args} />
            </Layout>
        );
    },
};

export default meta;
