import { Meta, StoryObj } from '@storybook/react';
import DirectoryTree from 'AWING/DirectoryTree';
import Layout from '../common/Layout';

// #region Meta
const meta = {
    title: 'AWING/DirectoryTree',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: DirectoryTree,
} satisfies Meta<typeof DirectoryTree>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {
        defaultValue: '',
        labelSearch: 'Workspces',
        onChange: () => {},
        options: [
            {
                parentObjectId: 0,
                directoryPath: '.0.2.',
                value: 2,
                objectId: 2,
                level: 1,
                text: 'awing',
                actions: (
                    <div>
                        <button>action 1</button>
                        <button>action 2</button>
                    </div>
                ),
            },
            {
                parentObjectId: 2,
                directoryPath: '.0.2.1021263.',
                value: 1021263,
                objectId: 1021263,
                level: 2,
                text: 'Demo 01',
                actions: (
                    <div>
                        <button>action 1</button>
                        <button>action 2</button>
                    </div>
                ),
            },
            {
                parentObjectId: 1021263,
                directoryPath: '.0.2.1021263.1021264.',
                value: 1021264,
                objectId: 1021264,
                level: 3,
                text: 'Demo child 01',
            },
            {
                parentObjectId: 2,
                directoryPath: '.0.2.11.',
                objectId: 11,
                value: 1004564,
                level: 2,
                text: 'MEDIA_PLAN',
            },
            {
                parentObjectId: 2,
                directoryPath: '.0.2.12.',
                objectId: 12,
                value: 1004565,
                level: 2,
                text: 'RECONCILIATION_PERIOD',
            },
            {
                parentObjectId: 2,
                directoryPath: '.0.2.13.',
                objectId: 13,
                value: 1004566,
                level: 2,
                text: 'MENU',
            },
            {
                parentObjectId: 13,
                directoryPath: '.0.2.13.14',
                objectId: 14,
                value: 1004568,
                level: 3,
                text: 'MENU 1',
            },
        ],
        rootDirectoryId: 'root',
    },
    render: (args) => {
        return (
            <Layout>
                <DirectoryTree {...args} />
            </Layout>
        );
    },
};

export default meta;
