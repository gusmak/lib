import { createContext, useContext, useMemo } from 'react';
import { SubscriptionConfigServices } from './Services';
import { ObjectTypeCode } from 'Features/types';

/** SubscriptionConfig Context */
export const SubscriptionConfigContext = createContext<{
    services?: SubscriptionConfigServices;
    objectTypeCodes?: ObjectTypeCode[];
}>({});

export const useGetContext = () => {
    const context = useContext(SubscriptionConfigContext);
    const props = useMemo(() => context, [context]);
    return props;
};
