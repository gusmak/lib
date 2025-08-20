import MultipleHierarchicalChoice from 'AWING/MultipleHierarchicalChoice';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';
import ProvinceData from '../common/data/province-data.json';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/MultipleHierarchicalChoice',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: MultipleHierarchicalChoice,
} satisfies Meta<typeof MultipleHierarchicalChoice>;
// #endregion Meta

export const Simple: Story = {
    args: {
        label: 'Demo',
        placeholder: 'Chọn mới',
        options: ProvinceData,
        onChange: (newValue) => {
            console.log(newValue);
        },
        parentTitle: 'TỈNH',
        endAdornmentOptions: [
            { id: 'or', name: '||' },
            { id: 'and', name: '&' },
        ],
        onEndAdornmentValueChange: (newOperator) => {
            console.log('Change operator to: ', newOperator);
        },
    },
    render: (args) => {
        return (
            <Layout>
                <MultipleHierarchicalChoice {...args} />
            </Layout>
        );
    },
};

export default meta;
