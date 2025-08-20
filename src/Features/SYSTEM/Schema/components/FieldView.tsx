import { type MouseEvent, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TreeItem } from '@mui/x-tree-view';
import { Done } from '@mui/icons-material';
import { Box, Typography, Checkbox } from '@mui/material';
import type { ConvertObjectDefinition, CurrentSchemaDetail } from '../types';

export type OwnProps = {
    fieldInfo: ConvertObjectDefinition;
    schemaDetails: CurrentSchemaDetail[];
    isDefaultSchema?: boolean;
    onCheckbox?: (checked: boolean, fieldInfo: ConvertObjectDefinition) => void;
    onCheckReadOnly?: (checked: boolean, fieldInfo: ConvertObjectDefinition) => void;
};

const FieldView = (props: OwnProps) => {
    const { t } = useTranslation();
    const { isDefaultSchema = false, fieldInfo, schemaDetails, onCheckbox, onCheckReadOnly } = props;

    const currentField = schemaDetails?.find((s) => s?.objectDefinitionId === fieldInfo.id);
    const isFieldOfSchema = isDefaultSchema && fieldInfo.isEnable ? true : !!currentField;

    /** computer checked of ReadOnly checkbox  */
    const readOnlyChecked = () => {
        if (isDefaultSchema) return !!fieldInfo.isReadOnly || false;
        return currentField?.isReadOnly || fieldInfo.isReadOnly;
    };

    /** check disabled of ReadOnly  */
    const readOnlyDisabled = !isFieldOfSchema || (isFieldOfSchema && fieldInfo.isReadOnly);

    /** Render Select checkbox */
    const SelectedAction = () => {
        return onCheckbox ? (
            <Checkbox
                onClick={(e: MouseEvent) => e.stopPropagation()}
                checked={isFieldOfSchema || false}
                onChange={(_event: ChangeEvent, checked: boolean) => {
                    onCheckbox(checked, fieldInfo);
                }}
                disabled={fieldInfo.isDisable}
                data-testid="SelectedActionCheckbox"
            />
        ) : (
            <Box
                style={{
                    display: 'flex',
                    width: '42px',
                    height: '42px',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {isFieldOfSchema && <Done color="primary" style={{ fontSize: '24px' }} />}
            </Box>
        );
    };

    /** Render ReadOnly checkbox */
    const ReadOnlyCheckbox = () => {
        return onCheckReadOnly ? (
            <Checkbox
                onClick={(e: MouseEvent) => e.stopPropagation()}
                checked={readOnlyChecked() || false}
                onChange={(_event: ChangeEvent, checked: boolean) => {
                    onCheckReadOnly(checked, fieldInfo);
                }}
                disabled={readOnlyDisabled}
                data-testid="readOnlyCheckbox"
            />
        ) : (
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {readOnlyChecked() && (
                    <Typography fontWeight={'bold'} style={{ paddingLeft: '8px' }}>
                        {t('Schema.ReadOnly')}
                    </Typography>
                )}
            </Box>
        );
    };

    return fieldInfo.isEnable || fieldInfo.isDisable ? (
        <TreeItem
            itemId={fieldInfo?.fieldPath ?? ''}
            label={
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: onCheckbox ? 'space-between' : 'flex-start',
                        alignItems: 'center',
                    }}
                    data-testid={fieldInfo.fieldName}
                >
                    {/* selected checkbox */}
                    <SelectedAction />

                    <Typography
                        style={{
                            flex: 1,
                            textAlign: 'left',
                        }}
                    >
                        {fieldInfo.fieldName}
                    </Typography>

                    {/* Read-only checkbox */}
                    <ReadOnlyCheckbox />
                </div>
            }
        >
            {fieldInfo?.childs?.map((c) => (
                <FieldView
                    key={c.id}
                    isDefaultSchema={isDefaultSchema}
                    fieldInfo={c}
                    schemaDetails={schemaDetails}
                    {...(onCheckbox && { onCheckbox })}
                    {...(onCheckReadOnly && { onCheckReadOnly })}
                />
            ))}
        </TreeItem>
    ) : null;
};

export default FieldView;
