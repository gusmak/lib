import { useMemo } from 'react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Drawer, IconButton, Typography, Box, Button, Divider, Tooltip } from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAppHelper } from 'Context';
import type { DrawerProps } from './Types';

export const preventDuplidateAction = debounce((action: Function) => {
    action();
}, 300);

const Container = (props: DrawerProps) => {
    const { t } = useTranslation();
    const { confirm } = useAppHelper();

    const {
        title,
        disableButtonSubmit,
        loading,
        customAction,
        customButtonSubmit,
        onSubmit,
        open,
        confirmExit,
        onClose,
        children,
        wrapperStyle,
        childrenWrapperStyle,
    } = props;

    const initPathname = useMemo(() => {
        return window.location.pathname;
    }, []);
    const match = initPathname === window.location.pathname;

    const handleSubmit = () => {
        if (onSubmit) {
            preventDuplidateAction(onSubmit);
        }
    };

    const handleClose = () => {
        if (onClose)
            preventDuplidateAction(
                confirmExit
                    ? () => {
                          confirm(onClose);
                      }
                    : onClose
            );
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            slotProps={{
                paper: {
                    elevation: 0,
                    style: {
                        backgroundColor: '#fafafa',
                        width: match ? '80%' : '100%',
                        ...(wrapperStyle ? wrapperStyle : {}),
                    },
                },
            }}
            onClose={handleClose}
        >
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    backgroundColor: 'white',
                }}
            >
                <Tooltip title={t('Common.Close')} enterDelay={300}>
                    <IconButton color="inherit" onClick={handleClose} edge="start" style={{ marginLeft: '8px', marginRight: '8px' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                    {title}
                </Typography>
                {!!customAction && customAction}
                {onSubmit && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            WebkitBoxPack: 'center',
                            justifyContent: 'center',
                            WebkitBoxAlign: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {customButtonSubmit ? (
                            customButtonSubmit
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={handleSubmit}
                                disabled={disableButtonSubmit || loading}
                            >
                                {loading ? t('Common.Loading') : t('Common.Save')}
                            </Button>
                        )}
                    </div>
                )}
            </Box>
            <Divider />
            <Box
                sx={{
                    padding: '24px 40px',
                    height: 'calc(100% - 52px)',
                    overflow: 'auto',
                    ...childrenWrapperStyle,
                }}
            >
                {children}
            </Box>
        </Drawer>
    );
};

export default Container;
