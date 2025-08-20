import { Group } from 'Features/SYSTEM/Group/types';
import { User } from 'Features/SYSTEM/User/types';
import { PagingQueryInput } from 'Features/types';
import { NotificationTemplates, ObjectFilter } from '../components/ConfigNotification/type';
import { SubscriptionConfigRequestGqlInput, SubscriptionConfigsType } from './types';

export type SubscriptionConfigServices = {
    getSubscriptionConfigs: (p?: PagingQueryInput<SubscriptionConfigsType>) => Promise<{ items: SubscriptionConfigsType[]; total: number }>;
    deleteSubscriptionConfig: (p: { id: number }) => Promise<void>;
    getById: (p: { id: number }) => Promise<SubscriptionConfigsType>;
    createSubscriptionConfig: (p: { input: SubscriptionConfigRequestGqlInput }) => Promise<void>;
    updateSubscriptionConfig: (p: { input: SubscriptionConfigRequestGqlInput; id: number }) => Promise<void>;
    getObjectFilter: () => Promise<{ items: ObjectFilter[]; total: number }>;
    getSubscriptionTemplates: () => Promise<{ items: NotificationTemplates[]; total: number }>;
    getUsers: () => Promise<{ items: User[]; total: number }>;
    getUserGroups: () => Promise<{ items: Group[]; total: number }>;
};
