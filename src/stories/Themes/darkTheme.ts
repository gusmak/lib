import { createTheme, Theme } from '@mui/material/styles';

export const darkTheme: Theme = createTheme({
    palette: {
        mode: 'dark',
        secondary: {
            main: '#06101A',
        },
        background: {
            default: '#0a1929',
            paper: '#0a1929',
        },
    },
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginTop: '8px',
                    marginBottom: '8px',
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
    },
});
