import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Event as EventIcon } from '@mui/icons-material';
import Layout from '../common/Layout';
import { AdvancedSearch } from 'AWING';
import { Autorenew, Place } from '@mui/icons-material';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/AdvancedSearch',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: AdvancedSearch,
} satisfies Meta<typeof AdvancedSearch>;
// #endregion Meta

type AddressType = {
    code: string;
    name: string;
};

enum PlaceStatus {
    Active = 0,
    OnPause = 1,
    Maintenance = 2,
    InActive = 3,
}
const provinces: AddressType[] = [
    {
        code: ' 21',
        name: 'Hải Dương',
    },
    {
        code: '100000',
        name: 'Hà Nội',
    },
];
const districts: AddressType[] = [];
const communes: AddressType[] = [];

const Demo = (props: any) => {
    const [value, setValue] = useState<any>([]);

    return (
        <Layout>
            <AdvancedSearch {...props} value={value} onChangeValue={setValue} />
        </Layout>
    );
};

export const Simple: Story = {
    args: {
        expanded: true,
        fields: [
            {
                fieldName: 'province',
                label: 'Tỉnh',
                type: 'autocomplete',
                icon: <Place fontSize="small" />,
                options: provinces.map((item) => ({
                    text: item.name!,
                    value: item.code!,
                    key: item.code,
                })),
            },
            {
                fieldName: 'district',
                icon: <Place fontSize="small" />,
                label: 'Quận, huyện',
                type: 'autocomplete',
                options: districts.map((item) => ({
                    text: item.name!,
                    value: item.code!,
                    key: item.code,
                })),
            },
            {
                fieldName: 'ward',
                icon: <Place fontSize="small" />,
                label: 'Phường, xã',
                type: 'autocomplete',
                options: communes.map((item) => ({
                    text: item.name!,
                    value: item.code!,
                    key: item.code,
                })),
            },
        ],
        onChangeValue: (newValue) => {
            // console.log('newValue', newValue);
        },
    },
    render: (args) => {
        return <Demo {...args} />;
    },
};

export const FullTypeOfField: Story = {
    args: {
        expanded: true,
        fields: [
            {
                fieldName: 'autocomplete_field',
                label: 'Autocomplete Label',
                type: 'autocomplete',
                icon: <Autorenew fontSize="small" />,
                defaultValue: { text: 'Option 1', value: '1' },
                options: [
                    { text: 'Option 1', value: '1' },
                    { text: 'Option 2', value: '2' },
                    { text: 'Option 3', value: '3' },
                ],
            },
            {
                fieldName: 'select_field',
                label: 'Select Field',
                type: 'select',
                options: [
                    { text: 'Option 1', value: '1' },
                    { text: 'Option 2', value: '2' },
                    { text: 'Option 3', value: '3' },
                ],
            },
            {
                fieldName: 'date_range_field',
                label: 'DateRange Field',
                type: 'date-range',
                icon: <EventIcon />,
            },
            {
                fieldName: 'directory_field',
                label: 'Directory Field',
                type: 'directory',
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
            },
        ],
        onChangeValue: (newValue) => {
            console.log('newValue', newValue);
        },
    },
    render: (args) => {
        return <Demo {...args} />;
    },
};

export default meta;
