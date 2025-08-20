import Box from '@mui/material/Box';
import NotificationDetail from './NotificationDetail';

const Container = () => {
    return (
        <Box
            component="div"
            sx={{
                borderRadius: '8px',
                border: '0.1px solid #0000001a',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            data-testid="notificationScreen"
            width={{ xs: '100%', sm: '600px', lg: '680px' }}
        >
            <NotificationDetail />
        </Box>
    );
};

export default Container;
