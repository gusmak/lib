import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useAppHelper } from 'Context';
import i18next from 'translate/i18n';
import DrawerBase, { DrawerBaseProps } from './ClassicBaseDrawer';

export interface ModalDrawerProps extends Omit<DrawerBaseProps, 'open'> {
    confirmExit?: boolean;
    confirmSave?: boolean;
    messageConfirmSave?: string;
    onSubmit?: () => Promise<any> | void;
    onClose?: () => void;
}

export const enum CloseAction {
    Reload = 'Reload',
    Close = 'Close',
    ReloadDirectory = 'ReloadDirectory',
}
/**
 * Drawer không trả về state,
 *
 * không cần khai báo route trong Router tổng
 * @param{ModalDrawerProps} props
 * @returns
 */
export const Drawer = (props: ModalDrawerProps) => {
    const { confirmExit, confirmSave, onSubmit, onClose, messageConfirmSave, ...other } = props;

    const { confirm, snackbar } = useAppHelper();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation(undefined, { i18n: i18next });

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => {
        setOpen(true);
        return () => {
            clearTimeout(timer.current);
        };
    }, []);
    const closeDrawer = (action: string = CloseAction.Close) => {
        setOpen(false);
        // Điều hướng ngay lập tức thay vì sử dụng setTimeout để tránh vấn đề component bị unmount
        try {
            location.state?.type === 'history'
                ? navigate(-1)
                : navigate('..', { state: { ...location.state, action: action } });
        } catch (error) {
            console.error('Navigation error:', error);
        }

        // Giữ lại hiệu ứng đóng drawer với timeout nhưng không ảnh hưởng đến việc điều hướng
        timer.current = window.setTimeout(() => {}, 100);
    };
    const doPromise = () => {
        const result = onSubmit!();
        if (result instanceof Promise) {
            setLoading(true);
            result
                .then((state: string) => {
                    setTimeout(() => {
                        snackbar('success');
                    }, 700);
                    closeDrawer(typeof state === 'string' && state ? state : CloseAction.Reload);
                })
                .catch((e) => {
                    if (e) snackbar('error');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            console.log('onSubmit did not return a Promise');
        }
    };
    const handleSubmit = () => {
        if (onSubmit) {
            confirmSave ? confirm(doPromise, () => {}, messageConfirmSave ?? t('Common.ConfirmAction')) : doPromise();
        } else {
            closeDrawer();
        }
    };
    const handleClose = () => {
        if (confirmExit) {
            confirm(() => {
                if (onClose) onClose();
                closeDrawer();
            });
        } else {
            if (onClose) onClose();
            closeDrawer();
        }
    };

    return (
        <DrawerBase
            open={open}
            onSubmit={onSubmit ? handleSubmit : undefined}
            onClose={handleClose}
            {...other}
            isLoadingButtonSubmit={loading}
        />
    );
};

export default Drawer;
