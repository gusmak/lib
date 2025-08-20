import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n as I18n } from 'i18next';
import i18n from './i18n';
import { AppProvider } from 'Utils';
import { ThemeProvider } from '../Themes';

const I18nProvider = ({ children, i18nData }: { children: ReactNode; i18nData: I18n }) => {
    Object.entries(i18nData.store.data).forEach(([lng, namespaces]) => {
        Object.entries(namespaces).forEach(([namespace, resources]) => {
            i18n.addResourceBundle(lng, namespace, resources, true, true);
        });
    });

    i18nData.on('languageChanged', (lng) => {
        i18n.changeLanguage(lng);
    });

    return (
        <I18nextProvider i18n={i18n}>
            <ThemeProvider>
                <AppProvider>{children}</AppProvider>
            </ThemeProvider>
        </I18nextProvider>
    );
};

export default I18nProvider;
