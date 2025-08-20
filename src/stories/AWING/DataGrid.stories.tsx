import DataGrid from 'AWING/DataGrid';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';
import { TableCell, TableRow } from '@mui/material';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/DataGrid',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: DataGrid,
} satisfies Meta<typeof DataGrid>;
// #endregion Meta

export const Simple: Story = {
    args: {
        onRowClick: console.log,
        rows: [
            { id: 'Row1 ID', name: 'Row1 Name', quantity: 15 },
            { id: 'Row2 ID', name: 'Row2 Name', quantity: 23 },
        ],
        columns: [
            {
                field: '',
                headerName: '#',
                valueGetter: (row, idx, stt) => stt,
                width: 50,
            },
            { field: 'id', headerName: 'ID' },
            { field: 'name', headerName: 'Name' },
            {
                field: 'quantity',
                headerName: 'Quantity',
            },
        ],

        spanningRows: (
            <TableRow style={{ background: 'lightgrey', fontWeight: 'bold' }}>
                <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                    Tổng số
                </TableCell>
                <TableCell>38</TableCell>
            </TableRow>
        ),
        spanningRowsPosition: 'top',
        onPageIndexChange: console.log,
        onPageSizeChange: console.log,
    },
    render: (args) => {
        return (
            <Layout>
                <DataGrid {...args} />
            </Layout>
        );
    },
};
export default meta;
