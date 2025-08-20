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
    key?: string | number;
    value?: NotificationConfigDetailInput;
};
