import { Trans, useTranslation } from 'react-i18next';
import { TranslationKeys } from './i18next';
import i18nNext from './i18n';

export const useAppTranslation = () => {
    const { t, i18n, ...rest } = useTranslation(undefined, { i18n: i18nNext });
    const translate = (key: TranslationKeys, options?: Record<string, any>) => t(key, options);
    const tJSX = (
        i18nKey: TranslationKeys,
        values: Record<string, any> = {},
        components: Record<string, React.ReactElement> & { [key: string]: React.ReactElement } = {}
    ) => <Trans i18nKey={i18nKey as string} values={values} components={components} />;

    return {
        t: translate,
        tJSX,
        i18n,
        rest,
    };
};
