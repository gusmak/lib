import {
    processObjectFilter,
    processNotificationTemplate,
    processNotificationConfig,
    computedTestingData,
    getMessageTitle,
} from './utils';
import { ChannelType } from 'Features/NOTIFICATION/enums';

describe('TestingTool Utils', () => {
    describe('processObjectFilter', () => {
        it('returns default values when input is empty', () => {
            const result = processObjectFilter({});
            expect(result).toEqual({
                moduleTitle: 'TestingTool.ObjectFilter',
                objectTypeCode: '',
                formValid: true,
            });
        });

        it('returns correct objectTypeCode when provided', () => {
            const result = processObjectFilter({
                objectFilterInput: { objectTypeCode: 'TEST' },
            });
            expect(result.objectTypeCode).toBe('TEST');
        });

        it('returns empty string when objectType is undefined', () => {
            const result = processObjectFilter({
                objectFilterInput: { objectTypeCode: undefined },
            });
            expect(result.objectTypeCode).toBe('');
        });
    });

    describe('processNotificationTemplate', () => {
        it('handles email channel with receivers', () => {
            const result = processNotificationTemplate({
                templateInput: {
                    channelType: ChannelType.EMAIL,
                    objectType: 'TEST',
                },
                emailReceivers: 'test@email.com',
            });
            expect(result).toEqual({
                moduleTitle: 'TestingTool.NotificationTemplate',
                objectTypeCode: 'TEST',
                hasEmailChannel: true,
                hasTelegramChannel: false,
                formValid: true,
            });
        });

        it('handles telegram channel with receivers', () => {
            const result = processNotificationTemplate({
                templateInput: {
                    channelType: ChannelType.TELEGRAM,
                    objectType: 'TEST',
                },
                telegramReceivers: '123',
            });
            expect(result).toEqual({
                moduleTitle: 'TestingTool.NotificationTemplate',
                objectTypeCode: 'TEST',
                hasEmailChannel: false,
                hasTelegramChannel: true,
                formValid: true,
            });
        });

        it('handles telegram channel with receivers and objectType is undefined', () => {
            const result = processNotificationTemplate({
                templateInput: {
                    channelType: ChannelType.TELEGRAM,
                    objectType: undefined,
                },
                telegramReceivers: '123',
            });
            expect(result).toEqual({
                moduleTitle: 'TestingTool.NotificationTemplate',
                objectTypeCode: '',
                hasEmailChannel: false,
                hasTelegramChannel: true,
                formValid: true,
            });
        });

        it('invalidates form when receivers are missing', () => {
            const result = processNotificationTemplate({
                templateInput: {
                    channelType: ChannelType.EMAIL,
                    objectType: 'TEST',
                },
            });
            expect(result.formValid).toBe(false);
        });
    });

    describe('processNotificationConfig', () => {
        it('processes config with email details', () => {
            const result = processNotificationConfig({
                notificationConfigInput: {
                    objectType: 'TEST',
                    notificationConfigDetails: [{ value: { channelType: ChannelType.EMAIL, email: 'test@email.com' } }],
                },
            });
            expect(result).toEqual({
                moduleTitle: 'TestingTool.NotificationConfig',
                objectTypeCode: 'TEST',
                emails: 'test@email.com',
                telegrams: '',
                hasEmailChannel: true,
                hasTelegramChannel: false,
                formValid: true,
            });
        });

        it('processes config with telegram details', () => {
            const result = processNotificationConfig({
                notificationConfigInput: {
                    objectType: 'TEST',
                    notificationConfigDetails: [{ value: { channelType: ChannelType.TELEGRAM, telegramChatId: 123 } }],
                },
            });
            expect(result).toEqual({
                moduleTitle: 'TestingTool.NotificationConfig',
                objectTypeCode: 'TEST',
                emails: '',
                telegrams: '123',
                hasEmailChannel: false,
                hasTelegramChannel: true,
                formValid: true,
            });
        });

        it('handles empty config details', () => {
            const result = processNotificationConfig({
                notificationConfigInput: {
                    objectType: 'TEST',
                },
            });
            expect(result).toEqual({
                moduleTitle: 'TestingTool.NotificationConfig',
                objectTypeCode: 'TEST',
                emails: '',
                telegrams: '',
                hasEmailChannel: false,
                hasTelegramChannel: false,
                formValid: true,
            });
        });
    });

    describe('computedTestingData ', () => {
        it('returns correct data when all booleans are false', () => {
            const result = computedTestingData({}, false, false, false);
            expect(result).toEqual({});
        });

        it('returns correct data when all booleans are false and callback', () => {
            const mockCallback = jest.fn();
            const result = computedTestingData({}, false, false, false, mockCallback);
            expect(result).toEqual({});
            expect(mockCallback).toHaveBeenCalled();
        });

        it('returns correct data when isObjectFilter is true', () => {
            const result = computedTestingData({}, true, false, false);
            expect(result).toEqual({
                objectFilterInput: {
                    configType: undefined,
                    logicalExpression: undefined,
                    name: undefined,
                    objectType: undefined,
                },
            });
        });

        it('returns correct data when isNotificationTemplate is true', () => {
            const result = computedTestingData({}, false, true, false);
            expect(result).toEqual({
                templateInput: {
                    channelType: undefined,
                    configType: undefined,
                    content: undefined,
                    contentType: undefined,
                    name: undefined,
                    objectType: undefined,
                    schemaId: undefined,
                    title: undefined,
                },
            });
        });

        it('returns correct data when isNotificationConfig is true', () => {
            const result = computedTestingData({}, false, false, true);
            expect(result).toEqual({
                notificationConfigInput: {
                    name: undefined,
                    notificationConfigDetails: undefined,
                    objectType: undefined,
                    status: undefined,
                    transactionType: undefined,
                },
            });
        });
    });

    describe('getMessageTitle ', () => {
        it('returns correct title when all booleans are false', () => {
            const result = getMessageTitle(false, false, false);
            expect(result).toBe('');
        });

        it('returns correct title when isObjectFilter is true', () => {
            const result = getMessageTitle(true, false, false);
            expect(result).toBe('TestingTool.MessageObjectFilterDone');
        });

        it('returns correct title when isNotificationTemplate is true', () => {
            const result = getMessageTitle(false, true, false);
            expect(result).toBe('TestingTool.MessageNotificationTemplateDone');
        });

        it('returns correct title when isNotificationConfig is true', () => {
            const result = getMessageTitle(false, false, true);
            expect(result).toBe('TestingTool.MessageNotificationConfigDone');
        });
    });
});
