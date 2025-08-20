import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { NEGATIVE_COLOR } from 'Commons/Constant';

export type TableLabelProps = { content: ReactNode; error?: boolean; errContent?: ReactNode };

export default function TabLabel({ content, error, errContent }: TableLabelProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography component={'span'} fontWeight="bold" style={{ marginRight: error ? '5px' : 0 }}>
                {content}
            </Typography>
            {error && (
                <Typography component={'span'} sx={{ color: NEGATIVE_COLOR, fontSize: '1.3em' }}>
                    {errContent || '!'}
                </Typography>
            )}
        </Box>
    );
}
