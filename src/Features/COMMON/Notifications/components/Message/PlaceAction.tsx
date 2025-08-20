import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Constants } from 'Commons/Constant';
import { defaultResult } from '.';
import type { NotificationMessageField } from '../../Types';

export const PlaceActionBuildUpdateDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const place = fields.find((x) => x.name === 'PlaceId') ?? defaultResult;
    const url = `${Constants.PLACE_PATH}/${Constants.EDIT_PATH}/${place.value}`;

    return {
        title: (
            <>
                {t('Notification.Place')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{place.text}</NavLink>
                </span>
                {t('Notification.has been')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.updated')}</span>
            </>
        ),
        url,
    };
};
