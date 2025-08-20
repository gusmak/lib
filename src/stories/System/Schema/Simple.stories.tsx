import { Meta, StoryObj } from '@storybook/react';
import { SchemaSystem } from 'Features/SYSTEM/Schema';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import { services, currentWorkspace } from './services';

const Demo = () => {
    return (
        <AppWrapper>
            <SchemaSystem currentWorkspace={currentWorkspace} {...services} />
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'SYSTEM/Schema',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof SchemaSystem>;
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
