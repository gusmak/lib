import type { ReactNode, ReactElement } from 'react';
import { SxProps, Theme } from '@mui/material';

export type DrawerProps = {
    title: string;
    disableButtonSubmit?: boolean;
    loading?: boolean;
    customAction?: ReactElement;
    customButtonSubmit?: ReactElement;
    onSubmit?: () => void;
    open: boolean;
    onClose?: () => void;
    confirmExit?: boolean;
    children: ReactNode;
    childrenWrapperStyle?: SxProps<Theme>;
    wrapperStyle?: any;
};
