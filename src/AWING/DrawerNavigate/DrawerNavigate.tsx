import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Drawer from '../Drawer';
import { pub, sub, off, updateGUID, getRandomKey } from '../PubSub';
import { CloseAction } from 'Commons/Components/Drawer';
import { DrawerStateEnum } from './Enum';
import { DrawerNavigateProps } from './interface';
import { EVENT_UPDATE_DRAWER_STATE_NAME, EVENT_UPDATE_DRAWER_TITLE_NAME, EVENT_UPDATE_CONFIRM_EXIT_NAME } from './constant';

const DrawerNavigate = (props: DrawerNavigateProps) => {
    const { title, ...other } = props;
    const navigate = useNavigate();

    const [updateEventName, setUpdateEventName] = useState('');
    const [drawerState, setDrawerState] = useState(DrawerStateEnum.PENDING);
    const [drawerTitle, setDrawerTitle] = useState(title || '');
    const [confirmExit, setConfirmExit] = useState(false);

    useEffect(() => {
        const id = updateGUID();
        const newEventName = `${EVENT_UPDATE_DRAWER_STATE_NAME}${id}`;
        const newTitleEventName = `${EVENT_UPDATE_DRAWER_TITLE_NAME}${id}`;
        const newConfirmExitEventName = `${EVENT_UPDATE_CONFIRM_EXIT_NAME}${id}`;
        setUpdateEventName(newEventName);
        const setStateKey = getRandomKey();
        const setTitleKey = getRandomKey();
        const setConfirmExitKey = getRandomKey();
        sub(
            newEventName,
            (newDrawerState: DrawerStateEnum) => {
                setDrawerState(newDrawerState);
            },
            setStateKey
        );
        sub(
            newTitleEventName,
            (newDrawerTitle: string) => {
                setDrawerTitle(newDrawerTitle);
            },
            setTitleKey
        );
        sub(
            newConfirmExitEventName,
            (newConfirmExitStatus: boolean) => {
                setConfirmExit(newConfirmExitStatus);
            },
            setConfirmExitKey
        );
        return () => {
            off(setStateKey);
            off(setTitleKey);
            off(setConfirmExitKey);
        };
    }, []);

    useEffect(() => {
        if (drawerState === DrawerStateEnum.SUBMIT_SUCCESS) {
            setTimeout(() => {
                navigate('..', { state: { action: CloseAction.Reload } });
            }, 500);
        }
    }, [drawerState]);

    const navigateBack = () => {
        navigate('..');
    };

    const handleSubmit = () => {
        pub(updateEventName, DrawerStateEnum.IN_PROGRESS);
    };

    const handleClose = () => {
        navigateBack();
    };
    return (
        <Drawer
            open={true}
            onSubmit={handleSubmit}
            onClose={handleClose}
            loading={drawerState === DrawerStateEnum.IN_PROGRESS || drawerState === DrawerStateEnum.LOADING}
            disableButtonSubmit={drawerState === DrawerStateEnum.INVALID || drawerState === DrawerStateEnum.PENDING}
            title={drawerTitle}
            confirmExit={confirmExit}
            {...other}
        />
    );
};

export default DrawerNavigate;
