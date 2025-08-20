import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';

export const LabelDiv = styled('div')(({ theme }) => {
    return {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
        height: 40,
        minWidth: 100,
    };
});

export const useFilterTreeViewStyles = makeStyles({
    root: {
        flexGrow: 1,
        maxWidth: 600,
        margin: '-4px',
    },
    CircularRoot: {
        display: 'flex',
        '& > * + *': {
            marginLeft: '16px',
        },
    },
    icon: {
        color: '#bdbdbd',
    },
    treeviewStyle: {
        '& .MuiTreeItem-root:focus > .MuiTreeItem-content': {
            background: 'rgba(0, 0, 0, 0.08)',
        },
    },
    circularProgress: {
        width: '50px !important',
        height: '50px !important',
        margin: '0px auto',
    },
});

export const useDirectoryTreeStyles = makeStyles(() => ({
    root: {
        marginTop: '10px !important',
        padding: '0px 16px',
    },
    campaignAdvanceSearchformControl: {
        '& .MuiOutlinedInput-input': {
            padding: '12px',
            border: 'none',
        },
        '& .MuiFormControl-marginNormal': {
            margin: '0px',
        },
        '& .MuiOutlinedInput-adornedEnd': {
            paddingRight: '4px',
        },
        '& .MuiIconButton-root': {
            padding: '8px',
        },
        '& .MuiAutocomplete-inputRoot': {
            padding: '2px',
        },
        '& .MuiAutocomplete-endAdornment': {
            top: 'calc(50% - 19px)',
        },
    },
    btnResetFormSearch: {
        textAlign: 'right',
        float: 'right',
        fontSize: '14px',
        marginRight: '-8px',
    },
    resetFormAdvanceSeach: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        textTransform: 'none',
        fontWeight: 'normal',
    },
    boxAvanceSerch: {
        background: '#fafafa',
        paddingTop: '16px',
        paddingBottom: '32px',
    },
    componentAdvanceSearch: {
        background: '#ffffff',
        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
        borderRadius: '4px',
        borderCollapse: 'collapse',
    },
    boxHeaderSearch: {
        borderBottom: '1px solid #dcdcdc',
        padding: '16px',
    },
    boxContentSearch: {
        padding: '0px 24px',
        '& .MuiGrid-item': {
            padding: '8px 8px 4px 16px',
        },
    },
    chipContent: {
        minHeight: '50px',
        padding: '16px 8px',
        textAlign: 'right',
        '& .MuiChip-root': {
            margin: '4px 8px',
        },
    },
    button: {
        width: '100%',
        textAlign: 'right',
        paddingBottom: 8,
        minWidth: '110',
        fontSize: 16,
        '&:hover,&:focus': {
            color: '#586069',
        },
        '& span': {
            width: '100%',
        },
        '& svg': {
            width: 16,
            height: 16,
        },
    },
    tag: {
        marginTop: 3,
        height: 20,
        padding: '.15em 4px',
        fontWeight: 600,
        lineHeight: '15px',
        borderRadius: 2,
    },
    popper: {
        border: '1px solid rgba(27,31,35,.15)',
        boxShadow: '0 3px 12px rgba(27,31,35,.15)',
        borderRadius: 3,
        width: 300,
        zIndex: 1,
        color: '#586069',
        background: '#fafafa',
    },
    header: {
        borderBottom: '1px solid #e1e4e8',
        padding: '8px 10px',
        background: '#fafafa',
    },
    inputBase: {
        padding: 10,
        width: '100%',
        borderBottom: '1px solid #dfe2e5',
        background: '#fafafa',
        '& input': {
            borderRadius: 4,
            padding: 8,
            border: '1px solid #ced4da',
            '&:focus': {
                //   boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`
            },
        },
    },
    paper: {
        boxShadow: 'none',
        margin: 0,
        color: '#586069',
    },
    option: {
        minHeight: 'auto',
        alignItems: 'flex-start',
        padding: 8,
        '&[aria-selected="true"]': {
            backgroundColor: 'transparent',
        },
    },
    popperDisablePortal: {
        position: 'relative',
    },
    iconSelected: {
        width: 17,
        height: 17,
        marginRight: 5,
        marginLeft: -2,
    },
    color: {
        width: 14,
        height: 14,
        flexShrink: 0,
        borderRadius: 3,
        marginRight: 8,
        marginTop: 2,
    },
    text: {
        flexGrow: 1,
    },
    close: {
        opacity: 0.6,
        width: 18,
        height: 18,
    },
    fontIconSizeInfo: {
        paddingLeft: '4px',
        fontSize: '16px',
    },
    contentDateRange: {
        padding: '24px 24px 40px 24px',
        background: '#fff',
    },
    contentDirectoryTree: {
        padding: '0px 8px 24px 8px',
        maxHeight: 300,
        overflowY: 'scroll',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
            width: 3,
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
        },
    },
    buttonReset: {
        float: 'right',
        minWidth: '10px',
        padding: '1px 5px',
    },
}));
