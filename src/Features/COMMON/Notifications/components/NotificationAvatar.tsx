import { Fragment, memo } from 'react';
import { Avatar } from '@mui/material';

export type PropsNotificationItem = {
    url?: string;
    name?: string;
};

const NotificationAvatar = (props: PropsNotificationItem) => {
    const { url, name } = props;

    const styleAvatar = {
        width: '54px',
        height: '54px',
        border: '1px solid #0000001a',
    };

    if (!url) {
        return (
            <Fragment>
                {name ? (
                    <Avatar alt={name} title={name} src="/broken-image.jpg" sx={{ ...styleAvatar }} />
                ) : (
                    <Avatar src="/broken-image.jpg" sx={{ ...styleAvatar }} />
                )}
            </Fragment>
        );
    }

    return <Avatar src={url} alt={name} title={name} sx={{ ...styleAvatar }} />;
};

export default memo(NotificationAvatar);
