import { Grid, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TestingDataInput } from '../index';

export type TestingInfomationProps = {
    testingData: TestingDataInput;
    objectTypeCode: string;
    isObjectFilter: boolean;
    isNotificationTemplate: boolean;
    isNotificationConfig: boolean;
};

const RowInfo = ({ label, value }: { label: string; value?: string }) => (
    <span>
        <b>{label}</b>: <i>{value}</i>
    </span>
);

export default function TestingInfomation(props: TestingInfomationProps) {
    const { testingData, objectTypeCode, isObjectFilter, isNotificationTemplate, isNotificationConfig } = props;
    const { t } = useTranslation();

    return (
        <Grid container component={Paper} sx={{ width: '100%', p: 3, mb: 3 }}>
            <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ flexGrow: 1, pb: 2 }}>
                    {t('TestingTool.InputTitle')}
                </Typography>

                <Stack direction={'row'} flexWrap={'wrap'} sx={{ columnGap: 3, rowGap: 1 }}>
                    <RowInfo label={t('TestingTool.ObjectTypeCode')} value={objectTypeCode} />

                    {isObjectFilter && (
                        <RowInfo
                            label={`${t('TestingTool.ObjectFilter')}, ${t('Filter.LogicExpression')}`}
                            value={testingData.objectFilter?.logicalExpression || ''}
                        />
                    )}

                    {isNotificationTemplate && (
                        <>
                            <RowInfo label={t('NotificationTemplate.Channel')} value={testingData.templateInput?.channelType || ''} />
                            <RowInfo label={t('NotificationTemplate.ContentType')} value={testingData.templateInput?.contentType || ''} />
                        </>
                    )}

                    {isNotificationConfig && (
                        <>
                            <RowInfo label={t('TestingTool.ObjectFilter')} value={testingData.objectFilter?.name || ''} />
                            <RowInfo label={t('Filter.LogicExpression')} value={testingData.objectFilter?.logicalExpression || ''} />
                            <RowInfo label={t('TestingTool.NotificationTemplate')} value={testingData.notificationTemplate?.name || ''} />
                            <RowInfo
                                label={t('NotificationTemplate.Channel')}
                                value={testingData.notificationTemplate?.channelType || ''}
                            />
                            <RowInfo
                                label={t('NotificationTemplate.ContentType')}
                                value={testingData.notificationTemplate?.contentType || ''}
                            />
                        </>
                    )}
                </Stack>
            </Grid>
        </Grid>
    );
}
