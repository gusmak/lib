import { ObjectTypeCode } from 'Features/types';
import { Detail, NotificationConfigDetail } from '../components/ConfigNotification/type';
import { ObjectDataInputOfNotificationConfigDetailInput } from '../types';
import { convertToDetails } from '../utils';

export const convertToObjectDataInputOfNotificationConfigDetailInput = (details: Partial<NotificationConfigDetail>[]) => {
    return details.map((x) => {
        return {
            key: Number(x?.id),
            value: {
                objectFilterId: Number(x?.objectFilterId),
                channelType: x?.channelType,
                telegramChatId: x?.telegramChatId ? Number(x?.telegramChatId) : undefined,
                email: x?.email,
                userId: x?.userId ? Number(x.userId) : undefined,
                userGroupId: x?.userGroupId ? Number(x?.userGroupId) : undefined,
                templateId: Number(x?.templateId),
            },
        } as ObjectDataInputOfNotificationConfigDetailInput;
    });
};

const handleRemoveItem = (arrayNew: Partial<NotificationConfigDetail>[], arrayOld: Partial<NotificationConfigDetail>[]) => {
    const arrayResult: any[] = [];

    // Find elements that are in arrayOld but not in arrayNew (deleted)
    arrayOld.forEach((oldItem) => {
        const newItem = arrayNew.find((item) => item.id === oldItem.id);
        if (!newItem) {
            arrayResult.push({ key: oldItem.id });
        }
    });

    return arrayResult;
};

const findChangedFields = (originalArray: any, modifiedArray: any) => {
    // Hàm so sánh trả về id và các field thay đổi, hoặc toàn bộ phần tử nếu userId, userGroupId, email thay đổi
    const changes = [];
    const specialFields = ['userId', 'userGroupId', 'email']; // Các field đặc biệt

    // 1. So sánh các phần tử có trong cả hai mảng
    for (const originalItem of originalArray) {
        // Tìm tất cả phần tử trong modifiedArray có cùng id
        const matchedItems = modifiedArray.filter((item: any) => item.id === originalItem.id);

        if (matchedItems.length === 0) {
            continue;
        }

        // Xử lý từng phần tử khớp
        for (const modifiedItem of matchedItems) {
            let hasSpecialFieldChange = false;
            const changedFields: any = {};

            // Kiểm tra các field thay đổi
            for (let key in originalItem) {
                if (key !== 'id' && Object.prototype.hasOwnProperty.call(originalItem, key) && originalItem[key] !== modifiedItem[key]) {
                    if (specialFields.includes(key)) {
                        hasSpecialFieldChange = true; // Đánh dấu nếu có thay đổi trong field đặc biệt
                        break; // Thoát vòng lặp nếu phát hiện thay đổi trong field đặc biệt
                    }
                    if (modifiedItem[key] !== '' && modifiedItem[key] !== undefined) {
                        changedFields[key] = modifiedItem[key];
                    }
                }
            }

            if (hasSpecialFieldChange) {
                // Trả về toàn bộ phần tử nếu có thay đổi trong userId, userGroupId, hoặc email
                const validFields: any = {};
                for (let key in modifiedItem) {
                    if (modifiedItem[key] !== '' && modifiedItem[key] !== undefined) {
                        validFields[key] = modifiedItem[key];
                    }
                }
                changes.push(validFields);
            } else if (Object.keys(changedFields).length > 0) {
                // Trả về chỉ các field thay đổi nếu không có thay đổi trong field đặc biệt
                changes.push({
                    id: originalItem.id,
                    ...changedFields,
                });
            }
        }
    }

    return changes;
};

export const convertToSubmit = (details: Detail[], detailsNotifications: NotificationConfigDetail[] | undefined) => {
    if (!details) {
        return { result: [], isChangeNotificationConfigDetails: [] };
    }

    const newNotificationConfigDetails = convertToDetails(details);
    const oldNotificationConfigDetailIds = detailsNotifications?.map((x) => x.id) ?? [];

    const oldNotificationConfigDetails = detailsNotifications ?? [];
    const itemChangedNotificationConfigDetails = findChangedFields(oldNotificationConfigDetails, newNotificationConfigDetails).map((x) => {
        const { id, ...rest } = x;
        return {
            key: x.id ? x.id : undefined,
            value: { ...rest },
        };
    });

    //Xử lý những item bị xóa
    let result = handleRemoveItem(newNotificationConfigDetails, oldNotificationConfigDetails);
    result = [
        ...result,
        //Xử lý những item thêm mới
        ...newNotificationConfigDetails
            .filter((item) => !oldNotificationConfigDetailIds.find((id) => id === item.id))
            .map((u) => ({
                key: undefined,
                value: {
                    objectFilterId: Number(u.objectFilterId),
                    channelType: u.channelType,
                    telegramChatId: u.telegramChatId ? Number(u.telegramChatId) : undefined,
                    email: u.email,
                    userId: u.userId ? Number(u.userId) : undefined,
                    userGroupId: u.userGroupId ? Number(u.userGroupId) : undefined,
                    templateId: Number(u.templateId),
                },
            })),
        // Xử lý những item thay đổi
        ...itemChangedNotificationConfigDetails.filter((x, index) => {
            x.key !== undefined;
            if (index === 0) {
                return x;
            } else {
                delete x.key;
                return x;
            }
        }),
    ];

    const isChangeNotificationConfigDetails = result.length > 0 ? true : false;

    return { result, isChangeNotificationConfigDetails };
};

export const replaceSuffixes = (sagaTransactionType: ObjectTypeCode[], suffixes: string[]) => {
    return sagaTransactionType.map((item) => {
        let updatedValue = String(item.value);
        suffixes.forEach((suffix) => {
            if (updatedValue.endsWith(suffix)) {
                updatedValue = updatedValue.replace(suffix, '');
            }
        });
        return { ...item, value: updatedValue };
    });
};
