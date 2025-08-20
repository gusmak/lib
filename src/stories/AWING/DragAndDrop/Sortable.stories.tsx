import { Meta, StoryObj } from '@storybook/react';
import Layout from '../../common/Layout';
import { Sortable } from 'AWING/DragAndDrop';

export type Story = StoryObj<typeof meta>;

const Demo = () => {
    return (
        <Layout>
            <h2>Default (Vertical)</h2>
            <Sortable
                items={[1, 2, 3]}
                itemStyle={{
                    padding: '10px',
                    border: '1px solid #ccc',
                }}
            />
            <h3>Scroll</h3>
            <div style={{ height: '200px', overflowY: 'auto' }}>
                <Sortable
                    items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    itemStyle={{
                        padding: '10px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>
            <h2>Horizontal</h2>
            <Sortable
                items={[1, 2, 3]}
                direction="horizontal"
                itemStyle={{
                    padding: '10px',
                    border: '1px solid #ccc',
                }}
            />
            <h3>Scroll</h3>
            <div style={{ width: '200px', overflowX: 'auto' }}>
                <Sortable
                    items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    direction="horizontal"
                    itemStyle={{
                        padding: '10px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>
        </Layout>
    );
};

// #region Meta
const meta = {
    title: 'DragAndDrop/Sortable',
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
