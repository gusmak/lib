import { Grid, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import MonacoEditor from 'Features/NOTIFICATION/components/MonacoEditor';
import { TestingDataInput } from 'Features/NOTIFICATION/components/TestingTool/types';

export type DataTestingProps = {
    testingData: TestingDataInput;
    onChange: (fieldName: keyof TestingDataInput, newValue: any) => void;
    onSetOpenFullEditor: (isOpen: boolean, position: 0 | 1, value: string) => void;
};

export default function DataTesting(props: DataTestingProps) {
    const { testingData, onChange, onSetOpenFullEditor } = props;
    const { t } = useTranslation();

    return (
        <Grid container sx={{ pt: 3, width: '100%' }}>
            {/* Dữ liệu cũ */}
            <Grid size={{ xs: 6 }}>
                <Grid container>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="body1">{t('TestingTool.FormData.Old')}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }} sx={{ mb: -1, textAlign: 'right' }}>
                        <OpenFullEditorButton onOpen={onSetOpenFullEditor} position={0} content={testingData.oldObjectJson} />
                    </Grid>
                </Grid>
                <TestingDataEditor
                    onChange={onChange}
                    fieldToChange={'oldObjectJson'}
                    value={testingData.oldObjectJson}
                    editorRequired={true}
                    editorErrorOnValue={true}
                />
            </Grid>

            {/* Dữ liệu thay đổi */}
            <Grid size={{ xs: 6 }} sx={{ pl: 2 }}>
                <Grid container>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="body1">{t('TestingTool.FormData.Change')}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }} sx={{ mb: -1, textAlign: 'right' }}>
                        <OpenFullEditorButton onOpen={onSetOpenFullEditor} position={1} content={testingData.changedObjectJson} />
                    </Grid>
                </Grid>
                <TestingDataEditor onChange={onChange} fieldToChange={'changedObjectJson'} value={testingData.changedObjectJson} />
            </Grid>
        </Grid>
    );
}

const OpenFullEditorButton = ({
    onOpen,
    position,
    content,
}: {
    onOpen: (isOpen: boolean, position: 0 | 1, content: string) => void;
    position: 0 | 1;
    content?: string | null;
}) => {
    const { t } = useTranslation();

    return (
        <IconButton
            data-testid={`full-editor-btn-${position}`}
            size="small"
            title={t('TestingTool.FormData.OpenInFullTitle')}
            onClick={() => onOpen(true, position, content ?? '')}
        >
            <OpenInFullIcon />
        </IconButton>
    );
};

const TestingDataEditor = ({
    onChange,
    fieldToChange,
    value,
    editorRequired,
    editorErrorOnValue,
}: {
    onChange: (fieldName: keyof TestingDataInput, newValue: any) => void;
    fieldToChange: keyof TestingDataInput;
    editorRequired?: boolean;
    editorErrorOnValue?: boolean;
    value?: string | null;
}) => {
    return (
        <div
            data-testid={`editor-${fieldToChange}`}
            style={{
                border: '1px solid #e4e4e4',
                padding: '10px 0',
                borderRadius: '4px',
                marginTop: '16px',
            }}
        >
            <MonacoEditor
                value={value}
                height="30vh"
                language="json"
                required={editorRequired}
                error={editorErrorOnValue ? !value || value.length === 0 : false}
                onChange={(val: string) => onChange(fieldToChange, val)}
            />
        </div>
    );
};
