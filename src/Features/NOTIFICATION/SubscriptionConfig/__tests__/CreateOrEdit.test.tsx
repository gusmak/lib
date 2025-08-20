import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { CronTabType } from 'AWING/CronTab/constants';
import { useAppHelper } from 'Context';
import React, { act } from 'react';
import { useNavigate, useParams } from 'react-router';
import CreateOrEdit from '../CreateOrEdit';
import { SubscriptionConfigServices } from '../Services';
import { SubscriptionConfigContext } from '../context';
import { ScheduleType } from '../enums';
import { SubscriptionConfigsType } from '../types';

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
const resData: SubscriptionConfigsType = {
    id: 2,
    objectType: 'RECONCILIATION_PERIOD',
    name: 'Sub-Campaign',
    status: true,
    scheduleType: 'MONTHLY' as ScheduleType,
    scheduleIntervalDaysOfWeek: '',
    scheduleIntervalDaysOfMonth: '11',
    scheduleIntervalFromTime: '00:20:00',
    scheduleIntervalEndTime: undefined,
    // scheduleStartDate: undefined,
    scheduleIntervalInMinutes: 0,
    // scheduleToDate: null,
    scheduleSummary: '20 0 11 * * *',
    scheduleExpression: '20 0 11 * * *',
    details: [
        {
            channelType: 'FILE',
            id: 3,
            objectFilterId: 11,
            telegramChatId: undefined,
            email: 'longld@gmail.com',
            userId: undefined,
            userGroupId: undefined,
            templateId: 12,
            subscriptionConfigId: 2,
        },
    ],
    outputFieldPermission: {
        currentWorkflowState: undefined,
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
        targetWorkflowStates: undefined,
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
    ],
};
const mockDataSubscripcationTemplates = {
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
// Mock the necessary hooks and components
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

const mockDataFormOnUpdate = jest.fn();

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
                    onClick={(e: any) =>
                        onUpdate(
                            {
                                objectType: 'RECONCILIATION_PERIOD',
                                name: 'Sub-Campaign',
                                status: true,
                            },
                            e.target.valid,
                            e.target.fieldUpdate
                        )
                    }
                />
            </div>
        );
    },
}));

jest.mock('Commons/Constant', () => ({
    Constants: {
        PERMISSION_CODE: {
            FULL_CONTROL: 31,
            MODIFY: 15,
        },
    },
}));

jest.mock('../components/AddFilter', () => ({
    __esModule: true,
    default: (props: any) => (
        <>
            <button data-testid="config-filter" onClick={() => props.onSubmitData([])}>
                btnAddSubscriptionConfigFilter
            </button>
            <button data-testid="btnTesting" onClick={(e: any) => props.onClickTesting(e)}>
                btnTesting
            </button>
            <button data-testid="btnOnValid" onClick={() => props.onValid(true)}>
                btnOnValid
            </button>
            <button data-testid="btnObjectFilters" onClick={() => props.objectFilters([])}>
                btnObjectFilters
            </button>
        </>
    ),
}));

jest.mock('../utils', () => ({
    convertToDetails: jest.fn(),
    convertToStateDetails: jest.fn(),
}));

jest.mock('./ScheduleSettings', () => ({
    __esModule: true,
    default: (props: any) => (
        <button data-testid="btnScheduleSettings" onClick={() => props.onChange({}, true)}>
            btnScheduleSettings
        </button>
    ),
}));

const mockDelete = jest.fn();
const mockSubscriptionConfigs = jest.fn();
const mockCreateSubscriptionConfigs = jest.fn();
const mockUpdateSubscriptionConfigs = jest.fn();
const mockObjectFilter = jest.fn();
const mockGetById = jest.fn();
const mockUsers = jest.fn();
const mockUserGroups = jest.fn();
const mockTemplates = jest.fn();

const services: SubscriptionConfigServices = {
    getById: mockGetById,
    getSubscriptionConfigs: mockSubscriptionConfigs,
    deleteSubscriptionConfig: mockDelete,
    createSubscriptionConfig: mockCreateSubscriptionConfigs,
    updateSubscriptionConfig: mockUpdateSubscriptionConfigs,
    getObjectFilter: mockObjectFilter,
    getSubscriptionTemplates: mockTemplates,
    getUsers: mockUsers,
    getUserGroups: mockUserGroups,
};

const objectTypeCodes = Object.entries(ObjectTypeCode).map(([key, value]) => ({
    key: key,
    value: value,
}));

const renderUi = () =>
    render(
        <SubscriptionConfigContext.Provider
            value={{
                services,
                objectTypeCodes,
            }}
        >
            <CreateOrEdit />
        </SubscriptionConfigContext.Provider>
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

    mockGetById.mockResolvedValue(resData);
    mockUserGroups.mockResolvedValue({ userGroups: [], total: 0 });
    mockUsers.mockResolvedValue({ users: [], total: 0 });
    mockTemplates.mockResolvedValue(mockDataSubscripcationTemplates);
    mockObjectFilter.mockResolvedValue({
        objectFilters: {
            totalCount: mockDataObjectFilter.totalCount,
            items: mockDataObjectFilter.items,
        },
    });

    (mockCreateSubscriptionConfigs as jest.Mock).mockResolvedValue({ id: 1 });
    (mockUpdateSubscriptionConfigs as jest.Mock).mockResolvedValue({ id: 1 });
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('CreateOrEdit Component', () => {
    it('renders CreateOrEdit component', () => {
        renderUi();

        const btnAddFilter = screen.getByRole('button', { name: /btnAddSubscriptionConfigFilter/i });
        btnAddFilter.click();

        const btnOnValidConfig = screen.getByRole('button', { name: /btnOnValid/i });
        btnOnValidConfig.click();

        expect(screen.getByTestId('ClassicDrawer-header')).toBeInTheDocument();
    });

    it('renders ScheduleSettings component', () => {
        renderUi();
        const btnScheduleSettings = screen.getByRole('button', { name: /btnScheduleSettings/i });
        btnScheduleSettings.click();
    });

    it('renders ScheduleSettings component with Edit', () => {
        renderUi();
        const btnScheduleSettings = screen.getByRole('button', { name: /btnScheduleSettings/i });
        btnScheduleSettings.click();
    });

    it('renders CreateOrEdit component with isCreate = false', () => {
        (useParams as jest.Mock).mockReturnValue({ id: 2 });

        renderUi();

        const btnAddFilter = screen.getByRole('button', { name: /btnAddSubscriptionConfigFilter/i });
        btnAddFilter.click();

        expect(screen.getByTestId('ClassicDrawer-header')).toBeInTheDocument();
    });

    it('should show CircularProgress when loading subscription config data', () => {
        (useParams as jest.Mock).mockReturnValue({ id: 2 });
        renderUi();
        expect(screen.getAllByTestId('CircularProgress-header').length).toBe(2);
    });

    it('should show CircularProgress when loading subscription config data with scheduleType is WEEKLY', () => {
        mockGetById.mockResolvedValue({ ...resData, scheduleType: 'WEEKLY' });

        (useParams as jest.Mock).mockReturnValue({ id: 2 });
        renderUi();
        expect(screen.getAllByTestId('CircularProgress-header').length).toBe(2);
    });

    it('should show CircularProgress when loading subscription config data with scheduleType is DAILY', () => {
        mockGetById.mockResolvedValue({ ...resData, scheduleType: CronTabType.ADVANCED });

        (useParams as jest.Mock).mockReturnValue({ id: 2 });
        renderUi();
        expect(screen.getAllByTestId('CircularProgress-header').length).toBe(2);
    });

    it('should render DataForm when creating a new subscription config', () => {
        (useParams as jest.Mock).mockReturnValue({});
        renderUi();
        expect(screen.getByTestId('DataForm-header')).toBeInTheDocument();
    });

    it('should render ScheduleSettings when not loading subscription config data', () => {
        (useParams as jest.Mock).mockReturnValue({});
        renderUi();
        expect(screen.getByTestId('btnScheduleSettings')).toBeInTheDocument();
    });

    it('should update schedule settings on change', () => {
        renderUi();
        const scheduleSettings = screen.getByTestId('btnScheduleSettings');
        expect(scheduleSettings).toBeInTheDocument();
    });

    it('should render SubscriptionConfigAddFilter', () => {
        renderUi();
        expect(screen.getByTestId('config-filter')).toBeInTheDocument();
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
});

describe('CreateOrEdit Component', () => {
    it('should component when Edit', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '2' });
        (mockGetById as jest.Mock).mockResolvedValue(resData);
        await act(async () => {
            renderUi();
        });
    });

    it('should render DataForm when creating a new subscription config', () => {
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
        (mockGetById as jest.Mock).mockResolvedValue(resData);
        renderUi();
        const submitButton = screen.getByTestId('ClassicDrawer-onSubmit');
        submitButton.click();
    });

    it('should disable submit button when not ready for submit', () => {
        renderUi();
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
});
