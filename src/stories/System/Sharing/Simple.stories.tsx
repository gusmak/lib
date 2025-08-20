import { Meta, StoryObj } from '@storybook/react';
import { Sharing as SharingFeature } from 'Features/SYSTEM/Sharing';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import { sharingProps } from './services';

const Demo = () => {
    return (
        <AppWrapper>
            <SharingFeature {...sharingProps} />
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'SYSTEM/Sharing',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof SharingFeature>;
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
