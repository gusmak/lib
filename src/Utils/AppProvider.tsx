import React, { ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Alert as MuiAlert, AlertColor } from '@mui/material';
import { AppContext } from 'Context';

/**
 * Append common Components
 * snackbar, alert, confirm
 */
const AppProvider = ({ children }: { children: ReactNode }) => {
    const { t } = useTranslation();

    // Ref này dùng để set luôn giá trị cho snackbarProps khi hàm snackbar được gọi,
    // tránh trường hợp nó bị gọi 2 lần và lần thứ 2 message nó bị undefined, và khi
    // snackbarProps được set thì nó sẽ cập nhật giá trị để không bị gọi nữa. Khi state
    // snackbarProps được set xong thì ref này sẽ được reset lại để chuẩn bị cho lần set
    // tiếp theo.
    const firstTimeCallSnackbar = useRef(true);

    const [snackbarProps, setSnackbarProps] = useState<{
        open?: boolean;
        severity?: AlertColor;
        message?: string;
        autoHideDuration?: number;
    }>({});

    const snackbar = useCallback(
        (severity?: AlertColor, message?: string, autoHideDuration?: number) => {
            if (firstTimeCallSnackbar.current) {
                switch (severity) {
                    case 'error':
                        message = message || t('ServiceErrorResponse.OtherError');
                        autoHideDuration = autoHideDuration || 30000;
                        break;
                    case 'info':
                        message = message || t('Common.Info');
                        autoHideDuration = autoHideDuration || 3000;
                        break;
                    case 'warning':
                        message = message || t('Common.Warning');
                        autoHideDuration = autoHideDuration || 5000;
                        break;
                    default:
                        message = message || t('Common.Success');
                        autoHideDuration = autoHideDuration || 3000;
                        break;
                }
                setSnackbarProps({
                    open: true,
                    severity: severity ?? 'success',
                    message: message,
                    autoHideDuration: autoHideDuration,
                });
                firstTimeCallSnackbar.current = false;
            }
        },
        [t]
    );

    useEffect(() => {
        firstTimeCallSnackbar.current = true;
    }, [snackbarProps]);

    const handleCloseSnackbar = (_event?: Event | React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarProps({ open: false });
    };

    const [dialogProps, setDialogProps] = useState<{
        open?: boolean;
        title?: string;
        message?: string;
        okAction?: () => void;
        cancelAction?: () => void;
    }>({});
    const alert = useCallback((message: string, title?: string) => {
        setDialogProps({
            open: true,
            title: title,
            message: message,
            okAction: () => setDialogProps({ open: false }),
        });
    }, []);
    const confirm = useCallback(
        (okFunction?: () => void, cancelFunction?: () => void, message?: string, title?: string) => {
            setDialogProps({
                open: true,
                title: title ?? t('Common.Confirm'),
                message: message ?? t('Common.ConfirmAction'),
                okAction: () => {
                    setDialogProps({ open: false });
                    if (okFunction) okFunction();
                },
                cancelAction: () => {
                    setDialogProps({ open: false });
                    if (cancelFunction) cancelFunction();
                },
            });
        },
        [t]
    );
    const handleCloseDialog = () => {
        setDialogProps({ open: false });
    };

    return (
        <AppContext.Provider
            value={{
                snackbar,
                alert,
                confirm,
            }}
        >
            {children}
            {snackbarProps.open && (
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={snackbarProps.open}
                    autoHideDuration={snackbarProps.autoHideDuration}
                    onClose={handleCloseSnackbar}
                >
                    <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarProps.severity}>
                        {snackbarProps.message}
                    </MuiAlert>
                </Snackbar>
            )}
            {dialogProps.open && (
                <Dialog
                    open={dialogProps.open}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {dialogProps.title && <DialogTitle id="alert-dialog-title">{dialogProps.title}</DialogTitle>}
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">{dialogProps.message}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {dialogProps.cancelAction && (
                            <Button onClick={dialogProps.cancelAction} color="secondary">
                                {t('Common.Cancel')}
                            </Button>
                        )}
                        {dialogProps.okAction && (
                            <Button onClick={dialogProps.okAction} autoFocus>
                                {t('Common.Agree')}
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            )}
        </AppContext.Provider>
    );
};

export default AppProvider;
