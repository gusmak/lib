import { useTranslation } from 'react-i18next';
import { Workflow, StateType } from '../types';
import { DataForm, FIELD_TYPE } from 'AWING';

interface Props {
    formData: StateType<Workflow>;
    onUpdateFormValid: (formData: StateType<Workflow>, isValid: boolean, key: string) => void;
    objectTypeCodeMap: { value: string; label: string }[];
}

export default function Information(props: Props) {
    const { t } = useTranslation();
    const { formData, onUpdateFormValid, objectTypeCodeMap } = props;

    return (
        <DataForm
            fields={[
                {
                    fieldName: 'name',
                    type: FIELD_TYPE.TEXT,
                    label: t('Workflow.Name'),
                    required: true,
                    length: 200,
                    inputProps: {
                        'data-testid': 'workflow-information-name',
                    },
                },
                {
                    fieldName: 'objectTypeCode',
                    type: FIELD_TYPE.SELECT,
                    label: t('Workflow.ObjectTypeCode'),
                    required: true,
                    options: objectTypeCodeMap.map((item) => ({
                        value: item.value as any,
                        text: item.label,
                    })),
                    inputProps: {
                        'data-testid': 'workflow-information-objectTypeCode',
                    },
                },
                {
                    fieldName: 'stateFieldName',
                    type: FIELD_TYPE.TEXT,
                    label: t('Workflow.StateFieldName'),
                    required: true,
                    inputProps: {
                        'data-testid': 'workflow-information-stateFieldName',
                    },
                },
                {
                    fieldName: 'description',
                    type: FIELD_TYPE.TEXT_AREA,
                    label: t('Workflow.Description'),
                    length: 500,
                    inputProps: {
                        'data-testid': 'workflow-information-description',
                    },
                },
            ]}
            oldValue={formData}
            onUpdate={onUpdateFormValid}
            padding="none"
        />
    );
}
