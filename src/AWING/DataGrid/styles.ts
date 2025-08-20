import styled from '@emotion/styled';
import { TableRow } from '@mui/material';

export const StyledTableRow = styled(TableRow)({
    '& .MuiTableCell-root:last-child .MuiButtonBase-root': {
        visibility: 'hidden',
    },
    '&:hover': {
        '& .MuiTableCell-root:last-child .MuiButtonBase-root': {
            visibility: 'visible',
        },
    },
});

export const SpanSortIndex = styled('span')({
    display: 'flex',
    flexFlow: 'row wrap',
    WebkitBoxPack: 'center',
    placeContent: 'center',
    WebkitBoxAlign: 'center',
    alignItems: 'center',
    position: 'absolute',
    boxSizing: 'border-box',
    fontWeight: 500,
    fontSize: '0.75rem',
    minWidth: '20px',
    lineHeight: 1,
    padding: '0px 6px',
    height: '20px',
    borderRadius: '10px',
    zIndex: 1,
    transition: 'transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    top: '0px',
    right: '0px',
    transform: 'scale(1) translate(50%, -50%)',
    transformOrigin: '100% 0%',
});
