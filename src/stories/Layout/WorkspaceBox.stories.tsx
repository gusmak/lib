import { Meta, StoryObj } from '@storybook/react';
import WorkspaceBox from 'Layouts/Toolbar/WorkplaceBox';
import Layout from '../common/Layout';
import { BrowserRouter } from 'react-router';

const Demo = () => {
    return <WorkspaceBox />;
};

// #region Meta
const meta = {
    title: 'Layout/WorkspaceBox',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof WorkspaceBox>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    render: () => {
        return (
            <Layout>
                <BrowserRouter>
                    <Demo />
                </BrowserRouter>
            </Layout>
        );
    },
};

export default meta;
