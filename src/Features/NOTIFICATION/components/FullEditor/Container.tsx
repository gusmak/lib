import { Button, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MonacoEditor from '../MonacoEditor';
import { useState } from 'react';
import { formatJSON } from 'Helpers/FormatJSON';
import { ClassicDrawer } from 'Commons/Components';

type TestingToolFullEditorProps = {
    content: string;
    onChange(content: string): void;
    onClose(): void;
};

export default function FullEditor(props: TestingToolFullEditorProps) {
    const { content, onChange, onClose } = props;
    const { t } = useTranslation();

    const [editorContent, setEditorContent] = useState(content);

    const handleClose = () => {
        //submit changed data before closed
        onChange(editorContent);
        onClose();
    };

    return (
        <ClassicDrawer
            title={t('TestingTool.FullEditor')}
            isLoadingButtonSubmit={false}
            disableButtonSubmit={true}
            confirmExit={false}
            onClose={handleClose}
            width="70%"
        >
            <Grid container sx={{ flexGrow: 1, padding: 4, height: '80%' }}>
                <Grid size={{ xs: 12 }} component={Paper} sx={{ p: 3 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setEditorContent(formatJSON(editorContent));
                        }}
                    >
                        Format JSON
                    </Button>
                    <div
                        style={{
                            border: '1px solid #e4e4e4',
                            padding: '10px 0',
                            borderRadius: '4px',
                            marginTop: '5px',
                        }}
                    >
                        <MonacoEditor
                            value={editorContent}
                            language="json"
                            onChange={(val: string) => setEditorContent(val)}
                            full
                            height="calc(100vh - 200px)"
                        />
                    </div>
                </Grid>
            </Grid>
        </ClassicDrawer>
    );
}
