import { Meta, StoryObj } from '@storybook/react';
import DataForm from 'AWING/DataForm';
import Layout from '../common/Layout';
import { FieldDefinitionProps } from 'AWING/DataInput/interfaces';
import { IMultipleHierarchicalChoiceInput } from 'AWING/MultipleHierarchicalChoice';
import { FIELD_TYPE } from 'AWING/DataInput';
import React from 'react';

export type Story = StoryObj<typeof meta>;

// #region Meta
const meta = {
    title: 'AWING/DataForm',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: DataForm,
} satisfies Meta<typeof DataForm>;
// #endregion Meta

const fields: FieldDefinitionProps[] = [
    {
        fieldName: 'name',
        label: 'Name',
        gridSize: 12,
        type: FIELD_TYPE.TEXT,
        // required: true,
        defaultValue: 'John Doe',
    },
    {
        fieldName: 'age',
        label: 'Age',
        gridSize: 12,
        type: FIELD_TYPE.NUMBER,
        required: true,
        defaultValue: 12,
    },
    {
        type: FIELD_TYPE.CUSTOM,
        fieldName: 'custom',
        label: 'Custom',
        component: (
            <div>
                <label>Custom field</label>
                <input type="file" />
            </div>
        ),
    },
    // {
    //     fieldName: 'total',
    //     label: 'Total',
    //     gridSize: 12,
    //     type: FIELD_TYPE.NUMBER,
    //     autoFormula: '{price}*{quantity}',
    // },
    // {
    //     type: FIELD_TYPE.GEO_FENCING,
    //     gridSize: 12,
    //     fieldName: 'geoFencing',
    //     label: 'GeoFencing',
    //     lable: 'GeoFencing',
    //     configs: {
    //         GOOGLE_MAP_KEY: 'your-google-maps-api-key-here',
    //         // Add required GeoFencing configuration properties here
    //     },
    // },
    {
        type: FIELD_TYPE.MONACO_EDITOR,
        gridSize: 12,
        fieldName: 'monaco',
        label: 'Monaco Editor',
        // defaultValue: '{"Id":0,"Name":null,"Groups":[],"Charts":[],"ReportColumnDefinitions":[],"ReportFilterDefinitions":[]}',
        // value: '{}',
    },
    // {
    //     type: FIELD_TYPE.CHECKBOX,
    //     gridSize: 12,
    //     fieldName: 'checkbox',
    //     label: 'Checkbox',
    //     defaultValue: true,
    // },
    {
        type: FIELD_TYPE.DATE,
        gridSize: 12,
        fieldName: 'date',
        label: 'Date',
        required: true,
        defaultValue: new Date(),
    },
    {
        type: FIELD_TYPE.MONTH,
        gridSize: 12,
        fieldName: 'month',
        label: 'Month',
        required: true,
    },
    {
        type: FIELD_TYPE.LOGIC_EXPRESSION,
        gridSize: 12,
        fieldName: 'logicExpression',
        label: 'Logic Expression',
        required: true,
        objectStructures: [],
        functionStructures: [],
    },
    // {
    //     type: FIELD_TYPE.DATE_RANGE,
    //     gridSize: 12,
    //     fieldName: 'dateRange',
    //     label: 'Date Range',
    //     required: true,
    // },

    // {
    //     fieldName: 'select',
    //     type: FIELD_TYPE.SELECT,
    //     label: 'Select',
    //     required: true,
    //     options: [
    //         { text: 'Option 1', value: 'option1' as string, level: 2 },
    //         { text: 'Option 2', value: 'option2' as string, level: 2 },
    //     ],
    //     multiple: false,
    // },
    {
        type: FIELD_TYPE.AUTOCOMPLETE,
        gridSize: 22,
        fieldName: 'autocomplete',
        label: 'Autocomplete',
        required: true,
        multiple: false,
        options: [
            { text: 'Option 2', value: 'option2' },
            { text: 'Option 1', value: 'option1' },
            { text: 'Option 3', value: 'option3' },
        ],
        // disabled: true,
    },
    {
        type: FIELD_TYPE.MULTIPLE_HIERARCHICAL,
        gridSize: 12,
        fieldName: 'multipleHierarchical',
        label: 'Multiple Hierarchical',
        required: true,
        options: [{}] as IMultipleHierarchicalChoiceInput[],
        disabled: true,
    },
    {
        type: FIELD_TYPE.DATE_RANGE,
        gridSize: 12,
        fieldName: 'dateRange',
        label: 'Date Range',
        required: true,
    },
    // {
    //     type: FIELD_TYPE.RADIO,
    //     gridSize: 12,
    //     fieldName: 'radio',
    //     label: 'Radio',
    //     required: true,
    //     options: [
    //         { text: 'Option 1', value: 'option1' },
    //         { text: 'Option 2', value: 'option2' },
    //     ],
    // }
];

const DemoForm = () => {
    const [value, setValue] = React.useState({ name: 'John Doe', autocomplete: '', logicExpression: '1 = 1' });

    const getFieldSupplier = React.useCallback(() => {
        const result = [];
        switch (value['autocomplete']) {
            case 'option2':
                result.push({
                    fieldName: 'demo-callback',
                    label: 'Demo Callback',
                    gridSize: 12,
                    type: FIELD_TYPE.TEXT,
                    // required: true,
                    defaultValue: 'Value 2',
                });
                break;

            default:
                result.push({
                    fieldName: 'demo-callback',
                    label: 'Demo Callback',
                    gridSize: 12,
                    type: FIELD_TYPE.TEXT,
                    // required: true,
                    defaultValue: 'Value 1',
                });
                break;
        }

        return result;
    }, [value]) as any;

    const fields: FieldDefinitionProps[] = [
        {
            fieldName: 'name',
            label: 'Name',
            gridSize: 12,
            type: FIELD_TYPE.TEXT,
            // required: true,
            defaultValue: 'John Doe',
            value: '',
        },
        {
            fieldName: 'age',
            label: 'Age',
            gridSize: 12,
            type: FIELD_TYPE.NUMBER,
            required: true,
            defaultValue: 12,
        },
        {
            type: FIELD_TYPE.CUSTOM,
            fieldName: 'custom',
            label: 'Custom',
            component: (
                <div>
                    <label>Custom field</label>
                    <input type="file" />
                </div>
            ),
        },
        ...getFieldSupplier(),
        {
            type: FIELD_TYPE.MONACO_EDITOR,
            gridSize: 12,
            fieldName: 'monaco',
            label: 'Monaco Editor',
            // defaultValue: '{"Id":0,"Name":null,"Groups":[],"Charts":[],"ReportColumnDefinitions":[],"ReportFilterDefinitions":[]}',
            // value: '{}',
        },
        {
            type: FIELD_TYPE.DATE,
            gridSize: 12,
            fieldName: 'date',
            label: 'Date',
            required: true,
            defaultValue: new Date(),
        },
        {
            type: FIELD_TYPE.MONTH,
            gridSize: 12,
            fieldName: 'month',
            label: 'Month',
            required: true,
        },
        {
            type: FIELD_TYPE.AUTOCOMPLETE,
            gridSize: 22,
            fieldName: 'autocompleteSingle',
            label: 'Autocomplete Single',
            required: true,
            multiple: false,
            options: [
                { text: 'Option 2', value: 'option2' },
                { text: 'Option 1', value: 'option1' },
                { text: 'Option 3', value: 'option3' },
            ],

            // disabled: true,
        },
        {
            type: FIELD_TYPE.AUTOCOMPLETE,
            gridSize: 22,
            fieldName: 'autocompleteMultiple',
            label: 'Autocomplete Multiple',
            required: true,
            multiple: true,
            options: [
                { text: 'Option 2', value: 'option2' },
                { text: 'Option 1', value: 'option1' },
                { text: 'Option 3', value: 'option3' },
            ],
        },
        {
            type: FIELD_TYPE.MULTIPLE_HIERARCHICAL,
            gridSize: 12,
            fieldName: 'multipleHierarchical',
            label: 'Multiple Hierarchical',
            required: true,
            options: [{}] as IMultipleHierarchicalChoiceInput[],
            disabled: true,
        },
        {
            type: FIELD_TYPE.DATE_RANGE,
            gridSize: 12,
            fieldName: 'dateRange',
            label: 'Date Range',
            required: true,
        },
        {
            type: FIELD_TYPE.SELECT,
            multiple: false,
            options: [
                { text: 'Option 1', value: 1 },
                { text: 'Option 2', value: 2 },
                { text: 'Option 3', value: 3 },
            ],
            fieldName: 'selectSingle',
            label: 'Select Single',
            required: true,
            defaultValue: 2,
        },
        {
            type: FIELD_TYPE.SELECT,
            multiple: true,
            options: [
                { text: 'Option 1', value: 'option1' },
                { text: 'Option 2', value: 'option2' },
                { text: 'Option 3', value: 'option3' },
            ],
            fieldName: 'selectMultiple',
            label: 'Select Multiple',
            required: true,
            defaultValue: ['option1'],
        },
        {
            type: FIELD_TYPE.LOGIC_EXPRESSION,
            gridSize: 12,
            fieldName: 'logicExpression',
            label: 'Logic Expression',
            required: true,
            objectStructures: [],
            functionStructures: [],
        },
    ];

    const handleUpdate = (fieldsToUpdate: FieldDefinitionProps[], formValid: boolean, key?: string) => {
        console.log('check return value', fieldsToUpdate, formValid, key);

        setValue((prev) => ({ ...prev, [key ?? '']: fieldsToUpdate }));
    };

    return <DataForm fields={fields} oldValue={value} onUpdate={handleUpdate} />;
};

export const Simple: Story = {
    args: {
        fields: fields,
        onUpdate: () => {},
    },
    render: (args) => {
        return (
            <Layout>
                <DemoForm />
            </Layout>
        );
    },
};

export default meta;
