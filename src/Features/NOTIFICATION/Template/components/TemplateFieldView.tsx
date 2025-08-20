import { Grid, Typography } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view';
import { type ConvertObjectDefinition } from 'Features/SYSTEM/Schema';

type TemplateFieldViewProps = {
    fieldInfo: ConvertObjectDefinition;
};

export default function TemplateFieldView(props: TemplateFieldViewProps) {
    const { fieldInfo } = props;
    return fieldInfo.fieldPath ? (
        <Grid size={{ xs: 12 }}>
            <TreeItem
                itemId={fieldInfo.fieldPath}
                label={
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            opacity: fieldInfo.isDisable ? '0.5' : '1',
                        }}
                    >
                        <Typography>{fieldInfo.fieldName}</Typography>
                    </div>
                }
            >
                {fieldInfo?.childs?.map((c, index) => <TemplateFieldView key={index} fieldInfo={c} />)}
            </TreeItem>
        </Grid>
    ) : null;
}
