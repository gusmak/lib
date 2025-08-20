import { ChannelType } from 'Features/NOTIFICATION/enums';
import { ProcessedData, TestingDataInput } from './types';

export const processObjectFilter = (input: TestingDataInput): Partial<ProcessedData> => ({
    moduleTitle: 'TestingTool.ObjectFilter',
    objectTypeCode: input.objectFilterInput?.objectTypeCode ?? '',
    formValid: true,
});

export const processNotificationTemplate = (input: TestingDataInput): Partial<ProcessedData> => {
    const hasEmailChannel = input.templateInput?.channelType === ChannelType.EMAIL;
    const hasTelegramChannel = input.templateInput?.channelType === ChannelType.TELEGRAM;

    return {
        moduleTitle: 'TestingTool.NotificationTemplate',
        objectTypeCode: input.templateInput?.objectType ?? '',
        hasEmailChannel,
        hasTelegramChannel,
        formValid: !((hasEmailChannel && !input.emailReceivers) || (hasTelegramChannel && !input.telegramReceivers)),
    };
};

export const processNotificationConfig = (input: TestingDataInput): Partial<ProcessedData> => {
    const details = input.notificationConfigInput?.notificationConfigDetails;
    const channelTypes = details?.filter((x) => x.value?.channelType).map((item) => item.value!.channelType) ?? [];

    const emails =
        details
            ?.filter((x) => x.value?.email)
            .map((x) => x.value!.email)
            .join(', ') ?? '';

    const telegrams =
        details
            ?.filter((x) => x.value?.telegramChatId)
            .map((x) => x.value!.telegramChatId)
            .join(', ') ?? '';

    const hasEmailChannel = channelTypes.includes(ChannelType.EMAIL);
    const hasTelegramChannel = channelTypes.includes(ChannelType.TELEGRAM);

    return {
        moduleTitle: 'TestingTool.NotificationConfig',
        objectTypeCode: input.notificationConfigInput?.objectType ?? '',
        emails,
        telegrams,
        hasEmailChannel,
        hasTelegramChannel,
        formValid: !((hasEmailChannel && !emails) || (hasTelegramChannel && !telegrams)),
    };
};

export const computedTestingData = (
    testingData: TestingDataInput,
    isObjectFilter: boolean,
    isNotificationTemplate: boolean,
    isNotificationConfig: boolean,
    elseCallback?: () => void
) => {
    let postDataInput = { ...testingData };
    //remove plus fields
    delete postDataInput.objectId;
    delete postDataInput.objectFilter;
    delete postDataInput.notificationTemplate;

    if (isObjectFilter) {
        postDataInput.objectFilterInput = {
            name: postDataInput.objectFilterInput?.name,
            objectTypeCode: postDataInput.objectFilterInput?.objectTypeCode,
            configType: postDataInput.objectFilterInput?.configType,
            logicalExpression: postDataInput.objectFilterInput?.logicalExpression,
        };
    } else if (isNotificationTemplate) {
        postDataInput.templateInput = {
            name: postDataInput.templateInput?.name,
            title: postDataInput.templateInput?.title,
            content: postDataInput.templateInput?.content,
            schemaId: postDataInput.templateInput?.schemaId,
            objectType: postDataInput.templateInput?.objectType,
            channelType: postDataInput.templateInput?.channelType,
            contentType: postDataInput.templateInput?.contentType,
            configType: postDataInput.templateInput?.configType,
        };
    } else if (isNotificationConfig) {
        postDataInput.notificationConfigInput = {
            name: postDataInput.notificationConfigInput?.name,
            objectType: postDataInput.notificationConfigInput?.objectType,
            transactionType: postDataInput.notificationConfigInput?.transactionType,
            status: postDataInput.notificationConfigInput?.status,
            notificationConfigDetails: postDataInput.notificationConfigInput?.notificationConfigDetails
                ?.filter((x) => x.value)
                ?.map((item) => {
                    return {
                        value: {
                            objectFilterId: item.value?.objectFilterId,
                            channelType: item.value?.channelType,
                            templateId: item.value?.templateId,
                            userId: item.value?.userId,
                            userGroupId: item.value?.userGroupId,
                            email: item.value?.email,
                            telegramChatId: item.value?.telegramChatId,
                        },
                    };
                }),
        };
    } else {
        elseCallback && elseCallback();
        return {};
    }

    return postDataInput;
};

export const getMessageTitle = (isObjectFilter?: boolean, isNotificationTemplate?: boolean, isNotificationConfig?: boolean) => {
    let message = '';
    if (isObjectFilter) message = 'TestingTool.MessageObjectFilterDone';
    else if (isNotificationTemplate) message = 'TestingTool.MessageNotificationTemplateDone';
    else if (isNotificationConfig) message = 'TestingTool.MessageNotificationConfigDone';

    return message;
};
