import { TestingToolServices } from 'Features/NOTIFICATION/components/TestingTool/Services';

export const services: TestingToolServices = {
    getObjectJsonById(p) {
        return Promise.resolve({
            testGetObjectJsonById: {
                status: true,
                message:
                    '{"Id":0,"RefId":null,"Name":null,"Vat":0.0,"BrandId":0,"MediaPlanType":0,"PaymentCustomerId":null,"BillCustomerId":null,"PaymentDay":null,"PaymentType":[],"Status":0,"Description":null,"AcceptanceDate":null,"AmountSubtotal":null,"AmountTotal":null,"AgencyDiscountRateForBrand":null,"BuId":0,"PicId":null,"PicSupporterId":null,"ContractSigningDate":null,"PaymentDueDate":null,"LastAcceptanceDate":null,"CreatedDate":"0001-01-01T00:00:00","BillCustomer":null,"Brand":null,"Bu":null,"MediaPlanAcceptanceFileSuppliers":[],"MediaPlanAcceptanceFiles":[],"MediaPlanAcceptances":[],"MediaPlanCampaigns":[],"MediaPlanPayments":[],"MediaPlanUnitPrices":[],"PaymentCustomer":null,"Pic":null,"PicSupporter":null,"ReconciliationMediaPlans":[]}',
            },
        });
    },
    testNotification(p) {
        return Promise.resolve({
            testNotification: {
                status: true,
                message: 'Test notification successfully',
            },
        });
    },
};
