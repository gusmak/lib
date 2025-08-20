import { useLocation, useNavigate, matchRoutes } from 'react-router';
import { useState, useEffect, useRef, useContext } from 'react';
import { AwingContext } from '../../Context';
import { pub, sub, off, getGUID, getRandomKey } from '../PubSub';
import { EVENT_UPDATE_DRAWER_STATE_NAME, EVENT_UPDATE_DRAWER_TITLE_NAME, EVENT_UPDATE_CONFIRM_EXIT_NAME } from '../DrawerNavigate';
import { DrawerStateEnum } from '../DrawerNavigate';

export function useDrawer() {
    const { routes } = useContext(AwingContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [drawerState, setDrawerStatus] = useState<DrawerStateEnum>(DrawerStateEnum.PENDING);
    const [drawerTitle, setStateDrawerTitle] = useState<string>('');

    const id = useRef(getGUID()).current;

    useEffect(() => {
        const setStateKey = getRandomKey();
        const setTitleKey = getRandomKey();
        sub(
            `${EVENT_UPDATE_DRAWER_STATE_NAME}${id}`,
            (newState: DrawerStateEnum) => {
                setDrawerStatus(newState);
            },
            setStateKey
        );
        sub(
            `${EVENT_UPDATE_DRAWER_TITLE_NAME}${id}`,
            (newTitle: string) => {
                setStateDrawerTitle(newTitle);
            },
            setTitleKey
        );
        return () => {
            off(setStateKey);
            off(setTitleKey);
        };
    }, []);

    const setDrawerState = (newDrawerState: DrawerStateEnum) => {
        pub(`${EVENT_UPDATE_DRAWER_STATE_NAME}${id}`, newDrawerState);
    };

    const setDrawerTitle = (newDrawerTitle: string) => {
        pub(`${EVENT_UPDATE_DRAWER_TITLE_NAME}${id}`, newDrawerTitle);
    };

    const setConfirmExit = (newConfirmExitStatus: boolean) => {
        pub(`${EVENT_UPDATE_CONFIRM_EXIT_NAME}${id}`, newConfirmExitStatus);
    };

    // Hanlde navigate back
    const matchedRoutes = matchRoutes(routes, location);
    const navigateBack = () => {
        if (matchedRoutes && matchedRoutes.length > 0) {
            navigate(matchedRoutes[matchedRoutes.length - 2].pathnameBase);
        }
    };

    return {
        drawerState,
        setDrawerState,
        drawerTitle,
        setDrawerTitle,
        setConfirmExit,
        navigateBack,
    };
}
