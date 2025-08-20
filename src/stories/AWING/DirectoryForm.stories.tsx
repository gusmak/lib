import { Meta, StoryObj } from '@storybook/react';
import { useState, useRef } from 'react';
import Directory, { type DirectoryAddOrEditServices } from 'AWING/DirectoryForm';
import { BrowserRouter } from 'react-router';
import { AppProvider } from 'Utils';
import Layout from '../common/Layout';

const services: DirectoryAddOrEditServices = {
    createDirectory: (_p) => {
        return Promise.resolve();
    },
    updateDirectory: (_p) => {
        return Promise.resolve();
    },
    getDirectoryById: (_p) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 1,
                    name: 'Root Directory',
                    description: 'This is root directory',
                    directoryPath: '',
                    isSystem: false,
                    level: 1,
                    order: 1,
                    parentObjectId: 0,
                });
            }, 800);
        }),
};

const Demo = () => {
    let isCreate = useRef<boolean>(false);
    const [isShow, setIsShow] = useState<boolean>(false);

    return (
        <div>
            <button
                onClick={() => {
                    setIsShow(true);
                    isCreate.current = true;
                }}
            >
                Create Directory
            </button>
            <button
                onClick={() => {
                    setIsShow(true);
                    isCreate.current = false;
                }}
            >
                Edit Directory
            </button>
            {isShow ? (
                <AppProvider>
                    <Directory
                        isCreate={isCreate.current}
                        onDrawerClose={() => setIsShow(false)}
                        onUpdateDirectories={() => {}}
                        {...services}
                    />
                </AppProvider>
            ) : null}
        </div>
    );
};

const Container = () => {
    return (
        <Layout>
            <BrowserRouter>
                <Demo />
            </BrowserRouter>
        </Layout>
    );
};

// #region Meta
const meta = {
    title: 'AWING/Directory Form',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Container,
} satisfies Meta<typeof Directory>;
// #endregion Meta

export type Story = StoryObj<typeof meta>;

export const Simple: Story = {
    args: {},
    render: (_args) => {
        return <Container />;
    },
};

export default meta;
