import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, Paper } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { useAwing } from 'Context';
import NotificationAvatar from '../../components/NotificationAvatar';
import NotificationContent from '../../components/NotificationContent';
import { getFullDescription } from '../../components/Message';
import { NotificationMessageStatus } from '../../Enum';
import type { NotificationMessage } from '../../Types';

export type ValueItem = {
    id: number;
    status: NotificationMessageStatus;
};

export type PropsNotificationItem = {
    notificationMessage: NotificationMessage;
    onUpdateStatus: (dataSent: ValueItem | string) => void;
};

const NotificationItem = (props: PropsNotificationItem) => {
    const { t } = useTranslation();
    const { transactionType } = useAwing();
    const navigate = useNavigate();
    const { notificationMessage, onUpdateStatus } = props;
    const { sagaTransactionType, fields, status, id } = notificationMessage;

    const handleUpdateStatus = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onUpdateStatus({ id, status } as ValueItem);
    };

    const handleClickNotification = () => {
        if (sagaTransactionType && fields) navigate(getFullDescription(sagaTransactionType, fields, transactionType).url);

        status === NotificationMessageStatus.Unread && onUpdateStatus({ id, status } as ValueItem);
    };

    const itemStatus = status === NotificationMessageStatus.Unread;

    return (
        <Box
            color="inherit"
            onClick={handleClickNotification}
            sx={[
                {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px',
                    borderRadius: '8px',
                    position: 'relative',
                    cursor: 'pointer',
                },
                {
                    '&:hover': {
                        backgroundColor: '#03030312',
                        '& .wrapBtnStatus': {
                            display: 'flex',
                            alignItems: 'center',
                            position: 'absolute',
                            right: '32px',
                            padding: '4px',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            backgroundColor: '#EBEDF0',
                            boxShadow: 'rgba(14, 30, 37, 0.12) 0 2px 4px 0, rgba(14, 30, 37, 0.32) 0 2px 16px 0',
                        },
                    },
                },
            ]}
        >
            <Box
                content="div"
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <NotificationAvatar url={''} name={''} />
                <NotificationContent status={itemStatus} notificationMessage={notificationMessage} />
            </Box>
            <Paper
                variant="outlined"
                sx={{ display: 'none' }}
                className="wrapBtnStatus"
                onClick={handleUpdateStatus}
                title={itemStatus ? t('Notifications.TitleMarkRead') : t('Notifications.TitleMarkUnread')}
            >
                {itemStatus ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Paper>
            {itemStatus && (
                <Paper
                    data-testid="iconStatus"
                    variant="outlined"
                    sx={{
                        padding: '5px',
                        marginLeft: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#ed1d25',
                    }}
                />
            )}
        </Box>
    );
};

export default NotificationItem;
