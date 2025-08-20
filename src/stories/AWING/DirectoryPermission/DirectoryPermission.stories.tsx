import { Meta, StoryObj } from '@storybook/react';
import DirectoryPermission from 'AWING/DirectoryPermission';
import Component from './Component';

// #region Meta
const meta = {
    title: 'AWING/Directory Permission',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Component,
} satisfies Meta<typeof DirectoryPermission>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple1: Story = {
    args: {},
    render: (_args) => {
        return <Component />;
    },
};

export default meta;
