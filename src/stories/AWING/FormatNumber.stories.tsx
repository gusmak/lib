import { Meta, StoryObj } from '@storybook/react';
import Layout from '../common/Layout';
import { formatNumber } from 'Helpers/number';

export type Story = StoryObj<typeof meta>;

const Demo = () => {
    return (
        <Layout>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                Number: {formatNumber(1234567890)}
            </div>
        </Layout>
    );
};

// #region Meta
const meta = {
    title: 'Helpers/FormatNumber',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof Demo>;
// #endregion Meta

export const Simple: Story = {
    args: {},
    render: (args) => {
        return <Demo {...args} />;
    },
};

export default meta;
