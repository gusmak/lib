# Add I18nProvider

    import { I18nProvider } from "awing-library";
    import i18n from "./config.ts";

### config.ts

    import i18next from "i18next";
    import translationsVI from "./translations.json";
    import translationsEN from "./translations-en.json";
    import translationsID from "./translations-id.json";
    import { initReactI18next } from "react-i18next";
    import Backend from "i18next-http-backend";
    import LanguageDetector from "i18next-browser-languagedetector";

    declare module "i18next" {
        interface CustomTypeOptions {
            returnNull: false;
        }
    }
    const i18n = i18next.createInstance();
    i18n.use(Backend)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            fallbackLng: "vi",
            supportedLngs: ["en", "vi", "id"],
            debug: false,
            returnNull: false,
            interpolation: {
                escapeValue: false,
            },
            resources: {
                en: {
                    translation: translationsEN,
                },
                vi: {
                    translation: translationsVI,
                },
                id: {
                    translation: translationsID,
                },
            },
        });
    export default i18n;

### Using

    <I18nProvider i18nData={i18n}>
        <App />
    </I18nProvider>
