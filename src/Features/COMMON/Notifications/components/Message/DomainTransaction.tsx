import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Constants } from 'Commons/Constant';
import { defaultResult } from '.';
import type { NotificationMessageField } from '../../Types';

export const DomainTransactionBuildJoinRequestDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();

    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const request = fields.find((x) => x.name === 'RequestId') ?? defaultResult;
    const url = `${Constants.NETWORK_PATH}/${Constants.DETAIL_PATH}/${request.value}/DomainJoinRequest`;

    return {
        title: (
            <>
                {t('Notification.Domain')}
                <span style={{ padding: '0px 3px' }}>{domain.text}</span>
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

export const DomainTransactionBuildJoinApproveDescription = (fields: NotificationMessageField[]) => {
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
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.approved')}</span>
                join network
            </>
        ),
        url,
    };
};

export const DomainTransactionBuildJoinRejectDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    return {
        title: (
            <>
                {t('Notification.Domain')}
                <b style={{ padding: '0px 3px' }}>{domain.text}</b>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.rejected')}</span>
                join network
            </>
        ),
        url: '',
    };
};

export const DomainTransactionBuildJoinDeleteDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    return {
        title: (
            <>
                {t('Notification.Domain')}
                <b style={{ padding: '0px 3px' }}>{domain.text}</b>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.EventObject.Delete')}</span>
                {t('Notification.EventObject.JoinRequest')}
            </>
        ),
        url: '',
    };
};

export const DomainTransactionBuildUnjoinRequestDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    const request = fields.find((x) => x.name === 'RequestId') ?? defaultResult;
    const url = `${Constants.NETWORK_PATH}/${Constants.DETAIL_PATH}/${request.value}/PlaceUnjoinRequest`;

    return {
        title: (
            <>
                {t('Notification.Domain')}
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

export const DomainTransactionBuildUnjoinApproveDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const domain = fields.find((x) => x.name === 'DomainId') ?? defaultResult;
    return {
        title: (
            <>
                {t('Notification.Domain')}
                <b style={{ padding: '0px 3px' }}>{domain.text}</b>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.approved')}</span>
                unjoin network
            </>
        ),
        url: '',
    };
};

export const DomainTransactionBuildUnjoinRejectDescription = (fields: NotificationMessageField[]) => {
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
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.rejected')}</span>
                unjoin network
            </>
        ),
        url,
    };
};
