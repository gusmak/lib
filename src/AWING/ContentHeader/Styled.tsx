import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() => ({
    headerTitle: {
        fontSize: '1.4993rem',
        fontWeight: '700',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: '1.334',
        letterSpacing: '0em',
        textAlign: 'left',
        color: 'inherit',
        textOverflow: 'ellipsis',
    },
    headerBar: {
        paddingBottom: '2rem',
        '& a': {
            float: 'right',
        },
        '& input': {
            float: 'right',
        },
        background: `#fafafa`,
    },
    headerButton: {
        float: 'right',
    },
}));
