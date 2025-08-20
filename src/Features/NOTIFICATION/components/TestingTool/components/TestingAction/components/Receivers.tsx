import { Grid, InputAdornment, TextField } from '@mui/material';
import { TestingDataInput } from 'Features/NOTIFICATION/components/TestingTool/types';
import { ChannelType, ReceiverField } from 'Features/NOTIFICATION/enums';
import { useTranslation } from 'react-i18next';

export type ReceiversProps = {
    channelType: ChannelType;
    value: string | null;
    onChange: (fieldName: keyof TestingDataInput, newValue: any) => void;
};

export default function Receivers(props: ReceiversProps) {
    const { channelType, value, onChange } = props;
    const { t } = useTranslation();

    const receiverField = channelType === ChannelType.EMAIL ? ReceiverField.EMAIL : ReceiverField.TELEGRAM;

    return (
        <Grid size={{ xs: 6 }}>
            <TextField
                variant="standard"
                label={t('TestingTool.Receivers')}
                value={value ?? ''}
                onChange={(e) => onChange(receiverField, e.target.value)}
                fullWidth
                required
                error={!value?.trim()}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <b>{channelType}</b>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Grid>
    );
}
