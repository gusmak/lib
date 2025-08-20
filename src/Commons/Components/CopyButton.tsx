import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileCopyOutlined as FileCopyOutlinedIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

export type CopyButtonProps = {
    id: string;
};

const CopyButton = (props: CopyButtonProps) => {
    const { t } = useTranslation();
    const { id } = props;
    const [copied, setCopied] = useState(false);

    return (
        <Tooltip title={copied ? t('Campaign.Copied') : t('Campaign.ClickToCopy')}>
            <IconButton
                style={{ padding: '0px 5px' }}
                aria-label="copy"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard?.writeText(id);
                    setCopied(true);
                }}
                onBlur={() => setCopied(false)}
            >
                <FileCopyOutlinedIcon fontSize="inherit" style={{ cursor: 'pointer', color: '#9e9e9e' }} color="secondary" />
            </IconButton>
        </Tooltip>
    );
};

export default CopyButton;
