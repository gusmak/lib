import { SortInputType, ObjectInputType } from 'Features/types';

export type ObjectDefinition = {
    id?: number;
    objectTypeCode?: string;
    fieldName?: string;
    fieldPath?: string;
    fieldType?: string;
    description?: string;
    isPrimaryKey?: boolean;
};

export type SchemaObjectDefinition = {
    clone?: SchemaObjectDefinition;
    id?: number;
    isReadOnly?: boolean;
    objectDefinition?: ObjectDefinition;
    objectDefinitionId?: number;
    schemaId?: number;
};

export type Schema = {
    id?: number;
    name?: string;
    objectTypeCode?: string;
    schemaObjectDefinitions?: Array<SchemaObjectDefinition>;
    workspaceId?: number;
    isRoot?: boolean;
};

export type WorkspaceDefaultSchema = {
    schemaId?: number;
    workspaceId?: number;
};

export type SchemasQuery = {
    totalCount?: number;
    items?: Schema[];
};

export type SortInput = SortInputType<Schema>;

export type SchemaDetail = {
    id?: Schema['id'];
    isReadOnly?: boolean;
    objectDefinition?: ObjectDefinition;
    objectDefinitionId?: number;
    schema?: Schema;
    schemaId?: number;
};

export type SchemaInput = ObjectInputType<Schema>;
export type SchemaObjectDefinitionsInput = {
    key?: number;
    value?: {
        objectDefinitionId?: number;
        isReadOnly?: boolean;
    };
};

export type CurrentSchemaDetail = {
    id?: number;
    isReadOnly?: boolean;
    objectDefinitionId?: number;
    objectDefinition?: ObjectDefinition;
};

export type ConvertObjectDefinition = ObjectDefinition & {
    isReadOnly?: boolean;
    isEnable?: boolean;
    isDisable?: boolean;
    childs?: ConvertObjectDefinition[];
};

export type FieldChild = {
    objectDefinitionId?: number;
    objectDefinition?: ConvertObjectDefinition;
    isReadOnly?: boolean;
    schema?: Schema;
};
