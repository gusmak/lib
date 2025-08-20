import { createTheme, Theme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

export const lightTheme: Theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#ED1D25',
        },
        secondary: {
            main: grey[500],
        },
        background: {
            default: grey[50],
        },
    },
    components: {
        MuiInput: {
            styleOverrides: {
                underline: {
                    '&:after': {
                        borderBottomColor: grey[900],
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: grey[900],
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginTop: '8px',
                    marginBottom: '8px',
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused:not(.Mui-error)': {
                        color: grey[900],
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    textAlign: 'right',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        background: grey[300],
                        '&:hover': {
                            background: grey[200],
                            with: 300,
                        },
                    },
                },
            },
        },
    },
});
