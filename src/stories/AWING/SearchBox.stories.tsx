import { Meta, StoryObj } from '@storybook/react';
import SearchBox, { type SearchType } from 'AWING/SearchBox';
import Layout from '../common/Layout';

// #region Meta
const meta = {
    title: 'AWING/SearchBox',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: SearchBox,
} satisfies Meta<typeof SearchBox>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {
        defaultValue: '',
        includeSearchById: false,
        onlyNumberString: false,
        onSearch: (searchType: SearchType, searchString: string) => {
            console.log(searchType, searchString);
        },
    },
    render: (args) => {
        return (
            <Layout>
                <SearchBox {...args} />
            </Layout>
        );
    },
};

export const Multiple: Story = {
    args: {
        defaultValue: '',
        includeSearchById: false,
        onlyNumberString: false,
        onSearch: (searchType: SearchType, searchString: string) => {
            console.log(searchType, searchString);
        },
    },
    render: (args) => {
        return (
            <Layout>
                <SearchBox {...args} />
                <br />
                <SearchBox {...args} />
            </Layout>
        );
    },
};

export default meta;
