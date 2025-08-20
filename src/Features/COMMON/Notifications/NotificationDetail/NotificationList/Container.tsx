import { Fragment, useLayoutEffect, useState } from 'react';
import { Constants } from 'Commons/Constant';
import { NotificationMessageStatus } from '../../Enum';
import NotificationItem from './NotificationItem';
import NotificationEmpty from '../../components/NotificationEmpty';
import NotificationLoading from '../../components/NotificationLoading';
import type { IValueItem, NotificationMessage } from '../../Types';

interface PropsNotificationList {
    isLoading?: boolean;
    valueFilter: {
        textSearch: string;
        tabs: string;
    };
    notificationMessage: NotificationMessage[];
    onUpdateStatus: (dataSent: IValueItem | string) => void;
}

const NotificationList = (props: PropsNotificationList) => {
    const { valueFilter, onUpdateStatus, isLoading = false, notificationMessage } = props;

    const [notifications, setNotifications] = useState<NotificationMessage[]>(notificationMessage);

    useLayoutEffect(() => {
        setNotifications(
            valueFilter.tabs === Constants.UNREAD
                ? notificationMessage.filter((item) => item.status === NotificationMessageStatus.Unread)
                : notificationMessage
        );
    }, [notificationMessage, valueFilter.tabs]);

    if (!notifications.length && !isLoading) {
        return <NotificationEmpty isSearch={valueFilter?.textSearch?.length > 0} />;
    }

    return (
        <Fragment>
            {notifications.map((item: NotificationMessage) => (
                <NotificationItem key={item.id} notificationMessage={item} onUpdateStatus={onUpdateStatus} />
            ))}
            {isLoading && <NotificationLoading />}
        </Fragment>
    );
};

export default NotificationList;
