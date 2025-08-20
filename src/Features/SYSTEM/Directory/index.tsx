import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router';
import { makeStyles } from '@mui/styles';
import { Box, Tab } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import { AppProvider } from 'Utils';
import { Page } from 'AWING';
import { Constants } from '../constants';
import { DirectoryContext } from './context';
import Permission from './Permission';
import Container from './Container';
import { BORDER_LIGHTGRAY } from './constants';
import type { ObjectTypeCode } from 'Features/types';
import type { DirectoryServices } from './Services';
import type { CurrentWorkspace } from '../types';

export type DirectorySystemProps = DirectoryServices & {
    parentDirectoryId: number;
    currentWorkspace?: CurrentWorkspace;
    objectTypeCodes?: ObjectTypeCode[];
};

const useFilterTreeViewStyles = makeStyles({
    root: {
        '& .MuiTabs-flexContainer': {
            borderBottom: BORDER_LIGHTGRAY,
        },
    },
});

const DirectorySystem = (props: DirectorySystemProps) => {
    const { t } = useTranslation();
    const { parentDirectoryId, currentWorkspace, objectTypeCodes, ...services } = props;
    const classes = useFilterTreeViewStyles();

    const [tabValue, setTabValue] = useState<string>('1');

    useEffect(() => {
        const currentPath = window.location.href;
        setTabValue(currentPath.includes(Constants.SYSTEM_DIRECTORY_PERMISSION) ? '2' : '1');
    }, []);

    const handleChange = (_e: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <AppProvider>
            <DirectoryContext.Provider
                value={{
                    parentDirectoryId,
                    currentWorkspace,
                    objectTypeCodes,
                    services,
                }}
            >
                <Page caption={t('DirectoryManagement.Title')}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={tabValue}>
                            <TabList onChange={handleChange} indicatorColor={'primary'} className={`${classes.root}`}>
                                <Tab style={{ fontWeight: 'bold' }} label={t('DirectoryManagement.DomainDirectoryTab')} value="1" />
                            </TabList>
                            <TabPanel value="1">
                                <Container />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Page>
                {/* Routes */}
                <Routes>
                    <Route
                        key={Constants.DIRECTORY_PERMISSION + '/:id/*'}
                        path={Constants.DIRECTORY_PERMISSION + '/:id/*'}
                        element={<Permission />}
                    />
                </Routes>
            </DirectoryContext.Provider>
        </AppProvider>
    );
};

export * from './types';
export * from './Services';
export default DirectorySystem;
