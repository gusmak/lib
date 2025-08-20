import { Meta, StoryObj } from '@storybook/react';
import Layout from '../common/Layout';
import BoxResizableSplit from 'AWING/BoxResizableSplit';

export type Story = StoryObj<typeof meta>;

const Demo = () => {
    return (
        <Layout>
            <h3>Basic</h3>
            <BoxResizableSplit>
                <div style={{ padding: 10, background: '#e3f2fd' }}>Left Panel</div>
                <div style={{ padding: 10, background: '#fff3e0' }}>Right Panel</div>
            </BoxResizableSplit>

            <br />
            <br />
            <h3>Scroll</h3>
            <BoxResizableSplit
                containerStyle={{
                    height: 300,
                    width: '100%',
                }}
            >
                <div style={{ padding: 10, background: '#e3f2fd', height: 200, overflowY: 'auto' }}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam error rem, magnam enim
                        dignissimos ipsa, earum adipisci tenetur nemo sed, sunt necessitatibus! Numquam labore illum
                        architecto quidem quibusdam eius animi.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam error rem, magnam enim
                        dignissimos ipsa, earum adipisci tenetur nemo sed, sunt necessitatibus! Numquam labore illum
                        architecto quidem quibusdam eius animi.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam error rem, magnam enim
                        dignissimos ipsa, earum adipisci tenetur nemo sed, sunt necessitatibus! Numquam labore illum
                        architecto quidem quibusdam eius animi.
                    </p>
                </div>
                <div style={{ padding: 10, background: '#fff3e0', minWidth: 300, overflowX: 'auto' }}>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam error rem, magnam enim
                        dignissimos ipsa, earum adipisci tenetur nemo sed, sunt necessitatibus! Numquam labore illum
                        architecto quidem quibusdam eius animi.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam error rem, magnam enim
                        dignissimos ipsa, earum adipisci tenetur nemo sed, sunt necessitatibus! Numquam labore illum
                        architecto quidem quibusdam eius animi.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam error rem, magnam enim
                        dignissimos ipsa, earum adipisci tenetur nemo sed, sunt necessitatibus! Numquam labore illum
                        architecto quidem quibusdam eius animi.
                    </p>
                </div>
            </BoxResizableSplit>
        </Layout>
    );
};

// #region Meta
const meta = {
    title: 'AWING/BoxResizableSplit',
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
