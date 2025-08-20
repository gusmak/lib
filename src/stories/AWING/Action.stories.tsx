import { Meta, StoryObj } from '@storybook/react';
import { Event as EventIcon, MarkEmailRead } from '@mui/icons-material';
import Layout from '../common/Layout';
import Action from 'AWING/Action';

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
                <Action
                    menus={[
                        {
                            action: () => {
                                console.log('event click');
                            },
                            icon: <EventIcon />,
                            name: 'Event',
                        },
                        {
                            action: () => {
                                console.log('email click');
                            },
                            icon: <MarkEmailRead />,
                            name: 'Email',
                        },
                    ]}
                />
            </div>
        </Layout>
    );
};

// #region Meta
const meta = {
    title: 'AWING/Action',
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
