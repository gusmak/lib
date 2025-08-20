import { Meta, StoryObj } from '@storybook/react';
import Layout from '../common/Layout';

export type Story = StoryObj<typeof meta>;

import DataInput from 'AWING/DataInput';
import { GeoFencingDefinition } from 'AWING/DataInput/components/GeoFencingInput';
import { RadioFieldDefinition } from 'AWING/DataInput/components/RadioInput';
import { BaseFieldDefinition, FIELD_TYPE } from 'AWING/DataInput';
import { GeoFencingValue } from 'AWING/GeoFencing';

const fieldDefinitionGeoFecing: BaseFieldDefinition<GeoFencingValue> = {
    gridSize: 12,
    readOnly: false,
    autoFormula: '',
    disableHelperText: false,
    label: 'label',
    // customeFieldChange: (fieldValue: any) => ({ latitude: 0, longitude: 0, radius: 0 }),
    onChange: (newValue: GeoFencingValue | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
};

const fieldDefinitionRadio: BaseFieldDefinition<string> = {
    gridSize: 12,
    defaultValue: '',
    readOnly: false,
    autoFormula: '',
    value: '',
    disableHelperText: false,
    label: 'label',
    // customeFieldChange: (fieldValue: any) => '',
    onChange: (newValue: string | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
};

const radio: RadioFieldDefinition = {
    ...fieldDefinitionRadio,
    type: FIELD_TYPE.RADIO,
    options: [
        { value: 'option1', text: 'Option 1', label: 'Option 1' },
        { value: 'option2', text: 'Option 2', label: 'Option 2' },
    ],
};

const LogicExpression: BaseFieldDefinition<string> = {
    gridSize: 12,
    defaultValue: '',
    readOnly: false,
    autoFormula: '',
    value: 'Awing',
    disableHelperText: false,
    label: 'Logic Expression',
    // customeFieldChange: (fieldValue: any) => '',
    onChange: (newValue: string | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
};

const logicExpression = {
    ...LogicExpression,
    type: FIELD_TYPE.LOGIC_EXPRESSION as const,
    objectStructures: [],
    functionStructures: [],
};

const AsyncAutocomplete: BaseFieldDefinition<string> = {
    gridSize: 12,
    defaultValue: '',
    readOnly: false,
    autoFormula: '',
    // value: '',
    disableHelperText: false,
    label: 'Async Autocomplete',
    // customeFieldChange: (fieldValue: any) => '',
    onChange: (newValue: string | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
};

const asyncAutocomplete = {
    ...AsyncAutocomplete,
    type: FIELD_TYPE.ASYNC_AUTOCOMPLETE as const,
    fetchData: async (searchString: string) => [] as unknown[],
    getOptionValue: (val: unknown) => String(val),
    getOptionLabel: (val: unknown) => String(val),
};

const CheckBox: BaseFieldDefinition<boolean> = {
    gridSize: 12,
    defaultValue: false,
    readOnly: false,
    autoFormula: '',
    value: true,
    disableHelperText: false,
    label: 'Checkbox',
    // customeFieldChange: (fieldValue: any) => false,
    onChange: (newValue: boolean | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
};

const checkBox = {
    ...CheckBox,
    type: FIELD_TYPE.CHECKBOX as const,
};

const monthTime: BaseFieldDefinition<Date> = {
    gridSize: 12,
    defaultValue: new Date(),
    readOnly: false,
    autoFormula: '',
    value: new Date(),
    disableHelperText: false,
    label: 'Month Time',
    // customeFieldChange: (fieldValue: any) => new Date(),
    onChange: (newValue: Date | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
};

const month = {
    ...monthTime,
    type: FIELD_TYPE.MONTH as const,
};

const dateTime: BaseFieldDefinition<Date> = {
    gridSize: 12,
    defaultValue: new Date(),
    readOnly: false,
    autoFormula: '',
    value: new Date(),
    disableHelperText: false,
    label: 'Date Time',
    // customeFieldChange: (fieldValue: any) => new Date(),
    onChange: (newValue: Date | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
};

const date = {
    ...dateTime,
    type: FIELD_TYPE.DATE as const,
};

const dateRange: BaseFieldDefinition<Date[]> = {
    gridSize: 12,
    defaultValue: [new Date(), new Date()],
    readOnly: false,
    autoFormula: '',
    value: [new Date(), new Date()],
    disableHelperText: false,
    label: 'Date Range',
    // customeFieldChange: (fieldValue: any) => [new Date(), new Date()],
    onChange: (newValue: Date[] | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
};

const dateRage = {
    ...dateRange,
    type: FIELD_TYPE.DATE_RANGE as const,
};

const numberDef: BaseFieldDefinition<number> = {
    gridSize: 12,
    defaultValue: 0,
    readOnly: false,
    autoFormula: '',
    value: 0,
    disableHelperText: false,
    label: 'Number',
    // customeFieldChange: (fieldValue: any) => 0,
    onChange: (newValue: number | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
};

const number = {
    ...numberDef,
    type: FIELD_TYPE.NUMBER as const,
    min: 0,
    max: 100,
};

const radioFieldDefinition: RadioFieldDefinition = {
    ...fieldDefinitionRadio,
    type: FIELD_TYPE.RADIO,
    options: [
        { value: 'option1', text: 'Option 1', label: 'Option 1' },
        { value: 'option2', text: 'Option 2', label: 'Option 2' },
    ],
};

const radioField = {
    ...radioFieldDefinition,
};

const geoFencing: GeoFencingDefinition = {
    ...fieldDefinitionGeoFecing,
    type: FIELD_TYPE.GEO_FENCING,
    lable: 'label', // Adding the missing property
    configs: {
        GOOGLE_MAP_KEY: 'GOOGLE_MAP_KEY',
    },
};

const geoFencingField = {
    ...geoFencing,
};

const MonacoEditor: BaseFieldDefinition<string> = {
    gridSize: 12,
    defaultValue: '',
    readOnly: false,
    autoFormula: '',
    value: 'Awing',
    disableHelperText: false,
    label: 'Monaco Editor',
    // customeFieldChange: (fieldValue: any) => '',
    onChange: (newValue: string | undefined, valid: boolean | undefined) => {},
    fieldName: 'fieldName',
    // width: 200,
};

const monaco = {
    ...MonacoEditor,
    type: FIELD_TYPE.MONACO_EDITOR as const,
    rows: 10,
    width: 200,
};

// #region Meta
const meta = {
    title: 'AWING/DataInput',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    component: DataInput,
} satisfies Meta<typeof DataInput>;
// #endregion Meta

export const Simple: Story = {
    args: {
        // ...geoFencing,
        // ...radio,
        // ...number,
        // ...date,
        // ...logicExpression,
        // ...asyncAutocomplete
        // ...checkBox
        // ...month,
        // ...date,
        // ...dateRage,
        // ...number
        // ...radioField,
        ...geoFencingField,
        // ...monaco
    },
    render: (args) => {
        console.log('abc');
        return (
            <Layout>
                <DataInput {...args} />
            </Layout>
        );
    },
};
export default meta;
