import { BaseNotificationConfig, Detail } from '../ConfigNotification/type';

export interface IAddFilter extends BaseNotificationConfig {
    onValid: (valid: boolean) => void;
    onSubmitData: (newValue: Detail[]) => void;
    notificationConfigDetailPermissions: boolean;
}

export const LastPointType = {
    TELEGRAM: 'telegram',
    EMAIL: 'email',
    USER_IDS: 'user_ids',
    USER_GROUP_IDS: 'user_group_ids',
};
