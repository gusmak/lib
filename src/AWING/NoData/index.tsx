import { useTranslation } from 'react-i18next';

export function NoData() {
    const { t } = useTranslation();

    return (
        <div
            style={{
                padding: 2 * 8,
                textAlign: 'center',
                color: 'black',
            }}
        >
            {t('Common.NoData')}
        </div>
    );
}

export default NoData;
