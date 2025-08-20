import { Fragment } from 'react';
import { Link, matchPath } from 'react-router';
import { grey } from '@mui/material/colors';
import { Collapse, Icon, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import HeaderMenu from './HeaderMenu';
import NavLink from './NavLink';
import type { RouteItem } from '../Types';

interface MenuNavProps {
    routes: RouteItem[];
    zoomOut: boolean;
    open: string;
    handleClick: (key: string) => void;
}

const MenuNav = (props: MenuNavProps) => {
    const { routes, zoomOut, open, handleClick } = props;

    return routes.map((route) => (
        <Fragment key={route.key}>
            {route.subRoutes ? (
                <>
                    {zoomOut ? (
                        <Tooltip title={route.title} placement="right">
                            <HeaderMenu
                                onClick={() => handleClick(route.key)}
                                sx={(theme) => ({ paddingLeft: theme.spacing(0.5) })}
                                open={open}
                                route={route}
                            />
                        </Tooltip>
                    ) : (
                        <HeaderMenu
                            onClick={() => handleClick(route.key)}
                            sx={(theme) => ({ paddingLeft: theme.spacing(0.5) })}
                            open={open}
                            route={route}
                        />
                    )}
                    <Collapse in={open === route.key} timeout="auto" unmountOnExit>
                        <List
                            component="div"
                            disablePadding
                            sx={(theme) => ({
                                marginInline: theme.spacing(5, 0),
                                borderLeft: `1px solid ${grey[400]}`,
                                fontSize: '14px',
                            })}
                        >
                            {route.subRoutes?.map((sRoute, index) => (
                                <ListItemButton
                                    key={index}
                                    component={NavLink}
                                    to={`/${sRoute.path?.replace(/\/\*/g, '') || '#'}`}
                                    sx={{
                                        whiteSpace: 'normal',
                                    }}
                                    end
                                >
                                    <ListItemText
                                        disableTypography
                                        // TODO: Fix this translation
                                        primary={sRoute.title}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </>
            ) : (
                <ListItemButton
                    component={Link}
                    sx={(theme) => ({
                        paddingLeft: theme.spacing(0.5),
                    })}
                    onClick={() => handleClick(route.key)}
                    selected={route.path ? Boolean(matchPath(route.path, location.pathname)) : false}
                    to={route.path || '#'}
                >
                    {route.icon && (
                        <ListItemIcon
                            sx={(theme) => ({
                                minWidth: theme.spacing(4),
                            })}
                        >
                            <Icon component={route.icon} />
                        </ListItemIcon>
                    )}
                    <ListItemText
                        primary={route.title}
                        sx={{
                            fontSize: '14px',
                            textTransform: 'uppercase',
                        }}
                    />
                </ListItemButton>
            )}
        </Fragment>
    ));
};

export default MenuNav;
