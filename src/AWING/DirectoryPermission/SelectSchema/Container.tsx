import { Box, Button, Grid, MenuItem, Paper, TextField } from '@mui/material';
import { ClassicDrawer } from 'Commons/Components';
import AddOrEdit from 'Features/SYSTEM/Schema/AddOrEdit';
import {
    fullFieldsState as schemaFullFieldsState,
    objectTypeCodesState as schemaObjectTypeCodesState,
    resetAllState as schemaResetAllState,
    rootSchemasState as schemaRootSchemasState,
} from 'Features/SYSTEM/Schema/Atoms';
import { getObjectTypeCodes } from 'Features/SYSTEM/Schema/utils';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Routes, useNavigate } from 'react-router';
import { fullFieldsState, rootSchemasState, schemasState } from '../Atoms';
import { BORDER_LIGHTGRAY, Constants } from '../constants';
import { useGetDirectoryContext } from '../context';
import type { Schema } from '../types';
import { getNewExplicitPermissions } from '../utils/schema';
import SchemaProvider from './SchemaProvider';
import SchemaView from './SchemaView';
import type { SelectSchemaProps } from './types';

const SelectSchema = (props: SelectSchemaProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { explicitPermissions, onExplicitPermissionsChange, drawerLevel, onDrawerLevelChange } = props;
    const { services, currentWorkspace } = useGetDirectoryContext();

    const objectTypeDetail = useAtomValue(fullFieldsState);
    const rootSchemas = useAtomValue(rootSchemasState);
    const [schemas, setSchemas] = useAtom(schemasState);

    const setSchemaFullFields = useSetAtom(schemaFullFieldsState);
    const setSchemaRootSchemas = useSetAtom(schemaRootSchemasState);
    const setSchemaObjectTypeCodes = useSetAtom(schemaObjectTypeCodesState);
    const setSchemaResetAllState = useSetAtom(schemaResetAllState);

    const [selectedSchemaIds, setSelectedSchemaIds] = useState<(number | null)[]>([]);
    const objectTypeCode = 0;

    /** Set jotai state cho Schema */
    useEffect(() => {
        setSchemaRootSchemas(rootSchemas);
        setSchemaFullFields(objectTypeDetail);

        if (rootSchemas.length) {
            // lấy options đối tượng muốn tạo Schema
            const result = getObjectTypeCodes(objectTypeDetail).find((o) => o.value === rootSchemas[0]?.objectTypeCode);
            result && setSchemaObjectTypeCodes([result]);
        }
    }, []);

    useEffect(() => {
        setSelectedSchemaIds(explicitPermissions.map((e) => e.schemaId ?? null));
    }, [explicitPermissions]);

    const handleSelectedSchemaChange = (checked: boolean, schema: Schema) => {
        let newSelectedSchemaIds = selectedSchemaIds.slice();
        if (checked && schema.id !== undefined) {
            newSelectedSchemaIds.push(schema.id);
        } else {
            newSelectedSchemaIds = newSelectedSchemaIds.filter((schemaId) => {
                return schemaId !== null ? schemaId !== schema.id : schemaId !== null;
            });
        }
        setSelectedSchemaIds(newSelectedSchemaIds);
    };

    const handleOpenEditSchema = (pickedSchema: Schema) => {
        drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel + 1);
        navigate(`${Constants.EDIT_SCHEMA_PATH}/${pickedSchema.id}`);
    };

    const handleSubmit = () => {
        return new Promise((resolve) => {
            /** Lấy những thay đổi của ExplicitPermission */
            const newExplicitPermissions = getNewExplicitPermissions(explicitPermissions, selectedSchemaIds);
            drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel - 1);
            onExplicitPermissionsChange(newExplicitPermissions);
            resolve(true);
        });
    };

    const handleUpdateSchemas = () => {
        services
            ?.getSchemas({
                where: {
                    objectTypeCode: {
                        eq: objectTypeDetail[0].objectTypeCode,
                    },
                    workspaceId: { eq: currentWorkspace?.id },
                },
            })
            .then((data) => {
                setSchemas(data.items);
            });
    };

    const handleCloseDrawer = () => {
        setSchemaResetAllState();
        drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel - 1);
    };

    return (
        <ClassicDrawer
            title={t('DirectoryManagement.TitleSelectSchema')}
            onSubmit={handleSubmit}
            width={drawerLevel && drawerLevel > 3 ? '100%' : '80%'}
            onClose={handleCloseDrawer}
        >
            <SchemaProvider>
                <Grid container sx={{ flexGrow: 1, padding: (theme) => theme.spacing(3) }}>
                    <Grid size={{ xs: 12 }} component={Paper} sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <TextField
                                select
                                variant="standard"
                                label={t('DirectoryManagement.ObjectLabel')}
                                value={objectTypeCode}
                                style={{ minWidth: '200px' }}
                                disabled
                            >
                                {(objectTypeDetail && objectTypeDetail[0]
                                    ? [
                                          {
                                              value: objectTypeCode,
                                              label: objectTypeDetail[0]?.objectTypeCode ?? '',
                                          },
                                      ]
                                    : []
                                ).map((item: { value: number; label: string }, index: number) => (
                                    <MenuItem key={`${index}`} value={item.value}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                component={Link}
                                variant="outlined"
                                sx={(theme) => ({
                                    backgroundColor: theme.palette.action.hover,
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondary.main,
                                        border: BORDER_LIGHTGRAY,
                                    },
                                    color: theme.palette.text.primary,
                                    border: BORDER_LIGHTGRAY,
                                })}
                                to={Constants.CREATE_SCHEMA_PATH}
                                onClick={() => {
                                    drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel + 1);
                                }}
                            >
                                {t('DirectoryManagement.TitleCreateSchema')}
                            </Button>
                        </Box>

                        {/* Schema root - lấy phần tử gốc đầu tiên */}
                        {rootSchemas.length > 0 && (
                            <SchemaView
                                id={'SchemaView_default'}
                                key={'SchemaView_default'}
                                rootSchemas={rootSchemas}
                                objectDefinitions={objectTypeDetail}
                                schema={rootSchemas[0]}
                                selectedSchemaIds={Object.assign([], selectedSchemaIds)}
                                onSelectedSchemaChange={handleSelectedSchemaChange}
                            />
                        )}

                        {/* Danh sách schema còn lại */}
                        {schemas.length > 0 &&
                            schemas.map((schema: Schema) => (
                                <SchemaView
                                    id={`SchemaView_${schema.id}`}
                                    key={`SchemaView_${schema.id}`}
                                    objectDefinitions={objectTypeDetail}
                                    rootSchemas={rootSchemas}
                                    schema={schema}
                                    onOpenEditSchema={handleOpenEditSchema}
                                    selectedSchemaIds={Object.assign([], selectedSchemaIds)}
                                    onSelectedSchemaChange={handleSelectedSchemaChange}
                                />
                            ))}
                    </Grid>
                </Grid>
                <Routes>
                    <Route
                        key={Constants.CREATE_SCHEMA_PATH}
                        path={Constants.CREATE_SCHEMA_PATH}
                        element={
                            <AddOrEdit
                                onUpdateSchemas={handleUpdateSchemas}
                                drawerLevel={drawerLevel}
                                onDrawerLevelChange={onDrawerLevelChange}
                            />
                        }
                    />
                </Routes>
            </SchemaProvider>
        </ClassicDrawer>
    );
};

export default SelectSchema;
