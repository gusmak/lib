import { enUS, viVN } from '@mui/material/locale';
import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
    responsiveFontSizes,
    StyledEngineProvider,
    type Theme,
} from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'moment/locale/vi';
import { darkTheme, lightTheme } from '.';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCookie } from 'Helpers';

moment.locale('vi');

const languageMap = (locale: string) => {
    switch (locale) {
        case 'en':
            return enUS;
        default:
            return viVN;
    }
};

export const ThemeContext = createContext<(mode: 'dark' | 'light') => void>(() => {
    throw new Error('Forgot to wrap component in `ThemeProvider`');
});

export default function ThemeProvider(props: {
    children: React.ReactNode;
    themes?: {
        darkTheme: Theme;
        lightTheme: Theme;
    };
}) {
    const { children, themes } = props;
    //const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const preferredMode = 'light'; //prefersDarkMode ? 'dark' : 'light';

    const [paletteMode, setPaletteMode] = useState(getCookie('paletteMode') || preferredMode);

    const { i18n } = useTranslation();
    const locale = useMemo(() => {
        moment.locale(i18n.language);
        return i18n.language;
    }, [i18n.language]);

    useEffect(() => {
        const nextPaletteMode = 'light'; //getCookie('paletteMode') || preferredMode;
        setPaletteMode(nextPaletteMode);
    }, [preferredMode]);

    const theme = useMemo(() => {
        let nextTheme = createTheme(
            paletteMode === 'dark' ? (themes ? themes.darkTheme : darkTheme) : themes ? themes.lightTheme : lightTheme,
            languageMap(i18n.language)
        );
        nextTheme = responsiveFontSizes(nextTheme);
        return nextTheme;
    }, [paletteMode, themes, i18n.language]);

    return (
        <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
                    <ThemeContext.Provider value={(mode: 'dark' | 'light') => setPaletteMode(mode)}>
                        {children}
                    </ThemeContext.Provider>
                </LocalizationProvider>
            </MuiThemeProvider>
        </StyledEngineProvider>
    );
}

export function useChangeTheme() {
    const changeTheme = useContext(ThemeContext);
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return useCallback((mode: any) => changeTheme(mode), [changeTheme]);
}
