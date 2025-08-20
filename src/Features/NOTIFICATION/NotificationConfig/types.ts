import { SortInputType } from 'Features/types';
import { NotificationConfigDetail, NotificationTemplate, ObjectFilter, UserGroup } from '../components/ConfigNotification/type';
import { NotificationConfigServices } from './Services';
import { User } from 'Features/SYSTEM/User/types';
import { OutputFieldPermission } from '../SubscriptionConfig';
export interface NotificationConfigProps {
    services: NotificationConfigServices;
}

export type NotificationConfig = {
    id?: number;
    name?: string;
    baseObjectType?: string;
    transactionType?: string;
    status?: boolean;
    details?: Array<NotificationConfigDetail>;
    outputFieldPermission?: OutputFieldPermission;
};

export type SortInput = SortInputType<NotificationConfig>;

export interface Info {
    baseObjectType?: string;
    transactionType?: string;
    name?: string;
    status?: boolean;
}

export enum ChannelType {
    Email = 'EMAIL',
    InApp = 'IN_APP',
    Telegram = 'TELEGRAM',
}

export type NotificationConfigDetailRequestGqlInput = {
    channelType?: ChannelType;
    email?: string;
    objectFilterId?: number;
    telegramChatId?: number;
    templateId?: number;
    userGroupId?: number;
    userId?: number;
};

export type KeyValueNotificationConfigDetailRequestGqlInput = {
    key?: number;
    value?: NotificationConfigDetailRequestGqlInput;
};

export type NotificationConfigInput = {
    name?: string;
    notificationConfigDetails?: Array<KeyValueNotificationConfigDetailRequestGqlInput>;
    baseObjectType?: string;
    status?: boolean;
    transactionType?: string;
};
export type NotificationTemplateInput = {};
export type ObjectFilterInput = {
    configType?: string;
    logicalExpression?: string;
    name?: string;
    objectType?: string;
};

export type TestingInput = {
    changedObjectJson?: string;
    emailReceivers?: string;
    notificationConfigInput?: NotificationConfigInput;
    notificationTemplateInput?: NotificationTemplateInput;
    objectFilterInput?: ObjectFilterInput;
    oldObjectJson?: string;
    telegramReceivers?: string;
};

export interface TestingDataInput extends TestingInput {
    objectId?: number;
    objectFilter?: ObjectFilterInput; //dữ liệu thêm
    notificationTemplate?: NotificationTemplateInput; //dữ liệu thêm
}

export type NotificationConfigDataType = {
    notificationConfig: NotificationConfigType;
};

export type NotificationConfigType = {
    id?: number;
    name?: string;
    baseObjectType?: string;
    transactionType?: string;
    status?: boolean;
    details?: NotificationConfigDetail[];
    outputFieldPermission?: OutputFieldPermission;
};

export type ObjectFiltersCollectionSegment = {
    objectFilters: {
        totalCount: number;
        items: ObjectFilter[];
    };
};

export type NotificationTemplatesCollectionSegment = {
    totalCount: number;
    notificationTemplates: {
        items: NotificationTemplate[];
    };
};

export type UsersCollectionSegment = {
    totalCount: number;
    users: {
        items: User[];
    };
};

export type UserGroupCollectionSegment = {
    totalCount: number;
    userGroups: {
        items: UserGroup[];
    };
};

export type fieldEditPermissionType = {
    baseObjectType: boolean;
    transactionType: boolean;
    name: boolean;
    status: boolean;
    notificationConfigDetails: boolean;
};
