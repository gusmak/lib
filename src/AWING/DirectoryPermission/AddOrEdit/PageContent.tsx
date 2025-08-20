import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { Constants, BORDER_LIGHTGRAY } from '../constants';
import { workflowStates } from '../Atoms';
import { getNewPermissions, getNewPermissionStates, removeSchema } from '../utils';
import WorkflowMatrix from '../components/WorkflowMatrix';
import PermissionTable from '../components/PermissionTable';
import AddOrEditHeader from '../components/AddOrEditHeader';
import { type PageContentProps } from './types';
import { useAtomValue } from 'jotai';

function PageContent(props: PageContentProps) {
    const { t } = useTranslation();

    const {
        explicitMatrixPermissions,
        inheritedMatrixPermissions,
        onExplicitMatrixPermissionsChange,
        isCreate,
        objectTypeCodeSelected,
        onDeleteAuthen,
        disableSelectSchema,
        explicitPermissions,
        onExplicitPermissionsChange,
        inheritedPermissions,
        authenPermissions,
        onChangeObjectTypeCode,
        onDrawerLevelChange,
    } = props;

    const workflow = useAtomValue(workflowStates);

    const handleDeleteSchema = (schemaId: number | null) => {
        const newPermissions = removeSchema(explicitPermissions, schemaId);
        onExplicitPermissionsChange(newPermissions);
    };

    const handleChangePermission = (permissionCode: number, schemaId: number | null) => {
        const newPermissions = getNewPermissions(explicitPermissions, permissionCode, schemaId);

        onExplicitPermissionsChange(newPermissions);
    };

    const handleChangeStates = (stateId: string, schemaId: number | null) => {
        const newPermissions = getNewPermissionStates(explicitPermissions, stateId, schemaId, workflow?.workflowStates ?? []);

        onExplicitPermissionsChange(newPermissions);
    };

    return (
        <Paper
            sx={{
                padding: 2,
                border: '1px solid #e0e0e0',
                width: '100%',
            }}
        >
            <Grid container>
                {/* Header */}
                <AddOrEditHeader
                    objectTypeCodeSelected={objectTypeCodeSelected}
                    onChangeObjectTypeCode={onChangeObjectTypeCode}
                    isCreate={isCreate}
                    authenPermissions={authenPermissions}
                    onDeleteAuthen={onDeleteAuthen}
                    onDrawerLevelChange={onDrawerLevelChange}
                />

                <Grid size={{ xs: 12 }} sx={{ marginTop: 1 }}>
                    <Grid
                        container
                        sx={{
                            borderBottom: BORDER_LIGHTGRAY,
                            paddingBottom: 2,
                        }}
                    >
                        <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Typography
                                component="p"
                                sx={{
                                    marginBottom: 1,
                                    fontWeight: '500',
                                }}
                            >
                                {t('DirectoryManagement.PermissionLabel')}
                            </Typography>
                        </Grid>
                    </Grid>
                    {!disableSelectSchema && (
                        <Grid
                            size={{ xs: 12 }}
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: 2,
                            }}
                        >
                            <Button
                                component={Link}
                                variant="outlined"
                                sx={(theme) => ({
                                    backgroundColor: theme.palette.action.hover,
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondary.main,
                                        border: BORDER_LIGHTGRAY,
                                    },
                                    color: theme.palette.text.primary,
                                    border: BORDER_LIGHTGRAY,
                                })}
                                to={Constants.SELECT_SCHEMA_PATH}
                                onClick={() => {
                                    onDrawerLevelChange && onDrawerLevelChange(3);
                                }}
                            >
                                {t('DirectoryManagement.TitleSelectSchema')}
                            </Button>
                        </Grid>
                    )}
                    <PermissionTable
                        explicitPermissions={explicitPermissions}
                        inheritedPermissions={inheritedPermissions}
                        disableSelectSchema={disableSelectSchema}
                        onChangePermission={handleChangePermission}
                        onDeleteSchema={handleDeleteSchema}
                        onChangeStates={handleChangeStates}
                    />
                </Grid>
                {workflow && (
                    <WorkflowMatrix
                        workflow={workflow}
                        explicitMatrices={explicitMatrixPermissions}
                        inheritMatrices={inheritedMatrixPermissions}
                        onMatrixPermissionsChange={onExplicitMatrixPermissionsChange}
                    />
                )}
            </Grid>
        </Paper>
    );
}

export default PageContent;
