import { Meta, StoryObj } from '@storybook/react';
import Footer from 'Layouts/Footer';
import Layout from '../common/Layout';
import { BrowserRouter } from 'react-router';

const Demo = () => {
    return <Footer appName="Demo Footer" />;
};

// #region Meta
const meta = {
    title: 'Layout/Footer',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof Footer>;
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
