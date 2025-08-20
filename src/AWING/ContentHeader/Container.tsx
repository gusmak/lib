import { ReactNode } from 'react';
import { Grid, Typography } from '@mui/material';
import { useStyles } from './Styled';

export type OwnProps = {
    title: string;
    columnLeftWidth?: number;
    columnRightWidth?: number;
    headerRight?: ReactNode;
};

const ContentHeader = (props: OwnProps) => {
    const { title, columnLeftWidth, columnRightWidth, headerRight } = props;
    const classes = useStyles();
    const colLeftWidth = columnLeftWidth ? columnLeftWidth : 7;
    const colRightWidth = columnRightWidth ? columnRightWidth : 5;

    return (
        <Grid container spacing={0} sx={{ mb: 2 }}>
            <Grid size={{ xs: colLeftWidth }}>
                <Typography variant="h1" className={classes.headerTitle}>
                    {title}
                </Typography>
            </Grid>
            <Grid size={{ xs: colRightWidth }}>{headerRight}</Grid>
        </Grid>
    );
};

export default ContentHeader;
