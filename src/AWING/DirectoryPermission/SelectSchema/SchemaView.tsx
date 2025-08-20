import { useState, SyntheticEvent } from 'react';
import { ExpandMore, ChevronRight, Done } from '@mui/icons-material';
import { Box, Typography, Checkbox } from '@mui/material';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';
import { FieldView } from 'Features/SYSTEM/Schema';
import { convertToDisplayData, convertToTreeData, getRootSchema } from 'Features/SYSTEM/Schema/utils';
import { BORDER_LIGHTGRAY } from '../constants';
import { SchemaViewProps } from './types';

export default function SchemaView(props: SchemaViewProps) {
    const { objectDefinitions, rootSchemas, schema, onOpenEditSchema, selectedSchemaIds, onSelectedSchemaChange } = props;

    const [expanded, setExpanded] = useState<string[]>([]);
    if (!schema) return null;

    const handleToggle = (_e: SyntheticEvent | null, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const handleSelectedSchemaChange = (checked: boolean) => {
        onSelectedSchemaChange && onSelectedSchemaChange(checked, schema);
    };

    const handleOpenEditSchema = () => {
        onOpenEditSchema && onOpenEditSchema(schema);
    };

    const enableFields =
        rootSchemas.length > 0
            ? getRootSchema(rootSchemas, schema)?.schemaObjectDefinitions?.map((detail) => ({
                  ...detail.objectDefinition,
                  isReadOnly: !!detail.isReadOnly,
              }))
            : objectDefinitions;
    const displayData = convertToDisplayData(objectDefinitions, rootSchemas.length > 0 ? getRootSchema(rootSchemas, schema) : undefined);
    const treeDatas = convertToTreeData(displayData);

    return (
        <Box style={{ borderBottom: BORDER_LIGHTGRAY }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: 2,
                }}
            >
                <Checkbox
                    checked={selectedSchemaIds.includes(schema.id ?? -1)}
                    onChange={(_event: React.ChangeEvent, checked: boolean) => {
                        handleSelectedSchemaChange(checked);
                    }}
                />
                <Typography
                    sx={{
                        fontWeight: 'bold',
                        paddingRight: 1,
                        cursor: 'pointer',
                    }}
                    onClick={handleOpenEditSchema}
                >
                    {schema.id !== null ? schema.name : 'Default'}
                </Typography>
            </Box>
            <SimpleTreeView
                aria-label="controlled"
                slots={{ collapseIcon: ExpandMore, expandIcon: ChevronRight }}
                expandedItems={expanded}
                onExpandedItemsChange={handleToggle}
                sx={{
                    paddingBottom: 2,
                }}
                disableSelection={true}
            >
                <TreeItem
                    itemId={`root`}
                    label={
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    width: '42px',
                                    height: '42px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {(schema?.schemaObjectDefinitions?.length === objectDefinitions?.length ||
                                    (schema.id === null && enableFields?.length === objectDefinitions.length)) && (
                                    <Done color="primary" style={{ fontSize: '24px' }} />
                                )}
                            </Box>
                            <Typography>{objectDefinitions && objectDefinitions[0] ? objectDefinitions[0].objectTypeCode : ''}</Typography>
                        </Box>
                    }
                >
                    {treeDatas.map((fieldInfo, index) => (
                        <FieldView
                            key={index}
                            isDefaultSchema={schema.id === null}
                            fieldInfo={fieldInfo}
                            schemaDetails={(schema.schemaObjectDefinitions ?? []).map((p) => ({
                                id: p.id,
                                objectDefinitionId: p.objectDefinitionId,
                                objectDefinition: p.objectDefinition,
                            }))}
                        />
                    ))}
                </TreeItem>
            </SimpleTreeView>
        </Box>
    );
}
