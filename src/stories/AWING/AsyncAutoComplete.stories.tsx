import AsyncAutocomplete from 'AWING/AsyncAutocomplete';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';

// #region Meta
const meta = {
    title: 'AWING/AsyncAutocomplete',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: AsyncAutocomplete,
} satisfies Meta<typeof AsyncAutocomplete>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {
        fetchData: async (searchString: string) => {
            return new Promise<unknown[]>((resolve) => {
                resolve([
                    { id: 1, label: 'Option 1' },
                    { id: 2, label: 'Option 2' },
                ]);
            });
        },
        getOptionValue: (val: unknown) => (typeof val === 'object' && val !== null ? (val as any).value : ''),
        getOptionLabel: (val: unknown) => (typeof val === 'object' && val !== null ? (val as any).label : ''),
    },
    render: (args) => {
        return (
            <Layout>
                <AsyncAutocomplete {...args} />
            </Layout>
        );
    },
};

export const Multi: Story = {
    args: {
        multiple: true,
        fetchData: async (searchString: string) => {
            return new Promise<unknown[]>((resolve) => {
                resolve([
                    { id: 1, label: 'Option 1' },
                    { id: 2, label: 'Option 2' },
                ]);
            });
        },
        getOptionValue: (val: unknown) => (typeof val === 'object' && val !== null ? (val as any).value : ''),
        getOptionLabel: (val: unknown) => (typeof val === 'object' && val !== null ? (val as any).label : ''),
    },
    render: (args) => {
        return (
            <Layout>
                <AsyncAutocomplete {...args} />
            </Layout>
        );
    },
};

export default meta;
