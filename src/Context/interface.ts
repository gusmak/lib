import { AlertColor } from '@mui/material';
import { type ReactNode } from 'react';

export interface RouteInfo {
    path: string;
    children?: RouteInfo[];
    element?: ReactNode;
}

export interface AppHelper {
    alert: (message: string, title?: string) => void;
    snackbar: (severity?: AlertColor, message?: string, autoHideDuration?: number) => void;
    confirm: (okFunction?: () => void, cancelFunction?: () => void, message?: string, title?: string) => void;
}

export interface AppHelperContextType {
    routes: Array<{ path: string; children: RouteInfo[] }>;
    i18next: any;
    appHelper: AppHelper;
    service: any;
    transactionType: Record<string, number>;
}
