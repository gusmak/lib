import moment from 'moment';
import DateRangePickerOld from 'AWING/DateRangePickerOld';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';

// #region Meta
const meta = {
    title: 'AWING/DateRangePickerOld',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: DateRangePickerOld,
} satisfies Meta<typeof DateRangePickerOld>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {
        // autoFocus: false,
        // autoFocusEndDate: false,
        // initialStartDate: null,
        // initialEndDate: null,
        // callback: () => {},
        // disabled: false,
        // renderMonthText: null,
        // orientation: HORIZONTAL_ORIENTATION,
        // withPortal: false,
        // initialVisibleMonth: null,
        // numberOfMonths: 2,
        // keepOpenOnDateSelect: false,
        // isRTL: false,

        // navPrev: null,
        // navNext: null,
        // onPrevMonthClick() { },
        // onNextMonthClick() { },
        // onClose() { },

        // day presentation and interaction related props
        // renderDayContents: null,
        // minimumNights: 0,
        // enableOutsideDays: false,
        // isDayBlocked: (day) => false,
        // isOutsideRange: (day) => false,
        // isDayHighlighted: () => false,

        // internationalization
        // monthFormat: 'MMMM YYYY',

        // isShowCalendarInfo: false,
        // handleValid: () => {},
        // handleDateRangePopover: () => {},
        value: {
            startDate: moment('2021-10-20'),
            endDate: moment('2021-10-25'),
        },
        label: 'Date Range',
        callback: (value: any) => console.log('value', value),
    },
    render: (args: any) => {
        return (
            <Layout>
                <DateRangePickerOld {...args} />
            </Layout>
        );
    },
}; 

export default meta;
