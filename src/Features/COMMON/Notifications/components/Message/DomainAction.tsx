import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Constants } from 'Commons/Constant';
import { defaultResult } from '.';
import type { NotificationMessageField } from '../../Types';

export const DomainActionBuildUpdateDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();

    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const url = `${Constants.DOMAINS_PATH}/${Constants.EDIT_PATH}/${domain.value}`;

    return {
        title: (
            <>
                {t('Notification.Domain')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{domain.text}</NavLink>
                </span>
                {t('Notification.has been')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.updated')}</span>
            </>
        ),
        url,
    };
};
