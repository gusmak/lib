import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Person } from '@mui/icons-material';
import { useAtomValue } from 'jotai';
import { Logout as LogoutIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { Constants } from 'Commons/Constant';
import { useAppHelper } from 'Context';
import { currentUserState } from '../Atom';
import { useGetToolbarContext } from '../context';

const UserBox = () => {
    const { t } = useTranslation();
    const { snackbar } = useAppHelper();
    const { services } = useGetToolbarContext();
    /* Atom */
    const currentUser = useAtomValue(currentUserState);
    /* State */
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleComingSoon = () => {
        snackbar('warning', t('Common.CommingSoon'));
        setAnchorEl(null);
    };

    const getFirstLetterFromString = (str: string) => {
        return str.substring(0, 1);
    };

    const handleLogout = async () => {
        setAnchorEl(null);
        if (services) await services.onLogout();
    };

    const handleProfileDetail = () => {
        const profileUrl = `${Constants.ID_DOMAIN}/${Constants.PROFILE_PATH}/${Constants.USER_PROFILE_INFO}`;
        window.location.href = profileUrl;
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title={t('Common.UserProfile').toString()}>
                <IconButton
                    id="user-profile-button"
                    aria-controls="user-profile-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ ml: 1 }}
                >
                    <Avatar sx={{ width: 32, height: 32 }}>
                        {getFirstLetterFromString(currentUser?.username ?? t('User.Username'))?.toLocaleUpperCase()}
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                id="user-profile-menu"
                aria-labelledby="user-profile-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem about="name" onClick={handleProfileDetail}>
                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>
                    {currentUser?.name ?? t('User.Name')}
                </MenuItem>
                <Divider />
                <MenuItem about="setting" onClick={handleComingSoon}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    {t('Common.Settings')}
                </MenuItem>
                <MenuItem about="logout" onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    {t('Common.Logout')}
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserBox;
