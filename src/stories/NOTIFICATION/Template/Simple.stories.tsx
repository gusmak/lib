import { Meta, StoryObj } from '@storybook/react';
import Template from 'Features/NOTIFICATION/Template';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import { services } from './services';

export enum ObjectTypeCodeMap {
    MEDIA_PLAN = 'MEDIA_PLAN',
    RECONCILIATION_PERIOD = 'RECONCILIATION_PERIOD',
    MENU = 'MENU',
    OBJECT_FILTER = 'OBJECT_FILTER',
    TEMPLATE = 'TEMPLATE',
    NOTIFICATION_CONFIG = 'NOTIFICATION_CONFIG',
    SUBSCRIPTION_CONFIG = 'SUBSCRIPTION_CONFIG',
    REPORT = 'REPORT',
}

const Demo = () => {
    return (
        <AppWrapper>
            <Template
                objectTypeCodes={[
                    {
                        key: 'MEDIA_PLAN',
                        value: 'MEDIA_PLAN',
                    },
                    {
                        key: 'RECONCILIATION_PERIOD',
                        value: 'RECONCILIATION_PERIOD',
                    },
                    {
                        key: 'TEMPLATE',
                        value: 'TEMPLATE',
                    },
                ]}
                // objectTypeCodes={[
                //     {
                //         key: 'none',
                //         value: 'None',
                //     },
                //     {
                //         key: 'menu',
                //         value: 'Menu',
                //     },
                //     {
                //         key: 'campaign',
                //         value: 'Campaign',
                //     },
                //     {
                //         key: 'page',
                //         value: 'Page',
                //     },
                //     {
                //         key: 'page_welcome',
                //         value: 'Page Welcome',
                //     },
                //     {
                //         key: 'page_login',
                //         value: 'Page Login',
                //     },
                //     {
                //         key: 'media_plan',
                //         value: 'Media Plan',
                //     },
                //     {
                //         key: 'object_filter',
                //         value: 'Object Filter',
                //     },
                //     {
                //         key: 'reconciliation_period',
                //         value: 'Reconciliation Period',
                //     },
                // ]}
                services={services}
            />
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'NOTIFICATION/Template',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof Template>;
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
