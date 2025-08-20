import { Box, Checkbox, Typography } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type MouseEvent, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { confirmExitState, currentSchemaDetailsState, fullFieldsState, objectTypeCodeState } from '../Atoms';
import type { ConvertObjectDefinition, FieldChild } from '../types';
import {
    countEnableFields,
    getCurrentSchemaFields,
    getCurrentSchemaFieldsWithChecked,
    getExpandedItems,
    recursionFields,
} from '../utils';
import FieldView from './FieldView';

export type OwnProps = {
    displayFields: ConvertObjectDefinition[];
};

const ObjectFields = (props: OwnProps) => {
    const { t } = useTranslation();
    const { displayFields = [] } = props;

    const objectTypeCode = useAtomValue(objectTypeCodeState);
    const fullFields = useAtomValue(fullFieldsState);
    const setConfirmExit = useSetAtom(confirmExitState);
    const [currentSchemaDetails, setCurrentSchemaDetails] = useAtom(currentSchemaDetailsState);

    const isFirstLoad = useRef<boolean>(true);
    const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<string[]>(['root']);
    const handleToggle = (_e: SyntheticEvent | null, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    /** Check/Uncheck all  */
    useEffect(() => {
        const countEnableField = countEnableFields(displayFields);

        if (countEnableField && countEnableField === currentSchemaDetails?.length) setIsSelectAll(true);
        else setIsSelectAll(false);
    }, [currentSchemaDetails, displayFields, objectTypeCode]);

    /** Click check/uncheck all */
    const handleSelectAll = (checked: boolean) => {
        let tmpNewSchemaDetails: FieldChild[] = [];
        if (checked) tmpNewSchemaDetails = recursionFields(displayFields, currentSchemaDetails);
        else {
            let tmpPkField = displayFields.find((o) => o.isPrimaryKey);
            if (tmpPkField)
                tmpNewSchemaDetails = currentSchemaDetails.filter(
                    (o) => o?.objectDefinitionId !== undefined && o?.objectDefinitionId === tmpPkField?.id
                );
        }

        setConfirmExit(true);
        setCurrentSchemaDetails(tmpNewSchemaDetails);
    };

    /** Toggle on select checkbox */
    const handleCheckbox = (checked: boolean, fieldInfo: ConvertObjectDefinition) => {
        if (fieldInfo?.isPrimaryKey) return;

        // Danh sách các field con của field hiện tại
        let restFields = currentSchemaDetails.filter((o) => o.objectDefinitionId !== fieldInfo.id);

        if (checked) {
            restFields = getCurrentSchemaFieldsWithChecked(fullFields, restFields, fieldInfo);
        } else {
            restFields = getCurrentSchemaFields(currentSchemaDetails, restFields, fieldInfo);
        }

        setConfirmExit(true);
        setCurrentSchemaDetails(restFields);
    };

    /** Toggle on readOnly checkbox */
    const handleCheckReadOnly = (checked: boolean, fieldInfo: ConvertObjectDefinition) => {
        const item = currentSchemaDetails.find((t) => t.objectDefinitionId === fieldInfo.id);
        if (item) {
            const newSchemaDetails = currentSchemaDetails.map((c) => {
                if (c.objectDefinitionId === fieldInfo.id) {
                    return { ...c, isReadOnly: checked };
                }
                return c;
            });

            setConfirmExit(true);
            setCurrentSchemaDetails(newSchemaDetails);
        }
    };

    // Cache giá trị trả về cho đến khi objectTypeCode, isSelectAll thay đổi
    const getDisplayFieldData = useMemo(() => {
        if (displayFields.length < 0 || !objectTypeCode || objectTypeCode === '') return null;

        const result = displayFields.filter((field) => field.objectTypeCode === objectTypeCode);

        /** Nếu có child được checked, mở cha của nó */
        const expandedItems = getExpandedItems(result, currentSchemaDetails);
        if (isFirstLoad.current && expandedItems.length) {
            setExpanded(['root', ...expandedItems]);
            isFirstLoad.current = false;
        }

        return result.map((fieldInfo: ConvertObjectDefinition) => (
            <FieldView
                schemaDetails={currentSchemaDetails}
                key={fieldInfo.id}
                fieldInfo={fieldInfo}
                onCheckbox={handleCheckbox}
                onCheckReadOnly={handleCheckReadOnly}
            />
        ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectTypeCode, currentSchemaDetails, isSelectAll, displayFields]);

    return (
        <SimpleTreeView
            aria-label="controlled"
            expandedItems={expanded}
            onExpandedItemsChange={handleToggle}
            style={{ paddingBottom: '16px' }}
        >
            <TreeItem
                itemId="root"
                label={
                    <div
                        data-testid="objectTypeCode-header"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Checkbox
                                onClick={(e: MouseEvent) => e.stopPropagation()}
                                checked={isSelectAll}
                                disabled={!objectTypeCode || objectTypeCode === ''}
                                onChange={(_event: ChangeEvent, checked: boolean) => {
                                    handleSelectAll(checked);
                                }}
                            />
                            <Typography data-testid="objectTypeCode">{objectTypeCode}</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={'bold'}>
                            {t('Schema.ReadOnly')}
                        </Typography>
                    </div>
                }
                data-testid="TreeItem"
            >
                {getDisplayFieldData}
            </TreeItem>
        </SimpleTreeView>
    );
};

export default ObjectFields;
