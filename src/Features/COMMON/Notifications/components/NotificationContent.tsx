import { memo } from 'react';
import moment from 'moment';
import { toNumber } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { NotificationMessage } from '../Types';
import { getFullDescription } from './Message';
import { useAwing } from 'Context';

export type PropsNotificationContent = {
    status?: boolean;
    notificationMessage?: NotificationMessage;
};

const NotificationContent = (props: PropsNotificationContent) => {
    const { notificationMessage, status = false } = props;
    const { transactionType } = useAwing();
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: '8px',
            }}
        >
            <Typography
                variant="caption"
                sx={[
                    {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 5,
                        margin: '0 0 2px 0',
                        lineHeight: 1.2,
                        fontSize: '14px',
                        fontWeight: 400,
                        justifyContent: 'space-between',
                    },
                    {
                        '& h1, h2, h3, h4, h5, h6, p, span, b, strong, small, em, i, big': {
                            marginTop: 0,
                            marginBottom: 0,
                            fontSize: '14px',
                            fontWeight: 400,
                            textAlign: 'justify',
                        },
                        '& a': {
                            color: '#1a0dab',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 400,
                            textAlign: 'justify',
                        },
                    },
                ]}
            >
                {notificationMessage &&
                    getFullDescription(
                        toNumber(notificationMessage?.sagaTransactionType),
                        notificationMessage?.fields ?? [],
                        transactionType
                    )?.title}
            </Typography>

            {notificationMessage?.createdDate?.seconds && (
                <Typography variant="caption" sx={{ color: status ? '#ED1D25' : 'inherit' }}>
                    {moment.unix(Number(notificationMessage?.createdDate?.seconds)).locale(t('Common.lg')).format('MM/DD/YYYY hh:mm A')}
                </Typography>
            )}
        </Box>
    );
};

export default memo(NotificationContent);
