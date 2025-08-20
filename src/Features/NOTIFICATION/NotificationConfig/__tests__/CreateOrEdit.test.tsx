import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useAppHelper } from 'Context';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { NotificationConfigContext } from '../context';
import CreateOrEdit from '../CreateOrEdit';
import { NotificationConfigServices } from '../Services';
import { NotificationConfigDataType } from '../types';

export enum ObjectTypeCode {
    Ap = 'AP',
    Archive = 'ARCHIVE',
    Attribute = 'ATTRIBUTE',
    AttributeType = 'ATTRIBUTE_TYPE',
    AuthenticationProfile = 'AUTHENTICATION_PROFILE',
    Campaign = 'CAMPAIGN',
    CampaignCollection = 'CAMPAIGN_COLLECTION',
    Group = 'GROUP',
    Holiday = 'HOLIDAY',
    Layout = 'LAYOUT',
    Menu = 'MENU',
    Network = 'NETWORK',
    None = 'NONE',
    NotificationConfig = 'NOTIFICATION_CONFIG',
    NotificationTemplate = 'NOTIFICATION_TEMPLATE',
    ObjectFilter = 'OBJECT_FILTER',
    Page = 'PAGE',
    PageLogin = 'PAGE_LOGIN',
    PageWelcome = 'PAGE_WELCOME',
    Pending = 'PENDING',
    Place = 'PLACE',
    PlaceCustomerInfoCollection = 'PLACE_CUSTOMER_INFO_COLLECTION',
    PlaceGroup = 'PLACE_GROUP',
    Role = 'ROLE',
    RoleTag = 'ROLE_TAG',
    Schema = 'SCHEMA',
    Share = 'SHARE',
    SubscriptionConfig = 'SUBSCRIPTION_CONFIG',
    TaskScheduler = 'TASK_SCHEDULER',
    Template = 'TEMPLATE',
    TransactionLog = 'TRANSACTION_LOG',
    User = 'USER',
    Wizard = 'WIZARD',
    Workflow = 'WORKFLOW',
    Workspace = 'WORKSPACE',
}
export enum SagaTransactionType {
    AdministrativeunitCreate = 'ADMINISTRATIVEUNIT_CREATE',
    AdministrativeunitDelete = 'ADMINISTRATIVEUNIT_DELETE',
    AdministrativeunitUpdate = 'ADMINISTRATIVEUNIT_UPDATE',
    ApControllerClearCache = 'AP_CONTROLLER_CLEAR_CACHE',
    ApCreate = 'AP_CREATE',
    ApDelete = 'AP_DELETE',
    ApUpdate = 'AP_UPDATE',
    AttributeCreate = 'ATTRIBUTE_CREATE',
    AttributeDelete = 'ATTRIBUTE_DELETE',
    AttributeTypeCreate = 'ATTRIBUTE_TYPE_CREATE',
    AttributeTypeDelete = 'ATTRIBUTE_TYPE_DELETE',
    AttributeTypeUpdate = 'ATTRIBUTE_TYPE_UPDATE',
    AttributeUpdate = 'ATTRIBUTE_UPDATE',
    AudienceSumupCalculate = 'AUDIENCE_SUMUP_CALCULATE',
    AuthenticationProfileCreate = 'AUTHENTICATION_PROFILE_CREATE',
    AuthenticationProfileDelete = 'AUTHENTICATION_PROFILE_DELETE',
    AuthenticationProfileUpdate = 'AUTHENTICATION_PROFILE_UPDATE',
    CacheResetAcmFe = 'CACHE_RESET_ACM_FE',
    CampaignApprovalCreate = 'CAMPAIGN_APPROVAL_CREATE',
    CampaignApprovalDelete = 'CAMPAIGN_APPROVAL_DELETE',
    CampaignApprovalUpdate = 'CAMPAIGN_APPROVAL_UPDATE',
    CampaignBlocked = 'CAMPAIGN_BLOCKED',
    CampaignCreate = 'CAMPAIGN_CREATE',
    CampaignDelete = 'CAMPAIGN_DELETE',
    CampaignUpdate = 'CAMPAIGN_UPDATE',
    CaptiveClearCache = 'CAPTIVE_CLEAR_CACHE',
    DirectoryCreate = 'DIRECTORY_CREATE',
    DirectoryDelete = 'DIRECTORY_DELETE',
    DirectoryPermissionDelete = 'DIRECTORY_PERMISSION_DELETE',
    DirectoryPermissionUpdate = 'DIRECTORY_PERMISSION_UPDATE',
    DirectoryUpdate = 'DIRECTORY_UPDATE',
    FolderFileCreate = 'FOLDER_FILE_CREATE',
    GroupCreate = 'GROUP_CREATE',
    GroupDelete = 'GROUP_DELETE',
    GroupUpdate = 'GROUP_UPDATE',
    HolidayCreate = 'HOLIDAY_CREATE',
    HolidayDelete = 'HOLIDAY_DELETE',
    HolidayUpdate = 'HOLIDAY_UPDATE',
    InventoryCreate = 'INVENTORY_CREATE',
    InventoryDelete = 'INVENTORY_DELETE',
    InventoryUpdate = 'INVENTORY_UPDATE',
    ManuallySendMail = 'MANUALLY_SEND_MAIL',
    MenuPermissionCreate = 'MENU_PERMISSION_CREATE',
    MenuPermissionDelete = 'MENU_PERMISSION_DELETE',
    MenuPermissionUpdate = 'MENU_PERMISSION_UPDATE',
    None = 'NONE',
    NotificationConfigCreate = 'NOTIFICATION_CONFIG_CREATE',
    NotificationConfigDelete = 'NOTIFICATION_CONFIG_DELETE',
    NotificationConfigUpdate = 'NOTIFICATION_CONFIG_UPDATE',
    NotificationTemplateCreate = 'NOTIFICATION_TEMPLATE_CREATE',
    NotificationTemplateDelete = 'NOTIFICATION_TEMPLATE_DELETE',
    NotificationTemplateUpdate = 'NOTIFICATION_TEMPLATE_UPDATE',
    ObjectFilterCreate = 'OBJECT_FILTER_CREATE',
    ObjectFilterDelete = 'OBJECT_FILTER_DELETE',
    ObjectFilterUpdate = 'OBJECT_FILTER_UPDATE',
    PageArchive = 'PAGE_ARCHIVE',
    PageCreate = 'PAGE_CREATE',
    PageDelete = 'PAGE_DELETE',
    PageUpdate = 'PAGE_UPDATE',
    PlaceClearCache = 'PLACE_CLEAR_CACHE',
    PlaceCreate = 'PLACE_CREATE',
    PlaceCustomerInfoCreate = 'PLACE_CUSTOMER_INFO_CREATE',
    PlaceCustomerInfoDelete = 'PLACE_CUSTOMER_INFO_DELETE',
    PlaceCustomerInfoUpdate = 'PLACE_CUSTOMER_INFO_UPDATE',
    PlaceDelete = 'PLACE_DELETE',
    PlaceGroupCreate = 'PLACE_GROUP_CREATE',
    PlaceGroupDelete = 'PLACE_GROUP_DELETE',
    PlaceGroupUpdate = 'PLACE_GROUP_UPDATE',
    PlaceJoinApprove = 'PLACE_JOIN_APPROVE',
    PlaceJoinDelete = 'PLACE_JOIN_DELETE',
    PlaceJoinReject = 'PLACE_JOIN_REJECT',
    PlaceJoinRequest = 'PLACE_JOIN_REQUEST',
    PlaceStatsNeedCalculate = 'PLACE_STATS_NEED_CALCULATE',
    PlaceStatsUpdate = 'PLACE_STATS_UPDATE',
    PlaceStatusUpdate = 'PLACE_STATUS_UPDATE',
    PlaceUnjoinApprove = 'PLACE_UNJOIN_APPROVE',
    PlaceUnjoinDelete = 'PLACE_UNJOIN_DELETE',
    PlaceUnjoinReject = 'PLACE_UNJOIN_REJECT',
    PlaceUnjoinRequest = 'PLACE_UNJOIN_REQUEST',
    PlaceUpdate = 'PLACE_UPDATE',
    RemarketingListCreate = 'REMARKETING_LIST_CREATE',
    RemarketingListDelete = 'REMARKETING_LIST_DELETE',
    RemarketingListUpdate = 'REMARKETING_LIST_UPDATE',
    RoleCreate = 'ROLE_CREATE',
    RoleDelete = 'ROLE_DELETE',
    RoleTagCreate = 'ROLE_TAG_CREATE',
    RoleTagDelete = 'ROLE_TAG_DELETE',
    RoleTagUpdate = 'ROLE_TAG_UPDATE',
    RoleUpdate = 'ROLE_UPDATE',
    ScheduleAllCalculate = 'SCHEDULE_ALL_CALCULATE',
    ScheduleCampaignCalculate = 'SCHEDULE_CAMPAIGN_CALCULATE',
    ScheduleNeedCalculate = 'SCHEDULE_NEED_CALCULATE',
    SchemaCreate = 'SCHEMA_CREATE',
    SchemaDelete = 'SCHEMA_DELETE',
    SchemaUpdate = 'SCHEMA_UPDATE',
    SharingCreate = 'SHARING_CREATE',
    SharingDelete = 'SHARING_DELETE',
    SharingUpdate = 'SHARING_UPDATE',
    StartDay = 'START_DAY',
    StaticFileDelete = 'STATIC_FILE_DELETE',
    StaticFileDownload = 'STATIC_FILE_DOWNLOAD',
    StaticFileUpload = 'STATIC_FILE_UPLOAD',
    SubscriptionConfigCreate = 'SUBSCRIPTION_CONFIG_CREATE',
    SubscriptionConfigDelete = 'SUBSCRIPTION_CONFIG_DELETE',
    SubscriptionConfigUpdate = 'SUBSCRIPTION_CONFIG_UPDATE',
    SystemDirectoryPermissionDelete = 'SYSTEM_DIRECTORY_PERMISSION_DELETE',
    SystemDirectoryPermissionUpdate = 'SYSTEM_DIRECTORY_PERMISSION_UPDATE',
    TaskSchedulerCreate = 'TASK_SCHEDULER_CREATE',
    TaskSchedulerDelete = 'TASK_SCHEDULER_DELETE',
    TaskSchedulerUpdate = 'TASK_SCHEDULER_UPDATE',
    TemplateCreate = 'TEMPLATE_CREATE',
    TemplateDelete = 'TEMPLATE_DELETE',
    TemplateTypeCreate = 'TEMPLATE_TYPE_CREATE',
    TemplateTypeDelete = 'TEMPLATE_TYPE_DELETE',
    TemplateTypeUpdate = 'TEMPLATE_TYPE_UPDATE',
    TemplateUpdate = 'TEMPLATE_UPDATE',
    UserAddToWorkspace = 'USER_ADD_TO_WORKSPACE',
    UserChangePassword = 'USER_CHANGE_PASSWORD',
    UserCreate = 'USER_CREATE',
    UserDelete = 'USER_DELETE',
    UserLogin = 'USER_LOGIN',
    UserLogout = 'USER_LOGOUT',
    UserRemoveFromWorkspace = 'USER_REMOVE_FROM_WORKSPACE',
    UserUpdate = 'USER_UPDATE',
    WizardCreate = 'WIZARD_CREATE',
    WizardDelete = 'WIZARD_DELETE',
    WizardUpdate = 'WIZARD_UPDATE',
    WorkflowCreate = 'WORKFLOW_CREATE',
    WorkflowDelete = 'WORKFLOW_DELETE',
    WorkflowUpdate = 'WORKFLOW_UPDATE',
    WorkspaceClearCache = 'WORKSPACE_CLEAR_CACHE',
    WorkspaceCreate = 'WORKSPACE_CREATE',
    WorkspaceDelete = 'WORKSPACE_DELETE',
    WorkspaceJoinApprove = 'WORKSPACE_JOIN_APPROVE',
    WorkspaceJoinDelete = 'WORKSPACE_JOIN_DELETE',
    WorkspaceJoinReject = 'WORKSPACE_JOIN_REJECT',
    WorkspaceJoinRequest = 'WORKSPACE_JOIN_REQUEST',
    WorkspaceJoinUpdate = 'WORKSPACE_JOIN_UPDATE',
    WorkspaceUnjoinApprove = 'WORKSPACE_UNJOIN_APPROVE',
    WorkspaceUnjoinDelete = 'WORKSPACE_UNJOIN_DELETE',
    WorkspaceUnjoinReject = 'WORKSPACE_UNJOIN_REJECT',
    WorkspaceUnjoinRequest = 'WORKSPACE_UNJOIN_REQUEST',
    WorkspaceUpdate = 'WORKSPACE_UPDATE',
}
const mockDataNotificationConfigById: NotificationConfigDataType = {
    notificationConfig: {
        id: 225,
        name: 'Thông báo có số liệu kỳ đối soát',
        objectType: 'RECONCILIATION_PERIOD',
        transactionType: 'RECONCILIATION_CREATE',
        status: false,
        details: [
            {
                channelType: 'EMAIL',
                id: 681,
                objectFilterId: 10,
                telegramChatId: undefined,
                email: 'quannq@awing.vn',
                userId: undefined,
                userGroupId: undefined,
                templateId: 10,
            },
        ],
        outputFieldPermission: {
            currentWorkflowState: undefined,
            targetWorkflowStates: undefined,
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
};
const mockDataObjectFilter = {
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
            name: 'notification thông tin về các MediaPlan có Name MMS_Sting_T10-11/23',
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
    ],
};
const mockDataNotificationTemplates = {
    totalCount: 18,
    items: [
        {
            id: 3,
            name: 'Gửi thông tin nghiệm thu',
            objectType: 'MEDIA_PLAN',
            contentType: 'HTML',
            channelType: 'EMAIL',
            configType: 'OBJECT_AND_CHANGED',
            schema: null,
            outputFieldPermission: {
                currentWorkflowState: null,
                objectDefinitionWithPermissions: [
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'id',
                            fieldPath: '.id.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'name',
                            fieldPath: '.name.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'objectType',
                            fieldPath: '.objectType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'schemaId',
                            fieldPath: '.schemaId.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'channelType',
                            fieldPath: '.channelType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'contentType',
                            fieldPath: '.contentType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'title',
                            fieldPath: '.title.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'content',
                            fieldPath: '.content.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'configType',
                            fieldPath: '.configType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'schema',
                            fieldPath: '.schema.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                ],
                targetWorkflowStates: null,
            },
        },
        {
            id: 234,
            name: 'Gửi thông tin nghiệm thu (NEW)',
            objectType: 'MEDIA_PLAN',
            contentType: 'HTML',
            channelType: 'EMAIL',
            configType: 'OBJECT_AND_CHANGED',
            schema: null,
            outputFieldPermission: {
                currentWorkflowState: null,
                objectDefinitionWithPermissions: [
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'id',
                            fieldPath: '.id.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'name',
                            fieldPath: '.name.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'objectType',
                            fieldPath: '.objectType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'schemaId',
                            fieldPath: '.schemaId.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'channelType',
                            fieldPath: '.channelType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'contentType',
                            fieldPath: '.contentType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'title',
                            fieldPath: '.title.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'content',
                            fieldPath: '.content.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'configType',
                            fieldPath: '.configType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'schema',
                            fieldPath: '.schema.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                ],
                targetWorkflowStates: null,
            },
        },
        {
            id: 235,
            name: 'test refactor',
            objectType: 'MEDIA_PLAN',
            contentType: 'HTML',
            channelType: 'FILE',
            configType: 'OBJECT_AND_CHANGED',
            schema: null,
            outputFieldPermission: {
                currentWorkflowState: null,
                objectDefinitionWithPermissions: [
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'id',
                            fieldPath: '.id.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'name',
                            fieldPath: '.name.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'objectType',
                            fieldPath: '.objectType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'schemaId',
                            fieldPath: '.schemaId.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'channelType',
                            fieldPath: '.channelType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'contentType',
                            fieldPath: '.contentType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'title',
                            fieldPath: '.title.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'content',
                            fieldPath: '.content.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'configType',
                            fieldPath: '.configType.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                    {
                        permission: 31,
                        objectDefinition: {
                            fieldName: 'schema',
                            fieldPath: '.schema.',
                            objectTypeCode: 'TEMPLATE',
                        },
                    },
                ],
                targetWorkflowStates: null,
            },
        },
    ],
};
const mockDataUsers = {
    totalCount: 65,
    items: [
        {
            id: '2050',
            name: 'Lê Thế Phong',
            username: 'phonglt@awing.vn',
            description: null,
            gender: 1,
            image: null,
            __typename: 'User',
        },
        {
            id: '2051',
            name: 'Phạm Quang Huy',
            username: 'huypq@awing.vn',
            description: 'Quản lý chung về campaign',
            gender: 1,
            image: null,
            __typename: 'User',
        },
        {
            id: '2052',
            name: 'Nguyễn Tiến Dũng',
            username: 'dungnt@awing.vn',
            description: '',
            gender: 1,
            image: null,
        },
        {
            id: '2087',
            name: 'Nguyễn Ngọc Linh',
            username: 'linhnn@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2090',
            name: 'Hà Thị Phương Nhi',
            username: 'nhihtp@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2113',
            name: 'Đinh Thị Thu Nga',
            username: 'ngadtt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2117',
            name: 'Bao Linh Do',
            username: 'linhdb@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2122',
            name: 'Vo Thi Ngoc Bich',
            username: 'bichvtn@awing.vn',
            description: null,
            gender: 0,
            image: '',
        },
        {
            id: '2139',
            name: 'Lê Xuân Hương',
            username: 'huonglx@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2141',
            name: 'Phạm Thị Bích Thuận',
            username: 'thuanptb@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2150',
            name: 'Đàm Thị Phương Thanh',
            username: 'thanhdtp@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2157',
            name: 'Nguyễn Tường Vy',
            username: 'vynt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2161',
            name: 'ADD - AnTT',
            username: 'antt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2178',
            name: 'Đào Khánh Linh',
            username: 'linhdk@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2184',
            name: 'Lê Nguyễn Ngọc Tuyết',
            username: 'tuyetlnn@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2210',
            name: 'Nguyễn Đăng Khoa',
            username: 'khoand@awing.vn',
            description: null,
            gender: 1,
            image: '',
        },
        {
            id: '2211',
            name: 'Vcommunications',
            username: 'creative.media@vcommunications.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2221',
            name: 'Vũ Thị Phương Thủy',
            username: 'thuyvtp@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2259',
            name: 'Nguyễn Thái Cương',
            username: 'cuongnt@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2274',
            name: 'Nguyễn Thị Hạnh Dung',
            username: 'dungnth@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2276',
            name: 'Nguyễn Thị Ngọc Ánh',
            username: 'anhntn@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2299',
            name: 'Nguyễn Đắc Thắng',
            username: 'thangnd@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2307',
            name: 'Phan Tuấn Phú',
            username: 'phupt@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2317',
            name: 'Phạm Khánh Toàn',
            username: 'toanpk@awing.vn',
            description: null,
            gender: 1,
            image: '',
        },
        {
            id: '2332',
            name: 'Asean Securties',
            username: 'anh.lt@aseansc.com.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2340',
            name: 'Atani Group',
            username: 'contact@atanigroup.co',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2348',
            name: 'Nguyen Thuy Vi',
            username: 'vint@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2377',
            name: 'Vũ Hà My',
            username: 'myvh@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2380',
            name: 'Le Minh Quan',
            username: 'quanlm@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2382',
            name: 'Tô Kiều Trang',
            username: 'trangtk@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2390',
            name: 'Vu Thi Phuong Thanh',
            username: 'thanhvtp@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2407',
            name: 'Phuong TTM',
            username: 'phuongttm@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2420',
            name: 'Vu Quynh Chi',
            username: 'chivq@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2427',
            name: 'Nguyễn Thị Hồng Trang',
            username: 'trangnth@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2431',
            name: 'Nguyễn Mạnh Tuấn',
            username: 'tuannm@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2436',
            name: 'Nguyễn Ngọc Phương Anh',
            username: 'anhnnp@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2452',
            name: 'Võ Thị Kim Thoáng',
            username: 'thoangvtk@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2453',
            name: 'Hoàng Thị Việt Hà',
            username: 'hahtv@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2479',
            name: 'Dương Khắc Huy',
            username: 'huydk@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2496',
            name: 'Mr. Bao',
            username: 'baovhk@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2501',
            name: 'ADD - Nguyễn Mai Như',
            username: 'nhunm@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2526',
            name: 'Ta Duy Thang',
            username: 'taduythang@awing.com.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2547',
            name: 'Dũng Hoàng Việt',
            username: 'dunghv@awing.vn',
            description: null,
            gender: 1,
            image: '',
        },
        {
            id: '2548',
            name: 'Nguyễn Thị Thanh Phương',
            username: 'phuongntt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2554',
            name: 'Nguyễn Thị Thu Hương',
            username: 'huongntt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2565',
            name: 'Ha Phuong Mai',
            username: 'maihp@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2580',
            name: 'Nguyen Xuan Loc',
            username: 'locnx@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2587',
            name: 'Vũ Thành Công',
            username: 'congvt@awing.vn',
            description: '',
            gender: 1,
            image: null,
        },
        {
            id: '2592',
            name: 'Mr. Uyen',
            username: 'uyenpt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2605',
            name: 'Trang Lê Thu',
            username: 'tranglt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2630',
            name: 'Phạm Thị Thùy Trang',
            username: 'trangptt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2639',
            name: 'Quân Nguyễn Quang',
            username: 'quannq@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2642',
            name: 'Lê Trần Đình Khánh',
            username: 'khanhltd@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2643',
            name: 'Phạm Hoàng My',
            username: 'myph@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2649',
            name: 'Chu Mai Anh',
            username: 'anhcm@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2666',
            name: 'Nguyễn Thảo Ngân',
            username: 'ngannt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2675',
            name: 'Ngô Bắc Quang',
            username: 'quangnb@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2687',
            name: 'Nguyen Thi Kim Phuong',
            username: 'phuongntk@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2689',
            name: 'Lý Công Danh',
            username: 'danhlc@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2693',
            name: 'Trần Thị Tường',
            username: 'tuongtt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2723',
            name: 'Tạ Duy Thắng',
            username: 'thangtd@awing.com.vn',
            description: null,
            gender: 1,
            image: null,
        },
        {
            id: '2740',
            name: 'Vũ Thị Thu Hằng',
            username: 'hangvtt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2758',
            name: 'Trần Huyền Ái Nhi',
            username: 'nhitha@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '2801',
            name: 'Phạm Thị Thúy Hiền',
            username: 'hienptt@awing.vn',
            description: null,
            gender: 0,
            image: null,
        },
        {
            id: '5013461470212533044',
            name: 'Tiệm Trần',
            username: 'tiemtv@awing.vn',
            description: null,
            gender: 1,
            image: null,
        },
    ],
};
const mockDataUserGroups = {
    totalCount: 6,
    items: [
        {
            id: 1,
            name: 'Administrator',
            description: 'admin',
            userGroupDetails: [
                {
                    userId: '2605',
                    user: {
                        username: 'tranglt@awing.vn',
                        name: 'Trang Lê Thu',
                    },
                },
                {
                    userId: '2117',
                    user: {
                        username: 'linhdb@awing.vn',
                        name: 'Bao Linh Do',
                    },
                },
                {
                    userId: '2587',
                    user: {
                        username: 'congvt@awing.vn',
                        name: 'Vũ Thành Công',
                    },
                },
                {
                    userId: '5013461470212533044',
                    user: {
                        username: 'tiemtv@awing.vn',
                        name: 'Tiệm Trần',
                    },
                },
                {
                    userId: '2050',
                    user: {
                        username: 'phonglt@awing.vn',
                        name: 'Lê Thế Phong',
                    },
                },
                {
                    userId: '2639',
                    user: {
                        username: 'quannq@awing.vn',
                        name: 'Quân Nguyễn Quang',
                    },
                },
                {
                    userId: '2630',
                    user: {
                        username: 'trangptt@awing.vn',
                        name: 'Phạm Thị Thùy Trang',
                    },
                },
                {
                    userId: '2087',
                    user: {
                        username: 'linhnn@awing.vn',
                        name: 'Nguyễn Ngọc Linh',
                    },
                },
                {
                    userId: '2380',
                    user: {
                        username: 'quanlm@awing.vn',
                        name: 'Le Minh Quan',
                    },
                },
                {
                    userId: '2052',
                    user: {
                        username: 'dungnt@awing.vn',
                        name: 'Nguyễn Tiến Dũng',
                    },
                },
                {
                    userId: '2307',
                    user: {
                        username: 'phupt@awing.vn',
                        name: 'Phan Tuấn Phú',
                    },
                },
                {
                    userId: '2317',
                    user: {
                        username: 'toanpk@awing.vn',
                        name: 'Phạm Khánh Toàn',
                    },
                },
                {
                    userId: '2547',
                    user: {
                        username: 'dunghv@awing.vn',
                        name: 'Dũng Hoàng Việt',
                    },
                },
            ],
        },
        {
            id: 2,
            name: 'BIZ',
            description: 'Team BIZ',
            userGroupDetails: [
                {
                    userId: '2113',
                    user: {
                        username: 'ngadtt@awing.vn',
                        name: 'Đinh Thị Thu Nga',
                    },
                },
                {
                    userId: '2087',
                    user: {
                        username: 'linhnn@awing.vn',
                        name: 'Nguyễn Ngọc Linh',
                    },
                },
                {
                    userId: '2630',
                    user: {
                        username: 'trangptt@awing.vn',
                        name: 'Phạm Thị Thùy Trang',
                    },
                },
                {
                    userId: '2587',
                    user: {
                        username: 'congvt@awing.vn',
                        name: 'Vũ Thành Công',
                    },
                },
                {
                    userId: '2776',
                    user: {
                        username: 'quangdt@awing.vn',
                        name: 'Đôn Tuấn Quang',
                    },
                },
                {
                    userId: '2407',
                    user: {
                        username: 'phuongttm@awing.vn',
                        name: 'Phuong TTM',
                    },
                },
                {
                    userId: '2740',
                    user: {
                        username: 'hangvtt@awing.vn',
                        name: 'Vũ Thị Thu Hằng',
                    },
                },
                {
                    userId: '2452',
                    user: {
                        username: 'thoangvtk@awing.vn',
                        name: 'Võ Thị Kim Thoáng',
                    },
                },
                {
                    userId: '2157',
                    user: {
                        username: 'vynt@awing.vn',
                        name: 'Nguyễn Tường Vy',
                    },
                },
                {
                    userId: '2221',
                    user: {
                        username: 'thuyvtp@awing.vn',
                        name: 'Vũ Thị Phương Thủy',
                    },
                },
                {
                    userId: '2801',
                    user: {
                        username: 'hienptt@awing.vn',
                        name: 'Phạm Thị Thúy Hiền',
                    },
                },
                {
                    userId: '2453',
                    user: {
                        username: 'hahtv@awing.vn',
                        name: 'Hoàng Thị Việt Hà',
                    },
                },
                {
                    userId: '2548',
                    user: {
                        username: 'phuongntt@awing.vn',
                        name: 'Nguyễn Thị Thanh Phương',
                    },
                },
                {
                    userId: '2554',
                    user: {
                        username: 'huongntt@awing.vn',
                        name: 'Nguyễn Thị Thu Hương',
                    },
                },
                {
                    userId: '2210',
                    user: {
                        username: 'khoand@awing.vn',
                        name: 'Nguyễn Đăng Khoa',
                    },
                },
                {
                    userId: '2178',
                    user: {
                        username: 'linhdk@awing.vn',
                        name: 'Đào Khánh Linh',
                    },
                },
                {
                    userId: '2377',
                    user: {
                        username: 'myvh@awing.vn',
                        name: 'Vũ Hà My',
                    },
                },
                {
                    userId: '2592',
                    user: {
                        username: 'uyenpt@awing.vn',
                        name: 'Mr. Uyen',
                    },
                },
                {
                    userId: '2496',
                    user: {
                        username: 'baovhk@awing.vn',
                        name: 'Mr. Bao',
                    },
                },
                {
                    userId: '2090',
                    user: {
                        username: 'nhihtp@awing.vn',
                        name: 'Hà Thị Phương Nhi',
                    },
                },
                {
                    userId: '2259',
                    user: {
                        username: 'cuongnt@awing.vn',
                        name: 'Nguyễn Thái Cương',
                    },
                },
                {
                    userId: '2689',
                    user: {
                        username: 'danhlc@awing.vn',
                        name: 'Lý Công Danh',
                    },
                },
                {
                    userId: '2479',
                    user: {
                        username: 'huydk@awing.vn',
                        name: 'Dương Khắc Huy',
                    },
                },
                {
                    userId: '2299',
                    user: {
                        username: 'thangnd@awing.vn',
                        name: 'Nguyễn Đắc Thắng',
                    },
                },
                {
                    userId: '2758',
                    user: {
                        username: 'nhitha@awing.vn',
                        name: 'Trần Huyền Ái Nhi',
                    },
                },
                {
                    userId: '2436',
                    user: {
                        username: 'anhnnp@awing.vn',
                        name: 'Nguyễn Ngọc Phương Anh',
                    },
                },
                {
                    userId: '2110',
                    user: {
                        username: 'trang.nguyenthihong@awing.vn',
                        name: 'Nguyễn Thị Hồng Trang',
                    },
                },
                {
                    userId: '2382',
                    user: {
                        username: 'trangtk@awing.vn',
                        name: 'Tô Kiều Trang',
                    },
                },
                {
                    userId: '2642',
                    user: {
                        username: 'khanhltd@awing.vn',
                        name: 'Lê Trần Đình Khánh',
                    },
                },
                {
                    userId: '2427',
                    user: {
                        username: 'trangnth@awing.vn',
                        name: 'Nguyễn Thị Hồng Trang',
                    },
                },
                {
                    userId: '2431',
                    user: {
                        username: 'tuannm@awing.vn',
                        name: 'Nguyễn Mạnh Tuấn',
                    },
                },
                {
                    userId: '2139',
                    user: {
                        username: 'huonglx@awing.vn',
                        name: 'Lê Xuân Hương',
                    },
                },
                {
                    userId: '2141',
                    user: {
                        username: 'thuanptb@awing.vn',
                        name: 'Phạm Thị Bích Thuận',
                    },
                },
                {
                    userId: '2276',
                    user: {
                        username: 'anhntn@awing.vn',
                        name: 'Nguyễn Thị Ngọc Ánh',
                    },
                },
                {
                    userId: '2649',
                    user: {
                        username: 'anhcm@awing.vn',
                        name: 'Chu Mai Anh',
                    },
                },
                {
                    userId: '2643',
                    user: {
                        username: 'myph@awing.vn',
                        name: 'Phạm Hoàng My',
                    },
                },
                {
                    userId: '2150',
                    user: {
                        username: 'thanhdtp@awing.vn',
                        name: 'Đàm Thị Phương Thanh',
                    },
                },
            ],
        },
        {
            id: 3,
            name: 'ADD',
            description: 'Team Ads Delivery',
            userGroupDetails: [
                {
                    userId: '2348',
                    user: {
                        username: 'vint@awing.vn',
                        name: 'Nguyen Thuy Vi',
                    },
                },
                {
                    userId: '2687',
                    user: {
                        username: 'phuongntk@awing.vn',
                        name: 'Nguyen Thi Kim Phuong',
                    },
                },
                {
                    userId: '2605',
                    user: {
                        username: 'tranglt@awing.vn',
                        name: 'Trang Lê Thu',
                    },
                },
                {
                    userId: '2117',
                    user: {
                        username: 'linhdb@awing.vn',
                        name: 'Bao Linh Do',
                    },
                },
                {
                    userId: '5013461470212533044',
                    user: {
                        username: 'tiemtv@awing.vn',
                        name: 'Tiệm Trần',
                    },
                },
                {
                    userId: '2122',
                    user: {
                        username: 'bichvtn@awing.vn',
                        name: 'Vo Thi Ngoc Bich',
                    },
                },
                {
                    userId: '2161',
                    user: {
                        username: 'antt@awing.vn',
                        name: 'ADD - AnTT',
                    },
                },
                {
                    userId: '2565',
                    user: {
                        username: 'maihp@awing.vn',
                        name: 'Ha Phuong Mai',
                    },
                },
                {
                    userId: '2501',
                    user: {
                        username: 'nhunm@awing.vn',
                        name: 'ADD - Nguyễn Mai Như',
                    },
                },
            ],
        },
        {
            id: 4,
            name: 'AF',
            description: 'Tài chính kế toán',
            userGroupDetails: [
                {
                    userId: '2274',
                    user: {
                        username: 'dungnth@awing.vn',
                        name: 'Nguyễn Thị Hạnh Dung',
                    },
                },
                {
                    userId: '2693',
                    user: {
                        username: 'tuongtt@awing.vn',
                        name: 'Trần Thị Tường',
                    },
                },
                {
                    userId: '2420',
                    user: {
                        username: 'chivq@awing.vn',
                        name: 'Vu Quynh Chi',
                    },
                },
                {
                    userId: '2390',
                    user: {
                        username: 'thanhvtp@awing.vn',
                        name: 'Vu Thi Phuong Thanh',
                    },
                },
            ],
        },
        {
            id: 204,
            name: 'Monitor',
            description: 'test',
            userGroupDetails: [
                {
                    userId: '2580',
                    user: {
                        username: 'locnx@awing.vn',
                        name: 'Nguyen Xuan Loc',
                    },
                },
                {
                    userId: '2675',
                    user: {
                        username: 'quangnb@awing.vn',
                        name: 'Ngô Bắc Quang',
                    },
                },
            ],
        },
        {
            id: 286,
            name: 'Update danh sách mới',
            description: 'Mô tả mới ở đây',
            userGroupDetails: [],
        },
    ],
};

// Mock các module
jest.mock('react', () => {
    const actual = jest.requireActual('react');
    return {
        ...actual,
        useState: actual.useState as jest.Mock,
        // your mocked methods
    };
});

jest.mock('react-router', () => ({
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock('Context', () => ({
    ...jest.requireActual('Context'),
    useAppHelper: jest.fn(),
    AppContext: {
        Provider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
}));

const mockDataFormOnUpdate = jest.fn();

jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => {
        return (
            <div>
                <p data-testid="ClassicDrawer-header">ClassicDrawer</p>
                <p data-testid="ClassicDrawer-title">{props.title}</p>
                <p data-testid="ClassicDrawer-disableButtonSubmit">
                    {props.disableButtonSubmit ? 'disabled' : 'non-disable'}
                </p>
                <button data-testid="ClassicDrawer-onSubmit" onClick={props.onSubmit} />
                <button data-testid="ClassicDrawer-onClose" onClick={props.onClose} />
                {props.children}
            </div>
        );
    },
}));

jest.mock('AWING', () => ({
    CircularProgress: () => <p data-testid="CircularProgress-header">CircularProgress</p>,
    DataForm: (props: any) => {
        const { onUpdate = mockDataFormOnUpdate } = props;
        return (
            <div>
                <p data-testid="DataForm-header">DataForm</p>
                <p data-testid="DataForm-fields">
                    {props.fields.map((f: any) => (
                        <p data-testid={`DataForm-field-${f?.fieldName}`}>{f?.value}</p>
                    ))}
                </p>
                <p data-testid="DataForm-oldValue-name">{props.oldValue?.name}</p>
                <textarea data-testid="DataForm-fields">{JSON.stringify(props.fields)}</textarea>
                <button
                    data-testid="DataForm-onUpdate"
                    onClick={(e: any) => onUpdate(e.target.obj, e.target.valid, e.target.fieldUpdate)}
                />
            </div>
        );
    },
}));

jest.mock('Commons/Constant', () => ({
    Constants: {
        PAGE_SIZE_DEFAULT: 10,
        PERMISSION_CODE: {
            FULL_CONTROL: 31,
        },
    },
}));

jest.mock('../../components/AddFilter', () => ({
    __esModule: true,
    default: (props: any) => (
        <>
            <button data-testid="config-filter" onClick={() => props.onSubmitData([])}>
                btnAddNotificationConfigFilter
            </button>
            <button data-testid="btnTesting" onClick={(e: any) => props.onClickTesting(e)}>
                btnTesting
            </button>
            <div data-testid="config-filter">ConfigFilter</div>
            <button data-testid="btnOnValid" onClick={() => props.onValid(true)}>
                btnOnValid
            </button>
            <button data-testid="btnObjectFilters" onClick={() => props.objectFilters([])}>
                btnObjectFilters
            </button>
        </>
    ),
}));

jest.mock('../../components/TestingTool', () => ({
    __esModule: true,
    default: (props: any) => (
        <>
            <p data-testid="TestingTool-header">TestingTool</p>
            <button data-testid="TestingTool-onTesting" onClick={props.onTesting} />
            <button data-testid="btnOnChange" onClick={props.onChange} />
            <button data-testid="btnOnClose" onClick={props.onClose} />
        </>
    ),
}));

jest.mock('../utils', () => ({
    convertToObjectDataInputOfNotificationConfigDetailInput: jest.fn(),
    convertToSubmit: jest.fn(),
}));

jest.mock('../../utils', () => ({
    convertToStateDetails: jest.fn(),
    filterByPrefix: jest.fn(),
}));

const mockDelete = jest.fn();
const mockNotificationConfigs = jest.fn();
const mockCreateNotificationConfigs = jest.fn();
const mockUpdateNotificationConfigs = jest.fn();
const mockObjectFilter = jest.fn();
const mockGetById = jest.fn();
const mockUsers = jest.fn();
const mockUserGroups = jest.fn();
const mockTemplates = jest.fn();

const services: NotificationConfigServices = {
    getNotificationConfigs: mockNotificationConfigs,
    getObjectFilter: mockObjectFilter,
    getNotificationTemplates: mockTemplates,
    getUsers: mockUsers,
    getUserGroups: mockUserGroups,
    getNotificationConfigById: mockGetById,
    deleteNotificationConfig: mockDelete,
    createNotificationConfig: mockCreateNotificationConfigs,
    updateNotificationConfig: mockUpdateNotificationConfigs,
};

const objectTypeCodes = Object.entries(ObjectTypeCode).map(([key, value]) => ({
    key: key,
    value: value,
}));

const sagaTransactionType = Object.entries(SagaTransactionType).map(([key, value]) => ({
    key: key,
    value: value,
}));

const renderUi = () =>
    render(
        <NotificationConfigContext.Provider
            value={{
                services,
                objectTypeCodes,
                sagaTransactionType,
            }}
        >
            <CreateOrEdit />
        </NotificationConfigContext.Provider>
    );

const mockNavigate = jest.fn();
const mockUseParams = jest.fn(() => ({ id: '1' }));

const mockAppHelper = {
    confirm: jest.fn(),
    snackbar: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue(mockUseParams);
    (useAppHelper as jest.Mock).mockReturnValue(mockAppHelper);

    mockGetById.mockResolvedValue(mockDataNotificationConfigById);
    mockUsers.mockResolvedValue(mockDataUsers);
    mockUserGroups.mockResolvedValue(mockDataUserGroups);
    mockObjectFilter.mockResolvedValue(mockDataObjectFilter);
    mockTemplates.mockResolvedValue(mockDataNotificationTemplates);

    (mockCreateNotificationConfigs as jest.Mock).mockResolvedValue({ id: 1 });
    (mockUpdateNotificationConfigs as jest.Mock).mockResolvedValue({ id: 1 });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('CreateOrEdit Component', () => {
    it('should render the component correctly', () => {
        (useParams as jest.Mock).mockReturnValue({ id: 225 });
        renderUi();
    });

    it('should render the component correctly with id = 0', () => {
        (useParams as jest.Mock).mockReturnValue({ id: 0 });
        renderUi();
    });
});

describe('CreateOrEdit Component', () => {
    it('renders CreateOrEdit component', () => {
        renderUi();

        const btnAddFilter = screen.getByRole('button', { name: /btnAddNotificationConfigFilter/i });
        btnAddFilter.click();

        const btnOnValidConfig = screen.getByRole('button', { name: /btnOnValid/i });
        btnOnValidConfig.click();

        expect(screen.getByTestId('ClassicDrawer-header')).toBeInTheDocument();
    });

    it('should component when Edit', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '2' });
        (mockGetById as jest.Mock).mockResolvedValue(mockDataNotificationConfigById);
        await act(async () => {
            renderUi();
        });
    });

    it('should show CircularProgress when loading notification config data', async () => {
        renderUi();
        const btnTestingTool = screen.getByTestId('btnTesting');
        fireEvent.click(btnTestingTool, {});
    });

    it('should render DataForm when creating a new notification config', () => {
        (useParams as jest.Mock).mockReturnValue({});
        renderUi();
        expect(screen.getByTestId('DataForm-header')).toBeInTheDocument();
    });

    it('should call handleSubmit on ClassicDrawer submit', () => {
        renderUi();
        const submitButton = screen.getByTestId('ClassicDrawer-onSubmit');
        submitButton.click();
    });

    it('should call handleSubmit on ClassicDrawer submit for Edit', () => {
        (useParams as jest.Mock).mockReturnValue({ id: '2' });
        (mockGetById as jest.Mock).mockResolvedValue(mockDataNotificationConfigById);
        renderUi();
        const submitButton = screen.getByTestId('ClassicDrawer-onSubmit');
        submitButton.click();
    });

    it('should disable submit button when not ready for submit', () => {
        renderUi();
        expect(screen.getByTestId('ClassicDrawer-disableButtonSubmit').textContent).toBe('disabled');
    });

    it('should enable submit button when ready for submit', () => {
        renderUi();
        const updateButton = screen.getByTestId('DataForm-onUpdate');
        updateButton.click();
        expect(screen.getByTestId('ClassicDrawer-disableButtonSubmit').textContent).toBe('disabled');
    });

    it('should enable submit button when ready for submit with Edit', async () => {
        renderUi();

        await act(async () => {
            const updateButton = screen.getByTestId('DataForm-onUpdate');
            fireEvent.click(updateButton, {
                target: {
                    obj: {
                        name: 'Test',
                    },
                    valid: true,
                    fieldUpdate: {},
                },
            });
        });
    });
    it('should enable submit button when ready for submit with Edit', async () => {
        renderUi();

        await act(async () => {
            const updateButton = screen.getByTestId('DataForm-onUpdate');
            fireEvent.click(updateButton, {
                target: {
                    obj: {
                        name: null,
                    },
                    valid: true,
                    fieldUpdate: {},
                },
            });
        });
    });

    it('action onChage and onClose of TestingTool', async () => {
        renderUi();
        const btnTestingTool = screen.getByTestId('btnTesting');
        fireEvent.click(btnTestingTool, {});
        await act(async () => {
            const btnOnCloseTestingTool = screen.getByTestId('btnOnClose');
            fireEvent.click(btnOnCloseTestingTool);

            const btnOnChangeTestingTool = screen.getByTestId('btnOnChange');
            fireEvent.click(btnOnChangeTestingTool);
        });
    });
});
