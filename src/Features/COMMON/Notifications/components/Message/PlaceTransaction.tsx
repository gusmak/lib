import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Constants } from 'Commons/Constant';
import { defaultResult } from '.';
import type { NotificationMessageField } from '../../Types';

export const PlaceTransactionBuildJoinRequestDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const place = fields.find((x) => x.name === 'PlaceId') ?? defaultResult;
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const url = `${Constants.NETWORK_PATH}/${Constants.DETAIL_PATH}/${place.value}/PlaceJoinRequest`;

    return {
        title: (
            <>
                {t('Notification.Place')}
                <span style={{ padding: '0px 3px' }}>{place.text}</span>
                {t('Notification.of domain')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={`${Constants.DOMAINS_PATH}/${Constants.EDIT_PATH}/${domain.value}`}>{domain.text}</NavLink>
                </span>
                {t('Notification.send')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{t('Notification.request')}</NavLink>
                </span>
                join network
            </>
        ),
        url,
    };
};

export const PlaceTransactionBuildJoinApproveDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const place = fields.find((x) => x.name === 'PlaceId') ?? defaultResult;
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const url = `${Constants.DOMAINS_PATH}/${Constants.EDIT_PATH}/${domain.value}`;

    return {
        title: (
            <>
                {t('Notification.Place')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={`${Constants.PLACE_PATH}/${Constants.EDIT_PATH}/${place.value}`}>{place.text}</NavLink>
                </span>
                {t('Notification.of domain')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{domain.text}</NavLink>
                </span>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.approved')}</span>
                join network
            </>
        ),
        url,
    };
};

export const PlaceTransactionBuildJoinRejectDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const place = fields.find((x) => x.name === 'PlaceId') ?? defaultResult;
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const url = `${Constants.DOMAINS_PATH}/${Constants.EDIT_PATH}/${domain.value}`;

    return {
        title: (
            <>
                {t('Notification.Place')}
                <span style={{ padding: '0px 3px' }}>{place.text}</span>
                {t('Notification.of domain')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{domain.text}</NavLink>
                </span>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.rejected')}</span>
                join network
            </>
        ),
        url,
    };
};

export const PlaceTransactionBuildUnjoinRequestDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const place = fields.find((x) => x.name === 'PlaceId') ?? defaultResult;
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const url = `${Constants.NETWORK_PATH}/${Constants.DETAIL_PATH}/${place.value}/PlaceUnjoinRequest`;

    return {
        title: (
            <>
                {t('Notification.Place')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={`${Constants.PLACE_PATH}/${Constants.EDIT_PATH}/${place.value}`}>{place.text}</NavLink>
                </span>
                {t('Notification.of domain')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={`${Constants.DOMAINS_PATH}/${Constants.EDIT_PATH}/${domain.value}`}>{domain.text}</NavLink>
                </span>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{t('Notification.request')}</NavLink>
                </span>
                unjoin network
            </>
        ),
        url,
    };
};

export const PlaceTransactionBuildUnjoinApproveDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const place = fields.find((x) => x.name === 'PlaceId') ?? defaultResult;
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const url = `${Constants.DOMAINS_PATH}/${Constants.EDIT_PATH}/${domain.value}`;

    return {
        title: (
            <>
                {t('Notification.Place')}
                <span style={{ padding: '0px 3px' }}>{place.text}</span>
                {t('Notification.of domain')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{domain.text}</NavLink>
                </span>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.approved')}</span>
                unjoin network
            </>
        ),
        url,
    };
};

export const PlaceTransactionBuildUnjoinRejectDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const place = fields.find((x) => x.name === 'PlaceId') ?? defaultResult;
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const url = `${Constants.DOMAINS_PATH}/${Constants.EDIT_PATH}/${domain.value}`;

    return {
        title: (
            <>
                {t('Notification.Place')}
                <span style={{ padding: '0px 3px' }}>{place.text}</span>
                {t('Notification.of domain')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{domain.text}</NavLink>
                </span>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.rejected')}</span>
                unjoin network
            </>
        ),
        url,
    };
};

export const PlaceTransactionBuildPlaceStatusDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const place = fields.find((x) => x.name === 'PlaceId') ?? defaultResult;
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const url = `${Constants.DOMAINS_PATH}/${Constants.EDIT_PATH}/${domain.value}`;

    return {
        title: (
            <>
                {t('Notification.Place')}
                <span style={{ padding: '0px 3px' }}>{place.text}</span>
                {t('Notification.of domain')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{domain.text}</NavLink>
                </span>
                {t('Notification.has')}
                unjoin network
            </>
        ),
        url,
    };
};
