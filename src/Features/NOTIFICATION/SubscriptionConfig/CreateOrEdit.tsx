import { CircularProgress, DataForm } from 'AWING';
import { CronTabType, DEFAULT_SCHEDULE_FREE_PERMISSION, DEFAULT_SCHEDULE_PERMISSION } from 'AWING/CronTab/constants';
import { CronTabValue } from 'AWING/CronTab/interface';
import { FIELD_TYPE } from 'AWING/DataInput';
import { ClassicDrawer } from 'Commons/Components';
import { Constants } from 'Commons/Constant';
import { useAppHelper } from 'Context/hooks';
import { Group } from 'Features/SYSTEM/Group/types';
import { User } from 'Features/SYSTEM/User/types';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { convertToSubmit } from '../NotificationConfig/utils';
import { Template } from '../Template';
import SubscriptionConfigAddFilter from '../components/AddFilter';
import {
    Detail,
    NotificationTemplates,
    ObjectFilter,
    SubscriptionConfigDetail,
} from '../components/ConfigNotification/type';
import { convertToStateDetails } from '../utils';
import ScheduleSettings from './ScheduleSettings';
import { useGetContext } from './context';
import {
    fieldEditPermissionType,
    Info,
    ObjectDefinitionWithPermission,
    SubscriptionConfigRequestGqlInput,
    SubscriptionConfigsType,
} from './types';
import { compareChangedFieldsDeep, convertScheduleSettings } from './utils';
import TestingTool, { TestingDataInput } from '../components/TestingTool';

const CreateOrEdit = () => {
    const { t } = useTranslation();
    const { id } = useParams<'id'>();
    const { snackbar } = useAppHelper();

    const isCreate = id === undefined;
    const subscriptionConfigId = !isCreate ? parseInt(id ?? '') : 0;

    const [readyForSubmit, setReadyForSubmit] = useState<boolean>(false);
    const [formValid, setFormValid] = useState<boolean>(false);
    const [detailsValid, setDetailsValid] = useState<boolean>(false);
    const [info, setInfo] = useState<Info>({});
    const [details, setDetails] = useState<Detail[]>([]);
    const [scheduleSettings, setScheduleSettings] = useState<CronTabValue | undefined>();
    const [scheduleSettingsValid, setScheduleSettingsValid] = useState<boolean>(false);
    const [confirmExit, setConfirmExit] = useState<boolean>(false);
    const { services, objectTypeCodes } = useGetContext();

    const [fieldEditPermission, setFieldEditPermission] = useState<fieldEditPermissionType>({
        objectType: false,
        name: false,
        subscriptionConfigDetails: false,
        schedulePermissions: {
            ...DEFAULT_SCHEDULE_PERMISSION,
        },
    });

    const [subscriptionConfigData, setSubscriptionConfigData] = useState<SubscriptionConfigsType>();
    const [oldScheduleType, setOldScheduleType] = useState<any>();
    const [objectFiltersData, setObjectFiltersData] = useState<ObjectFilter[]>();
    const [templateData, setTemplateData] = useState<Template[]>();
    const [userData, setUserData] = useState<User[]>();
    const [groupData, setGroupData] = useState<Group[]>();
    const [openTestingTool, setOpenTestingTool] = useState<boolean>(false);
    const [testingDataInput, setTestingDataInput] = useState<TestingDataInput>({});

    const [loadingFlags, setLoadingFlags] = useState({
        loadingSubscriptionConfigData: isCreate ? false : true,
        objectFiltersLoading: isCreate ? false : true,
        templateLoading: isCreate ? false : true,
        userLoading: isCreate ? false : true,
        groupLoading: isCreate ? false : true,
        loadingUpdate: isCreate ? false : true,
        loadingCreate: false,
    });

    const fetchData = async () => {
        try {
            const [objectFilters, templates, users, userGroups] = await Promise.all([
                services?.getObjectFilter(),
                services?.getSubscriptionTemplates(),
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
                loadingSubscriptionConfigData: false,
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
            services
                ?.getById({
                    id: subscriptionConfigId,
                })
                .then((data) => {
                    setSubscriptionConfigData(data);
                    const sp = data;
                    setDetails(convertToStateDetails(sp?.details as unknown as SubscriptionConfigDetail[]));
                    const temp: CronTabValue = {
                        type: sp?.scheduleType!,
                    };
                    if (sp?.scheduleType != CronTabType.ADVANCED) {
                        temp.dayInterval = {
                            type: sp?.scheduleIntervalInMinutes?.toString() ?? '',
                            from: moment(sp?.scheduleIntervalFromTime, 'HH:mm:ss'),
                            to: moment(sp?.scheduleIntervalEndTime, 'HH:mm:ss'),
                        };
                    } else {
                        temp.cronExpression = sp?.scheduleExpression;
                    }

                    if (sp?.scheduleType == CronTabType.WEEKLY) {
                        temp.daysOfWeek = sp?.scheduleIntervalDaysOfWeek?.split(',')?.map((d: string) => Number(d));
                    }

                    if (sp?.scheduleType == CronTabType.MONTHLY) {
                        temp.daysOfMonth = sp?.scheduleIntervalDaysOfMonth?.split(',')?.map((d: string) => Number(d));
                    }
                    setScheduleSettings(temp);
                    setScheduleSettingsValid(true);
                    setOldScheduleType({
                        scheduleExpression: sp?.scheduleExpression,
                        scheduleIntervalDaysOfMonth: sp?.scheduleIntervalDaysOfMonth,
                        scheduleIntervalDaysOfWeek: sp?.scheduleIntervalDaysOfWeek,
                        scheduleIntervalEndTime: sp?.scheduleIntervalEndTime,
                        scheduleIntervalFromTime: sp?.scheduleIntervalFromTime,
                        scheduleIntervalInMinutes: sp?.scheduleIntervalInMinutes,
                        scheduleSummary: sp?.scheduleSummary,
                        scheduleType: sp?.scheduleType,
                    });
                });
        }
        fetchData();
    }, [isCreate]);

    useEffect(() => {
        if (isCreate) setReadyForSubmit(formValid && detailsValid && scheduleSettingsValid);
    }, [formValid, detailsValid, scheduleSettingsValid]);

    // Kiểm tra quyền của từng field trong outputFieldPermission
    useEffect(() => {
        if (subscriptionConfigData && !loadingFlags.loadingSubscriptionConfigData) {
            const fieldPermissions: fieldEditPermissionType = {
                objectType: false,
                name: false,
                subscriptionConfigDetails: false,
                schedulePermissions: {
                    ...DEFAULT_SCHEDULE_PERMISSION,
                },
            };
            const fieldMap = {
                objectType: 'objectType',
                name: 'name',
                subscriptionConfigDetails: 'subscriptionConfigDetails',
                schedulePermissions: {
                    scheduleType: 'scheduleType',
                    scheduleSummary: 'scheduleSummary',
                    scheduleIntervalDaysOfWeek: 'scheduleIntervalDaysOfWeek',
                    scheduleIntervalDaysOfMonth: 'scheduleIntervalDaysOfMonth',
                    scheduleIntervalFromTime: 'scheduleIntervalFromTime',
                    scheduleIntervalEndTime: 'scheduleIntervalEndTime',
                    scheduleStartDate: 'scheduleStartDate',
                    scheduleIntervalInMinutes: 'scheduleIntervalInMinutes',
                    scheduleToDate: 'scheduleToDate',
                    scheduleExpression: 'scheduleExpression',
                },
            };

            if (
                subscriptionConfigData?.outputFieldPermission?.objectDefinitionWithPermissions &&
                subscriptionConfigData?.outputFieldPermission?.objectDefinitionWithPermissions?.length > 0
            ) {
                for (
                    let i = 0;
                    i < subscriptionConfigData?.outputFieldPermission?.objectDefinitionWithPermissions?.length;
                    i++
                ) {
                    const item: ObjectDefinitionWithPermission =
                        subscriptionConfigData?.outputFieldPermission?.objectDefinitionWithPermissions[i];
                    const fieldName = item?.objectDefinition?.fieldName;

                    if (fieldName?.startsWith('schedule')) {
                        if (fieldName && fieldName in fieldMap.schedulePermissions) {
                            const scheduleKey = fieldName as keyof typeof fieldMap.schedulePermissions;
                            const permissionKey = fieldMap.schedulePermissions[
                                scheduleKey
                            ] as keyof typeof fieldPermissions.schedulePermissions;
                            fieldPermissions.schedulePermissions[permissionKey] =
                                (item.permission && item.permission & Constants.PERMISSION_CODE.MODIFY) ===
                                Constants.PERMISSION_CODE.MODIFY;
                        }
                    } else {
                        if (fieldName && fieldName in fieldMap && typeof fieldName === 'string') {
                            const key = fieldName as keyof typeof fieldMap;
                            const permissionKey = fieldMap[key];
                            if (typeof permissionKey === 'string' && permissionKey in fieldPermissions) {
                                (fieldPermissions[permissionKey as keyof typeof fieldPermissions] as boolean) =
                                    (item.permission && item.permission & Constants.PERMISSION_CODE.MODIFY) ===
                                    Constants.PERMISSION_CODE.MODIFY;
                            }
                        }
                    }
                }
            }

            setFieldEditPermission(fieldPermissions);
        }
    }, [loadingFlags.loadingSubscriptionConfigData, subscriptionConfigData]);

    const handleUpdate = React.useCallback(
        (fieldsToUpdate: Info, formValid: boolean) => {
            if (!isEmpty(fieldsToUpdate)) {
                setFormValid(formValid);
                setConfirmExit(true);
                setInfo((prev) => {
                    return { ...prev, ...fieldsToUpdate };
                });
                if (!isCreate) {
                    setReadyForSubmit(true);
                }
            }
        },
        [confirmExit]
    );

    const handleScheduleSettingsChange = (newValue: CronTabValue, isValid: boolean) => {
        setScheduleSettings(newValue);
        setScheduleSettingsValid(isValid);
        setConfirmExit(true);
        if (!isCreate && isValid) {
            setReadyForSubmit(true);
        }
    };

    const handleSubmit = useCallback(() => {
        if (!services) return;
        const results = convertToSubmit(details, subscriptionConfigData?.details);
        const changeScheduleSettings = compareChangedFieldsDeep(
            oldScheduleType,
            convertScheduleSettings(scheduleSettings)
        );
        const input: SubscriptionConfigRequestGqlInput = {
            ...info,
            ...(changeScheduleSettings && {
                ...convertScheduleSettings(scheduleSettings),
            }),
            ...(results.isChangeNotificationConfigDetails && {
                subscriptionConfigDetails: results.result,
            }),
        };
        isCreate
            ? setLoadingFlags({ ...loadingFlags, loadingCreate: true })
            : setLoadingFlags({ ...loadingFlags, loadingUpdate: true });

        return isCreate
            ? services
                  ?.createSubscriptionConfig({
                      input: input,
                  })
                  .then(() => {
                      snackbar('success');
                  })
                  .catch(() => {
                      snackbar('error');
                  })
                  .finally(() => setLoadingFlags({ ...loadingFlags, loadingCreate: false }))
            : services
                  ?.updateSubscriptionConfig({
                      input: input,
                      id: subscriptionConfigId,
                  })
                  .then(() => {
                      snackbar('success');
                  })
                  .catch(() => {
                      snackbar('error');
                  })
                  .finally(() => setLoadingFlags({ ...loadingFlags, loadingUpdate: false }));
    }, [details, subscriptionConfigId, info, scheduleSettings]);

    const SubscriptionConfig = useMemo(() => {
        let result = {
            info: {
                objectType: String(objectTypeCodes?.[0]?.value),
                status: true,
            } as Info,
            details: [] as Detail[],
        };
        if (!isCreate && subscriptionConfigData && !loadingFlags.loadingSubscriptionConfigData) {
            result = {
                info: {
                    objectType: subscriptionConfigData?.objectType,
                    name: subscriptionConfigData?.name,
                    status: subscriptionConfigData?.status,
                },
                details: [] as Detail[],
            };
        }
        return result;
    }, [subscriptionConfigData, loadingFlags.loadingSubscriptionConfigData, isCreate]);

    const handleUpdateConfigDetails = (details: Detail[]) => {
        setDetails(details);
        setConfirmExit(true);

        if (!isCreate) {
            setReadyForSubmit(true);
        }
    };

    const handleClickTestingTool = (detail: Detail) => {
        setOpenTestingTool(true);
        const configDetailInputs = convertToSubmit([detail], subscriptionConfigData?.details).result?.filter(
            (e) => e?.value
        );
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

    const handleTestingChanged = (newData: TestingDataInput) => {
        setTestingDataInput(newData);
    };

    return (
        <ClassicDrawer
            title={isCreate ? t('SubscriptionConfig.Create') : t('SubscriptionConfig.Edit')}
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
            childrenWrapperStyle={{ padding: 0 }}
            disableButtonSubmit={!readyForSubmit || details.length === 0}
        >
            <>
                {isCreate || (!loadingFlags.loadingSubscriptionConfigData && !isEmpty(SubscriptionConfig.info)) ? (
                    <DataForm
                        fields={[
                            {
                                fieldName: 'objectType',
                                type: FIELD_TYPE.SELECT,
                                label: t('Filter.ObjectType'),
                                required: true,
                                options:
                                    objectTypeCodes?.map((item) => ({
                                        value: String(item.value),
                                        text: item.key,
                                    })) ?? [],
                                inputProps: { readOnly: !isCreate ? true : false },
                            },
                            {
                                fieldName: 'name',
                                type: FIELD_TYPE.TEXT,
                                label: t('Common.Name'),
                                required: true,
                                length: 200,
                                inputProps: { readOnly: !isCreate ? !fieldEditPermission.name : false },
                            },
                            {
                                fieldName: 'status',
                                type: FIELD_TYPE.CHECKBOX,
                                label: t('Common.Active'),
                            },
                        ]}
                        oldValue={SubscriptionConfig.info}
                        onUpdate={handleUpdate}
                    />
                ) : (
                    <CircularProgress />
                )}

                {loadingFlags.loadingSubscriptionConfigData ? (
                    <CircularProgress />
                ) : (
                    <ScheduleSettings
                        value={scheduleSettings}
                        onChange={handleScheduleSettingsChange}
                        schedulePermissions={
                            !isCreate ? fieldEditPermission.schedulePermissions : DEFAULT_SCHEDULE_FREE_PERMISSION
                        }
                    />
                )}

                <SubscriptionConfigAddFilter
                    notificationConfigDetailPermissions={
                        !isCreate ? fieldEditPermission.subscriptionConfigDetails : true
                    }
                    notificationConfigDetails={details}
                    users={userData || []}
                    groups={groupData || []}
                    templates={(templateData as NotificationTemplates[]) || []}
                    loading={
                        loadingFlags.objectFiltersLoading ||
                        loadingFlags.userLoading ||
                        loadingFlags.groupLoading ||
                        loadingFlags.templateLoading
                    }
                    objectFilters={
                        (objectFiltersData?.filter(
                            (item) => item.objectTypeCode === (subscriptionConfigData?.objectType ?? info.objectType)
                        ) || []) as ObjectFilter[]
                    }
                    onSubmitData={(newValue: Detail[]) => {
                        handleUpdateConfigDetails(newValue);
                    }}
                    onValid={(valid: boolean) => setDetailsValid(valid)}
                    onClickTesting={handleClickTestingTool}
                />

                {openTestingTool && (
                    <TestingTool
                        testingDataInput={testingDataInput}
                        disabled={isEmpty(info.objectType)}
                        onChange={handleTestingChanged}
                        onClose={() => setOpenTestingTool(false)}
                    />
                )}
            </>
        </ClassicDrawer>
    );
};
export default CreateOrEdit;
