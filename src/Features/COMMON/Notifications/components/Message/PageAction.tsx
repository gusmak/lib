import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Constants } from 'Commons/Constant';
import { defaultResult, PAGE_CODES } from '.';
import type { NotificationMessageField } from '../../Types';

export const PageActionBuildCreateDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();

    const page = fields.find((x) => x.name === 'PageId') ?? defaultResult;
    const pageCode = fields.find((x) => x.name === 'PageCode') ?? defaultResult;
    const url = `${pageCode.value === PAGE_CODES.PageCodeLogin ? Constants.PAGE_LOGIN : Constants.PAGE_WELCOME}/${Constants.EDIT_PATH}/${
        page.value
    }`;

    return {
        title: (
            <>
                {pageCode.value === PAGE_CODES.PageCodeLogin ? t('Notification.PageLogin') : t('Notification.PageWelcome')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{page.text}</NavLink>
                </span>
                {t('Notification.has been')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.created')}</span>
            </>
        ),
        url,
    };
};

export const PageActionBuildUpdateDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const page = fields.find((x) => x.name === 'PageId') ?? defaultResult;
    const pageCode = fields.find((x) => x.name === 'PageCode') ?? defaultResult;
    const url = `${pageCode.value === PAGE_CODES.PageCodeLogin ? Constants.PAGE_LOGIN : Constants.PAGE_WELCOME}/${Constants.EDIT_PATH}/${
        page.value
    }`;

    return {
        title: (
            <>
                {pageCode.value === PAGE_CODES.PageCodeLogin ? t('Notification.PageLogin') : t('Notification.PageWelcome')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{page.text}</NavLink>
                </span>
                {t('Notification.has been')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.updated')}</span>
            </>
        ),
        url,
    };
};

export const PageActionBuildDeleteDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const page = fields.find((x) => x.name === 'PageId') ?? defaultResult;
    const pageCode = fields.find((x) => x.name === 'PageCode') ?? defaultResult;
    return {
        title: (
            <>
                {pageCode.value === PAGE_CODES.PageCodeLogin ? t('Notification.PageLogin') : t('Notification.PageWelcome')}
                <b style={{ padding: '0px 3px' }}>{page.text}</b>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.deleted')}</span>
            </>
        ),
        url: '',
    };
};
