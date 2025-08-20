import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { cloneDeep } from 'lodash';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { Drawer, IconButton, List, Toolbar } from '@mui/material';
import { darken, styled } from '@mui/material/styles';
import { currentWorkspaceState, menuPermissionsState } from '../Atom';
import { getRouteWorkspacePermission } from '../utils';
import { useGetLayoutContext } from '../context';
import { DRAWER_WIDTH } from '../Constants';
import MenuNav from './MenuNav';

const StyledDrawer = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        backgroundColor: darken(theme.palette.background.default, 0.02),
        width: DRAWER_WIDTH,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        ...(!open && {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: `calc(${theme.spacing(4)} + 1px)`,
            [theme.breakpoints.up('sm')]: {
                width: `calc(${theme.spacing(7)} + 6px)`,
            },
        }),
    },
}));

const ToggleMenu = styled('div')(({ theme }) => {
    return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        borderTop: `1px solid ${theme.palette.divider}`,
        ...theme.mixins.toolbar,
    };
});

const DrawerContainer = styled('div')(() => {
    return {
        overflowX: 'hidden',
        height: 'calc(100vh - 128px)',
    };
});

interface NavDrawerProps {
    menuOpen: boolean;
    toggleMenu: () => void;
}

const NavDrawer = (props: NavDrawerProps) => {
    const { menuOpen, toggleMenu } = props;
    const { routeList = [] } = useGetLayoutContext();

    /* Atom */
    const currentWorkspace = useAtomValue(currentWorkspaceState);
    const menuPermissions = useAtomValue(menuPermissionsState);
    /* State */
    const [zoomOut, setZoomOut] = useState(false);
    const [open, setOpen] = useState('');

    const handleClick = (newOpen: string) => {
        setZoomOut(false);
        if (zoomOut) toggleMenu();
        if (open === newOpen) setOpen('');
        else setOpen(newOpen);
    };

    const handleToggleMenu = () => {
        setZoomOut(!zoomOut);
        toggleMenu();
        setOpen('');
    };

    return (
        <>
            {currentWorkspace && (
                <StyledDrawer
                    variant="permanent"
                    open={menuOpen}
                    sx={(theme) => ({
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        zIndex: theme.zIndex.appBar - 1,
                        backgroundColor: darken(theme.palette.background.default, 0.02),
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        ...(!menuOpen && {
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                            overflowX: 'hidden',
                            width: `calc(${theme.spacing(4)} + 1px)`,
                            [theme.breakpoints.up('sm')]: {
                                width: `calc(${theme.spacing(7)} + 6px)`,
                            },
                        }),
                    })}
                >
                    <Toolbar />
                    <DrawerContainer>
                        <List sx={{ paddingBottom: 0, paddingTop: 0 }}>
                            <MenuNav
                                routes={getRouteWorkspacePermission(cloneDeep(routeList), menuPermissions, currentWorkspace.id)}
                                zoomOut={zoomOut}
                                open={open}
                                handleClick={handleClick}
                            />
                        </List>
                    </DrawerContainer>
                    <ToggleMenu>
                        <IconButton onClick={handleToggleMenu} size="large">
                            {menuOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </ToggleMenu>
                </StyledDrawer>
            )}
        </>
    );
};

export default NavDrawer;
