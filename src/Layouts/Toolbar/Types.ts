import { ReactNode } from 'react';

export type Workspace = {
    customerId?: number;
    contactPhoneNumber?: string;
    customizeCustomerFormPath?: string;
    customerType?: string;
    description?: string;
    id?: number;
    isJoinNetwork?: boolean;
    name?: string;
    type?: string;
    url?: string;
    workspaceClassId?: number;
    icons?: ReactNode;
};

export type CurrentUser = {
    id: number;
    name?: string;
    username?: string;
    description?: string;
    gender?: number;
    image?: string;
};
