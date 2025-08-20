import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './resources/en/translation.json';
import vi from './resources/vi/translation.json';
import id from './resources/id/translation.json';
import th from './resources/th/translation.json';
import ja from './resources/ja/translation.json';

const resources = {
    en: {
        translation: en,
    },
    vi: {
        translation: vi,
    },
    id: {
        translation: id,
    },
    th: {
        translation: th,
    },
    ja: {
        translation: ja,
    },
};

const i18n = i18next.createInstance();
i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(
        {
            resources,
            fallbackLng: (window as any).DEFAULT_LANGUAGE || 'en',
            debug: false,
            cleanCode: true,
            interpolation: {
                escapeValue: false, // not needed for react as it escapes by default
            },
            react: {
                useSuspense: false,
            },
            initImmediate: false,
        },
        (err, t) => {
            if (err) return console.log(err);
            t('key');
        }
    );

export default i18n;
