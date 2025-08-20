import { CircularProgress, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { TestingDataInput } from 'Features/NOTIFICATION/components/TestingTool/types';
import { useTranslation } from 'react-i18next';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { KeyboardEvent } from 'react';

export type ObjectIdFieldProps = {
    testingData: TestingDataInput;
    objectTypeCode: string;
    loadingGetObjectTestJson: boolean;
    onChange: (fieldName: keyof TestingDataInput, newValue: any) => void;
    loadObjectJson: (objectTypeCode: string, objectId?: number) => void;
};

export default function ObjectIdField(props: ObjectIdFieldProps) {
    const { testingData, objectTypeCode, loadingGetObjectTestJson, onChange, loadObjectJson } = props;
    const { t } = useTranslation();

    const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            loadObjectJson(objectTypeCode, testingData.objectId);
            (e.target as HTMLElement).blur();
        }
    };

    return (
        <Grid size={{ xs: 6 }}>
            <TextField
                variant="standard"
                label={t('TestingTool.FormData.ObjectId')}
                type="text"
                fullWidth
                value={testingData.objectId}
                onChange={(e) => onChange('objectId', e.target.value)}
                onKeyUp={handleKeyUp}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <b>{objectTypeCode}</b>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {loadingGetObjectTestJson ? (
                                    <CircularProgress size="24px" />
                                ) : (
                                    <IconButton
                                        disableRipple
                                        size="small"
                                        sx={{
                                            ml: 1,
                                            mr: -1,
                                            '&.MuiButtonBase-root:hover': {
                                                bgcolor: 'transparent',
                                            },
                                        }}
                                        title={t('TestingTool.FormData.ClickLoadObjectTitle')}
                                        onClick={() => loadObjectJson(objectTypeCode, testingData.objectId)}
                                    >
                                        <KeyboardDoubleArrowDownIcon />
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Grid>
    );
}
