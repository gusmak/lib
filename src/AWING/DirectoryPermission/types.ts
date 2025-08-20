import type { Schema as SchemaBase, SchemaServices } from 'Features/SYSTEM/Schema';
import type { ObjectInputType, ObjectTypeCode as ObjectTypeCodeBase, EnumTypeConvert } from 'Features/types';
import type { CurrentWorkspace } from 'Features/SYSTEM/types';
import { DirectoryPermissionServices } from './Services';
import { ObjectDefinition as ObjectDefinitionBase } from 'Commons/Types';
import { Directory as DirectoryBase } from '../DirectoryForm/types';

export type ObjectTyeCodeOption = { value: string; text: string };

/** Component Props */
export type PermissionContainerProps = {
    currentWorkspace?: CurrentWorkspace;
    objectTypeCodes?: EnumTypeConvert[];
    services?: DirectoryPermissionServices;
    schemaServices?: SchemaServices;
    onCloseDrawer?: () => void;
};

export enum AuthenTypeEnum {
    User,
    Group,
    Role,
}

export type AuthenType = keyof typeof AuthenTypeEnum;

export type Schema = SchemaBase;

export type Workflow = {
    id?: number;
    name?: string;
    objectTypeCode?: string;
    stateFieldName?: string;
    description?: string;
    workflowMatrices?: Array<WorkflowMatrix>;
    workflowStates?: Array<WorkflowState>;
};

export type WorkflowMatrix = {
    id?: number;
    priority?: number;
    stateStart?: string;
    stateStartNavigation?: WorkflowState;
    stateEnd?: string;
    stateEndNavigation?: WorkflowState;
};

export type WorkflowState = {
    id?: string;
    parentId?: string | null;
    name?: string;
    priority?: number;
    level?: number;
    parent?: WorkflowState;
    inverseParent?: Array<WorkflowState>;
    value?: number;
};

export type ObjectTypeCode = ObjectTypeCodeBase;

export type BaseDirectoryPermission = {
    id?: number;
    authenName?: string;
    authenType?: string;
    authenValue?: number;
    directoryId?: number;
    directoryPath?: string;
    objectTypeCode?: string;
};

export type DirectoryPermission = BaseDirectoryPermission & {
    permission?: number;
    schemaId?: number | null;
    workflowStateId?: string;
    workflow?: Workflow;
    schema?: Schema | null;
    workflowState?: WorkflowState | null;
};

export type DirectoryPermissionWorkflowMatrix = BaseDirectoryPermission & {
    workflowMatrix?: WorkflowMatrix;
    workflowMatrixId?: number;
};

/** Directory Root */
export type Directory = DirectoryBase;

export type ObjectDefinition = Partial<ObjectDefinitionBase> & {
    fieldType?: string;
    isReadOnly?: boolean;
};

export type ExplicitPermission = {
    permissions: number[];
    schemaId?: number | null;
    workflowStateIds: string[];
};

export type PermissionView = {
    authenValue?: number;
    authenType?: string;
    authenName?: string;
    name?: string;
    permission: number;
    canDelete?: boolean;
    matrices?: WorkflowMatrix[];
};

export type AuthenInput = {
    authenType: string;
    authenValue: number;
};

export type DirectoryInput = ObjectInputType<Directory>;

export type PermissionInput = {
    permission: number;
    schemaId?: number | null;
    workflowStateIds?: string[];
    workflowMatrixIds?: number[];
};

export type DirectoryPermissionInput = {
    authens?: AuthenInput[];
    directoryId: number;
    permissions?: PermissionInput[];
    objectTypeCodes?: string[];
    // workflowMatrixPermissions?: {
    //     workflowMatrixId: number;
    // }[];
};

export type AuthenPermission = {
    authenType: string;
    authenValue: number;
    name?: string;
    authenName?: string;
};

export type Authen = {
    id: number;
    name: string;
    type: string;
    username?: string;
};
