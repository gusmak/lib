import { Box } from '@mui/material';
import { LayoutNotificationContext } from './Context';
import Container from './Container';
import type { LayoutNotificationProps } from './Types';

const Notifications = (props: LayoutNotificationProps) => {
    return (
        <LayoutNotificationContext.Provider value={props}>
            <Box component="div" display="flex" justifyContent="center">
                <Container />
            </Box>
        </LayoutNotificationContext.Provider>
    );
};

export * from './Types';
export * from './Services';
export default Notifications;
export { NotificationPopover } from './NotificationPopover';
