import { useState } from 'react';
import { Outlet } from 'react-router';
import { useAtomValue } from 'jotai';
import { AppBar, Container, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { currentWorkspaceState, totalDefaultFavoriteWorkspaceState, workspaceIdsState } from './Atom';
import { useGetLayoutContext } from './context';
import Footer from './Footer';
import NavDrawer from './NavDrawer';
import Toolbar from './Toolbar';

const RootDiv = styled('div')({
    display: 'flex',
    '& #main-content': {
        outline: 0,
    },
});

const StyledAppBar = styled(AppBar)(({ theme }) => {
    return {
        transition: theme.transitions.create('width'),
        boxShadow: 'none',
        borderStyle: 'solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgb(19, 47, 76)' : theme.palette.grey[100], //theme.palette.primaryDark[700]
        borderWidth: 0,
        borderBottomWidth: 'thin',
        background: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.common.white, // theme.palette.primaryDark[900]
        color: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[800],
        '& .MuiIconButton-root': {
            color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.primary.main[500],
        },
        lineHeight: 'normal',
    };
});

const Main = styled('main')(() => {
    return {
        display: 'flex',
        width: '100%',
        fontFamily: '',
        minHeight: 'calc(100vh - 72px)',
    };
});

const StyledAppContainer = styled(Container)(({ theme }) => {
    return {
        paddingTop: 80 + 10,
        [theme.breakpoints.up('lg')]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
        position: 'relative',
    };
});

const Dashboard = () => {
    const { appName = '', services } = useGetLayoutContext();
    /* Atom */
    const currentWorkspace = useAtomValue(currentWorkspaceState);
    const totalDefaultFavoriteWorkspace = useAtomValue(totalDefaultFavoriteWorkspaceState);
    const workspaceIds = useAtomValue(workspaceIdsState);
    /* State */
    const [navDrawerOpen, setNavDrawerOpen] = useState(true);

    return (
        <>
            {currentWorkspace.id && (
                <RootDiv>
                    <CssBaseline />
                    <StyledAppBar>
                        {services && (
                            <Toolbar
                                currentWorkspace={currentWorkspace}
                                totalDefaultFavoriteWorkspace={totalDefaultFavoriteWorkspace}
                                workspaceIds={workspaceIds}
                                {...services}
                            />
                        )}
                    </StyledAppBar>
                    <NavDrawer menuOpen={navDrawerOpen} toggleMenu={() => setNavDrawerOpen(!navDrawerOpen)} />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}
                    >
                        <Main>
                            <StyledAppContainer id="main-content" maxWidth={false} tabIndex={-1}>
                                <Outlet />
                            </StyledAppContainer>
                        </Main>
                        <Container sx={{ bottom: 0 }}>
                            <Footer appName={appName} />
                        </Container>
                    </div>
                </RootDiv>
            )}
        </>
    );
};

export default Dashboard;
