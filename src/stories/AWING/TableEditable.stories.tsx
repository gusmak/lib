import TableEditable, { ColumnDefinition } from 'AWING/TableEditable';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';
import { FIELD_TYPE } from 'AWING/DataInput';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/TableEditable',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: TableEditable,
} satisfies Meta<typeof TableEditable>;
// #endregion Meta

const columnDefinitions = [
    {
        fieldName: 'field1',
        headerName: 'Field 1',
        contentGetter: (item: any) => item.field1,
    },
    {
        headerName: 'Field 2',
        fieldName: 'field2',
        contentGetter: (item: any) => item.field2,
    },
    {
        headerName: 'Field 3',
        editFieldDefinition: {
            fieldName: 'field3',
            type: FIELD_TYPE.SELECT,
            options: [
                {
                    text: 'ENGAGEMENT',
                    value: 'ENGAGEMENT',
                },
                {
                    text: 'SPOT',
                    value: 'SPOT',
                },
                {
                    text: 'CLICK',
                    value: 'CLICK',
                },
                {
                    text: 'SURVEY',
                    value: 'SURVEY',
                },
                {
                    text: 'VOUCHER',
                    value: 'VOUCHER',
                },
            ],
        },
    },
    {
        headerName: 'Field Date Range',
        fieldName: 'field_date',
        editFieldDefinition: {
            value: undefined,
            fieldName: 'field_date',
            type: FIELD_TYPE.DATE_RANGE,
        },
    },
] as ColumnDefinition<any>[];

const defaultItems = [
    { field1: 'value1', field2: 'V1' },
    { field1: 'value2', field2: 'V2' },
    { field1: 'value1', field2: 'V3' },
];

export const Simple: Story = {
    args: {
        columnDefinitions,
        items: defaultItems,
        onChange: (items) => console.log({ items }),
        mergeRowsBy: 'field1',
        
    },
    render: (args) => {
        return (
            <Layout>
                <TableEditable {...args} />
            </Layout>
        );
    },
};

export default meta;
