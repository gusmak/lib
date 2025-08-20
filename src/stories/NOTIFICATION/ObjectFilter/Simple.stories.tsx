import { Meta, StoryObj } from '@storybook/react';
import ObjectFilter from 'Features/NOTIFICATION/ObjectFilter';
import Layout from '../../common/Layout';
import AppWrapper from '../../common/AppWrapper';
import { services } from './services';

export enum ObjectConfigType {
    ObjectAndChanged = 'OBJECT_AND_CHANGED',
    ObjectOnly = 'OBJECT_ONLY',
}

export enum ObjectTypeCode {
    Campaign = 'CAMPAIGN',
    Page = 'PAGE',
    Menu = 'MENU',
    Place = 'Place',
}

const Demo = () => {
    return (
        <AppWrapper>
            <ObjectFilter
                {...services}
                objectTyeCodes={Object.entries(ObjectTypeCode).map(([key, value]) => ({
                    key: key,
                    value: value,
                }))}
                objectConfigTypes={Object.entries(ObjectConfigType).map(([key, value]) => ({
                    key: key,
                    value: value,
                }))}
                logicExpressionsStructure={{
                    objectStructures: {
                        o: [
                            {
                                name: 'string',
                                age: 'number',
                                gender: 'boolean',
                                dob: 'date',
                                address: {
                                    city: 'string',
                                    district: 'string',
                                    ward: 'string',
                                },
                                emails: 'array(string)',
                                occupation: 'enum["ba", "fe", "be"]',
                            },
                        ],
                        c: [
                            {
                                name: 'string',
                                age: 'number',
                                gender: 'boolean',
                                dob: 'date',
                                address: {
                                    city: 'string',
                                    district: 'string',
                                    ward: 'string',
                                },
                                emails: 'array(string)',
                                occupation: 'enum["ba", "fe", "be"]',
                            },
                        ],
                    },
                    functionStructures: [
                        {
                            name: 'benefit',
                            returnType: 'number',
                            parameters: ['number'],
                        },
                        {
                            name: 'exist',
                            returnType: 'boolean',
                            parameters: ['object'],
                        },
                    ],
                }}
            />
        </AppWrapper>
    );
};

// #region Meta
const meta = {
    title: 'NOTIFICATION/ObjectFilter',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: Demo,
} satisfies Meta<typeof ObjectFilter>;
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
