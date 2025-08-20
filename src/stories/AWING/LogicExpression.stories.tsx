import LogicExpression from 'AWING/LogicExpression';
import Layout from '../common/Layout';
import { Meta, StoryObj } from '@storybook/react';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/LogicExpression',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: LogicExpression,
} satisfies Meta<typeof LogicExpression>;
// #endregion Meta

export const Simple: Story = {
    args: {
        value: '',
        objectStructures: [
            {
                o: {
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
            },
            {
                c: {
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
            },
        ],
        functionStructures: [
            {
                name: 'isNull',
                returnType: 'boolean',
                parameters: ['object'],
            },
            {
                name: 'now',
                returnType: 'date',
                parameters: [],
            },
            {
                name: 'dateToString',
                returnType: 'string',
                parameters: ['date', 'string?'],
            },
            {
                name: 'stringToDate',
                returnType: 'date',
                parameters: ['string', 'string'],
            },
            {
                name: 'any',
                returnType: 'boolean',
                parameters: ['array(any)', 'condition(0)'],
            },
            {
                name: 'count',
                returnType: 'number',
                parameters: ['array(any)'],
            },
        ],
        onChange: (expresstion: string | undefined, isValid: boolean) => {
            console.log('Expression: ', expresstion, isValid);
        },
    },
    render: (args) => {
        return (
            <Layout>
                <LogicExpression variant="standard" label="Logic Expression" {...args} />
            </Layout>
        );
    },
};

export default meta;
