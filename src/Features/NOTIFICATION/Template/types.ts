import { SortInputType } from 'Features/types';

export type FieldPermissions = {
    objectType: boolean;
    configType: boolean;
    name: boolean;
    channelType: boolean;
    contentType: boolean;
    title: boolean;
    content: boolean;
};

export type NotificationConfigDetail = {
    id?: number;
};

export type SchemaDetail = {
    id?: number;
};

export type ObjectDefinition = {
    description?: string;
    fieldName?: string;
    fieldPath?: string;
    fieldType?: string;
    id?: number;
    isPrimaryKey?: boolean;
    objectTypeCode?: string;
    schemaDetails?: SchemaDetail[];
};

export type ObjectDefinitionWithPermission = {
    objectDefinition?: ObjectDefinition;
    permission?: number;
};

export type OutputFieldPermission = {
    objectDefinitionWithPermissions?: Array<ObjectDefinitionWithPermission>;
};

export type Schema = {
    id?: number;
};

export type SubscriptionConfigDetail = {
    id?: number;
};

export type Template = {
    channelType?: string;
    configType?: string;
    content?: string;
    contentType?: string;
    id?: number;
    name?: string;
    notificationConfigDetails?: Array<NotificationConfigDetail>;
    objectType?: string;
    outputFieldPermission?: OutputFieldPermission;
    schema?: Schema;
    schemaId?: number;
    subscriptionConfigDetails?: Array<SubscriptionConfigDetail>;
    title?: string;
};

export type SortInput = SortInputType<Template>;

export type ConvertObjectDefinition = ObjectDefinition & {
    isReadOnly?: boolean;
    isEnable?: boolean;
    isDisable?: boolean;
    childs?: ConvertObjectDefinition[];
};

export type TemplateInput = {
    channelType?: string;
    configType?: string;
    content?: string;
    contentType?: string;
    name?: string;
    objectType?: string;
    schemaId?: number;
    title?: string;
};

export type TemplateGenerationInput = {
    changedObjectJson?: string;
    id?: number;
    objectId?: number;
    oldObjectJson?: string;
    template?: TemplateInput;
};
