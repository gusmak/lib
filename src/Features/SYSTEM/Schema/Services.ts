import type { PagingQueryInput } from 'Features/types';
import type { Schema, ObjectDefinition, SchemaInput } from './types';

export type SchemaServices = {
    /** Get Schemas
     * @param p - PagingQueryInput<Schema> - Không truyền param sẽ lấy tất cả Schema
     */
    getSchemas: (p?: PagingQueryInput<Schema>) => Promise<{ items: Schema[]; total: number }>;

    /** Get Schemas
     * @param p - PagingQueryInput<Schema> - Không truyền param sẽ lấy tất cả Schema
     */
    getSchemaById: (p: { id: number }) => Promise<Schema>;

    /** Delete Schema */
    deleteSchema: (p: { id: number }) => Promise<void>;

    /** Get Object Definition
     * @param p - PagingQueryInput<ObjectDefinition> - Không truyền param sẽ lấy tất cả ObjectDefinition
     */
    getObjectDefinitions: (p?: PagingQueryInput<ObjectDefinition>) => Promise<{ items: ObjectDefinition[]; total: number }>;

    /** Creat new Schema */
    createSchema: (p: { input: SchemaInput }) => Promise<void>;

    /** Update new Schema */
    updateSchema: (p: { input: SchemaInput; id: number }) => Promise<void>;
};
