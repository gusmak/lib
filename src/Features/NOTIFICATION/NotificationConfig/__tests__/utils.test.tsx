import { Detail, NotificationConfigDetail } from '../../components/ConfigNotification/type';
import { convertToObjectDataInputOfNotificationConfigDetailInput, convertToSubmit } from '../utils';

describe('convertToObjectDataInputOfNotificationConfigDetailInput', () => {
    it('should correctly convert NotificationConfigDetail to ObjectDataInputOfNotificationConfigDetailInput', () => {
        const details: Partial<NotificationConfigDetail>[] = [
            {
                id: 1,
                objectFilterId: 100,
                channelType: 'EMAIL',
                telegramChatId: '200',
                email: 'example@example.com',
                userId: 300,
                userGroupId: 400,
                templateId: 500,
            },
        ];
        const result = convertToObjectDataInputOfNotificationConfigDetailInput(details);
        expect(result[0].key).toBe(1);
        expect(result[0]?.value?.objectFilterId).toBe(100);
        expect(result[0]?.value?.telegramChatId).toBe(200);
        expect(result[0]?.value?.email).toBe('example@example.com');
        expect(result[0]?.value?.userId).toBe(300);
        expect(result[0]?.value?.userGroupId).toBe(400);
        expect(result[0]?.value?.templateId).toBe(500);
    });

    it('should handle undefined fields gracefully', () => {
        const details: Partial<NotificationConfigDetail>[] = [{ id: 1, templateId: 100 }];
        const result = convertToObjectDataInputOfNotificationConfigDetailInput(details);
        expect(result[0].key).toBe(1);
        expect(result[0]?.value?.templateId).toBe(100);
        expect(result[0]?.value?.objectFilterId).toBeNaN();
    });
});

describe('convertToSubmit', () => {
    it('should correctly convert details', () => {
        const details: Detail[] = [
            {
                objectFilterId: 1,
                channels: [
                    {
                        channelType: 'EMAIL',
                        lastPoints: [
                            { id: 1, receiverId: 2, type: '', templateId: 3, userIds: ['4'], userGroupIds: ['5'] },
                        ],
                    },
                ],
            },
        ];
        const notificationConfigData = { notificationConfig: { details: [{ id: 2 }] } };
        const result = convertToSubmit(details, notificationConfigData).result;
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(2);
    });
});
