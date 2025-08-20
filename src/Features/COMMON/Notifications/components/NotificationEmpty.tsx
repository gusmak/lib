import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { Notifications as NotificationsIcon, ManageSearch as ManageSearchIcon } from '@mui/icons-material';

export type PropsNotificationEmpty = {
    isSearch?: boolean;
};

const NotificationEmpty = (props: PropsNotificationEmpty) => {
    const { t } = useTranslation();
    const { isSearch = false } = props;

    return (
        <Box
            component="div"
            sx={{
                paddingBottom: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            {isSearch ? <ManageSearchIcon /> : <NotificationsIcon />}
            <Typography
                style={{
                    fontSize: '20px',
                    color: '#65676B',
                    fontWeight: 600,
                    marginTop: '10px',
                    textAlign: 'center',
                }}
            >
                {isSearch ? t('Notifications.InappropriateNotification') : t('Notifications.TitleNoNotifications')}
            </Typography>
        </Box>
    );
};

export default memo(NotificationEmpty);
