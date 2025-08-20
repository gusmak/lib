import { useEffect } from 'react';
import { Link } from 'react-router';
import { useSetAtom } from 'jotai';
import AwingLogo from './flag/logo';
import { AppBar, Box, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import AppProvider from 'Utils/AppProvider';
import { Constants } from 'Commons/Constant';
import { currentUserState, favoriteWorkspacesState } from './Atom';
import { useGetToolbarContext } from './context';
import LanguageBox from './LanguageBox';
import WorkplaceBox from './WorkplaceBox';
import Notifications from './Notifications';
import UserBox from './UserBox';

const StyledAppBar = styled(AppBar)(({ theme }) => {
    return {
        transition: theme.transitions.create('width'),
        boxShadow: 'none',
        borderStyle: 'solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgb(19, 47, 76)' : theme.palette.grey[100],
        borderWidth: 0,
        borderBottomWidth: 'thin',
        background: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.common.white,
        color: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[800],
        '& .MuiIconButton-root': {
            color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary.main[500],
        },
        lineHeight: 'normal',
    };
});

const GrowingDiv = styled('div')({
    flex: '1 1 auto',
});

export type ContainerProps = {
    totalDefaultFavoriteWorkspace?: number;
    workspaceIds?: number[];
};

function Container(props: ContainerProps) {
    const { services } = useGetToolbarContext();
    /* Atom */
    const setCurrentUser = useSetAtom(currentUserState);
    const setfavoriteWorkspaces = useSetAtom(favoriteWorkspacesState);

    const fetchData = async () => {
        if (services) {
            await services.getCurrentUser().then((currentUser) => {
                setCurrentUser(currentUser);
            });

            await services
                .getFavoriteWorkspaces({
                    totalDefaultFavoriteWorkspace: props?.totalDefaultFavoriteWorkspace ?? 10,
                    workspaceIds: props?.workspaceIds ?? [],
                })
                .then((res) => {
                    setfavoriteWorkspaces(res.items);
                });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AppProvider>
            <StyledAppBar>
                <Toolbar>
                    <Box component={Link} to={`${Constants.HOME_PATH}`} aria-label="Goto homepage" sx={{ lineHeight: 0, mr: 2 }}>
                        <AwingLogo />
                    </Box>

                    <GrowingDiv />
                    <Notifications />
                    <LanguageBox />
                    <UserBox />
                    <WorkplaceBox />
                </Toolbar>
            </StyledAppBar>
        </AppProvider>
    );
}

export default Container;
