import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Routes, Route } from 'react-router';
import { orderBy, uniqBy } from 'lodash';
import { Grid } from '@mui/material';
import { ClassicDrawer } from 'Commons/Components';
import { AUTHEN_PATH_SEPARATION, Constants, OBJECT_TYPE_CODE_ALL } from '../constants';
import { useGetDirectoryContext } from '../context';
import { getAuthenPermissionInput, getAuthenValueAndType, getPermissionUpdate } from '../utils';
import { fullFieldsState, rootSchemasState, workflowStates } from '../Atoms';
import SelectSchema from '../SelectSchema';
import AddNewAuthen from '../AddNewAuthen';
import { getDefaultCurrentPermission, getDefaultExplicitPermissions } from './helper';
import PageContent from './PageContent';
import type { ExplicitPermission, AuthenPermission } from '../types';
import type { AddOrEditProps, CurrentAuthenPermission } from './types';
import { useAtomValue } from 'jotai';

const AddOrEdit = (props: AddOrEditProps) => {
    const { t } = useTranslation();
    /** Path bao gồm cả type và value cảu Authen */
    const { id } = useParams<'id'>();
    const { authenTypeValue } = useParams<'authenTypeValue'>();
    const { directoryPermission, listPermission, drawerLevel, objectTypeCodeTab, onDrawerLevelChange, onUpdateDirectoryPermission } = props;

    const directoryId = Number(id);
    const isCreate = !!directoryId && !authenTypeValue;

    const { services } = useGetDirectoryContext();
    const fullFields = useAtomValue(fullFieldsState);
    const rootSchemas = useAtomValue(rootSchemasState);
    const workflow = useAtomValue(workflowStates);

    const { authenType, authenValue } = getAuthenValueAndType(authenTypeValue ?? '', AUTHEN_PATH_SEPARATION);
    const currentEditPermission = listPermission?.find((p) => p.authenType === authenType && p.authenValue === authenValue);

    const [readyForSubmit, setReadyForSubmit] = useState(false);
    const [confirmExit, setConfirmExit] = useState(false);
    const [authenPermissions, setAuthenPermissions] = useState<AuthenPermission[]>([]);
    const [explicitMatrixPermissions, setExplicitMatrixPermissions] = useState<number[]>([]);
    const [explicitPermissions, setExplicitPermissions] = useState<ExplicitPermission[]>(getDefaultExplicitPermissions(rootSchemas));
    const [currentPermission, setCurrentPermission] = useState<CurrentAuthenPermission>(getDefaultCurrentPermission('Role'));
    const [objectTypeCodeSelected, setObjectTypeCodeSelected] = useState<string>(objectTypeCodeTab ?? '');

    useEffect(() => {
        if (!isCreate && directoryPermission && currentEditPermission) {
            /** Tính toán lần đầu tiên */
            const permission = getPermissionUpdate(currentPermission, authenType, authenValue, directoryPermission, currentEditPermission);

            setCurrentPermission(permission);
            setExplicitMatrixPermissions(permission.explicitMatrixPermissions);
            setExplicitPermissions(
                orderBy(
                    uniqBy(
                        [
                            ...permission.explicitPermissions,
                            ...permission.inheritedPermissions.map((item: ExplicitPermission) => {
                                return {
                                    schemaId: item.schemaId,
                                    permissions: [],
                                    workflowStateIds: [],
                                };
                            }),
                        ],
                        'schemaId'
                    ),
                    ['schemaId'],
                    ['desc']
                )
            );
        }
    }, [directoryPermission]);

    /** Check if the button is ready to be submitted */
    useEffect(() => {
        const checkExplicitPermissions = () => {
            if (workflow) {
                const firstValid = explicitPermissions.find((p) => p?.permissions?.length > 0);
                return !!firstValid || explicitMatrixPermissions.length > 0;
            } else {
                const invalid = explicitPermissions.find((p) => p?.permissions?.length === 0);
                return !invalid;
            }
        };

        if (!checkExplicitPermissions()) setReadyForSubmit(false);
        else confirmExit && setReadyForSubmit(true);
    }, [explicitMatrixPermissions, explicitPermissions, confirmExit, workflow]);

    const handleChangeMatrixPermissions = (newValue: number[]) => {
        setConfirmExit(true);
        setExplicitMatrixPermissions(newValue);
    };

    const handleComplete = () => {
        drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel - 1);
        onUpdateDirectoryPermission && onUpdateDirectoryPermission();
        setAuthenPermissions([]);
    };

    const handleSubmit = async () => {
        if (services) {
            if (isCreate) {
                const { authens, permissions } = getAuthenPermissionInput(authenPermissions, explicitPermissions);
                return await services
                    .addDirectoryPermission({
                        input: {
                            directoryId: Number(id || 0),
                            authens,
                            permissions: permissions.map((i) => ({
                                ...i,
                                workflowMatrixIds: explicitMatrixPermissions,
                                objectTypeCode: objectTypeCodeSelected === OBJECT_TYPE_CODE_ALL ? null : objectTypeCodeSelected,
                            })),
                        },
                    })
                    .then(() => {
                        handleComplete();
                    });
            } else {
                const { authens, permissions } = getAuthenPermissionInput([], explicitPermissions, currentPermission);
                return await services
                    .addDirectoryPermission({
                        input: {
                            directoryId: directoryPermission?.id || 0,
                            authens,
                            permissions: permissions.map((i) => ({
                                ...i,
                                workflowMatrixIds: explicitMatrixPermissions,
                                objectTypeCode: objectTypeCodeSelected === OBJECT_TYPE_CODE_ALL ? null : objectTypeCodeSelected,
                            })),
                        },
                    })
                    .then(() => {
                        handleComplete();
                    });
            }
        }
    };

    const handleTempPermissionsChange = (newTempPermissions: AuthenPermission[]) => {
        setConfirmExit(true);
        setAuthenPermissions(newTempPermissions);
    };

    const handleExplicitPermissionsChange = (newExplicitPermissions: ExplicitPermission[]) => {
        setConfirmExit(true);
        setExplicitPermissions(newExplicitPermissions);
    };

    const handleDrawerClose = () => {
        drawerLevel && onDrawerLevelChange && onDrawerLevelChange(drawerLevel - 1);
        setAuthenPermissions([]);
    };

    const handleChangeObjectTypeCode = (type: string) => {
        setObjectTypeCodeSelected(type);
    };

    const handleDeleteAuthen = (authen: AuthenPermission) => {
        if (isCreate) {
            setAuthenPermissions(
                authenPermissions?.filter((a) => !(a.authenValue === authen.authenValue && a.authenType === authen.authenType))
            );
        }
    };

    return (
        <ClassicDrawer
            title={isCreate ? t('DirectoryManagement.TitleAddPermission') : t('DirectoryManagement.TitleEditPermission')}
            onSubmit={handleSubmit}
            disableButtonSubmit={!readyForSubmit}
            width={drawerLevel && drawerLevel > 2 ? '100%' : '80%'}
            onClose={handleDrawerClose}
            confirmExit={confirmExit}
        >
            <Grid container sx={{ flexGrow: 1, padding: (theme) => theme.spacing(3) }}>
                <PageContent
                    objectTypeCodeSelected={objectTypeCodeSelected}
                    onChangeObjectTypeCode={handleChangeObjectTypeCode}
                    explicitMatrixPermissions={explicitMatrixPermissions}
                    inheritedMatrixPermissions={isCreate ? [] : currentPermission.inheritedMatrixPermissions}
                    onExplicitMatrixPermissionsChange={handleChangeMatrixPermissions}
                    isCreate={isCreate}
                    disableSelectSchema={!fullFields.length}
                    explicitPermissions={explicitPermissions}
                    inheritedPermissions={isCreate ? [] : currentPermission.inheritedPermissions}
                    onExplicitPermissionsChange={handleExplicitPermissionsChange}
                    authenPermissions={
                        isCreate
                            ? authenPermissions
                            : [
                                  {
                                      name: currentPermission.name,
                                      authenValue: Number(authenValue),
                                      authenType: currentPermission.authenType,
                                      authenName: currentPermission.name,
                                  },
                              ]
                    }
                    onDrawerLevelChange={onDrawerLevelChange}
                    onDeleteAuthen={handleDeleteAuthen}
                />
            </Grid>

            <Routes>
                {isCreate ? (
                    <Route
                        key={Constants.ADD_NEWAUTHEN_PATH}
                        path={Constants.ADD_NEWAUTHEN_PATH}
                        element={
                            <AddNewAuthen
                                authenPermissions={authenPermissions}
                                onTempPermissionsChange={handleTempPermissionsChange}
                                drawerLevel={drawerLevel}
                                onDrawerLevelChange={onDrawerLevelChange}
                            />
                        }
                    />
                ) : null}

                <Route
                    key={Constants.SELECT_SCHEMA_PATH}
                    path={`${Constants.SELECT_SCHEMA_PATH}/*`}
                    element={
                        <SelectSchema
                            explicitPermissions={explicitPermissions}
                            onExplicitPermissionsChange={handleExplicitPermissionsChange}
                            drawerLevel={drawerLevel}
                            onDrawerLevelChange={onDrawerLevelChange}
                        />
                    }
                />
            </Routes>
        </ClassicDrawer>
    );
};

export default AddOrEdit;
