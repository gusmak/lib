import { SubscriptionConfigServices } from 'Features/NOTIFICATION/SubscriptionConfig/Service';
import { SubscriptionConfigsType } from 'Features/NOTIFICATION/SubscriptionConfig/types';

export const resData: SubscriptionConfigsType[] = [
    {
        id: 2,
        objectType: 'RECONCILIATION_PERIOD',
        name: 'Sub-Campaign',
        status: true,
        scheduleType: 'MONTHLY',
        scheduleIntervalDaysOfWeek: '',
        scheduleIntervalDaysOfMonth: '11',
        scheduleIntervalFromTime: '00:20:00',
        scheduleIntervalEndTime: null,
        scheduleStartDate: null,
        scheduleIntervalInMinutes: 0,
        scheduleToDate: null,
        scheduleSummary: '20 0 11 * * *',
        scheduleExpression: '20 0 11 * * *',
        subscriptionConfigDetails: [
            {
                channelType: 'FILE',
                id: 3,
                objectFilterId: 11,
                telegramChatId: null,
                email: 'longld@gmail.com',
                userId: null,
                userGroupId: null,
                templateId: 12,
                subscriptionConfigId: 2,
            },
        ],
        outputFieldPermission: {
            currentWorkflowState: null,
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        fieldPath: '.id.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'name',
                        fieldPath: '.name.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'objectType',
                        fieldPath: '.objectType.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleType',
                        fieldPath: '.scheduleType.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleSummary',
                        fieldPath: '.scheduleSummary.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalDaysOfWeek',
                        fieldPath: '.scheduleIntervalDaysOfWeek.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalDaysOfMonth',
                        fieldPath: '.scheduleIntervalDaysOfMonth.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalFromTime',
                        fieldPath: '.scheduleIntervalFromTime.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalEndTime',
                        fieldPath: '.scheduleIntervalEndTime.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleStartDate',
                        fieldPath: '.scheduleStartDate.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleIntervalInMinutes',
                        fieldPath: '.scheduleIntervalInMinutes.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleToDate',
                        fieldPath: '.scheduleToDate.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'scheduleExpression',
                        fieldPath: '.scheduleExpression.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'subscriptionConfigDetails',
                        fieldPath: '.subscriptionConfigDetails.',
                        objectTypeCode: 'SUBSCRIPTION_CONFIG',
                    },
                },
            ],
            targetWorkflowStates: null,
        },
    },
];
const resDataGetById: SubscriptionConfigsType = {
    id: 2,
    objectType: 'RECONCILIATION_PERIOD',
    name: 'Sub-Campaign',
    status: true,
    scheduleType: 'MONTHLY',
    scheduleIntervalDaysOfWeek: '',
    scheduleIntervalDaysOfMonth: '11',
    scheduleIntervalFromTime: '00:20:00',
    scheduleIntervalEndTime: null,
    scheduleStartDate: null,
    scheduleIntervalInMinutes: 0,
    scheduleToDate: null,
    scheduleSummary: '20 0 11 * * *',
    scheduleExpression: '20 0 11 * * *',
    subscriptionConfigDetails: [
        {
            channelType: 'FILE',
            id: 3,
            objectFilterId: 11,
            telegramChatId: null,
            email: 'longld@gmail.com',
            userId: null,
            userGroupId: null,
            templateId: 12,
            subscriptionConfigId: 2,
        },
    ],
    outputFieldPermission: {
        currentWorkflowState: null,
        objectDefinitionWithPermissions: [
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'id',
                    fieldPath: '.id.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'name',
                    fieldPath: '.name.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'objectType',
                    fieldPath: '.objectType.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleType',
                    fieldPath: '.scheduleType.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleSummary',
                    fieldPath: '.scheduleSummary.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleIntervalDaysOfWeek',
                    fieldPath: '.scheduleIntervalDaysOfWeek.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleIntervalDaysOfMonth',
                    fieldPath: '.scheduleIntervalDaysOfMonth.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleIntervalFromTime',
                    fieldPath: '.scheduleIntervalFromTime.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleIntervalEndTime',
                    fieldPath: '.scheduleIntervalEndTime.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleStartDate',
                    fieldPath: '.scheduleStartDate.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleIntervalInMinutes',
                    fieldPath: '.scheduleIntervalInMinutes.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleToDate',
                    fieldPath: '.scheduleToDate.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'scheduleExpression',
                    fieldPath: '.scheduleExpression.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
            {
                permission: 31,
                objectDefinition: {
                    fieldName: 'subscriptionConfigDetails',
                    fieldPath: '.subscriptionConfigDetails.',
                    objectTypeCode: 'SUBSCRIPTION_CONFIG',
                },
            },
        ],
        targetWorkflowStates: null,
    },
};

export const services: SubscriptionConfigServices = {
    getSubscriptionConfigs: (p) => {
        return Promise.resolve({
            subscriptionConfigs: {
                totalCount: resData.length,
                items: resData,
            },
        });
    },
    deleteSubscriptionConfig: (p) => {
        return Promise.resolve();
    },
    getById: (p) => {
        return Promise.resolve(resDataGetById);
    },
    createSubscriptionConfig: (p) => {
        return Promise.resolve();
    },
    updateSubscriptionConfig: (p) => {
        return Promise.resolve();
    },
    getObjectFilter: () => {
        return Promise.resolve({
            objectFilters: {
                totalCount: 0,
                items: [],
            },
        });
    },
    getSubscriptionTemplates: () => {
        return Promise.resolve({ totalCount: 0, items: [] });
    },
    getUsers: () => {
        return Promise.resolve({ totalCount: 0, users: { items: [] } });
    },
    getUserGroups: () => {
        return Promise.resolve({ totalCount: 0, userGroups: { items: [] } });
    },
};
