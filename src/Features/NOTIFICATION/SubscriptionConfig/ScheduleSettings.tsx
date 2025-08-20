import { Box, Grid, Paper, Typography } from '@mui/material';
import { CronTab, CronTabProps } from 'AWING';
import { useTranslation } from 'react-i18next';

export default function ScheduleSettings(props: CronTabProps) {
    const { t } = useTranslation();
    const { value, onChange, schedulePermissions } = props;

    return (
        <Grid container sx={{ flexGrow: 1, padding: '0 24px 24px' }}>
            <Grid size={{ xs: 12 }} component={Paper} sx={{ p: 3 }}>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="body1" fontWeight="bold">
                        {t('SubscriptionConfig.ScheduleSettings')}
                    </Typography>
                </Box>
                <CronTab value={value} onChange={onChange} schedulePermissions={schedulePermissions} />
            </Grid>
        </Grid>
    );
}
