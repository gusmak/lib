import { CancelToken, PagedList_1OfNotificationMessage } from './Types';

export type NotificationService = {
    /**
     * API hiện thị Danh sách Notification.
     **/
    notificationsPaging: (
        pageIndex: number | undefined,
        pageSize: number | undefined,
        searchString: string | undefined,
        status: number | undefined,
        // body: SagaTransactionType[] | undefined,
        cancelToken?: CancelToken
    ) => Promise<PagedList_1OfNotificationMessage>;

    /**
     * API Chuyển trang Notifications thành đã đọc.
     **/
    notificationsReadAll: (cancelToken?: CancelToken) => Promise<void>;

    /**
     * API Chuyển trang NotificationItem sang đã đọc.
     **/
    notificationsRead: (body: number[] | undefined, cancelToken?: CancelToken) => Promise<void>;

    /**
     * API Chuyển trang NotificationItem sang chưa đọc.
     **/
    notificationsUnread: (body: number[] | undefined, cancelToken?: CancelToken) => Promise<void>;

    /**
     * API Hiển thị số lượng thông báo chưa đọc.
     **/
    notificationsCountUnreadMessages: (cancelToken?: CancelToken) => Promise<number>;
};
