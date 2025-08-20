import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { Science as ScienceIcon } from '@mui/icons-material';
import TemplateTestingTool from 'Features/NOTIFICATION/components/TestingTool';
import { DataForm, CircularProgress } from 'AWING';
import { ClassicDrawer } from 'Commons/Components';
import { useGetComponentInfo, useTemplateFields, useTemplate, useTemplatePermissions } from './hooks/useCreateOrEdit';
import CompareSchema from './components/CompareSchema';
import FunctionGrid from './components/FunctionGrid';
import TemplateContent from './components/TemplateContent';
import { FormMode } from '../enums';
import { Template } from './types';
import { useGetContext } from './context';
import { useAppHelper } from 'Context/hooks';

export default function CreateOrEdit() {
    const { t } = useTranslation();
    const { mode, templateId } = useGetComponentInfo();
    const { services, objectDefinitions, objectTypeCodes } = useGetContext();

    const [openTestingTool, setOpenTestingTool] = useState<boolean>(false);
    const { snackbar } = useAppHelper();

    const [template, setTemplate] = useState<Template>({});
    const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false);
    const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

    useEffect(() => {
        if (templateId && services) {
            setLoadingTemplate(true);

            services.getTemplateById({ id: templateId }).then((res) => {
                setTemplate(res);
                setLoadingTemplate(false);
            });
        }
    }, [templateId]);

    // Lấy thông tin template
    const {
        testingDataInput,
        templateInput,
        confirmExit,
        handleTestingChanged,
        handleChangeContent,
        handleChangeField,
        readyForSubmit,
        readyForTesting,
    } = useTemplate(mode, template, templateId);

    // Lấy thông tin quyền truy cập của từng field trong form
    const fieldPermissions = useTemplatePermissions(mode, template ?? {});

    // Lấy thông tin các field cần hiển thị trong form
    const fields = useTemplateFields(mode, templateInput, fieldPermissions, template, objectTypeCodes);

    const isShowingDrawerUI = loadingUpdate || loadingTemplate;

    const handleSubmit = async () => {
        // Tạo
        if (services && mode === FormMode.CREATE) {
            setLoadingCreate(true);
            return await services
                .createTemplate({
                    input: { ...templateInput },
                })
                .then(() => {
                    setLoadingCreate(false);
                    snackbar('success');
                })
                .catch((error) => {
                    snackbar('error', error?.message);
                });
        }

        // Sửa
        if (services && templateId) {
            const temp = { ...templateInput };
            if (templateInput?.content != template?.content) {
                temp.content = templateInput?.content;
            }

            setLoadingUpdate(true);
            return await services
                .updateTemplate({
                    id: templateId,
                    input: temp,
                })
                .then(() => {
                    setLoadingUpdate(false);
                    snackbar('success');
                })
                .catch((error) => {
                    snackbar('error', error?.message);
                });
        }
    };

    return (
        <ClassicDrawer
            title={t(`Template.Label.${mode === FormMode.CREATE ? 'Create' : 'Edit'}`)}
            onSubmit={handleSubmit}
            isLoadingButtonSubmit={loadingCreate}
            disableButtonSubmit={!readyForSubmit}
            confirmExit={confirmExit}
            childrenWrapperStyle={{ padding: 0 }}
            otherNodes={
                <>
                    <Button
                        variant="outlined"
                        startIcon={<ScienceIcon />}
                        sx={{ ml: 2, color: '#000000', borderColor: '#000000' }}
                        disabled={!readyForTesting}
                        onClick={() => setOpenTestingTool(true)}
                    >
                        {t('TestingTool.Name')}
                    </Button>
                    {openTestingTool && (
                        <TemplateTestingTool
                            testingDataInput={testingDataInput}
                            disabled={!readyForTesting}
                            onChange={handleTestingChanged}
                            onClose={() => setOpenTestingTool(false)}
                        />
                    )}
                </>
            }
        >
            {isShowingDrawerUI ? (
                <CircularProgress />
            ) : (
                <>
                    <DataForm fields={fields} onUpdate={handleChangeField} oldValue={templateInput} />
                    <CompareSchema
                        fields={
                            objectDefinitions?.filter(
                                (ob) =>
                                    ob.objectTypeCode ===
                                    (templateInput?.objectType?.toUpperCase() || template?.objectType?.toUpperCase())
                            ) || []
                        }
                    />
                    <FunctionGrid />
                    <TemplateContent
                        channelType={templateInput?.channelType || template?.channelType}
                        type={templateInput?.contentType || template?.contentType}
                        value={templateInput?.content ?? ''}
                        onChange={handleChangeContent}
                        contentPermission={mode === FormMode.CREATE || fieldPermissions.content}
                        testingDataInput={testingDataInput}
                    />
                </>
            )}
        </ClassicDrawer>
    );
}
