import { ChannelType, ContentType, ObjectConfigType } from 'Features/NOTIFICATION/enums';
import { OutputFieldPermission } from 'Features/NOTIFICATION/SubscriptionConfig';
import { User } from 'Features/SYSTEM/User/types';
import { DateTime } from 'Features/types';

export type NotificationConfig = {
    id: number;
    name: string;
    notificationConfigDetails: Array<NotificationConfigDetail>;
    objectType: string;
    outputFieldPermission?: OutputFieldPermission;
    status: boolean;
    transactionType: string;
};

export type MediaPlan = {};
export type MediaPlanAcceptanceAdjustment = {};
export type MediaPlanAcceptanceFileSupplier = {};
export type MediaPlanAcceptanceFile = {};
export type MediaPlanAcceptance = {};
export type NotificationConfigDetail = {
    channelType?: string;
    email?: string;
    objectFilterId?: number;
    telegramChatId?: number | string | bigint;
    templateId?: number;
    userGroupId?: number;
    userId?: number;
    id?: number;
};
export type ReconciliationMediaPlanDescription = {};
export type RoleAuthen = {};

export type SubscriptionConfig = {
    id: number;
    name?: string;
    objectType: string;
    outputFieldPermission?: OutputFieldPermission;
    scheduleExpression: string;
    scheduleIntervalDaysOfMonth?: string;
    scheduleIntervalDaysOfWeek?: string;
    scheduleIntervalEndTime?: string;
    scheduleIntervalFromTime: string;
    scheduleIntervalInMinutes: number;
    scheduleStartDate?: DateTime;
    scheduleSummary: string;
    scheduleToDate?: DateTime;
    scheduleType: string;
    status: boolean;
    subscriptionConfigDetails: Array<SubscriptionConfigDetail>;
};
export type NotificationTemplates = {
    channelType?: ChannelType;
    configType?: ObjectConfigType;
    content?: string;
    contentType?: ContentType;
    id?: number;
    name?: string;
    objectType?: string;
    title?: string;
};

export type SubscriptionConfigDetail = {
    channelType: string;
    email?: string;
    id: number;
    subscriptionConfig: SubscriptionConfig;
    subscriptionConfigId: number;
    objectFilter: ObjectFilter;
    objectFilterId: number;
    telegramChatId?: number;
    template: NotificationTemplates;
    templateId: number;
    user?: User;
    userGroup?: UserGroup;
    userGroupId?: number;
    userId?: string;
};
export type UserGroupDetail = {};
export type WorkspaceUser = {};
export type Workspace = {};
export type Schema = {};
export type WorkspaceSharing = {};

export type BusinessUnit = {
    businessUnitDetails: Array<BusinessUnitDetail>;
    createdDate: DateTime;
    description?: string;
    id: number;
    mediaPlans: Array<MediaPlan>;
    name?: string;
};

export type BusinessUnitDetail = {
    businessUnit: BusinessUnit;
    businessUnitId: number;
    id: number;
    user: User;
    userId: string;
};

export interface LastPoint {
    id?: number;
    type: string;
    receiverId?: number;
    userIds?: string[];
    userGroupIds?: string[];
    email?: string;
    templateId: number;
}

export type UserGroup = {
    description?: string;
    id: number;
    name?: string;
    notificationConfigDetails: Array<NotificationConfigDetail>;
    roleAuthens: Array<RoleAuthen>;
    subscriptionConfigDetails: Array<SubscriptionConfigDetail>;
    userGroupDetails: Array<UserGroupDetail>;
    workspace: Workspace;
    workspaceId: number;
};

export type NotificationTemplate = {
    channelType: string;
    configType: string;
    content: string;
    contentType: string;
    id: number;
    name: string;
    notificationConfigDetails: Array<NotificationConfigDetail>;
    objectType: string;
    outputFieldPermission?: OutputFieldPermission;
    schema?: Schema;
    schemaId?: string;
    subscriptionConfigDetails: Array<SubscriptionConfigDetail>;
    title?: string;
};

export type ObjectFilter = {
    configType?: string;
    id?: number;
    logicalExpression?: string;
    objectTypeCode?: string;
    name?: string;
    notificationConfigDetails?: Array<NotificationConfigDetail>;
    outputFieldPermission?: OutputFieldPermission;
    subscriptionConfigDetails?: Array<SubscriptionConfigDetail>;
    workspaceSharings?: Array<WorkspaceSharing>;
};

export interface Channel {
    channelType: string;
    lastPoints: LastPoint[];
}

export interface Detail {
    objectFilterId: number;
    channels: Channel[];
}

export interface Receiver {
    id: number;
    name: string;
}

export interface BaseNotificationConfig {
    notificationConfigDetails: Detail[];
    users: Partial<User>[];
    groups: Partial<UserGroup>[];
    templates: Partial<NotificationTemplate>[];
    loading?: boolean;
    objectFilters: ObjectFilter[];
    onClickTesting?: (detail: Detail) => void;
}

export interface ITableFilter extends BaseNotificationConfig {
    onSubmitData: (newValue: Detail[]) => void;
    notificationConfigDetailPermissions: boolean;
}

export interface RuleProps {
    objectFilters: ObjectFilter[];
    rule: Detail;
    onChange: (newValue: Detail) => void;
    users: Partial<User>[];
    groups: Partial<UserGroup>[];
    templates: Partial<NotificationTemplate>[];
    objectType: string;
}

export interface ReceiverProps {
    lastPoint: LastPoint;
    onChange: (newValue: LastPoint) => void;
    onDelete: () => void;
    users: Partial<User>[];
    groups: Partial<UserGroup>[];
    templates: Partial<NotificationTemplate>[];
    objectType: string;
}

export interface IConfigFilter extends BaseNotificationConfig {
    onChangeAddFilter: (filter: Detail) => void;
    notificationConfigDetailPermissions: boolean;
}
