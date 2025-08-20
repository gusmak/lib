import { createContext, useContext, useMemo } from 'react';
import { NotificationConfigServices } from './Services';
import { ObjectTypeCode } from 'Features/types';

/** NotificationConfig Context */
export const NotificationConfigContext = createContext<{
    services?: NotificationConfigServices;
    objectTypeCodes?: ObjectTypeCode[];
    sagaTransactionType?: ObjectTypeCode[];
}>({});

export const useGetContext = () => {
    const context = useContext(NotificationConfigContext);
    const props = useMemo(() => context, [context]);
    return props;
};
