import { LastPoint } from '../components/ConfigNotification/type';
import { ChannelType } from './types';

export const TransactionTypeMap = [{ value: 1000, label: 'Media Plan Update' }];

export const ChannelTypeMap = [
    { value: ChannelType.Telegram, label: 'Telegram' },
    { value: ChannelType.Email, label: 'Email' },
    { value: ChannelType.InApp, label: 'InApp - web' },
];

export const MediaPlanTransactionType = {
    MEDIA_PLAN_CREATE: 1000,
    MEDIA_PLAN_UPDATE: 1001,
    MEDIA_PLAN_DELETE: 1002,
    MEDIA_PLAN_MANUAL_SEND_EMAIL: 1003,
    MEDIA_PLAN_PAYMENT: 1004,
    MEDIA_PLAN_STATIC_FILE_UPLOAD: 1100,
    MEDIA_PLAN_STATIC_FILE_DELETE: 1101,
};

export const ReconciliationTransactionType = {
    RECONCILIATION_CREATE: 2000,
    RECONCILIATION_UPDATE: 2001,
    RECONCILIATION_DELETE: 2002,
    RECONCILIATION_PAYMENT: 2004,
};

export const SubcriptionConfigTransactionType = {
    SUBSCRIPTION_CONFIG_CREATE: 3000,
    SUBSCRIPTION_CONFIG_UPDATE: 3001,
    SUBSCRIPTION_CONFIG_DELETE: 3002,
};

export const NotificationConfigTransactionType = {
    NOTIFICATION_CONFIG_CREATE: 4000,
    NOTIFICATION_CONFIG_UPDATE: 4001,
    NOTIFICATION_CONFIG_DELETE: 4002,
};

export const NotificationTemplateTransactionType = {
    NOTIFICATION_TEMPLATE_CREATE: 5000,
    NOTIFICATION_TEMPLATE_UPDATE: 5001,
    NOTIFICATION_TEMPLATE_DELETE: 5002,
};

export const ObjectFilterTransactionType = {
    OBJECT_FILTER_CREATE: 6000,
    OBJECT_FILTER_UPDATE: 6001,
    OBJECT_FILTER_DELETE: 6002,
};

export const WorkspaceSharingTransactionType = {
    WORKSPACE_SHARING_CREATE: 7000,
    WORKSPACE_SHARING_UPDATE: 7001,
    WORKSPACE_SHARING_DELETE: 7002,
};

export const WorkspaceDirectoryTransactionType = {
    WORKSPACE_DIRECTORY_CREATE: 8000,
    WORKSPACE_DIRECTORY_UPDATE: 8001,
    WORKSPACE_DIRECTORY_DELETE: 8002,
    WORKSPACE_DIRECTORY_SET_PERMISSION: 8003,
    WORKSPACE_DIRECTORY_REMOVE_PERMISSION: 8004,
};

export const SchemaTransactionType = {
    SCHEMA_CREATE: 9000,
    SCHEMA_UPDATE: 9001,
    SCHEMA_DELETE: 9002,
};

export const BrandTransactionType = {
    BRAND_CREATE: 12000,
    BRAND_UPDATE: 12001,
    BRAND_DELETE: 12002,
};

export const CustomerTransactionType = {
    CUSTOMER_CREATE: 13000,
    CUSTOMER_UPDATE: 13001,
    CUSTOMER_DELETE: 13002,
};

export const BusinessUnitTransactionType = {
    BUSINESS_UNIT_CREATE: 14000,
    BUSINESS_UNIT_UPDATE: 14001,
    BUSINESS_UNIT_DELETE: 14002,
};

export const SupplierTransactionType = {
    SUPPLIER_CREATE: 15000,
    SUPPLIER_UPDATE: 15001,
    SUPPLIER_DELETE: 15002,
};

export const WorkflowTransactionType = {
    WORKFLOW_CREATE: 18000,
    WORKFLOW_UPDATE: 18001,
    WORKFLOW_DELETE: 18002,
};

export const LastPointType = {
    TELEGRAM: 'telegram',
    EMAIL: 'email',
    USER_IDS: 'user_ids',
    USER_GROUP_IDS: 'user_group_ids',
};
export const LastPointTypeObj: Record<string, LastPoint> = {
    [ChannelType.Telegram]: {
        type: LastPointType.TELEGRAM,
        receiverId: 0,
        templateId: 0,
    },
    [ChannelType.Email]: {
        type: LastPointType.EMAIL,
        email: '',
        templateId: 0,
    },
    [ChannelType.InApp]: {
        type: LastPointType.USER_GROUP_IDS,
        email: '',
        templateId: 0,
    },
};
