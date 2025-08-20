import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { Science as ScienceIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import { CircularProgress, DataForm, FIELD_TYPE } from 'AWING';
import { ClassicDrawer } from 'Commons/Components';
import { Constants } from 'Commons/Constant';
import NotificationTestingTool, { type TestingDataInput } from 'Features/NOTIFICATION/components/TestingTool';
import { type DataObject } from 'Features/types';
import { ObjectFilter, ObjectFilterInput } from './types';
import { useGetContext } from './context';
import { defaultObjectFilter } from './Constants';
import { checkValid, getDifferentFieldsValue } from './utils';
import { useAppHelper } from 'Context/hooks';

const CreateOrEdit = () => {
    const { id } = useParams<'id'>();
    const objectFilterId = parseInt(id ?? '');
    const { t } = useTranslation();
    const { services, objectTyeCodes = [], objectConfigTypes = [], logicExpressionsStructure } = useGetContext();

    // State để kiểm tra việc disabled cho nút thử nghiệm
    const [readyToTest, setReadyToTest] = useState(false);
    const [readyForSubmit, setReadyForSubmit] = useState(false);

    // State lưu giá trị để truyền lên API
    // const [objectFilterInput, setObjectFilterInput] = useState<ObjectFilterInput>(defaultObjectFilter);
    const [confirmExit, setConfirmExit] = useState(false);

    // State nhận giá trị khi get API
    const [objectFilter, setObjectFilter] = useState<ObjectFilter>(defaultObjectFilter);
    const [loadingObjectFilter, setLoadingObjectFilter] = useState<boolean>(false);
    const [fieldEditPermission, setFieldEditPermission] = useState<DataObject>({
        configType: false,
        name: false,
        logicalExpression: false,
    });

    const [openTestingTool, setOpenTestingTool] = useState(false);
    const [testingDataInput, setTestingDataInput] = useState<TestingDataInput>({
        objectFilter: defaultObjectFilter,
    });

    const [originalObjectFilter, setOriginalObjectFilter] = useState<ObjectFilter>({});
    const { snackbar } = useAppHelper();

    useEffect(() => {
        if (!!objectFilterId) {
            setLoadingObjectFilter(true);
            services
                ?.getObjectFilterById({
                    id: objectFilterId,
                })
                .then((res) => {
                    const objectFilter = res.objectFilter;
                    setOriginalObjectFilter(objectFilter ?? {});
                    if (objectFilter) {
                        setObjectFilter(objectFilter);
                        setTestingDataInput((e) => {
                            return {
                                ...e,
                                objectFilterInput: objectFilter,
                                objectFilter: objectFilter,
                            };
                        });
                    }
                })
                .finally(() => {
                    setLoadingObjectFilter(false);
                });
        }
    }, []);

    const handleTestingChanged = (newData: TestingDataInput) => {
        setTestingDataInput(newData);
    };

    useEffect(() => {
        if (!isEmpty(objectFilter)) {
            const check = checkValid(objectFilter);

            setReadyForSubmit(!!check);
        }
    }, []);

    useEffect(() => {
        setTestingDataInput((e) => {
            const temp = {
                ...objectFilter,
            };
            return {
                ...e,
                objectFilter: temp,
            };
        });
    }, [objectFilter]);

    const convertToObjectFilterInput = (filter: ObjectFilter): ObjectFilterInput => {
        return {
            configType: filter.configType,
            logicalExpression: filter.logicalExpression,
            name: filter.name,
            objectTypeCode: filter.objectTypeCode,
        };
    };

    const handleSubmit = async () => {
        if (objectFilterId) {
            return await services
                ?.updateObjectFilter({
                    id: objectFilterId,
                    input: getDifferentFieldsValue(
                        convertToObjectFilterInput(originalObjectFilter ?? {}),
                        convertToObjectFilterInput(objectFilter),
                        objectTyeCodes,
                        objectConfigTypes
                    ),
                })
                .then(() => {
                    snackbar('success');
                })
                .catch(() => {
                    snackbar('error');
                });
        } else {
            return await services
                ?.createObjectFilter({
                    input: convertToObjectFilterInput(objectFilter),
                })
                .then(() => {
                    snackbar('success');
                })
                .catch(() => {
                    snackbar('error');
                });
        }
    };

    // Kiểm tra quyền của từng field
    useEffect(() => {
        if (objectFilter && !loadingObjectFilter) {
            const fieldPermissions: DataObject = {};

            const fieldMap: DataObject = {
                configType: 'configType',
                name: 'name',
                logicalExpression: 'logicalExpression',
            };

            if (
                objectFilter.outputFieldPermission?.objectDefinitionWithPermissions &&
                objectFilter.outputFieldPermission?.objectDefinitionWithPermissions?.length > 0
            ) {
                for (let i = 0; i < objectFilter.outputFieldPermission?.objectDefinitionWithPermissions?.length; i++) {
                    const item: DataObject = objectFilter.outputFieldPermission?.objectDefinitionWithPermissions[i];
                    const fieldName = item.objectDefinition.fieldName;

                    if (fieldMap[fieldName]) {
                        fieldPermissions[fieldMap[fieldName]] =
                            (item.permission & Constants.PERMISSION_CODE.MODIFY) === Constants.PERMISSION_CODE.MODIFY;
                    }
                }
            }

            setFieldEditPermission(fieldPermissions);
        }
    }, [loadingObjectFilter, objectFilter, objectFilterId]);

    // Kiểm tra điều kiện để mở/đóng cho nút thử nghiệm
    useEffect(() => {
        if (!isEmpty(testingDataInput.objectFilter)) {
            if (checkValid(testingDataInput.objectFilter)) {
                setReadyToTest(true);
            } else {
                setReadyToTest(false);
            }
        }
    }, [testingDataInput.objectFilter]);

    useEffect(() => {
        if (!objectFilterId && objectTyeCodes?.length > 0 && objectConfigTypes?.length > 0) {
            setObjectFilter((prev) => ({
                ...prev,
                objectTypeCode: String(objectTyeCodes[0]?.value) ?? '',
                configType: String(objectConfigTypes[0]?.value) ?? '',
            }));
        }
    }, [objectTyeCodes, objectConfigTypes]);

    const objectStructuresByObjectTypeCode = useMemo(() => {
        if (objectFilter.objectTypeCode && logicExpressionsStructure?.objectStructures) {
            return logicExpressionsStructure?.objectStructures[objectFilter.objectTypeCode];
        }
    }, [objectFilter]);

    return (
        <ClassicDrawer
            title={objectFilterId ? t('Filter.Edit') : t('Filter.Create')}
            onSubmit={handleSubmit}
            disableButtonSubmit={!readyForSubmit}
            confirmExit={confirmExit}
            childrenWrapperStyle={{ padding: 0 }}
            otherNodes={
                <>
                    <Button
                        variant="outlined"
                        startIcon={<ScienceIcon />}
                        sx={{ ml: 2, color: '#000000', borderColor: '#000000' }}
                        disabled={!readyToTest}
                        onClick={() => setOpenTestingTool(true)}
                    >
                        {t('TestingTool.Name')}
                    </Button>
                    {openTestingTool && (
                        <NotificationTestingTool
                            testingDataInput={testingDataInput}
                            onChange={handleTestingChanged}
                            onClose={() => setOpenTestingTool(false)}
                        />
                    )}
                </>
            }
        >
            {loadingObjectFilter ? (
                <CircularProgress />
            ) : (
                <DataForm
                    fields={[
                        {
                            fieldName: 'objectTypeCode',
                            type: FIELD_TYPE.SELECT,
                            label: t('Filter.ObjectType'),
                            required: true,
                            options: (objectTyeCodes ?? []).map((item) => ({
                                value: item.value.toString(),
                                text: item.key,
                            })),
                            inputProps: { readOnly: !!objectFilterId },
                        },
                        {
                            fieldName: 'configType',
                            type: FIELD_TYPE.SELECT,
                            label: t('Filter.ConfigType'),
                            required: true,
                            options: (objectConfigTypes ?? [])?.map((item) => ({
                                value: item.value.toString(),
                                text: item.key,
                            })),
                            inputProps: {
                                readOnly: !!objectFilterId && !fieldEditPermission.configType,
                            },
                        },
                        {
                            fieldName: 'name',
                            type: FIELD_TYPE.TEXT,
                            label: t('Filter.Name'),
                            required: true,
                            length: 200,
                            inputProps: { readOnly: !!objectFilterId && !fieldEditPermission.name },
                        },
                        {
                            fieldName: 'logicalExpression',
                            type: FIELD_TYPE.LOGIC_EXPRESSION,
                            required: true,
                            label: t('Filter.LogicExpression'),
                            functionStructures: logicExpressionsStructure?.functionStructures ?? [],
                            objectStructures: objectStructuresByObjectTypeCode ?? [],
                            defaultValue: objectFilter.logicalExpression,
                            disabled: !!objectFilterId && !fieldEditPermission.logicalExpression,
                        },
                    ]}
                    oldValue={objectFilter}
                    onUpdate={(obj, formValid, key) => {
                        setConfirmExit(true);
                        let newValue = convertToObjectFilterInput({ ...objectFilter, ...obj });
                        if (!formValid) {
                            setReadyForSubmit(false);
                        } else {
                            if (key === 'objectTypeCode') {
                                newValue = { ...newValue, logicalExpression: '' };
                            }

                            if (checkValid(newValue)) {
                                setReadyForSubmit(formValid);
                            } else setReadyForSubmit(false);
                        }
                        setObjectFilter((prev) => ({ ...prev, ...newValue }));
                    }}
                />
            )}
        </ClassicDrawer>
    );
};

export default CreateOrEdit;
