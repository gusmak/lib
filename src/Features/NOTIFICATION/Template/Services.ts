import type { PagingQueryInput } from 'Features/types';
import type { Template, TemplateInput, TemplateGenerationInput, ObjectDefinition } from './types';

export type TemplateServices = {
    /** Get Roles
     * @param p - PagingQueryInput<Role> - Không truyền param sẽ lấy tất cả Role
     */
    getTemplates: (p?: PagingQueryInput<Template>) => Promise<{ items: Template[]; totalCount: number }>;

    deleteNotificationTemplate: (p: { id: number }) => Promise<void>;

    generateTemplate: (p: { templateGenerationInput: TemplateGenerationInput }) => Promise<{ generateTemplate: string }>;

    getTemplateById: (p: { id: number }) => Promise<Template>;

    getObjectDefinitions: (p?: PagingQueryInput<ObjectDefinition>) => Promise<{ items: ObjectDefinition[]; totalCount: number }>;

    createTemplate: (p: { input: TemplateInput }) => Promise<void>;

    updateTemplate: (p: { input: TemplateInput; id: number }) => Promise<void>;
};
