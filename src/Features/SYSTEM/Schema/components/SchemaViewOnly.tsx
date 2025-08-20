import Done from '@mui/icons-material/Done';
import { Box, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { CircularProgress } from 'AWING';
import { ClassicDrawer } from 'Commons/Components';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { objectTypeCodesState } from '../Atoms';
import type { ConvertObjectDefinition, ObjectDefinition, Schema, SchemaDetail } from '../types';
import { convertToDisplayData, convertToTreeData } from '../utils';
import FieldView from './FieldView';

export type OwnProps = {
    objectTypeDetail?: ObjectDefinition[];
    schema?: Schema;
    rows?: Schema[];
    drawerLevel?: number;
    onDrawerLevelChange?: (level: number) => void;
};

/**
 * View Root Schema Detail
 */
const SchemaViewOnly = (props: OwnProps) => {
    const { t } = useTranslation();
    const { rows, objectTypeDetail, schema, drawerLevel, onDrawerLevelChange } = props;
    const { chemaId } = useParams<'chemaId'>();

    const objectTypeCodes = useAtomValue(objectTypeCodesState);
    const [expanded, setExpanded] = useState<string[]>(['root']);
    const [chosenSchema, setChosenSchema] = useState<Schema | undefined>(schema);
    const [schemaDetails, setSchemaDetails] = useState<SchemaDetail[]>([]);

    const displayData = convertToDisplayData(objectTypeDetail, chosenSchema);
    const treeDatas = convertToTreeData(displayData);

    const handleToggle = (_event: React.SyntheticEvent | null, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    useEffect(() => {
        if (chemaId && rows) {
            const picked = rows.find((item) => item.id === Number(chemaId));
            if (picked) {
                setChosenSchema(picked);
                setSchemaDetails(
                    (picked?.schemaObjectDefinitions ?? []).map((p) => ({
                        id: p?.id,
                        isReadOnly: !!p?.isReadOnly,
                        objectDefinition: p?.objectDefinition ?? {},
                        objectDefinitionId: p?.objectDefinitionId,
                        schemaId: p?.schemaId,
                    }))
                );
            }
        }
    }, [chemaId, rows]);

    return (
        <ClassicDrawer
            title={t('Schema.TitleViewSchema')}
            onClose={() => {
                drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel - 1);
            }}
            childrenWrapperStyle={{ p: 0 }}
        >
            {chosenSchema ? (
                <Grid container sx={{ flexGrow: 1, p: 3 }}>
                    <Grid
                        size={{
                            xs: 12,
                        }}
                        component={Paper}
                        sx={{ p: 3 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            {/* ObjectTypeCode */}
                            <TextField
                                select
                                variant="standard"
                                label={t('Schema.ObjectLabel')}
                                value={schema?.objectTypeCode}
                                style={{ minWidth: '200px' }}
                                disabled
                            >
                                {objectTypeCodes.map((option) => (
                                    <MenuItem key={option.key} value={option.key}>
                                        {option.value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box>
                            <TextField fullWidth variant="standard" label={t('Schema.Name')} required value={chosenSchema?.name} disabled />
                        </Box>
                        <Box>
                            <Typography
                                style={{
                                    fontWeight: 'bold',
                                    padding: '16px 0px',
                                }}
                            >
                                {`${t('Schema.FieldLabel')} *`}
                            </Typography>
                            <Box>
                                <SimpleTreeView
                                    aria-label="controlled"
                                    expandedItems={expanded}
                                    onExpandedItemsChange={handleToggle}
                                    style={{ paddingBottom: '16px' }}
                                    disableSelection={true}
                                    data-testid="SimpleTreeView-Root"
                                >
                                    <TreeItem
                                        itemId="root"
                                        label={
                                            <div
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
                                                    <Box
                                                        style={{
                                                            display: 'flex',
                                                            width: '42px',
                                                            height: '42px',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {schemaDetails?.length === objectTypeDetail?.length && (
                                                            <Done
                                                                color="primary"
                                                                style={{
                                                                    fontSize: '24px',
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    <Typography data-testid="objectTypeCode_label">
                                                        {objectTypeDetail && chosenSchema?.objectTypeCode
                                                            ? objectTypeDetail.find(
                                                                  (item) => item.objectTypeCode === chosenSchema?.objectTypeCode
                                                              )?.objectTypeCode
                                                            : ''}
                                                    </Typography>
                                                </Box>
                                            </div>
                                        }
                                    >
                                        {treeDatas
                                            .filter((item) => item.objectTypeCode === chosenSchema.objectTypeCode)
                                            .map((fieldInfo: ConvertObjectDefinition) => (
                                                <FieldView
                                                    key={fieldInfo.id}
                                                    isDefaultSchema={chosenSchema?.id === null}
                                                    fieldInfo={fieldInfo}
                                                    schemaDetails={schemaDetails.map((s) => ({
                                                        isReadOnly: s?.isReadOnly ?? false,
                                                        objectDefinitionId: s?.objectDefinitionId ?? 0,
                                                        objectDefinition: s?.objectDefinition ?? {},
                                                    }))}
                                                />
                                            ))}
                                    </TreeItem>
                                </SimpleTreeView>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            ) : (
                <CircularProgress />
            )}
        </ClassicDrawer>
    );
};

export default SchemaViewOnly;
