import { useEffect, useState } from 'react';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { Badge, Box, IconButton, Popover } from '@mui/material';
import { Constants } from 'Commons/Constant';
import { useGetContext } from '../Context';
import NotificationDetail from '../NotificationDetail';

const Container = () => {
    const { service, numberNotification, onNotificationClick } = useGetContext();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        service?.notificationsCountUnreadMessages()?.then((count) => {
            onNotificationClick && onNotificationClick(count);
        });
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { href } = window.location;
        // nếu đang ở notifications thì click vào quả chuông sẽ không mở popover nữa.
        if (!href.includes(Constants.NOTIFICATIONS_PATH)) {
            onNotificationClick && onNotificationClick(0);
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const id = open ? 'simple-popover' : undefined;

    return (
        <Box component="div">
            <IconButton aria-describedby={id} onClick={handleClick} sx={{ backgroundColor: open ? '#F98D9C' : 'inherit' }}>
                <Badge badgeContent={numberNotification} color="error">
                    <NotificationsIcon sx={{ color: open ? '#DD040C' : 'inherit' }} />
                </Badge>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                sx={{ zIndex: 1100 }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                slotProps={{
                    paper: {
                        style: {
                            borderRadius: '8px',
                        },
                    },
                }}
            >
                <Box
                    data-testid="popover"
                    component="div"
                    sx={[
                        {
                            width: '400px',
                            overflowY: 'auto',
                            maxHeight: 'calc(90vh - 8px)',
                        },
                        {
                            '&::-webkit-scrollbar': {
                                width: '10px',
                            },
                        },
                        {
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                            },
                        },
                        {
                            '&::-webkit-scrollbar-thumb': {
                                borderRadius: '4px',
                                backgroundColor: '#c1c1c1',
                            },
                        },
                    ]}
                >
                    <NotificationDetail onClosePopover={handleClose} />
                </Box>
            </Popover>
        </Box>
    );
};

export default Container;
