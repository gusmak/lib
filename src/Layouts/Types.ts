import { ComponentType, ReactElement, ReactNode } from 'react';

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

export type MenuPermission = {
    id?: number;
    key?: string;
    name?: string;
    order?: number;
    parentId?: number;
};

export interface RouteItem {
    key: string;
    title: string;
    path?: string;
    tooltip?: string;
    element?: ReactElement;
    enabled?: boolean;
    index?: boolean;
    icon?: ComponentType;
    subRoutes?: Array<RouteItem>;
    appendDivider?: boolean;
}
