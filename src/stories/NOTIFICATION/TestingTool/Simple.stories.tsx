import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TestingTool from 'Features/NOTIFICATION/components/TestingTool';
import { Science as ScienceIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import { services } from './services';

const data = {
    objectFilterInput: {
        __typename: 'ObjectFilter',
        configType: 'OBJECT_AND_CHANGED',
        id: 245,
        logicalExpression: 'any(o.BillCustomer.Brands) = false ',
        name: 'WMP_6771_WMd',
        objectType: 'MEDIA_PLAN',
        outputFieldPermission: {
            __typename: 'OutputFieldPermission',
            currentWorkflowState: null,
            objectDefinitionWithPermissions: [
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'id',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.id.',
                        id: 88,
                    },
                },
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'name',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.name.',
                        id: 89,
                    },
                },
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'objectType',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.objectType.',
                        id: 90,
                    },
                },
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'logicalExpression',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.logicalExpression.',
                        id: 91,
                    },
                },
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'configType',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.configType.',
                        id: 92,
                    },
                },
            ],
            targetWorkflowStates: null,
        },
    },
    objectFilter: {
        __typename: 'ObjectFilter',
        configType: 'OBJECT_AND_CHANGED',
        id: 245,
        logicalExpression: 'any(o.BillCustomer.Brands) = false ',
        name: 'WMP_6771_WMd',
        objectType: 'MEDIA_PLAN',
        outputFieldPermission: {
            __typename: 'OutputFieldPermission',
            currentWorkflowState: null,
            objectDefinitionWithPermissions: [
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'id',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.id.',
                        id: 88,
                    },
                },
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'name',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.name.',
                        id: 89,
                    },
                },
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'objectType',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.objectType.',
                        id: 90,
                    },
                },
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'logicalExpression',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.logicalExpression.',
                        id: 91,
                    },
                },
                {
                    __typename: 'ObjectDefinitionWithPermission',
                    permission: 31,
                    objectDefinition: {
                        __typename: 'ObjectDefinition',
                        fieldName: 'configType',
                        objectTypeCode: 'OBJECT_FILTER',
                        fieldPath: '.configType.',
                        id: 92,
                    },
                },
            ],
            targetWorkflowStates: null,
        },
    },
};

const Demo = () => {
    const [open, setOpen] = useState(false);
    return (
        <AppWrapper>
            <IconButton onClick={() => setOpen(!open)}>
                <ScienceIcon />
            </IconButton>
            {open && <TestingTool services={services} testingDataInput={data} onClose={() => setOpen(false)} />}
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'NOTIFICATION/TestingTool',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof TestingTool>;
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
