import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isNil } from 'lodash';
import { LoadingButton } from '@mui/lab';
import { Science as ScienceIcon } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { formatJSON } from 'Helpers/FormatJSON';
import { useAppHelper } from 'Context';
import { emailValid, Drawer } from 'AWING';
import { processNotificationConfig, processNotificationTemplate, processObjectFilter, computedTestingData, getMessageTitle } from './utils';
import TestingAction from './components/TestingAction';
import TestingInformation from './components/TestingInformation';
import type { TestingToolServices } from './Services';
import type { TestingDataInput, ProcessedData } from './types';

export type NotificationTestingToolProps = {
    testingDataInput: TestingDataInput;
    services?: TestingToolServices;
    disabled?: boolean;
    disabledSubmit?: boolean;
    onChange?: (newData: TestingDataInput) => void;
    onClose?: () => void;
};

export default function TestingTool(props: NotificationTestingToolProps) {
    const { t } = useTranslation();
    const { alert } = useAppHelper();
    const { services, testingDataInput, disabled, onChange, onClose } = props;

    const [loadingTestNotification, setLoadingTestNotification] = useState<boolean>(false);
    const [loadingGetObjectTestJson, setLoadingGetObjectTestJson] = useState<boolean>(false);

    const [isValidForm, setIsValidForm] = useState<boolean>(false);
    const [testingData, setTestingData] = useState<TestingDataInput>({ changedObjectJson: '{}' });
    const [hasEmailChannel, setHasEmailChannel] = useState<boolean>(false);
    const [hasTelegramChannel, setHasTelegramChannel] = useState<boolean>(false);
    const [moduleTitle, setModuleTitle] = useState<string>('');
    const [objectTypeCode, setObjectTypeCode] = useState<string>('');

    const isObjectFilter = !isNil(testingData.objectFilterInput);
    const isNotificationTemplate = !isNil(testingData.templateInput);
    const isNotificationConfig = !isNil(testingData.notificationConfigInput);

    const handleChange = (fieldName: keyof TestingDataInput, newValue: any) => {
        if (fieldName === 'emailReceivers') {
            const emails = newValue.split(',').map((x: string) => x.trim());
            let isValidEmails = emails.every((x: string) => emailValid(x));
            setIsValidForm(isValidEmails);
        } else if (fieldName === 'telegramReceivers') {
            setIsValidForm(newValue && newValue.length > 0);
        }
        setTestingData({ ...testingData, [fieldName]: newValue });
    };

    // Lấy dữ liệu json của đối tượng
    const loadObjectJson = async (objectTypeCode?: string, objectId?: number) => {
        setLoadingGetObjectTestJson(true);
        await services
            ?.getObjectJsonById({
                variables: {
                    objectType: objectTypeCode ?? '',
                    id: Number(objectId) ?? 0,
                },
            })
            .then((data) => {
                if (data) {
                    const json = formatJSON(data?.testGetObjectJsonById?.message);
                    setLoadingGetObjectTestJson(false);
                    setTestingData((e) => {
                        return { ...e, oldObjectJson: json };
                    });
                }
            });
    };

    const callBack = () => {
        alert(t('Common.InvalidData'), t('Common.Error'));
    };

    const handleSubmit = async () => {
        let postDataInput = computedTestingData(testingData, isObjectFilter, isNotificationTemplate, isNotificationConfig, callBack);
        setLoadingTestNotification(true);
        if (postDataInput) {
            await services
                ?.testNotification({
                    variables: {
                        input: postDataInput,
                    },
                })
                .then((data) => {
                    if (data) {
                        let title = getMessageTitle(isObjectFilter, isNotificationTemplate, isNotificationConfig);
                        const message = t(title) + ': ' + data?.testNotification?.message;
                        alert(message, data?.testNotification?.status ? t('Common.Success') : t('Common.Error'));
                        setLoadingTestNotification(false);
                        return;
                    }
                });
        }
    };

    const handleClose = () => {
        onChange && onChange(testingData);
        onClose && onClose();
    };

    // Load và set state dữ liệu ban đầu
    useEffect(() => {
        if (testingDataInput) {
            let processedData: Partial<ProcessedData>;

            if (testingDataInput.objectFilterInput) {
                processedData = processObjectFilter(testingDataInput);
            } else if (testingDataInput.templateInput) {
                processedData = processNotificationTemplate(testingDataInput);
            } else if (testingDataInput.notificationConfigInput) {
                processedData = processNotificationConfig(testingDataInput);
            } else {
                processedData = {
                    moduleTitle: '',
                    objectTypeCode: '',
                    emails: '',
                    telegrams: '',
                    hasEmailChannel: false,
                    hasTelegramChannel: false,
                    formValid: false,
                };
            }

            const newData = {
                ...testingDataInput,
                emailReceivers: testingDataInput.emailReceivers || processedData.emails,
                telegramReceivers: testingDataInput.telegramReceivers || processedData.telegrams,
            };

            setTestingData(newData);
            setModuleTitle(t(processedData.moduleTitle || ''));
            setObjectTypeCode(processedData.objectTypeCode || '');
            setHasEmailChannel(processedData.hasEmailChannel ?? false);
            setHasTelegramChannel(processedData.hasTelegramChannel ?? false);
            setIsValidForm((processedData.formValid ?? false) && (processedData.objectTypeCode?.length ?? 0) > 0);

            loadObjectJson(processedData.objectTypeCode, testingDataInput.objectId);
        }
    }, []);

    return (
        <Drawer
            title={`${t('TestingTool.Title')} - ${moduleTitle}`}
            wrapperStyle={{ width: '70%' }}
            childrenWrapperStyle={{ padding: '24px' }}
            open={true}
            onClose={handleClose}
            customAction={
                <LoadingButton
                    startIcon={<ScienceIcon />}
                    variant="contained"
                    color="primary"
                    loadingPosition="start"
                    onClick={handleSubmit}
                    disabled={!isValidForm || loadingTestNotification || disabled}
                >
                    {t('TestingTool.Submit')}
                </LoadingButton>
            }
        >
            <Grid container sx={{ flexGrow: 1 }}>
                {/* Thông tin thử nghiệm */}
                <TestingInformation
                    testingData={testingData}
                    objectTypeCode={objectTypeCode}
                    isObjectFilter={isObjectFilter}
                    isNotificationTemplate={isNotificationTemplate}
                    isNotificationConfig={isNotificationConfig}
                />

                {/* Dữ liệu thử nghiệm */}
                <TestingAction
                    testingData={testingData}
                    loadingGetObjectTestJson={loadingGetObjectTestJson}
                    loadObjectJson={loadObjectJson}
                    objectTypeCode={objectTypeCode}
                    hasEmailChannel={hasEmailChannel}
                    hasTelegramChannel={hasTelegramChannel}
                    onChange={handleChange}
                />
            </Grid>
        </Drawer>
    );
}
