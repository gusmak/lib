import { useContext, useMemo } from 'react';
import { AppContext, AwingContext } from './context';

export const useAwing = () => {
    const awingContextValue = useContext(AwingContext);

    const awing = useMemo(() => {
        return awingContextValue;
    }, [awingContextValue]);

    return awing;
};

export const useAppHelper = () => {
    const helperContextValue = useContext(AppContext);

    const helper = useMemo(() => {
        return helperContextValue;
    }, [helperContextValue]);

    return helper;
};
