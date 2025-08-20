import { CircularProgress, DataForm } from 'AWING';
import { FIELD_TYPE } from 'AWING/DataInput';
import { ClassicDrawer } from 'Commons/Components';
import { Constants } from 'Commons/Constant';
import { Group } from 'Features/SYSTEM/Group/types';
import { User } from 'Features/SYSTEM/User/types';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import NotificationConfigAddFilter from '../components/AddFilter';
import {
    Detail,
    NotificationConfigDetail,
    NotificationTemplates,
    ObjectFilter,
} from '../components/ConfigNotification/type';
import TestingTool, { TestingDataInput } from '../components/TestingTool';
import { convertToStateDetails, filterByPrefix } from '../utils';
import { useGetContext } from './context';
import { fieldEditPermissionType, Info, NotificationConfigDataType, NotificationConfigInput } from './types';
import { convertToObjectDataInputOfNotificationConfigDetailInput, convertToSubmit } from './utils';
import { useAppHelper } from 'Context/hooks';

const CreateOrEdit = () => {
    const { t } = useTranslation();
    const { id } = useParams<'id'>();
    const { snackbar } = useAppHelper();

    const [readyForSubmit, setReadyForSubmit] = useState<boolean>(false);
    const [formValid, setFormValid] = useState<boolean>(false);
    const [detailsValid, setDetailsValid] = useState<boolean>(false);
    const [info, setInfo] = useState<Info>({
        baseObjectType: 'AP',
        status: true,
    });
    const [details, setDetails] = useState<Detail[]>([]);
    const [confirmExit, setConfirmExit] = useState<boolean>(false);
    const { services, objectTypeCodes, sagaTransactionType } = useGetContext();

    const isCreate = id === undefined;
    const notificationConfigId = !isCreate ? parseInt(id ?? '') : 0;

    const [notificationConfigData, setNotificationConfigData] = useState<NotificationConfigDataType>();
    const [objectFiltersData, setObjectFiltersData] = useState<ObjectFilter[]>();
    const [templateData, setTemplateData] = useState<NotificationTemplates[]>();
    const [userData, setUserData] = useState<User[]>();
    const [groupData, setGroupData] = useState<Group[]>();

    const [loadingFlags, setLoadingFlags] = useState({
        loadingNotificationConfigData: false,
        objectFiltersLoading: false,
        templateLoading: false,
        userLoading: false,
        groupLoading: false,
        loadingUpdate: false,
        loadingCreate: false,
    });
    const [openTestingTool, setOpenTestingTool] = useState<boolean>(false);
    const [testingDataInput, setTestingDataInput] = useState<TestingDataInput>({});

    const fetchData = async () => {
        try {
            setLoadingFlags({
                loadingNotificationConfigData: true,
                objectFiltersLoading: true,
                templateLoading: true,
                userLoading: true,
                groupLoading: true,
                loadingUpdate: false,
                loadingCreate: false,
            });
            const [objectFilters, templates, users, userGroups] = await Promise.all([
                services?.getObjectFilter(),
                services?.getNotificationTemplates(),
                services?.getUsers(),
                services?.getUserGroups(),
            ]);

            setObjectFiltersData(objectFilters?.items);
            setTemplateData(templates?.items);
            setUserData(users?.items);
            setGroupData(userGroups?.items);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingFlags({
                loadingNotificationConfigData: false,
                objectFiltersLoading: false,
                templateLoading: false,
                userLoading: false,
                groupLoading: false,
                loadingUpdate: false,
                loadingCreate: false,
            });
        }
    };

    useEffect(() => {
        if (!isCreate) {
            services?.getNotificationConfigById({ id: notificationConfigId }).then((data) => {
                setNotificationConfigData(data);
                const details: NotificationConfigDetail[] = data?.notificationConfig.details || [];
                setDetails(convertToStateDetails(details));
                setTestingDataInput((e) => ({
                    ...e,
                    notificationConfigInput: {
                        ...data,
                        notificationConfigDetails: convertToObjectDataInputOfNotificationConfigDetailInput(details),
                    },
                }));
            });
        }

        fetchData();
    }, [isCreate, id]);

    const [fieldEditPermission, setFieldEditPermission] = useState<fieldEditPermissionType>({
        baseObjectType: false,
        transactionType: false,
        name: false,
        status: false,
        notificationConfigDetails: false,
    });

    const handleTestingChanged = (newData: TestingDataInput) => {
        setTestingDataInput(newData);
    };

    const handleUpdate = React.useCallback((fieldsToUpdate: Partial<Info>, formValid: boolean) => {
        if (!isEmpty(fieldsToUpdate)) {
            const allFieldsNotEmpty = Object.keys(fieldsToUpdate).every((key) => {
                const value = (fieldsToUpdate as Info)[key as keyof Info];
                return value !== null && value !== undefined && value !== '';
            });
            setInfo((prev) => ({ ...prev, ...fieldsToUpdate }));
            setTestingDataInput((e) => {
                return {
                    ...e,
                    notificationConfigInput: {
                        ...e.notificationConfigInput,
                        ...fieldsToUpdate,
                    },
                };
            });
            if (!allFieldsNotEmpty) {
                setFormValid(false);
                setConfirmExit(false);
                setDetails([]);
                return;
            }
            setFormValid(formValid);
            setConfirmExit(true);
        }
    }, []);

    const handleUpdateConfigDetails = (details: Detail[]) => {
        setDetails(details);
        setConfirmExit(true);
        setTestingDataInput((e) => {
            return {
                ...e,
                notificationConfigInput: {
                    ...e.notificationConfigInput,
                    ...{
                        notificationConfigDetails: convertToSubmit(
                            details,
                            notificationConfigData?.notificationConfig.details
                        ).result,
                    },
                },
            };
        });
        if (!isCreate) {
            setReadyForSubmit(true);
        }
    };

    const handleClickTestingTool = (detail: Detail) => {
        setOpenTestingTool(true);
        const configDetailInputs = convertToSubmit(
            [detail],
            notificationConfigData?.notificationConfig.details
        ).result?.filter((e) => e?.value);
        if (configDetailInputs?.length > 0) {
            const objFilterId = configDetailInputs[0]?.value?.objectFilterId ?? 0;
            const templateId = configDetailInputs[0]?.value?.templateId ?? 0;
            const objectFilter = objectFiltersData?.find((e) => e?.id === objFilterId);
            const template = templateData?.find((e) => e?.id === Number(templateId));
            setTestingDataInput((e) => {
                let result = {
                    ...e,
                    objectFilter: objectFilter,
                    notificationTemplate: template,
                    notificationConfigInput: {
                        ...e.notificationConfigInput,
                        ...{ notificationConfigDetails: configDetailInputs },
                    },
                };
                return result;
            });
        }
    };

    const handleSubmit = useCallback(() => {
        if (!services) return;
        const results = convertToSubmit(details, notificationConfigData?.notificationConfig.details);
        const input = {
            ...(isCreate && { baseObjectType: String(objectTypeCodes?.[0]?.value), status: true }),
            ...info,
            ...(results.isChangeNotificationConfigDetails && {
                notificationConfigDetails: results.result,
            }),
        } as NotificationConfigInput;
        isCreate
            ? setLoadingFlags({ ...loadingFlags, loadingCreate: true })
            : setLoadingFlags({ ...loadingFlags, loadingUpdate: true });

        return isCreate
            ? services
                  ?.createNotificationConfig({
                      notificationConfig: input,
                  })
                  .then(() => {
                      snackbar('success');
                  })
                  .catch(() => {
                      snackbar('error');
                  })
                  .finally(() => setLoadingFlags({ ...loadingFlags, loadingCreate: false }))
            : services
                  ?.updateNotificationConfig({
                      notificationConfig: input,
                      id: notificationConfigId,
                  })
                  .then(() => {
                      snackbar('success');
                  })
                  .catch(() => {
                      snackbar('error');
                  })
                  .finally(() => setLoadingFlags({ ...loadingFlags, loadingUpdate: false }));
    }, [details, notificationConfigId, info]);

    useEffect(() => {
        setReadyForSubmit(formValid && detailsValid);
    }, [formValid, detailsValid]);

    // Kiểm tra quyền của từng field
    useEffect(() => {
        if (notificationConfigData && !loadingFlags.loadingNotificationConfigData) {
            const fieldPermissions: fieldEditPermissionType = {
                baseObjectType: false,
                transactionType: false,
                name: false,
                status: false,
                notificationConfigDetails: false,
            };

            const fieldMap: Record<string, keyof fieldEditPermissionType> = {
                baseObjectType: 'baseObjectType',
                transactionType: 'transactionType',
                name: 'name',
                status: 'status',
                notificationConfigDetails: 'notificationConfigDetails',
            };

            if (
                notificationConfigData?.notificationConfig.outputFieldPermission?.objectDefinitionWithPermissions &&
                notificationConfigData?.notificationConfig.outputFieldPermission?.objectDefinitionWithPermissions
                    ?.length > 0
            ) {
                for (
                    let i = 0;
                    i <
                    notificationConfigData?.notificationConfig.outputFieldPermission?.objectDefinitionWithPermissions
                        ?.length;
                    i++
                ) {
                    const item: any =
                        notificationConfigData?.notificationConfig.outputFieldPermission
                            ?.objectDefinitionWithPermissions[i];
                    const fieldName = item.objectDefinition.fieldName;

                    if (fieldMap[fieldName]) {
                        fieldPermissions[fieldMap[fieldName]] =
                            (item.permission & Constants.PERMISSION_CODE.MODIFY) === Constants.PERMISSION_CODE.MODIFY;
                    }
                }
            }

            setFieldEditPermission(fieldPermissions);
        }
    }, [loadingFlags.loadingNotificationConfigData, notificationConfigData]);

    const transactionTypeData = useMemo(() => {
        return filterByPrefix(
            sagaTransactionType ?? [],
            notificationConfigData?.notificationConfig.baseObjectType ??
                info.baseObjectType ??
                String(objectTypeCodes?.[0]?.value)
        )?.map(({ value }) => {
            return {
                value: String(value),
                text: String(value),
            };
        });
    }, [
        sagaTransactionType,
        objectTypeCodes,
        notificationConfigData?.notificationConfig.baseObjectType,
        info.baseObjectType,
    ]);

    const NotificationConfig = useMemo(() => {
        let result = {
            info: {
                objectType: String(objectTypeCodes?.[0]?.value),
                status: true,
            } as Info,
            details: [] as Detail[],
        };
        if (!isCreate && notificationConfigData?.notificationConfig && !loadingFlags.loadingNotificationConfigData) {
            result = {
                info: {
                    baseObjectType: notificationConfigData?.notificationConfig?.baseObjectType,
                    transactionType: notificationConfigData?.notificationConfig?.transactionType,
                    name: notificationConfigData?.notificationConfig?.name,
                    status: notificationConfigData?.notificationConfig?.status,
                },
                details: [] as Detail[],
            };
        }
        return result;
    }, [notificationConfigData, loadingFlags.loadingNotificationConfigData, isCreate]);

    return (
        <ClassicDrawer
            title={isCreate ? t('NotificationConfig.Create') : t('NotificationConfig.Edit')}
            isLoadingButtonSubmit={
                loadingFlags.loadingCreate ||
                loadingFlags.loadingUpdate ||
                loadingFlags.userLoading ||
                loadingFlags.groupLoading ||
                loadingFlags.objectFiltersLoading ||
                loadingFlags.templateLoading
            }
            onSubmit={handleSubmit}
            confirmExit={confirmExit}
            disableButtonSubmit={!readyForSubmit}
            childrenWrapperStyle={{ padding: 0 }}
        >
            <>
                {isCreate || (!loadingFlags.loadingNotificationConfigData && !isEmpty(NotificationConfig.info)) ? (
                    <>
                        <DataForm
                            fields={[
                                {
                                    fieldName: 'baseObjectType',
                                    type: FIELD_TYPE.SELECT,
                                    label: t('Filter.ObjectType'),
                                    required: true,
                                    options:
                                        objectTypeCodes?.map((item) => ({
                                            value: String(item.value),
                                            text: item.key,
                                        })) ?? [],
                                    inputProps: {
                                        readOnly: !isCreate ? true : false,
                                    },
                                    defaultValue: isCreate ? String(objectTypeCodes?.[0]?.value) : undefined,
                                },
                                {
                                    fieldName: 'transactionType',
                                    type: FIELD_TYPE.SELECT,
                                    label: t('NotificationConfig.Type'),
                                    required: true,
                                    options: transactionTypeData,
                                    inputProps: {
                                        readOnly: !isCreate ? !fieldEditPermission.transactionType : false,
                                    },
                                },
                                {
                                    fieldName: 'name',
                                    type: FIELD_TYPE.TEXT,
                                    label: t('Common.Name'),
                                    required: true,
                                    length: 200,
                                    inputProps: {
                                        readOnly: !isCreate ? !fieldEditPermission.name : false,
                                    },
                                },
                                {
                                    fieldName: 'status',
                                    type: FIELD_TYPE.CHECKBOX,
                                    label: t('Common.Active'),
                                    disabled: !isCreate ? !fieldEditPermission.status : false,
                                    defaultValue: true,
                                },
                            ]}
                            oldValue={NotificationConfig.info}
                            onUpdate={handleUpdate}
                        />
                        <NotificationConfigAddFilter
                            notificationConfigDetailPermissions={
                                !isCreate ? fieldEditPermission.notificationConfigDetails : true
                            }
                            notificationConfigDetails={details}
                            users={(userData as User[]) || []}
                            groups={(groupData as Group[]) || []}
                            templates={(templateData as NotificationTemplates[]) || []}
                            loading={
                                loadingFlags.objectFiltersLoading ||
                                loadingFlags.userLoading ||
                                loadingFlags.groupLoading ||
                                loadingFlags.templateLoading
                            }
                            objectFilters={
                                (objectFiltersData?.filter(
                                    (item) =>
                                        item.objectTypeCode ===
                                        (notificationConfigData?.notificationConfig.baseObjectType ??
                                            info.baseObjectType)
                                ) || []) as ObjectFilter[]
                            }
                            onSubmitData={(newValue: Detail[]) => {
                                handleUpdateConfigDetails(newValue);
                            }}
                            onValid={(valid: boolean) => setDetailsValid(valid)}
                            onClickTesting={handleClickTestingTool}
                        />
                    </>
                ) : (
                    <CircularProgress />
                )}

                {openTestingTool && (
                    <TestingTool
                        testingDataInput={testingDataInput}
                        disabled={isEmpty(info.baseObjectType)}
                        onChange={handleTestingChanged}
                        onClose={() => setOpenTestingTool(false)}
                    />
                )}
            </>
        </ClassicDrawer>
    );
};
export default CreateOrEdit;
