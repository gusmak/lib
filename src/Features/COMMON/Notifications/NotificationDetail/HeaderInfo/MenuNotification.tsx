import { memo, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MoreHorizOutlined as MoreHorizOutlinedIcon,
    Check as CheckIcon,
    DisplaySettings as DisplaySettingsIcon,
} from '@mui/icons-material';
import { IconButton, Typography, MenuItem, Popover, Box } from '@mui/material';
import { Constants } from 'Commons/Constant';

export type PropsMenu = {
    onUpdateMenuItem: (value: string) => void;
};

const MenuNotification = (props: PropsMenu) => {
    const { t } = useTranslation();
    const { onUpdateMenuItem } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const menuData = () => {
        const commonData = [
            {
                id: '1',
                icon: <CheckIcon />,
                title: t('Notifications.SelectAll'),
                value: Constants.SELECT_ALL,
            },
            {
                id: '2',
                icon: <DisplaySettingsIcon />,
                title: t('Notifications.NotificationSettings'),
                value: Constants.NOTIFICATION_SETTING_SCREEN_PATH,
            },
        ];
        return commonData;
    };

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectMenuItem = (event: MouseEvent<HTMLElement>) => {
        const valueItem = event?.currentTarget?.dataset?.value || '';
        onUpdateMenuItem(valueItem);
        handleClose();
    };

    return (
        <div>
            <IconButton size="small" aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
                <MoreHorizOutlinedIcon />
            </IconButton>
            <Popover
                anchorEl={anchorEl}
                onClose={handleClose}
                open={Boolean(anchorEl)}
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
                {menuData().map((item) => (
                    <MenuItem key={item.id} onClick={selectMenuItem} data-value={item.value}>
                        <Box
                            mr={2}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            {!!item?.icon && item?.icon}
                        </Box>
                        <Typography variant="inherit" sx={{ fontSize: '15px', fontWeight: 400 }}>
                            {item.title}
                        </Typography>
                    </MenuItem>
                ))}
            </Popover>
        </div>
    );
};

export default memo(MenuNotification);
