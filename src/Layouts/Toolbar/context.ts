import { createContext, useContext, useMemo } from 'react';
import type { ToolbarServices } from './Services';
import { Workspace } from './Types';

export type ToolbarContextType = {
    /** currentWorkspace pass props */
    currentWorkspace?: Workspace;

    /** All Service */
    services?: ToolbarServices;
};

/** Context for all Toolbar feature  */
export const ToolbarContext = createContext<ToolbarContextType>({});

/** Get Context of Toolbar */
export const useGetToolbarContext = () => {
    const context = useContext(ToolbarContext);
    const props = useMemo(() => context, [context]);
    return props;
};
