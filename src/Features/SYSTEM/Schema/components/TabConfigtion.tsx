import { Box, Grid, Paper, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabContext, TabPanel } from '@mui/lab';
import SchemaInformation from './SchemaInformation';

const TabConfigtion = () => {
    const { t } = useTranslation();
    const [tabValue, setTabValue] = useState('1');

    return (
        <Grid container sx={{ flexGrow: 1, padding: (theme) => theme.spacing(3) }}>
            <Grid
                size={{
                    xs: 12,
                }}
                component={Paper}
            >
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={(_e, newValue: string) => setTabValue(newValue)}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            aria-label="scrollable tabs"
                        >
                            <Tab label={t('Schema.Tab.Information')} value="1" style={{ fontWeight: 'bold' }} />
                        </Tabs>
                    </Box>
                    <TabPanel value="1">
                        <SchemaInformation />
                    </TabPanel>
                </TabContext>
            </Grid>
        </Grid>
    );
};

export default TabConfigtion;
