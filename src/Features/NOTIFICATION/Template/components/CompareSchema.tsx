import { Grid, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { convertToTreeData } from 'Features/SYSTEM/Schema/utils';
import { useGetContext } from '../context';
import Fields from './Fields';
import type { ObjectDefinition } from '../types';

type CompareSchemaProps = {
    fields: ObjectDefinition[];
};

export default function CompareSchema(props: CompareSchemaProps) {
    const { t } = useTranslation();
    const { fields } = props;
    const { objectTypeCodes } = useGetContext();

    const treeDatas = convertToTreeData(
        fields.map((ob) => ({
            ...ob,
            fieldName: (ob.fieldName ?? '').charAt(0).toUpperCase() + (ob.fieldName ?? '').slice(1),
            isEnable: true,
            isReadOnly: false,
            schemaDetails: [],
        }))
    );

    const getLabelByValue = (value: string) => {
        // const itemValue = Object.values(ObjectTypeCodeMap).find((objectTypeCodeValue) => objectTypeCodeValue === value);
        const itemValue = objectTypeCodes?.find((item) => item.key === value);
        return itemValue ? itemValue.value.toString() : value;
    };

    return (
        <Grid
            container
            sx={{
                flexGrow: 1,
                p: '0 24px',
            }}
        >
            <Grid size={{ xs: 12 }} component={Paper} sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {t('NotificationTemplate.Schema')}
                </Typography>
                <Grid container mt={2}>
                    <Fields treeDatas={treeDatas} label={fields[0]?.objectTypeCode ? getLabelByValue(fields[0]?.objectTypeCode) : ''} />
                </Grid>
            </Grid>
        </Grid>
    );
}
