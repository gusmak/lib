import { includes, size } from 'lodash';
import { ObjectTypeCode } from 'Features/types';
import {
    ObjectDefinition,
    ConvertObjectDefinition,
    Schema,
    CurrentSchemaDetail,
    SchemaDetail,
    FieldChild,
    SchemaObjectDefinitionsInput,
} from './types';

/** Lấy toàn bộ ObjectTypeCode thông qua các field  */
export const getObjectTypeCodes = (fields: ObjectDefinition[]): ObjectTypeCode[] => {
    const arr: string[] = [];
    fields.forEach((field: ObjectDefinition) => {
        if (field?.objectTypeCode && !includes(arr, field.objectTypeCode)) {
            arr.push(field.objectTypeCode);
        }
    });

    return arr.map((o) => {
        return {
            key: o,
            value: o.replace(/([A-Z])/g, ' $1').trim(),
        };
    });
};

/** Count field recursive  */
export const countEnableFields = (object: ConvertObjectDefinition[], count = 0) => {
    object.forEach((o) => {
        count++;

        if (o?.childs && size(o.childs)) {
            count = countEnableFields(o.childs, count);
        }
    });

    return count;
};

/** Get ObjectDefinition id of children recursive   */
export const getFieldChildrentObjectDefinitionIDs = (objectDefinitions: ConvertObjectDefinition[], childrentIDs: number[] = []) => {
    objectDefinitions.forEach((o) => {
        o.id && childrentIDs.push(o.id);
        if (o?.childs && size(o.childs)) {
            getFieldChildrentObjectDefinitionIDs(o.childs, childrentIDs);
        }
    });

    return childrentIDs;
};

/** Get Parents */
export const getParentNames = (fieldPath: string): string[] => {
    /* VD: fieldPath = '.a.b.c.' */
    const words = fieldPath.split('.'); // ['', 'a', 'b', 'c', '']
    words.splice(0, 1); /* Xóa phần tử trống đầu tiên => ['a', 'b', 'c', ''] */
    words.splice(words.length - 1, 1); /* Xóa phần tử trống cuối cùng => ['a', 'b', 'c'] */
    words.splice(words.length - 1, 1); /* Xóa phần tử cuối cùng, chỉ giữ lại các phần tử cha => ['a', 'b'] */

    return words;
};

export const convertToDisplayData = (fullFields?: ObjectDefinition[], rootSchema?: Schema) => {
    if (!fullFields || (fullFields && !fullFields.length)) return [];
    const result: ConvertObjectDefinition[] = [];

    /** Nếu có rootSchema, chỉ được kế thừa từ các field này */
    const enableFields: ConvertObjectDefinition[] =
        rootSchema && rootSchema?.schemaObjectDefinitions
            ? rootSchema.schemaObjectDefinitions?.map((detail) => ({
                  ...(detail?.objectDefinition || {}),
                  isReadOnly: !!detail?.isReadOnly,
              }))
            : fullFields;

    for (let i = 0; i < fullFields.length; i++) {
        /** Lặp qua tất cả các field  */
        const enableField = enableFields?.find((enableField) => enableField.id === fullFields[i].id);
        const child = enableFields?.find((enableField) => {
            return (
                size(enableField.fieldPath?.split('.')) > size(fullFields[i].fieldPath?.split('.')) &&
                enableField.fieldPath?.slice(0, size(fullFields[i].fieldPath)) === fullFields[i].fieldPath
            );
        });
        if (enableField) {
            result.push({
                ...fullFields[i],
                isEnable: true,
                isReadOnly: enableField.isReadOnly,
            });
        } else if (child) {
            result.push({
                ...fullFields[i],
                isEnable: true,
            });
        }
    }

    return result;
};

export const getFieldChilds = (fieldInfo: ConvertObjectDefinition): Omit<SchemaDetail, 'id, schema, schemaId'>[] => {
    let fieldChilds: ConvertObjectDefinition[] = [];

    // Nếu field hiện tại có field con thì thêm vào danh sách field con
    if (fieldInfo.childs && fieldInfo.childs.length > 0) {
        fieldChilds = fieldInfo.childs.map((child) => {
            return {
                objectDefinitionId: child.id,
                objectDefinition: {
                    ...child,
                    ...(child.childs &&
                        child.childs.length > 0 && {
                            childs: getFieldChilds(child),
                        }), // Đệ quy để lấy các field con của child
                },
                isReadOnly: child.isReadOnly || false,
            } as Omit<SchemaDetail, 'id, schema, schemaId'>;
        });
    }

    return fieldChilds;
};

export const getRootSchema = (rootSchemas?: Schema[], schema?: Schema) => {
    if (rootSchemas && schema) {
        const selectedRootSchema = rootSchemas.find((rootSchema) => {
            return rootSchema.objectTypeCode === schema.objectTypeCode;
        });
        if (selectedRootSchema) {
            let result = true;
            for (let i = 0; i < Number(schema?.schemaObjectDefinitions?.length); i++) {
                const idx =
                    selectedRootSchema?.schemaObjectDefinitions?.findIndex(
                        (r) => r?.objectDefinitionId === schema?.schemaObjectDefinitions?.[i]?.objectDefinitionId
                    ) ?? -1;
                if (idx < 0) {
                    result = false;
                    break;
                } else {
                    if (
                        schema?.schemaObjectDefinitions?.[i]?.isReadOnly === false &&
                        selectedRootSchema?.schemaObjectDefinitions?.[idx]?.isReadOnly === true
                    ) {
                        result = false;
                        break;
                    }
                }
            }
            return result ? selectedRootSchema : undefined;
        } else {
            return undefined;
        }
    } else return undefined;
};

export const getChilds = (fields: ConvertObjectDefinition[], fieldInfo: ConvertObjectDefinition) => {
    return fields.filter(
        (field) =>
            field.fieldPath?.split('.').length === (fieldInfo.fieldPath?.split('.').length ?? 0) + 1 &&
            field.fieldPath?.slice(0, fieldInfo.fieldPath?.length) === fieldInfo.fieldPath
    );
};

export const addChilds = (fields: ConvertObjectDefinition[], fieldInfo: ConvertObjectDefinition) => {
    const result = fieldInfo;
    const childs = getChilds(fields, fieldInfo);
    if (childs.length > 0) {
        const temp = childs.map((child) => addChilds(fields, child));
        result.childs = temp;
    }
    return result;
};

export const convertToTreeData = (fields: ConvertObjectDefinition[]) => {
    return fields.filter((field) => field.fieldPath?.split('.').length === 3).map((field) => addChilds(fields, field));
};

/** Hàm này dùng cho hàm handleCheckBox để khi thêm phần tử tránh bị lặp (nếu có) */
export const pushIfNotExists = (
    restFields: CurrentSchemaDetail[],
    newField?: {
        objectDefinitionId?: number;
        objectDefinition?: ConvertObjectDefinition;
        isReadOnly?: boolean;
    }
) => {
    const exists = restFields.some((field) => field.objectDefinition?.id === newField?.objectDefinition?.id);
    if (!exists && newField) {
        restFields.push(newField);
    }
};

export const addFieldChildsToRestFields = (fieldChilds: FieldChild[], restFields: CurrentSchemaDetail[]) => {
    if (fieldChilds.length > 0) {
        fieldChilds.forEach((child) => {
            pushIfNotExists(restFields, child);
            if (child.objectDefinition?.childs && child.objectDefinition.childs.length > 0) {
                addFieldChildsToRestFields(child.objectDefinition.childs, restFields); // Đệ quy để thêm các field con của child
            }
        });
    }
};

export const recursionFields = (
    objectDefinitions: ConvertObjectDefinition[],
    schemaDetails: CurrentSchemaDetail[],
    newSchemaDetails: CurrentSchemaDetail[] = []
) => {
    const tmpNewSchemaDetails = newSchemaDetails;
    objectDefinitions.forEach((o) => {
        if (o.childs?.length) recursionFields(o.childs, schemaDetails, tmpNewSchemaDetails);
        const hasInCurrentSchema = schemaDetails?.find((c) => c.objectDefinitionId === o.id);
        const properties = {
            objectDefinition: o,
            isReadOnly: hasInCurrentSchema ? hasInCurrentSchema.isReadOnly : !!o.isReadOnly,
        };
        const itemDetail = {
            objectDefinitionId: o?.id ?? -1,
            ...properties,
        };
        tmpNewSchemaDetails.push(itemDetail);
    });

    return tmpNewSchemaDetails;
};

export const getAllNearestMatchingFields = (fullFields: ObjectDefinition[], fieldInfo: ConvertObjectDefinition, parentFields: string[]) => {
    return fullFields
        .filter(
            (item) =>
                item.fieldPath?.includes(parentFields[parentFields.length - 1]) &&
                item.fieldName !== parentFields[parentFields.length - 1] &&
                item.id !== fieldInfo.id
        )
        .map((item) => ({
            objectDefinitionId: item.id,
            objectDefinition: item,
            isReadOnly: false,
        }));
};

export const getAllIncluded = (
    allMatchingFields: FieldChild[],
    parentField?: ObjectDefinition,
    rootParent?: ObjectDefinition,
    currentSchemaDetails?: CurrentSchemaDetail[],
    fieldChilds?: FieldChild[]
) => {
    return allMatchingFields
        .filter((item) => item.objectDefinition?.id !== parentField?.id && item.objectDefinition?.id !== rootParent?.id)
        .filter((item) => !fieldChilds?.some((child) => child.objectDefinition?.id === item.objectDefinition?.id))
        .every((o) => currentSchemaDetails?.some((r) => r.objectDefinition?.id === o?.objectDefinition?.id));
};

/** Get current fields with checked of false  */
export const getCurrentSchemaFields = (
    fullFields: ObjectDefinition[],
    currentSchemaDetails: CurrentSchemaDetail[],
    fieldInfo: ConvertObjectDefinition
) => {
    let result = currentSchemaDetails.filter(
        (s) =>
            s.objectDefinition?.fieldName &&
            !getParentNames(fieldInfo.fieldPath ?? '').includes(s.objectDefinition.fieldName) &&
            s.objectDefinition?.id !== fieldInfo.id
    );

    /** VD: '.abc.def.ghk.'  => ['', 'abc', 'def', 'ghk', ''] */
    const splitFieldPath = fieldInfo.fieldPath?.split('.');
    /** VD: ['', 'abc', 'def', 'ghk', ''] => "ghk" */
    const parentFieldName = splitFieldPath ? splitFieldPath[splitFieldPath.length - 2] : '';

    /** Lấy toàn bộ objectDefinition id của children nếu có */
    const obIDs = fieldInfo.childs?.length ? getFieldChildrentObjectDefinitionIDs(fieldInfo?.childs) : [];

    // Nếu có parent
    const isParentField = parentFieldName === fieldInfo?.fieldName;
    if (isParentField) {
        // Lấy ra tất cả các field có fieldPath chứa parentFieldName gần nhất trong fullFields,
        // trừ field hiện tại và parentFieldName gần nhất
        const allNearestMatchingFieldIds = fullFields
            .filter((item) => parentFieldName && item.fieldPath?.includes(parentFieldName))
            .map((item) => {
                return item.id;
            });
        result = result.filter(
            (field) => field.objectDefinition?.id !== undefined && !allNearestMatchingFieldIds.includes(field.objectDefinition.id)
        );
    }

    /** Nếu có childs, bỏ checked tất cả các con */
    if (obIDs?.length) {
        result = result.filter((r) => r.objectDefinitionId && !obIDs.includes(r.objectDefinitionId));
    }

    return result;
};

/**
 *
 * @param fullFields Danh sách tất cả các field
 * @param currentSchemaDetails Danh sách các field đã chọn
 * @param fieldInfo field đang tương tác
 * @returns currentSchemaDetails Danh sách mới các field đã chọn
 */
export const getCurrentSchemaFieldsWithChecked = (
    fullFields: ObjectDefinition[],
    currentSchemaDetails: CurrentSchemaDetail[],
    fieldInfo: ConvertObjectDefinition
) => {
    const currentField = {
        objectDefinitionId: fieldInfo?.id ?? -1,
        objectDefinition: fieldInfo,
        isReadOnly: fieldInfo.isReadOnly || false,
    };
    // Lấy ra parent field gần nhất của field được chọn
    const parentFields: string[] = fieldInfo.fieldPath ? getParentNames(fieldInfo.fieldPath) : [];

    /** Nếu field hiện tại có childs, lấy tất cả */
    let fieldChilds: FieldChild[] = [];
    if (fieldInfo?.childs && fieldInfo.childs.length > 0) {
        fieldChilds = getFieldChilds(fieldInfo);
    }

    let parentField = fullFields.find((o) => o.fieldName === parentFields[parentFields.length - 1]);
    if (parentFields.length === 0) {
        parentField = fullFields.find((o) => o.fieldName === fieldInfo.fieldPath?.split('.')[1]);
    }
    // Lấy ra tất cả các field có fieldPath chứa các parentFields trong fullFields
    const allMatchingFields = fullFields
        .filter((item) => parentFields.some((parent) => item.fieldPath?.includes(parent)))
        .map((item) => {
            return {
                objectDefinitionId: item.id,
                objectDefinition: item,
                isReadOnly: false,
            };
        });
    // Lấy ra tất cả các field có fieldPath chứa parentFields gần nhất trong fullFields,
    // trừ field hiện tại và parentFields gần nhất
    const allNearestMatchingFields = getAllNearestMatchingFields(fullFields, fieldInfo, parentFields);

    if (allMatchingFields.length === 0) {
        // Trường hợp không có parent
        pushIfNotExists(currentSchemaDetails, currentField);
    } else {
        const rootParent = fullFields.find((o) => o.fieldName === parentFields[0]);
        pushIfNotExists(currentSchemaDetails, currentField);
        // Kiểm tra xem các fields con của parentFields gần nhất đã được chọn hết chưa,
        // nếu rồi thì thêm parent của nó vào danh sách
        const allNearestMatchingFieldsIncluded = allNearestMatchingFields.every((o) =>
            currentSchemaDetails.some((r) => r.objectDefinition?.id === o?.objectDefinition.id)
        );
        if (allNearestMatchingFieldsIncluded && parentField) {
            pushIfNotExists(currentSchemaDetails, {
                objectDefinitionId: parentField?.id ?? -1,
                objectDefinition: parentField,
                isReadOnly: false,
            });
        }

        /** Kiểm tra tất cả đã được thêm vào */
        const areAllIncluded = getAllIncluded(allMatchingFields, parentField, rootParent, currentSchemaDetails, fieldChilds);

        if (areAllIncluded) {
            if (rootParent) {
                pushIfNotExists(currentSchemaDetails, {
                    objectDefinitionId: rootParent?.id ?? -1,
                    objectDefinition: rootParent,
                    isReadOnly: false,
                });
            }
        }
    }
    if (fieldChilds.length > 0) {
        // Hàm này thay đổi danh sách restFields từ bên trong bằng cách thêm các
        // field con vào danh sách
        addFieldChildsToRestFields(fieldChilds, currentSchemaDetails);
    }

    return currentSchemaDetails;
};

/** Lặp toàn bộ các field và lấy ra ExpandedItems cho SimpleTreeView */
export const getExpandedItems = (fields: ConvertObjectDefinition[], schemaDetails: CurrentSchemaDetail[], expandedItems: string[] = []) => {
    const result = expandedItems;
    fields.forEach((f) => {
        if (f.childs) {
            getExpandedItems(f.childs, schemaDetails, result);

            f.childs.forEach((c) => {
                /** Nếu có bất kì phần tử con nào đang được checkbox thì thêm vào expanded */
                if (schemaDetails.find((s) => s.objectDefinition?.id === c.id))
                    f.fieldPath && !result?.includes(f.fieldPath) && result?.push(f.fieldPath);
            });
        }
    });
    return result;
};

export const getSchemaInput = (currentSchemaDetails: CurrentSchemaDetail[], oldSchemaDetails: CurrentSchemaDetail[]) => {
    const input: SchemaObjectDefinitionsInput[] = [];

    currentSchemaDetails.forEach((x) => {
        const schema = oldSchemaDetails.find((e) => e.objectDefinitionId === x.objectDefinitionId);
        if (schema) {
            /** Nếu tìm thấy schema trong mảng cũ, thì update value theo id */
            if (schema.isReadOnly !== x.isReadOnly) {
                input.push({
                    key: schema.id,
                    value: {
                        objectDefinitionId: x.objectDefinitionId,
                        isReadOnly: x.isReadOnly,
                    },
                });
            }
        } else {
            /** Nếu không thì thêm mới value */
            input.push({
                value: {
                    objectDefinitionId: x.objectDefinitionId,
                    isReadOnly: x.isReadOnly,
                },
            });
        }
    });

    /** Thêm id cho các field cần xoá */
    oldSchemaDetails.forEach((s) => {
        if (!currentSchemaDetails.find((e) => e.objectDefinitionId === s.objectDefinitionId) && !s.objectDefinition?.isPrimaryKey) {
            input.push({
                key: s.id,
            });
        }
    });

    return input;
};
