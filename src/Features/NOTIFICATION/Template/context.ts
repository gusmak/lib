import { createContext, useContext, useMemo } from 'react';
import { TemplateServices } from './Services';
import { ObjectTypeCode } from 'Features/types';
import { type ObjectDefinition } from './types';
/** Role Context */
export const TemplateContext = createContext<{
    services?: TemplateServices;
    objectTypeCodes?: ObjectTypeCode[];
    objectDefinitions?: ObjectDefinition[];
}>({});

export const useGetContext = () => {
    const context = useContext(TemplateContext);
    const props = useMemo(() => context, [context]);
    return props;
};
