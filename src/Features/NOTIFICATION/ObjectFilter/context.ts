import { createContext, useContext, useMemo } from 'react';
import { ObjectFilterServices } from './Services';
import { EnumTypeConvert } from 'Features/types';
import { LogicExpressionsStructure } from './types';

/** ObjectFilter Context */
export const ObjectFilterContext = createContext<{
    services?: ObjectFilterServices;
    objectTyeCodes?: EnumTypeConvert[];
    objectConfigTypes?: EnumTypeConvert[];
    logicExpressionsStructure?: LogicExpressionsStructure;
}>({});

export const useGetContext = () => {
    const context = useContext(ObjectFilterContext);
    const props = useMemo(() => context, [context]);
    return props;
};
