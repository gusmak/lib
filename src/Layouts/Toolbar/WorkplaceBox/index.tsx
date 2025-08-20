import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue } from 'jotai';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    SignalCellularAlt as SignalCellularAltIcon,
} from '@mui/icons-material';
import { Box, Button, ListItemIcon, ListItemText, MenuItem, Popover, styled } from '@mui/material';
import { favoriteWorkspacesState, currentUserState, allWorkSpaceState } from '../Atom';
import { useGetToolbarContext } from '../context';
import AllWorkSpace from './AllWorkSpace';
import type { Workspace } from '../Types';

const StyleDiv = styled('div')(({ theme }) => {
    return {
        display: 'inline-flex',
        alignItems: 'center',
        paddingLeft: `${theme.spacing(1)} !important`,
        cursor: 'pointer',
        marginTop: `${theme.spacing(1)} !important`,
        marginBottom: `${theme.spacing(1)} !important`,
    };
});

const StylePopover = styled(Popover)(() => {
    return {
        minWidth: '250px',
        top: '20px !important',
    };
});

const WorkplaceBox = () => {
    const { t } = useTranslation();
    const { services, currentWorkspace } = useGetToolbarContext();
    /* Atom */
    const currentUser = useAtomValue(currentUserState);
    const favoriteWorkspaces = useAtomValue(favoriteWorkspacesState);
    const [allWorkSpace, setAllWorkSpace] = useAtom(allWorkSpaceState);
    /* State */
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    const openPopoverDomain = Boolean(anchorEl);
    const id = openPopoverDomain ? 'popover-domain' : undefined;

    const closeDrawer = () => {
        setIsOpenDrawer(false);
    };

    const handleGetAllWorkSpace = async () => {
        setIsOpenDrawer(true);
        handleClosePopover();

        if (services) {
            services
                .getAllWorkSpaceByUserPermission({
                    userId: currentUser?.id,
                })
                .then((res) => {
                    setAllWorkSpace(res.items);
                });
        }
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const handleGetFavoriteWorkspace = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChangeWorkspace = async (workspace: Workspace) => {
        if (workspace?.id) {
            services && services?.onChangeWorkspace && services?.onChangeWorkspace();
        }
    };

    return (
        <>
            <StyleDiv onClick={handleGetFavoriteWorkspace}>
                {currentWorkspace?.name ?? 'Workspace'}
                {openPopoverDomain ? (
                    <KeyboardArrowUpIcon sx={{ color: 'rgba(0, 0, 0, 0.30)' }} />
                ) : (
                    <KeyboardArrowDownIcon sx={{ color: 'rgba(0, 0, 0, 0.30)' }} />
                )}
            </StyleDiv>
            <StylePopover
                id={id}
                open={openPopoverDomain}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box
                    pl={2}
                    pr={2}
                    pt={1}
                    pb={1}
                    sx={{
                        borderBottom: '1px solid #EEEEEE',
                        backgroundColor: '#EEEEEE',
                    }}
                >
                    {t('Common.SelectWorkSpace')}
                </Box>
                <Box mt={1} mb={1}>
                    {favoriteWorkspaces?.map((fw) => {
                        if (fw?.id !== currentWorkspace?.id)
                            return (
                                <MenuItem key={fw?.id} onClick={() => handleChangeWorkspace(fw)}>
                                    <ListItemIcon>{fw?.icons ?? <SignalCellularAltIcon />}</ListItemIcon>
                                    <ListItemText>{fw.name}</ListItemText>
                                </MenuItem>
                            );
                    })}
                    {favoriteWorkspaces && favoriteWorkspaces?.length >= 10 && (
                        <Box
                            sx={{
                                borderTop: '1px solid #EEEEEE',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                pt: 1,
                            }}
                        >
                            <Button variant="outlined" size="small" onClick={handleGetAllWorkSpace}>
                                {t('Common.SeeMore')}
                            </Button>
                        </Box>
                    )}
                </Box>
            </StylePopover>
            <AllWorkSpace
                isOpen={isOpenDrawer}
                allWorkSpace={allWorkSpace ?? []}
                onClose={closeDrawer}
                setCurrentWorkspace={handleChangeWorkspace}
            />
        </>
    );
};

export default WorkplaceBox;
