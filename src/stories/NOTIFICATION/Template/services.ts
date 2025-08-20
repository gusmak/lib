import { TemplateServices, ObjectDefinition } from 'Features/NOTIFICATION/Template';
import { initTemplates, initObjectDefinitions } from './initData';

export const services: TemplateServices = {
    getTemplates(p) {
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve({
                    totalCount: initTemplates.length,
                    items: initTemplates,
                });
            }, 1000)
        );
    },
    deleteNotificationTemplate(p) {
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, 1000)
        );
    },
    getObjectDefinitions(p) {
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve({
                    totalCount: initObjectDefinitions.length,
                    items: initObjectDefinitions,
                });
            }, 1000)
        );
    },
    generateTemplate(p) {
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve({
                    generateTemplate: 'generateTemplate',
                });
            }, 1000)
        );
    },
    getTemplateById(p) {
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve(initTemplates.find((x) => x.id === p.id)!);
            }, 1000)
        );
    },
    createTemplate(p) {
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, 1000)
        );
    },
    updateTemplate(p) {
        return new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, 1000)
        );
    },
};
