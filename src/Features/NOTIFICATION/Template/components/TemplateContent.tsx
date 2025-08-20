import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, TextField, Paper, Stack, Button } from '@mui/material';
import { CircularProgress } from 'AWING';
import { ChannelTypeMap, TemplateContentType } from 'Features/NOTIFICATION/enums';
import { TestingDataInput } from 'Features/NOTIFICATION/components/TestingTool';
import MonacoEditor from 'Features/NOTIFICATION/components/MonacoEditor';
import { previewTemplate } from '../utils';
import { useGetContext } from '../context';

export type OwnProps = {
    channelType?: string;
    type?: string;
    value?: string;
    onChange: (val: string) => void;
    contentPermission: boolean;
    testingDataInput: TestingDataInput;
};

export default function TemplateContent(props: OwnProps) {
    const { channelType, type, value, onChange, contentPermission, testingDataInput } = props;
    const { t } = useTranslation();
    const [openPreview, setOpenPreview] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const { services } = useGetContext();

    const [loadingGenerateTemplate, setLoadingGenerateTemplate] = useState(false);

    const handleOpenPreview = async () => {
        setOpenPreview(true);
        setLoadingGenerateTemplate(true);
        // Xử lý gọi api tạo template từ đây dựa vào thông tin template
        services
            ?.generateTemplate({
                templateGenerationInput: {
                    id: testingDataInput.notificationTemplate?.id ?? 0,
                    objectId: testingDataInput.objectId ?? 0,
                    template: {
                        channelType: testingDataInput.templateInput?.channelType,
                        configType: testingDataInput.templateInput?.configType,
                        contentType: testingDataInput.templateInput?.contentType,
                        content: testingDataInput.templateInput?.content,
                        objectType: testingDataInput.templateInput?.objectType,
                        name: testingDataInput.templateInput?.name,
                        title: testingDataInput.templateInput?.title,
                    },
                    oldObjectJson: testingDataInput.oldObjectJson ?? '{}',
                    changedObjectJson: testingDataInput.changedObjectJson ?? '{}',
                },
            })
            .then(async (res) => {
                if (res.generateTemplate) {
                    const template = res.generateTemplate;
                    await previewTemplate(template, iframeRef);

                    setLoadingGenerateTemplate(false);
                    document.getElementById('preview-section')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            });
    };

    useEffect(() => {
        if (!value && openPreview) {
            setOpenPreview(false);
        }
    }, [value]);

    return (
        <Grid
            container
            sx={{
                flexGrow: 1,
                p: '0 24px 24px',
            }}
        >
            <Grid size={{ xs: 12 }} component={Paper} sx={{ p: 3 }}>
                <Stack direction={'row'} alignItems={'center'} sx={{ marginBottom: '16px' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {t('Template.Label.Content')} *
                    </Typography>
                    {channelType === ChannelTypeMap.FILE && value && (
                        <Button sx={{ marginLeft: 'auto' }} onClick={handleOpenPreview} variant="outlined">
                            {t('FileExport.Preview')}
                        </Button>
                    )}
                </Stack>
                {type === TemplateContentType.HTML ? (
                    <div
                        style={{
                            border: '1px solid #e4e4e4',
                            padding: '10px 0',
                            borderRadius: '4px',
                            marginBottom: '16px',
                        }}
                    >
                        <MonacoEditor value={value} height="30vh" language="html" onChange={onChange} />
                    </div>
                ) : (
                    <TextField
                        type={'text'}
                        fullWidth
                        variant="standard"
                        multiline={true}
                        value={value}
                        onChange={(event) => onChange(event.target.value ?? '')}
                        slotProps={{
                            htmlInput: { readOnly: !contentPermission },
                        }}
                        sx={{ marginBottom: '16px' }}
                    />
                )}
                {openPreview && channelType === ChannelTypeMap.FILE && value && (
                    <div id="preview-section">
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
                            {t('Template.Label.Preview')}
                        </Typography>
                        {loadingGenerateTemplate ? (
                            <CircularProgress />
                        ) : (
                            <iframe
                                ref={iframeRef}
                                name="preview"
                                style={{
                                    width: '100%',
                                    height: '1200px',
                                    border: '1px solid #ddd',
                                }}
                                title="Xem trước PDF"
                            />
                        )}
                    </div>
                )}
            </Grid>
        </Grid>
    );
}
