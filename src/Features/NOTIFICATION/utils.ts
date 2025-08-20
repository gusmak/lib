import { Channel, Detail, LastPoint, NotificationConfigDetail, SubscriptionConfigDetail } from './components/ConfigNotification/type';
import { groupBy, map } from 'lodash';
import { ChannelTypeMap } from './constants';
import { LastPointType } from './NotificationConfig/common';
import { ObjectTypeCode } from 'Features/types';
import { checkFullControl } from 'Features/utils';
import { ObjectFilter } from './ObjectFilter';
import { SubscriptionConfigsType } from './SubscriptionConfig';
import { NotificationConfigType } from './NotificationConfig';

export const convertToStateDetails = (details: NotificationConfigDetail[] | SubscriptionConfigDetail[]) => {
    // Sử dụng groupBy để nhóm các đối tượng theo objectFilterId
    const groupByFilter = groupBy(details, 'objectFilterId');
    const result: Detail[] = map(groupByFilter, (group: any) => {
        const firstItem = group[0];
        const groupByChannel = groupBy(group, 'channelType');
        return {
            objectFilterId: firstItem.objectFilterId,
            // Group by channelType
            channels: map(groupByChannel, (channel) => {
                const firstChannel = channel[0];
                const convertLastPoints: LastPoint[] = [];
                const users: LastPoint[] = [];
                const groups: LastPoint[] = [];
                channel.map((item) => {
                    if (item.channelType == ChannelTypeMap[0].value) {
                        // Kênh Telegram
                        convertLastPoints.push({
                            id: item.id,
                            type: LastPointType.TELEGRAM,
                            receiverId: item.telegramChatId,
                            templateId: item.templateId,
                        });
                    } else {
                        // Kênh Email
                        if (item.email) {
                            convertLastPoints.push({
                                id: item.id,
                                type: LastPointType.EMAIL,
                                email: item.email,
                                templateId: item.templateId,
                            });
                        } else {
                            // Nhóm theo user và nhóm user
                            if (item.userId) {
                                const idx = users.findIndex((u) => u.templateId === item.templateId);
                                if (idx > -1) {
                                    users[idx]?.userIds?.push(item.userId);
                                } else {
                                    users.push({
                                        id: item.id,
                                        templateId: item.templateId,
                                        userIds: [item.userId],
                                        type: LastPointType.USER_IDS,
                                    });
                                }
                            } else {
                                const idx = groups.findIndex((g) => g.templateId === item.templateId);
                                if (idx > -1) {
                                    groups[idx]?.userGroupIds?.push(item?.userGroupId?.toString() ?? '');
                                } else {
                                    groups.push({
                                        id: item.id,
                                        templateId: item.templateId,
                                        userGroupIds: [item?.userGroupId?.toString() ?? ''],
                                        type: LastPointType.USER_GROUP_IDS,
                                    });
                                }
                            }
                        }
                    }
                });
                if (users.length > 0) {
                    convertLastPoints.push(
                        ...(users.map((u) => ({
                            id: u.id,
                            type: LastPointType.USER_IDS,
                            userIds: u.userIds,
                            templateId: u.templateId,
                        })) as LastPoint[])
                    );
                }
                if (groups.length > 0) {
                    convertLastPoints.push(
                        ...(groups.map((g) => ({
                            id: g.id,
                            type: LastPointType.USER_GROUP_IDS,
                            userGroupIds: g.userGroupIds,
                            templateId: g.templateId,
                        })) as LastPoint[])
                    );
                }
                return {
                    channelType: firstChannel.channelType,
                    lastPoints: convertLastPoints,
                };
            }),
        };
    });
    return result;
};

export const convertToDetails = (details: Detail[]) => {
    const result: Partial<NotificationConfigDetail>[] = [];

    const pushDetail = (point: LastPoint, detail: Detail, channel: Channel, additionalData: object) => {
        result.push({
            id: Number(point.id),
            objectFilterId: Number(detail.objectFilterId),
            channelType: channel.channelType,
            templateId: Number(point.templateId),
            ...additionalData,
        });
    };

    details.forEach((detail) => {
        detail?.channels?.forEach((channel) => {
            channel?.lastPoints?.forEach((point) => {
                switch (point.type) {
                    case LastPointType.TELEGRAM:
                        pushDetail(point, detail, channel, { telegramChatId: Number(point.receiverId) });
                        break;
                    case LastPointType.EMAIL:
                        pushDetail(point, detail, channel, { email: point.email, userId: null, userGroupId: null });
                        break;
                    case LastPointType.USER_IDS:
                        point.userIds?.forEach((userId) => {
                            pushDetail(point, detail, channel, { userId: Number(userId), email: null, userGroupId: null });
                        });
                        break;
                    case LastPointType.USER_GROUP_IDS:
                        point.userGroupIds?.forEach((userGroupId) => {
                            pushDetail(point, detail, channel, { userGroupId: Number(userGroupId), email: null, userId: null });
                        });
                        break;
                    default:
                        break;
                }
            });
        });
    });

    return result;
};

// Hàm lọc các phần tử có prefix tương ứng
export const filterByPrefix = (array: ObjectTypeCode[], prefixToFind: string) => {
    if (!array || !prefixToFind) return [];
    const regex = new RegExp(`^${prefixToFind}(_|$)`);
    return array.filter((item) => regex.test(String(item.value)));
};

export const checkPermissionControl = (objectFilters: ObjectFilter[] |
    SubscriptionConfigsType[] | NotificationConfigType[] | undefined
    , id: number): boolean => {
    const permission = objectFilters
        ?.find((item) => item.id === id)
        ?.outputFieldPermission?.objectDefinitionWithPermissions?.find((item) => item.objectDefinition?.fieldName === 'id')?.permission;

    return checkFullControl(permission);
};