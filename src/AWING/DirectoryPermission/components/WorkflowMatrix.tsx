import { useTranslation } from 'react-i18next';
import { Grid, Typography, Checkbox, Box } from '@mui/material';
import { ArrowRightAlt } from '@mui/icons-material';
import { getMatrixRows } from '../utils';
import { Workflow, WorkflowMatrix } from '../types';

export type Matrix = {
    id: number;
    stateStart?: WorkflowMatrix['stateStart'];
    stateEnd?: WorkflowMatrix['stateEnd'];
    explicitChecked: boolean;
    inheritChecked: boolean;
};

export type OwnProps = {
    workflow: Workflow;
    explicitMatrices: number[];
    inheritMatrices: number[];
    onMatrixPermissionsChange: (newValue: number[]) => void;
};

export default function Container(props: OwnProps) {
    const { t } = useTranslation();
    const { workflow, explicitMatrices, inheritMatrices, onMatrixPermissionsChange } = props;

    const handleMatrixPermissionsChange = (id?: number) => {
        if (id !== undefined) {
            const temp = Object.assign([], explicitMatrices);
            onMatrixPermissionsChange(temp.includes(id) ? temp.filter((t) => t !== id) : [...temp, id]);
        }
    };

    return (
        <Grid size={{ xs: 12 }} sx={{ marginTop: 8 }}>
            <Grid container sx={{ paddingBottom: 2 }}>
                <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Typography
                        component="p"
                        sx={{
                            marginBottom: 1,
                            fontWeight: '500',
                        }}
                    >
                        {t('DirectoryManagement.WorkflowMatrixPermissions')}
                    </Typography>
                </Grid>
            </Grid>
            {getMatrixRows(workflow, explicitMatrices, inheritMatrices).map((matrix) => {
                return (
                    <Box
                        key={`matrix-${matrix.id}`}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Checkbox checked={matrix.inheritChecked} disabled />
                        <Checkbox
                            checked={matrix.explicitChecked}
                            onChange={() => {
                                handleMatrixPermissionsChange(matrix.id);
                            }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {matrix.stateStart}
                        </Typography>
                        <ArrowRightAlt style={{ margin: '0px 24px' }} />
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {matrix.stateEnd}
                        </Typography>
                    </Box>
                );
            })}
        </Grid>
    );
}
