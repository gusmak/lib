import { SortEnumType } from 'Commons/Enums';
import { Timestamp } from 'Commons/Types';
import { BaseNotificationConfig, Detail } from '../components/ConfigNotification/type';
import { ContentType, ObjectConfigType } from '../enums';
import { ScheduleType } from './enums';

export type SubscriptionConfigSortInput = {
    id?: SortEnumType;
    name?: SortEnumType;
    objectType?: SortEnumType;
    scheduleExpression?: SortEnumType;
    scheduleIntervalDaysOfMonth?: SortEnumType;
    scheduleIntervalDaysOfWeek?: SortEnumType;
    scheduleIntervalEndTime?: SortEnumType;
    scheduleIntervalFromTime?: SortEnumType;
    scheduleIntervalInMinutes?: SortEnumType;
    scheduleStartDate?: SortEnumType;
    scheduleSummary?: SortEnumType;
    scheduleToDate?: SortEnumType;
    scheduleType?: SortEnumType;
    status?: SortEnumType;
};

type WorkflowState = {
    id?: string;
    level?: number;
    name?: string;
    parentId?: string | null;
    priority?: number;
    value?: number;
    workflowId?: number;
};

type ObjectDefinition = {
    fieldName?: string;
    fieldPath?: string;
    objectTypeCode?: string;
};

export type ObjectDefinitionWithPermission = {
    permission?: number;
    objectDefinition?: ObjectDefinition;
};

export type OutputFieldPermission = {
    currentWorkflowState?: WorkflowState;
    objectDefinitionWithPermissions?: Array<ObjectDefinitionWithPermission>;
    targetWorkflowStates?: Array<WorkflowState>;
};

type SubscriptionConfigDetail = {
    channelType?: string;
    email?: string;
    id?: number;
    objectFilterId?: number;
    subscriptionConfigId?: number;
    telegramChatId?: number;
    templateId?: number;
    userGroupId?: number;
    userId?: number;
};

export type SubscriptionConfigsType = {
    id?: number;
    name?: string;
    objectType?: string;
    scheduleExpression?: string;
    scheduleIntervalDaysOfMonth?: string;
    scheduleIntervalDaysOfWeek?: string;
    scheduleIntervalEndTime?: string;
    scheduleIntervalInMinutes?: number;
    scheduleIntervalFromTime?: string;
    scheduleSummary?: string;
    status?: boolean;
    scheduleType?: ScheduleType;
    details?: Array<SubscriptionConfigDetail>;
    outputFieldPermission?: OutputFieldPermission;
};

export interface Info {
    objectType?: string;
    name?: string;
    status?: boolean;
}

export interface ISubscriptionConfigAddFilter extends BaseNotificationConfig {
    onSubmitData: (newValue: Detail[]) => void;
    onValid: (valid: boolean) => void;
    notificationConfigDetailPermissions: boolean;
}

export type fieldEditPermissionType = {
    objectType: boolean;
    name: boolean;
    subscriptionConfigDetails: boolean;
    schedulePermissions: {
        scheduleType: boolean;
        scheduleSummary: boolean;
        scheduleIntervalDaysOfWeek: boolean;
        scheduleIntervalDaysOfMonth: boolean;
        scheduleIntervalFromTime: boolean;
        scheduleIntervalEndTime: boolean;
        scheduleStartDate: boolean;
        scheduleIntervalInMinutes: boolean;
        scheduleToDate: boolean;
        scheduleExpression: boolean;
    };
};

export type TemplatesCollectionSegment = {
    totalCount: number;
    items: Template[];
};

export type Template = {
    id: number;
    name: string;
    objectType: string;
    contentType: string;
    channelType: string;
    configType: string;
    schema: any | null;
    outputFieldPermission: OutputFieldPermission;
};

export type SubscriptionConfigDetailInput = {
    channelType?: string;
    email?: string;
    objectFilterId?: number;
    telegramChatId?: number;
    templateId?: number;
    userGroupId?: number;
    userId?: string;
};

export type ObjectDataInputOfSubscriptionConfigDetailInput = {
    id?: number;
    value?: SubscriptionConfigDetailInput;
};

export enum SharingConfigParamType {
    Filter = 'FILTER',
    Schema = 'SCHEMA',
}

export type SharingWorkspaceConfigRequestGqlInput = {
    paramName?: string;
    paramType?: SharingConfigParamType;
    paramValue?: string;
    sharingWorkspaceId?: number;
};

export type KeyValueSharingWorkspaceConfigGqlInput = {
    key?: number;
    value?: SharingWorkspaceConfigRequestGqlInput;
};

export type SharingWorkspaceRequestGqlInput = {
    sharingId?: number;
    sharingWorkspaceConfigs?: Array<KeyValueSharingWorkspaceConfigGqlInput>;
    targetWorkspaceId?: number;
};

export type KeyValueSharingWorkspaceRequestGqlInput = {
    key?: number;
    value?: SharingWorkspaceRequestGqlInput;
};

export type SubscriptionConfigDetailRequestGqlInput = {
    channelType?: string;
    email?: string;
    objectFilterId?: number;
    telegramChatId?: number;
    templateId?: number;
    userGroupId?: number;
    userId?: number;
};

export type KeyValueSubscriptionConfigDetailRequestGqlInput = {
    key?: number;
    value?: SubscriptionConfigDetailRequestGqlInput;
};

export type SubscriptionConfigRequestGqlInput = {
    name?: string;
    objectType?: string;
    scheduleExpression?: string;
    scheduleIntervalDaysOfMonth?: string;
    scheduleIntervalDaysOfWeek?: string;
    scheduleIntervalEndTime?: string;
    scheduleIntervalFromTime?: string;
    scheduleIntervalInMinutes?: number;
    scheduleStartDate?: Timestamp;
    scheduleSummary?: string;
    scheduleToDate?: Timestamp;
    scheduleType?: ScheduleType;
    status?: boolean;
    subscriptionConfigDetails?: Array<KeyValueSubscriptionConfigDetailRequestGqlInput>;
};

export type NofiticationTemplate = {
    channelType?: string;
    configType?: ObjectConfigType;
    content?: string;
    contentType?: ContentType;
    id?: number;
    name?: string;
    objectType?: string;
    title?: string;
};
