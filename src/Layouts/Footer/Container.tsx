import { Box, Container, Typography } from '@mui/material';

function FooterContainer(props: { appName: string }) {
    const { appName } = props;

    return (
        <Container sx={{ bottom: 0 }}>
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="body2" color="text.secondary" align="center">
                        {`Copyright © ${appName} ${new Date().getFullYear()}.`}
                    </Typography>
                </Container>
            </Box>
        </Container>
    );
}

export default FooterContainer;
