import Container from './Container';
import { LayoutNotificationContext, LayoutNotificationContextType } from '../Context';

export const NotificationPopover = (props: LayoutNotificationContextType) => {
    return (
        <LayoutNotificationContext.Provider value={props}>
            <Container />
        </LayoutNotificationContext.Provider>
    );
};
