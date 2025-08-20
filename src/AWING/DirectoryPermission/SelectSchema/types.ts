import { ExplicitPermission, ObjectDefinition, Schema } from '../types';

export type SelectSchemaProps = {
    explicitPermissions: ExplicitPermission[];
    onExplicitPermissionsChange: (newExplicitPermissions: ExplicitPermission[]) => void;
    drawerLevel?: number;
    onDrawerLevelChange?: (level: number) => void;
};

export type SchemaViewProps = {
    id?: string;
    objectDefinitions: ObjectDefinition[];
    rootSchemas: Schema[];
    selectedSchemaIds: (number | null)[];
    schema?: Schema;
    onOpenEditSchema?: (schema: Schema) => void;
    onSelectedSchemaChange?: (checked: boolean, schema: Schema) => void;
};
