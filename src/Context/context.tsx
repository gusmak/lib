import { createContext } from 'react';
import { type AlertColor } from '@mui/material/Alert';
import { AppHelperContextType } from './interface';

export const AwingContext = createContext<AppHelperContextType>({
    routes: [],
    i18next: {},
    appHelper: {} as any,
    service: {},
    transactionType: {},
});

export const AppContext = createContext<{
    snackbar: (severity?: AlertColor, message?: string, autoHideDuration?: number) => void;
    alert: (message: string, title?: string) => void;
    confirm: (okFunction?: () => void, cancelFunction?: () => void, message?: string, title?: string) => void;
}>({
    snackbar: () => {},
    alert: (_message: string) => {},
    confirm: () => {},
});
