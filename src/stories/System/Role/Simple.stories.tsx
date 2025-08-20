import { Meta, StoryObj } from '@storybook/react';
import { RoleSystem } from 'Features/SYSTEM/Role';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import { services } from './services';

const Demo = () => {
    return (
        <AppWrapper>
            <RoleSystem {...services} />
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'SYSTEM/Role',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof RoleSystem>;
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
