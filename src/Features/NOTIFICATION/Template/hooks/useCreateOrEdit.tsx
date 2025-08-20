import { useState, useCallback, useEffect, useMemo, useRef, Dispatch, SetStateAction, RefObject } from 'react';
import { FormMode, TemplateContentType, ChannelType } from '../../enums';
import { checkValid, containsHtmlTags } from '../utils';
import { TestingDataInput } from 'Features/NOTIFICATION/components/TestingTool';
import { isEmpty, toString } from 'lodash';
import { FIELD_TYPE, FieldDefinitionProps } from 'AWING/DataInput';
import { DataObject } from 'Features/types';
import { Constants } from 'Commons/Constant';
import { useTranslation } from 'react-i18next';
import { ConfigTypeCodeMap } from 'Features/NOTIFICATION/enums';
import { validateContainHtmlTag } from 'Features/SYSTEM/User/utils';
import { useParams } from 'react-router';
import { FieldPermissions, Template, TemplateInput } from '../types';
import { ObjectTypeCode } from 'Features/types';

export const DEFAULT_FIELD_PERMISSIONS: FieldPermissions = {
    objectType: true,
    configType: true,
    name: true,
    channelType: true,
    contentType: true,
    title: true,
    content: true,
};

/**
 * Hook lấy thông tin mode và id param của component khi render
 */
export const useGetComponentInfo = () => {
    const { id } = useParams<'id'>();
    const isCreate = id === undefined;
    const mode = isCreate ? FormMode.CREATE : FormMode.EDIT;
    const templateId = mode === FormMode.EDIT ? parseInt(id ?? '') : 0;

    return { mode, templateId };
};

/**
 * Hook xử lý logic của form tạo hoặc sửa template
 */
export const useTemplate = (mode: FormMode, template?: Template, id?: number) => {
    const firstRenderRef = useRef(0);
    const [templateInput, setTemplateInput] = useState<Partial<TemplateInput> | undefined>({});
    const [contentValid, setContentValid] = useState(false);
    const [confirmExit, setConfirmExit] = useState(false);
    const [testingDataInput, setTestingDataInput] = useState<TestingDataInput>({});
    const { readyForSubmit, readyForTesting } = useTemplateFormValidation(
        mode,
        templateInput,
        contentValid,
        confirmExit,
        firstRenderRef,
        template
    );
    const { handleChangeContent, handleChangeField, handleTestingChanged } = useTemplateFormHandlers(
        templateInput,
        setTemplateInput,
        setContentValid,
        setConfirmExit,
        setTestingDataInput,
        confirmExit
    );

    useEffect(() => {
        if (id && template) {
            setTestingDataInput((e) => {
                return { ...e, templateInput: template };
            });
            setTemplateInput({
                channelType: template.channelType,
                configType: template.configType,
                contentType: template.contentType,
                content: template.content,
                objectType: template.objectType,
                name: template.name,
                title: template.title,
            });
            template.content && handleChangeContent(template.content);
        }
    }, [id, template]);
    // Set dữ liệu thử nghiệm
    useEffect(() => {
        setTestingDataInput((prevState) => {
            const newTemplateInputData = templateInput || {};
            const newTemplateData = template || {};
            return {
                ...prevState,
                templateInput: {
                    ...prevState.templateInput,
                    ...newTemplateInputData,
                },
                template: {
                    ...prevState.notificationTemplate,
                    ...newTemplateData,
                },
            };
        });
    }, [template, templateInput]);

    // Kiểm tra hợp lệ của content
    useEffect(() => {
        const contentType = templateInput?.['contentType'];
        if (contentType === TemplateContentType.TEXT) {
            if (templateInput?.content && containsHtmlTags(templateInput.content)) {
                setContentValid(false);
            } else {
                setContentValid(!!templateInput?.content);
            }
        } else {
            setContentValid(!!templateInput?.content);
        }
    }, [templateInput?.contentType]);

    return {
        testingDataInput,
        templateInput,
        confirmExit,
        handleTestingChanged,
        handleChangeContent,
        handleChangeField,
        readyForSubmit,
        readyForTesting,
    };
};

/**
 * Hook xử lý validate, trả về state check valid cho form và valid cho dữ liệu thử nghiệm
 */
export const useTemplateFormValidation = (
    mode: FormMode,
    templateInput: Partial<TemplateInput> | undefined,
    contentValid: boolean,
    confirmExit: boolean,
    firstRenderRef: RefObject<number>,
    template?: Template
) => {
    const readyForSubmit = useMemo(() => {
        const check = checkValid(templateInput ?? null);
        if (mode === FormMode.EDIT && firstRenderRef.current < 2) {
            firstRenderRef.current += 1;
            return false;
        }
        return confirmExit && contentValid && check;
    }, [confirmExit, contentValid, templateInput, mode]);
    const readyForTesting = useMemo(() => {
        const fields = {
            objectType: templateInput?.objectType ?? template?.objectType,
            configType: templateInput?.configType ?? template?.configType,
            channelType: templateInput?.channelType ?? template?.channelType,
            contentType: templateInput?.contentType ?? template?.contentType,
            content: templateInput?.content ?? template?.content,
        };
        const isFieldsValid = checkValid(fields);
        return isFieldsValid && contentValid;
    }, [templateInput, template, contentValid]);
    return { readyForSubmit, readyForTesting };
};

/**
 * Hook xử lý các hàm của form tạo hoặc sửa template (dùng trong useTemplateFormHook)
 */
export const useTemplateFormHandlers = (
    templateInput: Partial<TemplateInput> | undefined,
    setTemplateInput: Dispatch<SetStateAction<Partial<TemplateInput> | undefined>>,
    setContentValid: Dispatch<SetStateAction<boolean>>,
    setConfirmExit: Dispatch<SetStateAction<boolean>>,
    setTestingDataInput: Dispatch<SetStateAction<TestingDataInput>>,
    confirmExit: boolean
) => {
    const handleChangeContent = useCallback(
        (value: string) => {
            if (!confirmExit) setConfirmExit(true);
            const contentType = templateInput?.['contentType'];
            if (contentType === TemplateContentType.TEXT) {
                setContentValid(!value || !containsHtmlTags(value));
            } else {
                setContentValid(!!value);
            }
            setTestingDataInput((prev) => ({
                ...prev,
                templateInput: {
                    ...prev.templateInput,
                    content: value,
                },
            }));
            setTemplateInput((prev) => ({
                ...prev,
                content: value,
            }));
        },
        [templateInput, confirmExit]
    );

    const handleChangeField = useCallback(
        (objectFieldChanged: Partial<TemplateInput>) => {
            if (!isEmpty(objectFieldChanged)) {
                if (!confirmExit) setConfirmExit(true);
                setTemplateInput((prev) => ({
                    ...prev,
                    ...objectFieldChanged,
                }));
            }
        },
        [confirmExit]
    );

    const handleTestingChanged = useCallback((newData: TestingDataInput) => {
        setTestingDataInput(newData);
    }, []);

    return {
        handleChangeContent,
        handleChangeField,
        handleTestingChanged,
    };
};

/**
 * Hook lấy thông tin quyền của user trên từng field của template
 */
export const useTemplatePermissions = (mode: FormMode, template: Template) => {
    const [fieldPermissions, setFieldPermissions] = useState<FieldPermissions>(DEFAULT_FIELD_PERMISSIONS);
    useEffect(() => {
        if (mode === FormMode.EDIT && template) {
            const fieldPermissions: FieldPermissions = DEFAULT_FIELD_PERMISSIONS;
            const fieldMap: { [key: string]: keyof FieldPermissions } = {
                objectType: 'objectType',
                configType: 'configType',
                name: 'name',
                channelType: 'channelType',
                contentType: 'contentType',
                title: 'title',
                content: 'content',
            };
            if (
                template.outputFieldPermission?.objectDefinitionWithPermissions &&
                template.outputFieldPermission?.objectDefinitionWithPermissions?.length > 0
            ) {
                for (let i = 0; i < template.outputFieldPermission?.objectDefinitionWithPermissions?.length; i++) {
                    const item: any = template.outputFieldPermission?.objectDefinitionWithPermissions[i];
                    const fieldName = item.objectDefinition.fieldName;
                    if (fieldMap[fieldName]) {
                        fieldPermissions[fieldMap[fieldName]] =
                            (item.permission & Constants.PERMISSION_CODE.MODIFY) === Constants.PERMISSION_CODE.MODIFY;
                    }
                }
            }
            setFieldPermissions(fieldPermissions);
        }
    }, [mode, template]);
    return fieldPermissions;
};

/**
 * Hook lấy thông tin các field của template
 */
export const useTemplateFields = (
    mode: FormMode,
    templateInput: Partial<TemplateInput> | undefined,
    fieldPermissions: DataObject,
    templateData?: Template,
    objectTypeCodes?: ObjectTypeCode[]
) => {
    const { t } = useTranslation();

    const fields = useMemo(() => {
        const result: FieldDefinitionProps<TemplateInput>[] = [
            {
                fieldName: 'objectType',
                type: FIELD_TYPE.SELECT,
                label: t('Template.Label.ObjectType'),
                required: true,
                multiple: false,
                options: (objectTypeCodes ?? []).map((item) => ({
                    value: item.value,
                    text: item.value.toString(),
                })),
                inputProps: { readOnly: mode === FormMode.EDIT ? !fieldPermissions.objectType : false },
                defaultValue:
                    mode === FormMode.EDIT
                        ? templateData?.objectType
                        : objectTypeCodes?.[0]?.value.toString().toUpperCase(),
            },
            {
                fieldName: 'configType',
                type: FIELD_TYPE.SELECT,
                label: t('Template.Label.ConfigType'),
                required: true,
                options: Object.values(ConfigTypeCodeMap).map((value) => ({
                    value: value,
                    text: t(`ConfigTypeCode.${value}`),
                })),
                inputProps: { readOnly: mode === FormMode.EDIT ? !fieldPermissions.configType : false },
                // defaultValue: mode === FormMode.EDIT ? templateData?.template?.configType : ConfigTypeCodeMap.OBJECT_AND_CHANGED,
            },
            {
                fieldName: 'name',
                type: FIELD_TYPE.TEXT,
                label: t('Template.Label.Name'),
                required: true,
                length: 200,
                inputProps: { readOnly: mode === FormMode.EDIT ? !fieldPermissions.name : false },
            },
            {
                fieldName: 'channelType',
                type: FIELD_TYPE.SELECT,
                label: t('Template.Label.Channel'),
                required: true,
                options: Object.entries(ChannelType).map(([key, value]) => ({
                    value: key,
                    text: value,
                })),
                inputProps: { readOnly: mode === FormMode.EDIT ? !fieldPermissions.channelType : false },
            },
            {
                fieldName: 'contentType',
                type: FIELD_TYPE.SELECT,
                label: t('Template.Label.ContentType'),
                required: true,
                options: Object.entries(TemplateContentType).map(([key, value]) => ({
                    value: key,
                    text: value,
                })),
                inputProps: { readOnly: mode === FormMode.EDIT ? !fieldPermissions.contentType : false },
            },
        ];
        const channelType = templateInput?.channelType || templateData?.channelType;

        if (channelType === 'FILE') {
            return result.filter((field) =>
                ['objectType', 'configType', 'name', 'channelType', 'contentType'].includes(toString(field.fieldName))
            );
        }
        if (channelType === 'EMAIL') {
            result.push({
                fieldName: 'title',
                label: t('Template.Label.TemplateTitle'),
                type: FIELD_TYPE.TEXT,
                required: true,
                onValidate: (value: string) => validateContainHtmlTag(value || ''),
                inputProps: { readOnly: mode === FormMode.EDIT ? !fieldPermissions.title : false },
            });
        }

        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        templateInput?.contentType,
        templateInput?.channelType,
        templateInput?.configType,
        templateData?.contentType,
        templateData?.channelType,
        templateData?.configType,
        fieldPermissions,
    ]);

    return fields;
};
