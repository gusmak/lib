import { HelmetProvider } from 'react-helmet-async';
import i18next from 'i18next';
import { I18nProvider } from 'translate';
import { ThemeProvider } from '../Themes';
import LanguageBox from './LanguageBox';

const i18n = i18next.createInstance();
i18n.init(
    {
        resources: {},
        fallbackLng: 'vi',
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

function Layout(props: { children: React.ReactNode; style?: React.CSSProperties }) {
    const { children, style } = props;

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem',
                ...style,
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '1rem',
                }}
            >
                <LanguageBox />
            </div>

            <div
                style={{
                    padding: '2rem',
                    width: '100%',
                    boxSizing: 'border-box',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                {children}
            </div>
        </div>
    );
}

const Container = (props: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <I18nProvider i18nData={i18n}>
        <ThemeProvider>
            <HelmetProvider>
                <Layout {...props} />
            </HelmetProvider>
        </ThemeProvider>
    </I18nProvider>
);

export default Container;
