import { TableCell } from '@mui/material';
import { Check } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

export const StyledCheck = styled(Check)(() => ({ fontSize: '22px' }));

export const StyledTableCell = styled(TableCell)(({ theme }) => {
    return {
        padding: theme.spacing(1.7, 2),
        borderBottom: '1px solid #a3a3a345',
        '&.MuiTableRow-root.MuiTableRow-hover:hover': {
            cursor: `pointer`,
            '& .isShowIcon': {
                visibility: 'visible',
            },
        },
        maxWidth: '300px',
        wordBreak: 'break-all',
    };
});
