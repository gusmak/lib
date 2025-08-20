import { Meta, StoryObj } from '@storybook/react';
import { RoleTagSystem } from 'Features/SYSTEM/RoleTag';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import { services } from './services';

const Demo = () => {
    return (
        <AppWrapper>
            <RoleTagSystem {...services} />
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'SYSTEM/RoleTag',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof RoleTagSystem>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    render: (args) => {
        return (
            <Layout>
                <Demo />
            </Layout>
        );
    },
};

export default meta;
