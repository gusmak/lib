import { ReactNode, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Divider, Drawer, IconButton, Stack, SxProps, Theme, Tooltip, Typography } from '@mui/material';
import i18next from 'translate/i18n';

export interface DrawerBaseProps {
    title?: ReactNode;
    disableButtonSubmit?: boolean;
    isLoadingButtonSubmit?: boolean;
    customAction?: ReactElement;
    onSubmit?: () => void;
    open: boolean;
    onClose?: () => void;
    otherNodes?: ReactNode;
    children: ReactNode;
    width?: string | number;
    childrenWrapperStyle?: SxProps<Theme>;
}
/**
 * Drawer không trả về state
 * @param{DrawerBaseProps} props
 * @returns
 */
const DrawerBase = (props: DrawerBaseProps) => {
    const {
        title,
        disableButtonSubmit,
        isLoadingButtonSubmit,
        customAction,
        onSubmit,
        open,
        onClose,
        otherNodes,
        children,
        width = '80%',
        childrenWrapperStyle,
        ...rest
    } = props;

    const { t } = useTranslation(undefined, { i18n: i18next });

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit();
        }
    };

    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        backgroundColor: (theme) => theme.palette.background.default,
                        width,
                    },
                },
            }}
            {...rest}
            onClose={handleClose}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    backgroundColor: (theme) => theme.palette.background.paper,
                }}
            >
                <Tooltip title={t('Common.Close') ?? 'Close'} enterDelay={300}>
                    <IconButton color="inherit" onClick={handleClose} edge="start" sx={{ mx: 1 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                {!!customAction && customAction}
                {onSubmit && (
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                        {otherNodes}
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            loading={isLoadingButtonSubmit}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            disabled={disableButtonSubmit || isLoadingButtonSubmit}
                        >
                            {t('Common.Save')}
                        </LoadingButton>
                    </Stack>
                )}
            </Box>
            <Divider />
            <Box
                sx={{
                    px: 2,
                    height: 'calc(100% - 52px)',
                    overflowY: 'auto',
                    ...childrenWrapperStyle,
                }}
            >
                {children}
            </Box>
        </Drawer>
    );
};

export default DrawerBase;
