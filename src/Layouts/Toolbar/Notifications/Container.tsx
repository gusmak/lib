import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationPopover } from 'Features/COMMON/Notifications';
import { IconButton } from '@mui/material';
import { useGetToolbarContext } from '../context';
import { useState } from 'react';

/** Component Notifications */
function Container() {
    const { services } = useGetToolbarContext();
    const [numberNotification, setnumberNotification] = useState(0);

    const handleClick = (count: number) => {
        setnumberNotification(count);
    };

    return services ? (
        <NotificationPopover
            numberNotification={numberNotification}
            service={{
                notificationsCountUnreadMessages: services.notificationsCountUnreadMessages,
                notificationsPaging: services.notificationsPaging,
                notificationsRead: services.notificationsRead,
                notificationsReadAll: services.notificationsReadAll,
                notificationsUnread: services.notificationsUnread,
            }}
            onNotificationClick={handleClick}
        />
    ) : (
        <IconButton>
            <NotificationsIcon />
        </IconButton>
    );
}

export default Container;
