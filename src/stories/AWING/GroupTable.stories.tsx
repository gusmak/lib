import GroupTable from 'AWING/GroupTable';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';
import { uniqBy } from 'lodash';
export interface GroupFilter {
    field: string;
    value: any;
}

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/GroupTable',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: GroupTable,
} satisfies Meta<typeof GroupTable>;
// #endregion Meta

const fakeData = [
    { field1: '1', field2: '1', field3: '1', field4: '1' },
    { field1: '2', field2: '2', field3: '2', field4: '2' },
    { field1: '3', field2: '3', field3: '3', field4: '3' },
    { field1: '4', field2: '4', field3: '4', field4: '4' },
    { field1: '5', field2: '5', field3: '5', field4: '5' },
    { field1: '6', field2: '6', field3: '6', field4: '6' },
    { field1: '7', field2: '7', field3: '7', field4: '7' },
    { field1: '8', field2: '8', field3: '8', field4: '8' },
    { field1: '9', field2: '9', field3: '1', field4: '9' },
    { field1: '1', field2: '10', field3: '10', field4: '10' },
    { field1: '11', field2: '11', field3: '11', field4: '11' },
    { field1: '12', field2: '12', field3: '12', field4: '12' },
    { field1: '13', field2: '13', field3: '13', field4: '13' },
    { field1: '14', field2: '4', field3: '14', field4: '14' },
    { field1: '15', field2: '15', field3: '15', field4: '15' },
    { field1: '16', field2: '16', field3: '1', field4: '16' },
    { field1: '1', field2: '17', field3: '17', field4: '17' },
    { field1: '18', field2: '18', field3: '1', field4: '18' },
    { field1: '19', field2: '4', field3: '19', field4: '19' },
    { field1: '20', field2: '20', field3: '20', field4: '20' },
];

const groupByValues: string | any[] = [];

const handleGetFakeData = (
    groupFilters: GroupFilter[],
    pageIndex: number,
    pageSize: number
): Promise<{ data: any[]; totalCount: number }> => {
    return new Promise((resolve, reject) => {
        const listView = fakeData;
        let groupPlaces = listView.filter((item: any) => {
            let check = true;
            groupFilters.map((groupFilter) => {
                item[groupFilter.field] !== groupFilter.value && (check = false);
            });
            return check;
        });
        if (groupFilters.length < groupByValues.length) {
            let dataView = uniqBy(groupPlaces, groupByValues[groupFilters.length]).map((item: any) => {
                return {
                    [groupByValues[groupFilters.length]]: item[groupByValues[groupFilters.length]],
                };
            });
            resolve({
                data: dataView.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize),
                totalCount: dataView.length,
            });
        } else {
            const newData = groupPlaces;
            resolve({
                data: newData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize),
                totalCount: newData.length,
            });
        }
    });
};

export const Simple: Story = {
    args: {
        headCells: [
            {
                field: 'field1',
                isGrouping: false,
                isFixed: false,
                getDisplay: (obj: any) => obj.field1,
                label: 'Field 1',
                sort: 'ready',
            },
            {
                field: 'field2',
                isGrouping: false,
                isFixed: false,
                getDisplay: (obj: any) => obj.field2,
                label: 'Field 2',
            },
            {
                field: 'field3',
                isGrouping: false,
                isFixed: true,
                getDisplay: (obj: any) => obj.field3,
                label: 'Field 3',
            },
            {
                field: 'field4',
                isGrouping: false,
                isFixed: true,
                getDisplay: (obj: any) => obj.field4,
                label: 'Field 4',
            },
        ],
        filters: [],
        onGetData: handleGetFakeData,
    },
    render: (args) => {
        return (
            <Layout>
                <GroupTable {...args} />
            </Layout>
        );
    },
};

export default meta;
