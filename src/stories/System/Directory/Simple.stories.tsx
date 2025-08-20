import { Meta, StoryObj } from '@storybook/react';
import { DirectorySystem } from 'Features/SYSTEM';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import { services, currentWorkspace } from './services';

const Demo = () => {
    return (
        <div style={{ minWidth: '650px' }}>
            <AppWrapper>
                <DirectorySystem
                    parentDirectoryId={0}
                    currentWorkspace={currentWorkspace}
                    {...services}
                    objectTypeCodes={[
                        {
                            key: '_',
                            value: 'Chon 1 option',
                        },
                        {
                            key: 'Campaign',
                            value: 'Campaign',
                        },
                    ]}
                />
            </AppWrapper>
        </div>
    );
};

// #region Meta
const meta = {
    title: 'SYSTEM/DirectorySystem',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof DirectorySystem>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    render: (_args) => {
        return (
            <Layout>
                <Demo />
            </Layout>
        );
    },
};

export default meta;
