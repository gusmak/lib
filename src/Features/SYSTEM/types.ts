import type { Schema } from './Schema';

export type CurrentWorkspace = {
    __typename?: string;
    customerId?: number | null;
    customerType?: string | null;
    description?: string | null;
    id?: number;
    isJoinNetwork?: boolean;
    name?: string;
    type?: string;
    url?: string;
    defaultSchemas?: Schema[];
};

export type Workspace = {
    customerId?: number;
    customerType?: string;
    defaultSchemas?: Array<Schema>;
    description?: string;
    id?: number;
    isJoinNetwork?: boolean;
    name?: string;
    type?: string;
    url?: string;
};
