import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Constants } from 'Commons/Constant';
import { defaultResult } from '.';
import type { NotificationMessageField } from '../../Types';

export const CampaignActionBuildCreateDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();

    const campaign = fields.find((x) => x.name === 'CampaignId') ?? defaultResult;
    const url = [Constants.CAMPAIGN_PATH, Constants.DETAIL_PATH, campaign.value, Constants.CAMPAIGN_INFORMATION].join('/');

    return {
        title: (
            <>
                {t('Notification.Campaign')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{campaign.text}</NavLink>
                </span>
                {t('Notification.has been')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.created')}</span>
            </>
        ),
        url,
    };
};

export const CampaignActionBuildUpdateDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const campaign = fields.find((x) => x.name === 'CampaignId') ?? defaultResult;
    const url = [Constants.CAMPAIGN_PATH, Constants.DETAIL_PATH, campaign.value, Constants.CAMPAIGN_INFORMATION].join('/');

    return {
        title: (
            <>
                {t('Notification.Campaign')}
                <span style={{ padding: '0px 3px' }}>
                    <NavLink to={url}>{campaign.text}</NavLink>
                </span>
                {t('Notification.has been')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.updated')}</span>
            </>
        ),
        url,
    };
};

export const CampaignActionBuildDeleteDescription = (fields: NotificationMessageField[]) => {
    const { t } = useTranslation();
    const campaign = fields.find((x) => x.name === 'CampaignId') ?? defaultResult;
    return {
        title: (
            <>
                {t('Notification.Campaign')}
                <b style={{ padding: '0px 3px' }}>{campaign.text}</b>
                {t('Notification.has')}
                <span style={{ padding: '0px 3px' }}>{t('Notification.deleted')}</span>
            </>
        ),
        url: '',
    };
};
