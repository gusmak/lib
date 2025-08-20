import { Grid, Paper, Typography } from '@mui/material';
import { TestingDataInput } from '../../types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Receivers from './components/Receivers';
import { ChannelType } from 'Features/NOTIFICATION/enums';
import ObjectIdField from './components/ObjectIdField';
import DataTesting from './components/DataTesting';
import FullEditor from 'Features/NOTIFICATION/components/FullEditor';

export type FullEditorConfig = {
    position: 0 | 1; // 0: oldObjectJson, 1: changedObjectJson
    isOpen: boolean;
    content: string;
};

export type TestingActionProps = {
    testingData: TestingDataInput;
    loadingGetObjectTestJson: boolean;
    loadObjectJson: (objectTypeCode?: string, objectId?: number) => void;
    objectTypeCode: string;
    hasEmailChannel: boolean;
    hasTelegramChannel: boolean;
    onChange: (fieldName: keyof TestingDataInput, newValue: any) => void;
};

const TestingInputHeader = ({ header, description }: { header: string; description: string }) => {
    return (
        <Grid>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {header}
            </Typography>
            <Typography>{description}</Typography>
        </Grid>
    );
};

export default function TestingAction(props: TestingActionProps) {
    const { testingData, loadingGetObjectTestJson, objectTypeCode, hasEmailChannel, hasTelegramChannel, loadObjectJson, onChange } = props;
    const { t } = useTranslation();
    const isObjectFilter = !_.isNil(testingData.objectFilterInput);

    const [openFullEditor, setOpenFullEditor] = useState<FullEditorConfig>({
        position: 0,
        isOpen: false,
        content: '',
    });

    const handleSetOpenFullEditor = (isOpen: boolean, position: 0 | 1, content: string) => {
        setOpenFullEditor({ position, isOpen, content });
    };

    return (
        <Grid container component={Paper} sx={{ p: 3 }}>
            {/* Tiêu đề và mô tả */}
            <TestingInputHeader header={t('TestingTool.FormData.Header')} description={t('TestingTool.FormData.Description')} />

            {/* Danh sách nhận và id của đối tượng */}
            <Grid container sx={{ pt: 2, width: '100%', flexDirection: 'column' }}>
                {!isObjectFilter && (hasEmailChannel || hasTelegramChannel) && (
                    <Receivers
                        channelType={hasEmailChannel ? ChannelType.EMAIL : ChannelType.TELEGRAM}
                        value={
                            hasEmailChannel
                                ? testingData.emailReceivers || null
                                : hasTelegramChannel
                                  ? testingData.telegramReceivers || null
                                  : null
                        }
                        onChange={onChange}
                    />
                )}
                <ObjectIdField
                    testingData={testingData}
                    objectTypeCode={objectTypeCode}
                    loadingGetObjectTestJson={loadingGetObjectTestJson}
                    onChange={onChange}
                    loadObjectJson={loadObjectJson}
                />
            </Grid>

            {/* Dữ liệu cũ và dữ liệu thay đổi */}
            <DataTesting testingData={testingData} onChange={onChange} onSetOpenFullEditor={handleSetOpenFullEditor} />

            {/* Editor full màn hình */}
            {openFullEditor.isOpen && (
                <FullEditor
                    content={openFullEditor.content}
                    onChange={(val) => {
                        if (openFullEditor.position === 0) {
                            onChange('oldObjectJson', val);
                        } else onChange('changedObjectJson', val);
                    }}
                    onClose={() => handleSetOpenFullEditor(false, openFullEditor.position, '')}
                />
            )}
        </Grid>
    );
}
