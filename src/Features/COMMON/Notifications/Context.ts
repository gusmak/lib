import { createContext, useContext, useMemo } from 'react';
import { NotificationService } from './Services';

export interface LayoutNotificationContextType {
    service?: NotificationService;
    numberNotification?: number;
    onNotificationClick?: (notification: number) => void;
}

/** Context for feature  */
export const LayoutNotificationContext = createContext<LayoutNotificationContextType>({});

/** Get Context */
export const useGetContext = () => {
    const context = useContext(LayoutNotificationContext);
    const props = useMemo(() => context, [context]);
    return props;
};
