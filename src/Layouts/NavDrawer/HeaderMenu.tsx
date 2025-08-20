import { Icon, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from '@mui/material';
import { ArrowDropDown as ArrowDropDownIcon, ArrowRight as ArrowRightIcon } from '@mui/icons-material';
import type { RouteItem } from '../Types';

export type HeaderMenu = Omit<ListItemButtonProps, 'open'> & {
    route: RouteItem;
    open: string;
};

const HeaderMenu = (props: HeaderMenu) => {
    const { route, open, ...rest } = props;

    return (
        <ListItemButton {...rest} selected={open === route.key}>
            {route.subRoutes?.length && open === route.key ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
            {route.icon && (
                <ListItemIcon sx={(theme) => ({ minWidth: theme.spacing(4) })}>
                    <Icon component={route.icon} />
                </ListItemIcon>
            )}
            <ListItemText
                primary={route.title}
                sx={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    '& span': {
                        fontSize: '14px!important',
                    },
                }}
            />
        </ListItemButton>
    );
};

export default HeaderMenu;
