import { ReactNode } from 'react';

export type ValueBase = string | number;

export interface MenuOption<T extends ValueBase> {
    value: T;
    text: string;
    key?: string;
    label?: ReactNode;
    disabled?: boolean;
    params?: any;
    level?: number;
    actions?: ReactNode;
    order?: number;
    directoryPath?: string;
    parentObjectId?: T;
    objectId?: T;
}

export interface IOption {
    id: string;
    name: string;
}
