import type { ObjectInputType } from 'Features/types';
import { DirectoryAddOrEditServices } from './Services';

export type DirectoryProps = DirectoryAddOrEditServices & {
    isCreate?: boolean;
    onUpdateDirectories: (directoryId: number) => void;
    onDrawerClose?: () => void;
};

/** Directory Root */
export type Directory = {
    /* PrimaryKey  */
    id?: number;
    description?: string;
    /* Directory path from root */
    directoryPath?: string;

    /* Quyền trực tiếp  */
    explicitPermissions?: Array<DirectoryPermission>;
    explicitWorkflowMatrixPermissions?: Array<DirectoryPermissionWorkflowMatrix>;

    /* Quyền kế thừa  */
    inheritedPermissions?: Array<DirectoryPermission>;
    inheritedWorkflowMatrixPermissions?: Array<DirectoryPermissionWorkflowMatrix>;

    /* Directory có 2 kiểu (thư mục hoặc file) - có phải là file */
    isFile?: boolean;
    /* Thư mục là kiểu System */
    isSystem?: boolean;
    /* Cấp thư mục */
    level?: number;
    /* Tên thư mục */
    name?: string;
    objectId?: number;
    objectTypeCode?: string;
    order?: number;
    /* ID Thư mục cha */
    parentObjectId?: number;
    sharingId?: number;
    sharingShemaId?: number;
    /** Workflow mà đối tượng này sử dụng */
    workflow?: Workflow;
};

export type DirectoryForm = {
    id?: number;
    description?: string;
    name?: string;
    order?: number;
    /** parent information */
    parentName?: string;
    parentDirectoryId?: number;
};

export type BaseDirectoryPermission = {
    /* PrimaryKey  */
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
};

export type DirectoryPermissionWorkflowMatrix = BaseDirectoryPermission & {
    workflowMatrixId?: number;
};

export type WorkflowState = {
    id?: string;
    level?: number;
    name?: string;
    parentId?: string | null;
    priority?: number;
    value?: number;
    workflowId?: number;
};

export type WorkflowMatrix = {
    id?: number;
    priority?: number;
    stateEnd?: string;
    stateEndNavigation?: WorkflowState;
    stateStart?: string;
    stateStartNavigation?: WorkflowState;
    workflowId?: number;
};

export type Workflow = {
    id?: number;
    description?: string;
    name?: string;
    objectTypeCode?: string;
    stateFieldName?: string;
    workflowMatrices?: Array<WorkflowMatrix>;
    workflowStates?: Array<WorkflowState>;
};

export type DirectoryRequestGqlInput = {
    description?: string
    name?: string
    isSystem?: boolean
    id?: number
    objectId?: number
    objectTypeCode?: string
}

export type DirectoryInput = ObjectInputType<{
    directory: DirectoryRequestGqlInput
} & { parentDirectoryId: number }>;
