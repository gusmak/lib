import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import { Grid, Paper } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import { useParams, useNavigate, Routes, Route } from 'react-router';
import { ClassicDrawer } from 'Commons/Components';
import { AUTHEN_PATH_SEPARATION, Constants, DEFAULT_DIRECTORY_TYPE, OBJECT_TYPE_CODE_ALL } from './constants';
import { useAppHelper } from 'Context';
import { SortEnumType } from 'Commons/Enums';
import {
    fullFieldsState,
    rootSchemasState,
    objectTypeCodesState,
    currentObjectTypeCodesState,
    workflowStates,
    resetAllState,
    schemasState,
} from './Atoms';
import {
    getTableHeader,
    convertDirectoryPermissionData,
    getObjectTypeCodes,
    getListPermissionsByTabValue,
    getAllObjectTypeCodeByDirectory,
} from './utils';
import { DEFAULT_WORKFLOW_STATE, DEFAULT_WORKFLOW_STATE_LABEL } from './constants';
import { useGetDirectoryContext } from './context';
import PermissionManagement from './components/PermissionManagement';
import TabPermissionStates from './components/TabPermissionStates';
import AddOrEdit from './AddOrEdit';
import type { Directory, PermissionView } from './types';
import { useAtom, useSetAtom } from 'jotai';
import { toString } from 'lodash';

function PermissionContainer() {
    const { t } = useTranslation();
    const { confirm, snackbar } = useAppHelper();
    const navigate = useNavigate();
    const { id } = useParams<'id'>();

    const { services, currentWorkspace, onCloseDrawer } = useGetDirectoryContext();
    const directoryId = Number(id || 0);

    /** Jotai State */
    const setFullFields = useSetAtom(fullFieldsState);
    const setRootSchemas = useSetAtom(rootSchemasState);
    const setObjectTypeCodes = useSetAtom(objectTypeCodesState);
    const setSchemas = useSetAtom(schemasState);
    const callResetAllState = useSetAtom(resetAllState);
    const [workflow, setWorkflow] = useAtom(workflowStates);
    const [currentObjectTypeCodes, setCurrentObjectTypeCodes] = useAtom(currentObjectTypeCodesState);

    /** useState */
    const [directoryPermission, setDirectoryPermission] = useState<Directory | undefined>(undefined);
    const [loadingDirectoryPermission, setLoadingDirectoryPermission] = useState<boolean>(true);
    const [objectTypeCodeTab, setObjectTypeCodeTab] = useState(DEFAULT_DIRECTORY_TYPE);
    const [workflowStateTab, setTabValue] = useState('');
    const [drawerLevel, setDrawerLevel] = useState(1);

    /** Callback when DirectoryPermission Updated*/
    const queryDirectoryPermissionData = React.useCallback(async () => {
        if (directoryId) {
            await services
                ?.getDirectoryById({
                    id: directoryId,
                })
                .then((data) => {
                    setDirectoryPermission(data);
                    setLoadingDirectoryPermission(false);
                });
        }
    }, [directoryId]);

    /** Get DirectoryPermission when first load */
    useEffect(() => {
        if (currentWorkspace?.id && directoryId) {
            queryDirectoryPermissionData();
        }
    }, [directoryId]);

    /** Convert Permission Data */
    const convertPermission = useMemo(() => {
        const result = convertDirectoryPermissionData(directoryPermission);
        result?.workflow && setWorkflow(result?.workflow);

        return result;
    }, [directoryPermission]);

    /** Convert Permission Data */
    useEffect(() => {
        if (directoryPermission) {
            let objectTypeCodesResult = getAllObjectTypeCodeByDirectory(directoryPermission);

            setCurrentObjectTypeCodes(objectTypeCodesResult);

            /** Nếu là file thì set tab luôn giá trị objectTypeCode, còn lại lấy giá trị đầu tiên trong mảng TabOptions */
            let currentobjectTypeCodeTab = '';

            if (!!directoryPermission?.isFile && directoryPermission?.objectTypeCode)
                currentobjectTypeCodeTab = directoryPermission.objectTypeCode;
            if (objectTypeCodesResult?.length) currentobjectTypeCodeTab = objectTypeCodesResult[0].key;
            setObjectTypeCodeTab(currentobjectTypeCodeTab);
        }
    }, [directoryPermission]);

    const objectTypeCode = directoryPermission?.objectTypeCode ?? '';

    /** Lấy danh sách workflowStates */
    let objectStates = workflow?.workflowStates?.map((i) => {
        if (i.name === DEFAULT_WORKFLOW_STATE) return { ...i, name: DEFAULT_WORKFLOW_STATE_LABEL };
        else return i;
    });

    useEffect(() => {
        /** Active State tab when first load */
        if (convertPermission?.workflow) {
            const workflowStates = convertPermission?.workflow?.workflowStates ?? [];
            const first = workflowStates[0]?.id ?? '';
            setTabValue(first);
        }
    }, [convertPermission]);

    /** Get ObjectTypeCodes and FullFields */
    useEffect(() => {
        if (services) {
            services
                .getObjectDefinitions({
                    // where: objectTypeCode ? { objectTypeCode: { eq: objectTypeCode } } : {},
                    where: {},
                    order: [{ fieldPath: SortEnumType.Asc }],
                })
                .then((data) => {
                    const objectDefinitions = data.items;
                    let all = objectDefinitions.map((ob) => ({
                        ...ob,
                        isReadOnly: false,
                    }));

                    if (all.length) {
                        /** Get Schema by ObjectTypeCode */
                        services
                            .getSchemas({
                                where: {
                                    objectTypeCode: {
                                        eq: all[0].objectTypeCode,
                                    },
                                    workspaceId: { eq: currentWorkspace?.id },
                                },
                            })
                            .then((data) => {
                                setSchemas(data.items);
                            });
                    }

                    /** Danh sách toàn bộ field/ */
                    setFullFields(all);

                    // Lấy toàn bộ ObjectTypeCodes thông qua ObjectDefinitions
                    setObjectTypeCodes(getObjectTypeCodes(objectDefinitions));
                });
        }
    }, [
        currentWorkspace,
        // objectTypeCode
    ]);

    useEffect(() => {
        /** Danh sách schema root thông qua current workspace */
        const defaultSchemas = currentWorkspace?.defaultSchemas;
        if (defaultSchemas) {
            const rootSchemas = defaultSchemas.filter((s) => {
                /** Nếu có objectTypeCode */
                if (objectTypeCode) return s.objectTypeCode === objectTypeCode;
                else return s;
            });

            setRootSchemas(rootSchemas);
        }
    }, [currentWorkspace?.defaultSchemas]);

    const handleChangeObjectTypeCodeTab = (newTab: string) => setObjectTypeCodeTab(newTab);

    /** Tab Change */
    const handleChangeWorkflowStateTab = (newValue: string) => setTabValue(newValue);

    /** Delete Permission */
    const handleDeletePermission = (authen: PermissionView) => {
        confirm(async () => {
            await services
                ?.deleteDirectoryPermission({
                    input: {
                        directoryId,
                        authens: [
                            {
                                authenType: authen.authenType!,
                                authenValue: authen.authenValue!,
                            },
                        ],
                        objectTypeCodes: [objectTypeCodeTab === OBJECT_TYPE_CODE_ALL ? '' : objectTypeCodeTab],
                    },
                })
                ?.then(() => {
                    snackbar('success');
                    queryDirectoryPermissionData();
                });
        });
    };

    const openEditPermission = (
        authenValue: PermissionView['authenValue'],
        authenType: PermissionView['authenType']
    ) => {
        setDrawerLevel(drawerLevel + 1);
        navigate(Constants.EDIT_PATH + `/${authenType}${AUTHEN_PATH_SEPARATION}${authenValue}`);
    };

    const openAddPermission = () => {
        setDrawerLevel(drawerLevel + 1);
        navigate(Constants.CREATE_PATH);
    };

    const handleDrawerLevelChange = (level: number) => {
        setDrawerLevel(level);
    };

    const handCloseDrawer = () => {
        callResetAllState();
        onCloseDrawer && onCloseDrawer();
    };

    /** Get list Permission */
    const listPermission = useMemo(
        () => getListPermissionsByTabValue(convertPermission, workflowStateTab, objectTypeCodeTab),
        [convertPermission, workflowStateTab, objectTypeCodeTab]
    );

    return directoryId ? (
        <ClassicDrawer
            title={t('DirectoryManagement.TitleViewPermission')}
            onClose={handCloseDrawer}
            customAction={
                <LoadingButton
                    variant="contained"
                    color="primary"
                    loading={loadingDirectoryPermission}
                    loadingPosition="start"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={openAddPermission}
                >
                    {t('DirectoryManagement.ButtonAddPermission')}
                </LoadingButton>
            }
            width={drawerLevel > 1 ? '100%' : '80%'}
        >
            <Grid container sx={{ flexGrow: 1, padding: (theme) => theme.spacing(3) }}>
                <Grid
                    size={{
                        xs: 12,
                    }}
                    component={Paper}
                    sx={{ p: 3, paddingTop: 0 }}
                >
                    {/* Object Type Code */}
                    <TabPermissionStates
                        isShow
                        tabOptions={currentObjectTypeCodes.map((typeCode) => ({
                            key: typeCode.key,
                            value: toString(typeCode.value),
                        }))}
                        tabValue={objectTypeCodeTab}
                        onChangeTab={handleChangeObjectTypeCodeTab}
                        hasBorderBottom
                        style={{
                            marginBottom: 16,
                        }}
                    />
                    {/* Workflow States */}
                    <TabPermissionStates
                        isShow={!!objectStates?.length && !!workflow?.id}
                        tabOptions={objectStates?.map((i) => ({ key: i.id, value: i.name }))}
                        tabValue={workflowStateTab}
                        onChangeTab={handleChangeWorkflowStateTab}
                    />

                    {/* Show Permission Table */}
                    <PermissionManagement
                        headCells={getTableHeader(t)}
                        permissions={listPermission}
                        openEditPermission={openEditPermission}
                        onDeletePermission={handleDeletePermission}
                        isLoading={loadingDirectoryPermission}
                    />
                </Grid>
            </Grid>

            <Routes>
                <Route
                    key={Constants.CREATE_PATH}
                    path={`${Constants.CREATE_PATH}/*`}
                    element={
                        <AddOrEdit
                            objectTypeCodeTab={objectTypeCodeTab}
                            onUpdateDirectoryPermission={queryDirectoryPermissionData}
                            drawerLevel={drawerLevel}
                            onDrawerLevelChange={handleDrawerLevelChange}
                        />
                    }
                />
                <Route
                    key={Constants.EDIT_PATH}
                    path={`${Constants.EDIT_PATH}/:authenTypeValue/*`}
                    element={
                        <AddOrEdit
                            objectTypeCodeTab={objectTypeCodeTab}
                            listPermission={listPermission}
                            directoryPermission={convertPermission}
                            onUpdateDirectoryPermission={queryDirectoryPermissionData}
                            drawerLevel={drawerLevel}
                            onDrawerLevelChange={handleDrawerLevelChange}
                        />
                    }
                />
            </Routes>
        </ClassicDrawer>
    ) : null;
}

export default PermissionContainer;
