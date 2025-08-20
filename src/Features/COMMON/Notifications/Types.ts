import { Timestamp } from 'Commons/Types';
import { NotificationMessageStatus } from './Enum';
import { LayoutNotificationContextType } from './Context';

export type SagaTransactionType = Record<string, number>;

export type LayoutNotificationProps = LayoutNotificationContextType & {
    // other props
};

export interface IValueFilterState {
    textSearch: string; // Từ khóa đang được tìm kiếm.
    tabs: string; // tabs người dùng đang chọn.
    status: number | undefined; // Trạng thái của thông báo.
}

export interface IValueItem {
    id: number;
    status: NotificationMessageStatus;
}

export interface INotificationItem {
    id: string | number;
    content: string;
    url: string;
    status: boolean;
    userName: string;
    avatarUrl: string;
    time: number | string;
}

export interface Cancel {
    message: string | undefined;
}

export interface CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;
    throwIfRequested(): void;
}

export interface NotificationMessage {
    id?: number;
    userId?: string;
    sagaTransactionType?: number;
    fields?: NotificationMessageField[];
    status?: NotificationMessageStatus;
    createdDate?: Timestamp;
}

export interface NotificationMessageField {
    name?: string | undefined;
    value?: string | undefined;
    text?: string | undefined;
}
export interface PagedList_1OfNotificationMessage {
    items: NotificationMessage[];
    totalItemCount: number;
    pageCount?: number;
    pageNumber?: number;
    pageSize?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
}
