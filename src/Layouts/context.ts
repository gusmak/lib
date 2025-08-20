import { createContext, useContext, useMemo } from 'react';
import type { LayoutServices } from './Services';
import { RouteItem } from './Types';

export type LayoutContextType = {
    /** Name of Project */
    appName?: string;

    /** All Service */
    services?: LayoutServices;

    /* routes */
    routeList?: RouteItem[];
};

/** Context for all Toolbar feature  */
export const LayoutContext = createContext<LayoutContextType>({});

/** Get Context of Layout */
export const useGetLayoutContext = () => {
    const context = useContext(LayoutContext);
    const props = useMemo(() => context, [context]);
    return props;
};
