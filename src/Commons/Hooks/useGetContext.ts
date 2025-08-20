import { Context, useContext, useMemo } from 'react';

/** Get Context */
function useGetContext<T extends Context<unknown>>(initContext: T) {
    const context = useContext(initContext);
    const data = useMemo(() => context, [context]);
    return data;
}

export default useGetContext;
