import type { FunctionStructure, ObjectStructure } from 'AWING/LogicExpression/types';
import { SortInputType } from 'Features/types';

export type NotificationConfigDetail = {
    id?: number;
};

export type ObjectDefinition = {
    fieldName?: string;
    fieldPath?: string;
    id?: number;
    objectTypeCode?: string;
};

export type ObjectDefinitionWithPermission = {
    objectDefinition?: ObjectDefinition;
    permission?: number;
};

export type OutputFieldPermission = {
    objectDefinitionWithPermissions?: Array<ObjectDefinitionWithPermission>;
};

export type SubscriptionConfigDetail = {
    id?: number;
};

export type WorkspaceSharing = {
    id?: number;
};

export type ObjectFilter = {
    configType?: string;
    directoryPath?: string;
    id?: number;
    logicalExpression?: string;
    name?: string;
    objectTypeCode?: string;
    outputFieldPermission?: OutputFieldPermission;
    notificationConfigDetails?: Array<NotificationConfigDetail>;
    subscriptionConfigDetails?: Array<SubscriptionConfigDetail>;
    workspaceSharings?: Array<WorkspaceSharing>;
};

export type SortInput = SortInputType<ObjectFilter>;

export type ObjectFilterInput = {
    configType?: string;
    logicalExpression?: string;
    name?: string;
    objectTypeCode?: string;
};

export type LogicExpressionsStructure = {
    objectStructures?: {
        [key: string]: ObjectStructure[];
    };
    functionStructures?: FunctionStructure[];
};
