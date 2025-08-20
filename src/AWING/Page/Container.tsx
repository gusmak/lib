import { Helmet } from 'react-helmet-async';
import { Grid, Typography, Toolbar, Box } from '@mui/material';
import { PageProps } from './interface';

const Page = ({ caption, actions, children }: PageProps) => {
    return (
        <>
            <Grid container>
                {caption && (
                    <Helmet>
                        <title>{caption}</title>
                    </Helmet>
                )}
                <Box sx={{ width: '100%' }}>
                    <Toolbar
                        style={{
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingBottom: '8px',
                        }}
                    >
                        <Typography component="h1" variant="h5" color="inherit" noWrap style={{ flex: '1 1 30%' }} fontWeight={'bold'}>
                            {caption}
                        </Typography>
                        {actions}
                    </Toolbar>
                </Box>
                <Grid
                    size={{
                        xs: 12,
                    }}
                >
                    {children}
                </Grid>
            </Grid>
        </>
    );
};
export default Page;
