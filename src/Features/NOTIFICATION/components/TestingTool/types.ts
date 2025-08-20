import { ObjectFilterInput } from 'Features/NOTIFICATION/ObjectFilter';

export type ProcessedData = {
    moduleTitle: string;
    objectTypeCode: string;
    emails: string;
    telegrams: string;
    hasEmailChannel: boolean;
    hasTelegramChannel: boolean;
    formValid: boolean;
};

export type NotificationTemplateInput = {
    id?: number;
    name?: string;
    title?: string;
    channelType?: string;
    configType?: string;
    content?: string;
    contentType?: string;
    objectType?: string;
    schemaId?: number;
};

export type NotificationConfigDetailInput = {
    channelType?: string;
    email?: string;
    objectFilterId?: number;
    telegramChatId?: number;
    templateId?: number;
    userGroupId?: number;
    userId?: string;
};

export type ObjectDataInputOfNotificationConfigDetailInput = {
    id?: string | number;
    value?: NotificationConfigDetailInput;
};

export type NotificationConfigInput = {
    name?: string;
    notificationConfigDetails?: Array<ObjectDataInputOfNotificationConfigDetailInput>;
    objectType?: string;
    status?: boolean;
    transactionType?: string;
};

export type TestingInput = {
    changedObjectJson?: string;
    emailReceivers?: string;
    notificationConfigInput?: NotificationConfigInput;
    templateInput?: NotificationTemplateInput;
    objectFilterInput?: ObjectFilterInput;
    oldObjectJson?: string;
    telegramReceivers?: string;
};

export type TestingDataInput = TestingInput & {
    objectId?: number;
    objectFilter?: ObjectFilterInput; //dữ liệu thêm
    notificationTemplate?: NotificationTemplateInput; //dữ liệu thêm
};

export type FullEditorConfig = {
    position: 0 | 1; // 0: oldObjectJson, 1: changedObjectJson
    isOpen: boolean;
    content: string;
};
