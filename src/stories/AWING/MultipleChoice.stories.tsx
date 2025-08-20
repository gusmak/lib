import { Meta, StoryObj } from '@storybook/react';
import MultipleChoice, { IOption } from 'AWING/MultipleChoice';
import Layout from '../common/Layout';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/MultipleChoice',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: MultipleChoice,
} satisfies Meta<typeof MultipleChoice>;
// #endregion Meta

export const Simple: Story = {
    args: {
        label: 'Multiple Choice',
        placeholder: 'Select option',
        options: [
            { id: '01', name: 'Option 1' },
            { id: '02', name: 'Option 2' },
        ],
        onChange: (values: IOption[]) => {
            console.log('first');
        },
        endAdornmentOptions: [
            { id: 'or', name: '||' },
            { id: 'and', name: '&' },
        ],
        onEndAdornmentValueChange: (newOperator: string) => {
            console.log('change to operator: ', newOperator);
        },
        popupOpen: false,
    },
    render: (args) => {
        return (
            <Layout>
                <MultipleChoice {...args} />
            </Layout>
        );
    },
};

export default meta;
