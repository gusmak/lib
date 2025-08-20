import { Fragment } from 'react';
import { Box, Avatar, Skeleton, Typography } from '@mui/material';

const NotificationLoading = () => {
    /* Lấy về Circular với Skeleton with khác nhau  */
    const getCircular = (width1: string, width2: string) => {
        return (
            <Box
                role="timer"
                component="div"
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '8px',
                    borderRadius: '8px',
                }}
            >
                <Skeleton variant="circular">
                    <Avatar
                        sx={{
                            width: '56px',
                            height: '56px',
                        }}
                    />
                </Skeleton>
                <Box
                    component="div"
                    ml={1}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                    }}
                >
                    <Skeleton variant="rectangular" width={width1} height="20px" sx={{ borderRadius: '8px' }}>
                        <Typography>.</Typography>
                    </Skeleton>
                    <Skeleton variant="rectangular" width={width2} height="10px" sx={{ borderRadius: '8px' }}>
                        <Typography>.</Typography>
                    </Skeleton>
                </Box>
            </Box>
        );
    };

    return (
        <Fragment>
            {getCircular('100%', '40%')}
            {getCircular('60%', '30%')}
            {getCircular('80%', '30%')}
        </Fragment>
    );
};

export default NotificationLoading;
