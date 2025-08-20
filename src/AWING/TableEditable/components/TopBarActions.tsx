import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TopBarActionsProps } from '../interface';

export default function TopBarActions(props: TopBarActionsProps) {
    const { t } = useTranslation();
    const { selected, selectionActions } = props;

    return (
        <Box sx={{ position: 'relative' }}>
            <Box
                sx={{
                    padding: '10px 16px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    background: '#EEEEEE',
                }}
            >
                <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>{`${selected.length} ${t(
                    'Common.Selected'
                ).toLowerCase()}`}</Typography>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}
                >
                    {selectionActions &&
                        selectionActions.map((actionDef, actIdx) => (
                            <Tooltip key={actIdx} title={actionDef.tooltipTitle}>
                                <IconButton size="small" onClick={() => actionDef.action()} sx={{ mx: 0.5 }} disabled={actionDef.disabled}>
                                    {actionDef.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                </Box>
            </Box>
        </Box>
    );
}
