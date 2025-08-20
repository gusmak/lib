import { Meta, StoryObj } from '@storybook/react';
import WorkflowFeature from '../../../Features/SYSTEM/Workflow';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import { Workflow } from 'Features/SYSTEM/Workflow/types';

const workflows: Workflow[] = [
    {
        id: 0,
        name: 'Workflow 1',
        objectTypeCode: 'campaign',
        stateFieldName: 'State',
        workflowMatrices: [
            {
                id: 0,
                priority: 0,
                stateStart: '1',
                stateStartNavigation: {
                    id: '1',
                    name: 'Start',
                    priority: 0,
                    level: 0,
                    value: 0,
                    inverseParent: [],
                },
                stateEnd: '2',
                stateEndNavigation: {
                    id: '2',
                    name: 'End',
                    priority: 1,
                    level: 0,
                    value: 1,
                    inverseParent: [],
                },
            },
        ],
        workflowStates: [
            {
                id: '1',
                name: 'Start',
                priority: 0,
                level: 0,
                value: 0,
                inverseParent: [],
            },
            {
                id: '2',
                name: 'End',
                priority: 1,
                level: 0,
                value: 1,
                inverseParent: [],
            },
        ],
    },
    {
        id: 1,
        name: 'Workflow 2',
        objectTypeCode: 'page',
        stateFieldName: 'State',
        workflowMatrices: [
            {
                id: 0,
                priority: 0,
                stateStart: '1',
                stateStartNavigation: {
                    id: '1',
                    name: 'Start',
                    priority: 0,
                    level: 0,
                    value: 0,
                    inverseParent: [],
                },
                stateEnd: '2',
                stateEndNavigation: {
                    id: '2',
                    name: 'End',
                    priority: 1,
                    level: 0,
                    value: 1,
                    inverseParent: [],
                },
            },
        ],
        workflowStates: [
            {
                id: '1',
                name: 'Start',
                priority: 0,
                level: 0,
                value: 0,
                inverseParent: [],
            },
            {
                id: '2',
                name: 'End',
                priority: 1,
                level: 0,
                value: 1,
                inverseParent: [],
            },
        ],
    },
];

const Demo = () => {
    const OBJECT_TYPE_CODE = {
        directory: 'directory',
        campaign: 'campaign',
        page: 'page',
        pageWelcome: 'pageWelcome',
        pageLogin: 'pageLogin',
        place: 'place',
        template: 'template',
        menu: 'menu',
    };

    const ObjectTypeCodeMap = [
        { value: OBJECT_TYPE_CODE.campaign, label: OBJECT_TYPE_CODE.campaign },
        { value: OBJECT_TYPE_CODE.page, label: OBJECT_TYPE_CODE.page },
        { value: OBJECT_TYPE_CODE.menu, label: OBJECT_TYPE_CODE.menu },
    ];

    return (
        <AppWrapper>
            <WorkflowFeature
                getById={async (id: number) => workflows[id]}
                getPaging={async (queryInput) => ({ items: workflows, totalCount: workflows.length })}
                create={async (workflow) => {}}
                update={async (id, workflow) => {}}
                remove={async (id) => {
                    workflows.splice(id, 1);
                }}
                objectTypeCodeMap={ObjectTypeCodeMap}
            />
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'SYSTEM/Workflow',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof WorkflowFeature>;
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
