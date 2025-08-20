import { useState, type MouseEvent } from 'react';
import { omit } from 'lodash';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { useAppTranslation } from 'translate/useAppTranslation';
import type { ActionsProps, IMenu } from './Types';

const Container = (props: ActionsProps) => {
    const { t } = useAppTranslation();
    const { menus, buttonIcon, elementId, ...other } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (menu: IMenu) => {
        menu.action();
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title={t('Common.More')}>
                <IconButton
                    id={`${elementId}-button-select`}
                    aria-controls={`${elementId}-menu`}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    size="small"
                    {...other}
                >
                    {buttonIcon || <MoreVertIcon />}
                </IconButton>
            </Tooltip>
            <Menu
                id={`${elementId}-menu`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': `${elementId}-button-select`,
                    },
                }}
                style={{ margin: '24px 0px 0px 24px' }}
            >
                {menus.map((menu, index) => (
                    <MenuItem
                        key={index}
                        onClick={(e: any) => {
                            e.stopPropagation();
                            handleMenuItemClick(menu);
                        }}
                        {...omit(menu, ['icon', 'name', 'action'])}
                    >
                        <div
                            style={{
                                display: 'flex',
                                marginRight: '8px',
                                alignItems: 'center',
                            }}
                        >
                            {menu.icon}
                        </div>
                        {menu.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default Container;
