import { Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Panels from './Panels';

export type OwnProps = {
    onFilter?: () => void;
};

function Container(props: OwnProps) {
    const { t } = useTranslation();
    const { onFilter } = props;

    /* click to onView  */
    const handleView = () => onFilter && onFilter();

    return (
        <Grid
            container
            justifyContent="flex-end"
            size={{
                xs: 12,
            }}
            spacing={2}
            sx={{ marginTop: '-1rem', padding: '0.2rem 1rem' }}
        >
            <Grid id="wrap-group-panel" style={{ flexGrow: 1, position: 'relative' }} sx={(theme) => ({ paddingTop: theme.spacing(2) })}>
                {/* Drag/Drop panels */}
                <Panels />
            </Grid>
            <Grid sx={(theme) => ({ display: 'flex', paddingTop: theme.spacing(2), width: '4rem' })}>
                <Button sx={{ height: '40px' }} variant="contained" color="primary" onClick={handleView}>
                    {t('Common.View')}
                </Button>
            </Grid>
        </Grid>
    );
}

export default Container;
