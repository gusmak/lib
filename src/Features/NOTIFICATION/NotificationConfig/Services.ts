import { Group } from 'Features/SYSTEM/Group/types';
import { User } from 'Features/SYSTEM/User/types';
import { PagingQueryInput } from 'Features/types';
import { NotificationTemplates, ObjectFilter } from '../components/ConfigNotification/type';
import { NotificationConfig, NotificationConfigDataType, NotificationConfigInput, NotificationConfigType } from './types';

export const initNotificationConfig: NotificationConfig[] = [
    {
        id: 647,
        name: 'aaa',
        baseObjectType: 'MEDIA_PLAN',
        transactionType: 'MEDIA_PLAN_CREATE',
        status: true,
    },
];

export type NotificationConfigServices = {
    getNotificationConfigs: (p?: PagingQueryInput<NotificationConfig>) => Promise<{ items: NotificationConfigType[]; total: number }>;
    getNotificationConfigById: (p: { id: number }) => Promise<NotificationConfigDataType>;
    getObjectFilter: () => Promise<{ items: ObjectFilter[]; total: number }>;
    getNotificationTemplates: () => Promise<{ items: NotificationTemplates[]; total: number }>;
    getUsers: () => Promise<{ items: User[]; total: number }>;
    getUserGroups: () => Promise<{ items: Group[]; total: number }>;
    deleteNotificationConfig: (p: { id: number }) => Promise<void>;
    createNotificationConfig: (p: { notificationConfig: NotificationConfigInput }) => Promise<void>;
    updateNotificationConfig: (p: { notificationConfig: NotificationConfigInput; id: number }) => Promise<void>;
};
