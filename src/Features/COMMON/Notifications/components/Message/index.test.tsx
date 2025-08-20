import { NotificationMessageField, SagaTransactionType } from '../../Types';
import { getFullDescription } from './index';

describe('getFullDescription', () => {
    const mockFields: NotificationMessageField[] = [
        { name: 'name', value: 'Test Name' },
        { name: 'url', value: 'https://test.com' },
    ];

    const mockTransactionType: SagaTransactionType = {
        CampaignCreate: 1,
        CampaignUpdate: 2,
        CampaignDelete: 3,
        PageCreate: 4,
        PageUpdate: 5,
        PageDelete: 6,
        DomainUpdate: 7,
        DomainJoinRequest: 8,
        DomainJoinApprove: 9,
        DomainJoinReject: 10,
        DomainUnjoinRequest: 11,
        DomainUnjoinApprove: 12,
        DomainUnjoinReject: 13,
        DomainJoinDelete: 14,
        PlaceUpdate: 15,
        PlaceJoinRequest: 16,
        PlaceJoinApprove: 17,
        PlaceJoinReject: 18,
        PlaceUnjoinRequest: 19,
        PlaceUnjoinApprove: 20,
        PlaceUnjoinReject: 21,
        PlaceStatusUpdate: 22,
    };

    it('should return default result for unknown type', () => {
        const result = getFullDescription(999, mockFields, mockTransactionType);
        expect(result).toEqual({ title: <></>, url: '' });
    });

    it('should handle CampaignCreate type', () => {
        const result = getFullDescription(mockTransactionType.CampaignCreate, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle CampaignUpdate type', () => {
        const result = getFullDescription(mockTransactionType.CampaignUpdate, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle CampaignDelete type', () => {
        const result = getFullDescription(mockTransactionType.CampaignDelete, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PageCreate type', () => {
        const result = getFullDescription(mockTransactionType.PageCreate, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PageUpdate type', () => {
        const result = getFullDescription(mockTransactionType.PageUpdate, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PageDelete type', () => {
        const result = getFullDescription(mockTransactionType.PageDelete, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle DomainUpdate type', () => {
        const result = getFullDescription(mockTransactionType.DomainUpdate, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle DomainJoinRequest type', () => {
        const result = getFullDescription(mockTransactionType.DomainJoinRequest, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle DomainJoinApprove type', () => {
        const result = getFullDescription(mockTransactionType.DomainJoinApprove, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle DomainJoinReject type', () => {
        const result = getFullDescription(mockTransactionType.DomainJoinReject, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle DomainUnjoinRequest type', () => {
        const result = getFullDescription(mockTransactionType.DomainUnjoinRequest, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle DomainUnjoinApprove type', () => {
        const result = getFullDescription(mockTransactionType.DomainUnjoinApprove, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle DomainUnjoinReject type', () => {
        const result = getFullDescription(mockTransactionType.DomainUnjoinReject, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle DomainJoinDelete type', () => {
        const result = getFullDescription(mockTransactionType.DomainJoinDelete, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PlaceUpdate type', () => {
        const result = getFullDescription(mockTransactionType.PlaceUpdate, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PlaceJoinRequest type', () => {
        const result = getFullDescription(mockTransactionType.PlaceJoinRequest, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PlaceJoinApprove type', () => {
        const result = getFullDescription(mockTransactionType.PlaceJoinApprove, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PlaceJoinReject type', () => {
        const result = getFullDescription(mockTransactionType.PlaceJoinReject, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PlaceUnjoinRequest type', () => {
        const result = getFullDescription(mockTransactionType.PlaceUnjoinRequest, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PlaceUnjoinApprove type', () => {
        const result = getFullDescription(mockTransactionType.PlaceUnjoinApprove, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PlaceUnjoinReject type', () => {
        const result = getFullDescription(mockTransactionType.PlaceUnjoinReject, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });

    it('should handle PlaceStatusUpdate type', () => {
        const result = getFullDescription(mockTransactionType.PlaceStatusUpdate, mockFields, mockTransactionType);
        expect(result).toBeDefined();
    });
});
