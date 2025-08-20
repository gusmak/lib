import { NotificationConfigServices } from 'Features/NOTIFICATION/NotificationConfig/Services';
import { NotificationConfig, NotificationConfigDataType } from 'Features/NOTIFICATION/NotificationConfig/types';

const resData: NotificationConfig[] = [
    {
        id: 647,
        name: 'aaa',
        objectType: 'MEDIA_PLAN',
        transactionType: 'MEDIA_PLAN_CREATE',
        status: true,
        outputFieldPermission: {
            objectDefinitionWithPermissions: [
                {
                    permission: 31,
                    objectDefinition: {
                        fieldName: 'id',
                        objectTypeCode: 'NOTIFICATION_CONFIG',
                    },
                },
            ],
        },
    },
];

export const services: NotificationConfigServices = {
    getNotificationConfigs: (p) => {
        return Promise.resolve({
            notificationConfigs: resData,
            total: resData.length,
        });
    },
    getObjectFilter: () => {
        return Promise.resolve({
            objectFilters: {
                totalCount: 15,
                items: [
                    {
                        id: 1,
                        name: 'Gửi thông tin nghiệm thu',
                        objectType: 'MEDIA_PLAN',
                        logicalExpression: 'o.Status <= 400 AND c.Status = 500',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 10,
                        name: 'Có thông tin đối soát mới',
                        objectType: 'RECONCILIATION_PERIOD',
                        logicalExpression:
                            '(o=null OR o.Status = null OR o.Status != 200) AND c.Status=200 AND any(c.ReconciliationMediaPlans)',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 11,
                        name: 'Có yêu cầu chỉnh sửa chưa trả lời',
                        objectType: 'RECONCILIATION_PERIOD',
                        logicalExpression:
                            'o.Status=200 AND any(c.ReconciliationMediaPlans, any(i.ReconciliationMediaPlanDescriptions, (i.Id = 0 OR i.Id = null) AND i.ParentId=null))',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 12,
                        name: 'Đã trả lời yêu cầu chỉnh sửa',
                        objectType: 'RECONCILIATION_PERIOD',
                        logicalExpression:
                            'o.Status=200 AND any(c.ReconciliationMediaPlans, any(i.ReconciliationMediaPlanDescriptions, (i.Id = 0 OR i.Id=null) AND i.ParentId != null))',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 137,
                        name: 'Subscription thông tin về các MediaPlan có Name MMS_Sting_T10-11/23',
                        objectType: 'MEDIA_PLAN',
                        logicalExpression: 'c.Name = "MMS_Sting_T10-11/23"',
                        configType: 'OBJECT_ONLY',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 227,
                        name: 'Đổ Menu cho Workspace',
                        objectType: 'MENU',
                        logicalExpression: 'o.Id > 0',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 228,
                        name: 'Đổ Filter cho Workspace',
                        objectType: 'OBJECT_FILTER',
                        logicalExpression: 'o.Id > 0',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 229,
                        name: 'Đổ NotificationTemplate cho Workspace',
                        objectType: 'TEMPLATE',
                        logicalExpression: 'o.Id > 0',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 230,
                        name: 'Đổ MediaPlan cho Workspace theo customer ',
                        objectType: 'MEDIA_PLAN',
                        logicalExpression:
                            'any(o.MediaPlanCampaigns, any(i.MediaPlanCampaignDetails, any(i.MediaPlanCampaignDetailSuppliers, i.CustomerId = {CustomerId})))',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 231,
                        name: 'Đổ ReconciliationPeriod cho Workspace theo CustomerId',
                        objectType: 'RECONCILIATION_PERIOD',
                        logicalExpression: 'o.CustomerId= {CustomerId}',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                    {
                        id: 240,
                        name: 'Chia sẻ bộ định nghĩa REPORT',
                        objectType: 'REPORT',
                        logicalExpression: 'o.Id = 11',
                        configType: 'OBJECT_AND_CHANGED',
                        outputFieldPermission: {
                            currentWorkflowState: null,
                            objectDefinitionWithPermissions: [
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'id',
                                        fieldPath: '.id.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'name',
                                        fieldPath: '.name.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'objectType',
                                        fieldPath: '.objectType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'logicalExpression',
                                        fieldPath: '.logicalExpression.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                                {
                                    permission: 31,
                                    objectDefinition: {
                                        fieldName: 'configType',
                                        fieldPath: '.configType.',
                                        objectTypeCode: 'OBJECT_FILTER',
                                    },
                                },
                            ],
                            targetWorkflowStates: null,
                        },
                    },
                ].map((item) => ({
                    ...item,
                    notificationConfigDetails: [],
                    subscriptionConfigDetails: [],
                    workspaceSharings: [],
                })),
            },
        });
    },
    getNotificationTemplates: () => {
        return Promise.resolve({ totalCount: 0, notificationTemplates: { items: [] } });
    },
    getUsers: () => {
        return Promise.resolve({ totalCount: 0, users: { items: [] } });
    },
    getUserGroups: () => {
        return Promise.resolve({ totalCount: 0, userGroups: { items: [] } });
    },
    getNotificationConfigById: (p) => {
        return Promise.resolve({
            notificationConfig: {
                id: 225,
                name: 'Thông báo có số liệu kỳ đối soát',
                objectType: 'RECONCILIATION_PERIOD',
                transactionType: 'RECONCILIATION_CREATE',
                status: false,
                notificationConfigDetails: [
                    {
                        channelType: 'EMAIL',
                        id: 681,
                        objectFilterId: 10,
                        telegramChatId: undefined,
                        email: 'quannq@awing.vn',
                        userId: undefined,
                        userGroupId: undefined,
                        templateId: 10,
                        notificationConfigId: 225,
                        notificationConfig: {
                            id: 0,
                            name: '',
                            objectType: '',
                            transactionType: '',
                            status: false,
                            notificationConfigDetails: [],
                        },
                        objectFilter: {
                            id: 0,
                            name: '',
                            objectType: '',
                            logicalExpression: '',
                            configType: '',
                            outputFieldPermission: {
                                currentWorkflowState: null,
                                targetWorkflowStates: null,
                                objectDefinitionWithPermissions: [],
                            },
                            notificationConfigDetails: [],
                            subscriptionConfigDetails: [],
                            workspaceSharings: [],
                        },
                        template: {
                            id: 0,
                            name: '',
                            objectType: '',
                            contentType: '',
                            channelType: '',
                            configType: '',
                            schema: undefined,
                            title: '',
                            content: '',
                            outputFieldPermission: {
                                currentWorkflowState: null,
                                targetWorkflowStates: null,
                                objectDefinitionWithPermissions: [],
                            },
                            notificationConfigDetails: [],
                            subscriptionConfigDetails: [],
                        },
                    },
                ],
                outputFieldPermission: {
                    currentWorkflowState: null,
                    targetWorkflowStates: null,
                    objectDefinitionWithPermissions: [
                        {
                            permission: 31,
                            objectDefinition: {
                                fieldName: 'id',
                                fieldPath: '.id.',
                                objectTypeCode: 'NOTIFICATION_CONFIG',
                            },
                        },
                        {
                            permission: 31,
                            objectDefinition: {
                                fieldName: 'name',
                                fieldPath: '.name.',
                                objectTypeCode: 'NOTIFICATION_CONFIG',
                            },
                        },
                        {
                            permission: 31,
                            objectDefinition: {
                                fieldName: 'objectType',
                                fieldPath: '.objectType.',
                                objectTypeCode: 'NOTIFICATION_CONFIG',
                            },
                        },
                        {
                            permission: 31,
                            objectDefinition: {
                                fieldName: 'transactionType',
                                fieldPath: '.transactionType.',
                                objectTypeCode: 'NOTIFICATION_CONFIG',
                            },
                        },
                        {
                            permission: 31,
                            objectDefinition: {
                                fieldName: 'status',
                                fieldPath: '.status.',
                                objectTypeCode: 'NOTIFICATION_CONFIG',
                            },
                        },
                        {
                            permission: 31,
                            objectDefinition: {
                                fieldName: 'notificationConfigDetails',
                                fieldPath: '.notificationConfigDetails.',
                                objectTypeCode: 'NOTIFICATION_CONFIG',
                            },
                        },
                    ],
                },
            },
        } as NotificationConfigDataType);
    },
    deleteNotificationConfig: (p) => {
        return Promise.resolve();
    },
    createNotificationConfig: (p) => {
        return Promise.resolve();
    },
    updateNotificationConfig: (p) => {
        return Promise.resolve();
    },
};
