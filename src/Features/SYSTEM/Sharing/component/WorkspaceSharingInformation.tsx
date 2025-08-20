import { useTranslation } from 'react-i18next';
import { DataForm, FIELD_TYPE, MenuOption } from 'AWING';
import { WorkspaceSharingInputForm } from '../Types';
import { WorkspaceSchemaOptionsState } from '../Atoms';
import { useAtomValue } from 'jotai';
import useSharingProps from '../Context';

export type WorkspaceSharingInfomationProps = {
    formData: any;
    onUpdateFormInfomation: (formData: WorkspaceSharingInputForm, isValid: boolean, key: string) => void;
    isCreate: boolean;
    objectFilters: any[];
    isSchemaRequired: boolean;
    directoriesOptions: {
        value: number;
        text: string;
        level: number;
    }[];
};

export default function WorkspaceSharingInfomation(props: WorkspaceSharingInfomationProps) {
    const { formData, onUpdateFormInfomation, isCreate, objectFilters, isSchemaRequired, directoriesOptions } = props;
    const { t } = useTranslation();
    const schemaOptions = useAtomValue(WorkspaceSchemaOptionsState);
    const { ObjectTypeCodeObj } = useSharingProps();

    return (
        <DataForm
            padding={'none'}
            fields={[
                {
                    fieldName: 'objectTypeCode',
                    type: FIELD_TYPE.AUTOCOMPLETE,
                    required: true,
                    label: t('WorkspaceSharing.Label.ObjectType'),
                    options: ObjectTypeCodeObj.map((item) => ({
                        value: item.value,
                        text: item.label,
                    })),
                    multiple: false,
                    readOnly: isCreate ? false : true,
                    disabled: isCreate ? false : true,
                },
                {
                    fieldName: 'name',
                    label: t('WorkspaceSharing.Label.Name'),
                    type: FIELD_TYPE.TEXT,
                    required: true,
                    length: 200,
                },
                {
                    fieldName: 'objectFilterId',
                    type: FIELD_TYPE.AUTOCOMPLETE,
                    multiple: false,
                    required: true,
                    label: t('WorkspaceSharing.Label.Filter'),
                    options: objectFilters
                        .filter((o) => o?.objectTypeCode === formData?.objectTypeCode)
                        .map((item) => ({
                            value: item.id,
                            text: item.name || '',
                        })),
                    disabled: formData.objectTypeCode === '' || formData.objectTypeCode === undefined,
                },
                {
                    fieldName: 'key',
                    label: 'Key',
                    type: FIELD_TYPE.AUTOCOMPLETE,
                    multiple: false,
                    required: true,
                    options: ObjectTypeCodeObj.flatMap(({ value, label }) => {
                        const baseOptions = [
                            { value: `${value.toLowerCase()}_local`, text: `${label} Local` },
                            { value: `${value.toLowerCase()}_share`, text: `${label} Share` },
                        ];
                        
                        // Add additional options for 'page' type with both local and share variants
                        if (value.toLowerCase() === 'page') {
                            return [
                                ...baseOptions,
                                { value: `page_local_login`, text: `Page Local Login` },
                                { value: `page_share_login`, text: `Page Share Login` },
                                { value: `page_local_welcome`, text: `Page Local Welcome` },
                                { value: `page_share_welcome`, text: `Page Share Welcome` },
                            ];
                        }
                        
                        return baseOptions;
                    }),
                },
                {
                    fieldName: 'folderSourceDirectoryId',
                    label: 'Directory Id',
                    type: FIELD_TYPE.AUTOCOMPLETE,
                    isDirectory: true,
                    multiple: false,
                    required: true,
                    options: directoriesOptions,
                },
                {
                    fieldName: 'schemaId',
                    type: FIELD_TYPE.AUTOCOMPLETE,
                    multiple: false,
                    required: isSchemaRequired,
                    label: t('WorkspaceSharing.Label.Schema'),
                    options: schemaOptions
                        .filter((o) => o?.objectTypeCode === formData?.objectTypeCode)
                        .map((item) => ({
                            value: item.id || '',
                            text: item.name || '',
                        })) as MenuOption<string>[],
                    disabled: formData.objectTypeCode === '' || formData.objectTypeCode === undefined,
                },
            ]}
            oldValue={formData}
            onUpdate={onUpdateFormInfomation}
        />
    );
}
