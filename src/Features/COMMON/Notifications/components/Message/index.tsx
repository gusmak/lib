import { NotificationMessageField, SagaTransactionType } from '../../Types';
import {
    CampaignActionBuildCreateDescription,
    CampaignActionBuildDeleteDescription,
    CampaignActionBuildUpdateDescription,
} from './CampaignAction';
import { PageActionBuildCreateDescription, PageActionBuildDeleteDescription, PageActionBuildUpdateDescription } from './PageAction';
import { DomainActionBuildUpdateDescription } from './DomainAction';
import {
    DomainTransactionBuildJoinApproveDescription,
    DomainTransactionBuildJoinDeleteDescription,
    DomainTransactionBuildJoinRejectDescription,
    DomainTransactionBuildJoinRequestDescription,
    DomainTransactionBuildUnjoinApproveDescription,
    DomainTransactionBuildUnjoinRejectDescription,
    DomainTransactionBuildUnjoinRequestDescription,
} from './DomainTransaction';
import { PlaceActionBuildUpdateDescription } from './PlaceAction';
import {
    PlaceTransactionBuildJoinApproveDescription,
    PlaceTransactionBuildJoinRejectDescription,
    PlaceTransactionBuildJoinRequestDescription,
    PlaceTransactionBuildPlaceStatusDescription,
    PlaceTransactionBuildUnjoinApproveDescription,
    PlaceTransactionBuildUnjoinRejectDescription,
    PlaceTransactionBuildUnjoinRequestDescription,
} from './PlaceTransaction';

export const defaultResult = { value: '', text: '[No name]' };

export const PAGE_CODES = {
    PageCodeLogin: 'lgn',
    PageCodeWelcome: 'wlc',
};

export const getFullDescription = (type: number, fields: NotificationMessageField[], transactionType: SagaTransactionType) => {
    switch (type) {
        // CampaignAction
        case transactionType.CampaignCreate:
            return CampaignActionBuildCreateDescription(fields);
        case transactionType.CampaignUpdate:
            return CampaignActionBuildUpdateDescription(fields);
        case transactionType.CampaignDelete:
            return CampaignActionBuildDeleteDescription(fields);
        // PageAction
        case transactionType.PageCreate:
            return PageActionBuildCreateDescription(fields);
        case transactionType.PageUpdate:
            return PageActionBuildUpdateDescription(fields);
        case transactionType.PageDelete:
            return PageActionBuildDeleteDescription(fields);
        // DomainAction
        case transactionType.DomainUpdate:
            return DomainActionBuildUpdateDescription(fields);
        // DomainTransaction
        case transactionType.DomainJoinRequest:
            return DomainTransactionBuildJoinRequestDescription(fields);
        case transactionType.DomainJoinApprove:
            return DomainTransactionBuildJoinApproveDescription(fields);
        case transactionType.DomainJoinReject:
            return DomainTransactionBuildJoinRejectDescription(fields);
        case transactionType.DomainUnjoinRequest:
            return DomainTransactionBuildUnjoinRequestDescription(fields);
        case transactionType.DomainUnjoinApprove:
            return DomainTransactionBuildUnjoinApproveDescription(fields);
        case transactionType.DomainUnjoinReject:
            return DomainTransactionBuildUnjoinRejectDescription(fields);
        case transactionType.DomainJoinDelete:
            return DomainTransactionBuildJoinDeleteDescription(fields);
        // PlaceAction
        case transactionType.PlaceUpdate:
            return PlaceActionBuildUpdateDescription(fields);
        // PlaceTransaction
        case transactionType.PlaceJoinRequest:
            return PlaceTransactionBuildJoinRequestDescription(fields);
        case transactionType.PlaceJoinApprove:
            return PlaceTransactionBuildJoinApproveDescription(fields);
        case transactionType.PlaceJoinReject:
            return PlaceTransactionBuildJoinRejectDescription(fields);
        case transactionType.PlaceUnjoinRequest:
            return PlaceTransactionBuildUnjoinRequestDescription(fields);
        case transactionType.PlaceUnjoinApprove:
            return PlaceTransactionBuildUnjoinApproveDescription(fields);
        case transactionType.PlaceUnjoinReject:
            return PlaceTransactionBuildUnjoinRejectDescription(fields);
        // PlaceTransaction
        case transactionType.PlaceStatusUpdate:
            return PlaceTransactionBuildPlaceStatusDescription(fields);

        default:
            return { title: <></>, url: '' };
    }
};
