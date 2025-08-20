import { PagingQueryInput } from 'Features/types';
import { Schema, SchemaObjectDefinition } from '../Schema';
import { Workspace } from '../types';
import { Atom } from 'jotai';
import { Directory } from 'AWING/index';

export interface WorkSpaceState {
    type?: string;
    id?: number;
    name?: string;
    customerId?: number;
}

export interface WorkspaceExtension extends Workspace {
    targetWorkspaceId?: number;
    sharingWorkspaceConfigs?: Array<SharingWorkspaceConfig>;
}

export type Sharing = {
    id: number;
    name?: string;
    objectFilter?: ObjectFilter;
    objectFilterId: number;
    schema?: Schema;
    schemaId?: number;
    sharingWorkspaces: Array<SharingWorkspace>;
    totalTargetWorkspace: number;
    workspaceId: number;
    folderSourceDirectoryId?: number;
    key?: string;
};

export type ObjectFilter = {
    configType?: string;
    id: number;
    logicalExpression?: string;
    name?: string;
    objectTypeCode?: string;
    // outputFieldPermission?: Maybe<OutputFieldPermission>;
};

export type ObjectDefinition = {
    description?: string;
    fieldName?: string;
    fieldPath?: string;
    id: number;
    isPrimaryKey?: Boolean;
    objectTypeCode?: string;
};

export type WorkspaceSchemaOption = {
    id?: number;
    name?: string;
    objectTypeCode?: string;
    workspaceId?: number;
    schemaObjectDefinitions?: SchemaObjectDefinition[];
};

export enum SharingConfigParamType {
    Filter = 'FILTER',
    Schema = 'SCHEMA',
}

export type ObjectDataInputOfSharingWorkspaceInput = {
    key?: number;
    value?: SharingWorkspaceInput;
};

export type SharingWorkspaceInput = {
    id?: number;
    sharingWorkspaceConfigs?: Array<ObjectDataInputOfSharingWorkspaceConfigInput>;
    targetWorkspaceId?: number;
};

export type ObjectDataInputOfSharingWorkspaceConfigInput = {
    id?: number;
    value?: SharingWorkspaceConfigInput;
};

export type SharingWorkspaceConfigInput = {
    id: number;
    paramName?: string;
    paramType: SharingConfigParamType;
    paramValue?: string;
};

export type SharingWorkspaceConfig = {
    id: number;
    paramName?: string;
    paramType: SharingConfigParamType;
    paramValue?: string;
    sharingWorkspaceId?: number;
};

export type SharingWorkspace = {
    __typename?: 'SharingWorkspace';
    id?: number;
    targetWorkspace?: Workspace;
    targetWorkspaceId?: number;
    // sharing?: SharingWorkspaceType['sharing']
    sharingId?: number;
    sharingWorkspaceConfigs?: Array<SharingWorkspaceConfig>;
};

export type SharingInput = {
    name?: string;
    objectFilterId?: number;
    schemaId?: number;
    key?: string;
    folderSourceDirectoryId?: number;
    targetWorkspaceId?: number;
    sharingWorkspaces?: Array<ObjectDataInputOfSharingWorkspaceInput>;
};

export type ParamConfiguration = {
    id: number;
    paramName?: ParamField;
    paramValue?: string;
};

export type FilterConfiguration = ParamConfiguration & {
    paramType: string;
    workspaceId: number;
};

export type Configuration = ParamConfiguration & {
    paramType?: string;
};

export type Option = {
    value: string | number;
    name: string | number;
    isChosen: boolean;
};

export type WorkspaceSharingInputForm = SharingInput & {
    id?: number;
    objectTypeCode?: string;
};

export type WorkspaceSharing = WorkspaceSharingInputForm & {
    workspaceId?: number;
};

export type ParamField = string | Option[];

export type ConfigResult = {
    id: string | number;
    paramName: string;
    paramValue: string | null | undefined;
};

export type ConfigArrayEdit = {
    DIRECTORY: ConfigResult[];
    FILTER: ConfigResult[];
};

export type ConfigurationParams = {
    filter?: string[];
    schema?: string[];
};

export type GetPagingInWorkspaceRequestGqlInput = {
    objectTypeCode?: string;
    pageIndex?: number;
    pageSize?: number;
    search?: string;
    workspaceId?: number;
};

export interface SharingProps {
    getSharingById: (p: { id: number }) => Promise<Sharing>;
    createWorkspaceSharing: (p: { input: SharingInput }) => Promise<Sharing>;
    updateWorkspaceSharing: (p: { id: number; input: SharingInput }) => Promise<void>;
    getSharings: (p?: {
        GetPagingInWorkspaceRequestGqlInput: GetPagingInWorkspaceRequestGqlInput;
    }) => Promise<{ sharings: Sharing[]; total: number }>;
    getSchemas: () => Promise<Schema[]>;
    getWorkspaces: () => Promise<Workspace[]>;
    getWorkspaceById: (p: { id: number }) => Promise<Workspace>;
    deleteWorkspaceSharing: (p: { id: number }) => Promise<void>;
    getObjectFilters: () => Promise<ObjectFilter[]>;
    getDirectories: (
        params?: PagingQueryInput<Directory> & {
            parentDirectoryId?: number;
            workspaceId?: number;
            depthFromRoot?: number;
        }
    ) => Promise<{ items: Directory[]; total: number }>;
    isLoading: boolean;
    isSubmitLoading: boolean;
    currentWorkspaceState: Atom<WorkSpaceState>;
    ObjectTypeCodeObj: Array<{
        value: string;
        label: string;
    }>;
}
