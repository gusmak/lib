import { useTranslation } from 'react-i18next';
import { Grid, Typography, Paper } from '@mui/material';

export default function FunctionGrid() {
    const { t } = useTranslation();

    const functionList = [
        {
            id: 1,
            name: 'exist',
            params: [
                {
                    id: 1,
                    name: 'fieldDefinition',
                    type: 'string',
                },
            ],
            returnType: 'void',
            description: t('Template.FunctionDescription.exist'),
        },
        {
            id: 2,
            name: 'now',
            params: [],
            returnType: 'Date',
            description: t('Template.FunctionDescription.now'),
        },
        {
            id: 3,
            name: 'dateToString',
            params: [
                {
                    id: 1,
                    name: 'date',
                    type: 'Date',
                },
                {
                    id: 2,
                    name: 'format',
                    type: 'string | null',
                },
            ],
            returnType: 'string',
            description: t('Template.FunctionDescription.dateToString'),
        },
        {
            id: 4,
            name: 'count',
            params: [
                {
                    id: 1,
                    name: 'arr',
                    type: 'Array',
                },
            ],
            returnType: 'number',
            description: t('Template.FunctionDescription.count'),
        },
        {
            id: 5,
            name: 'any',
            params: [
                {
                    id: 1,
                    name: 'arr',
                    type: 'Array',
                },
                {
                    id: 2,
                    name: 'conditions',
                    type: '(Object) => boolean | null',
                },
            ],
            returnType: 'boolean',
            description: t('Template.FunctionDescription.any'),
            example: t('Template.FunctionExample.any'),
        },
    ];

    return (
        <Grid
            container
            sx={{
                flexGrow: 1,
                padding: (theme) => theme.spacing(3),
            }}
        >
            <Grid size={{ xs: 12 }} component={Paper} sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {t('Template.Label.FunctionList')}
                </Typography>
                <Grid container sx={{ mt: 2 }}>
                    {functionList.map((func, index) => {
                        return (
                            <Grid key={func.id} size={{ xs: index === functionList.length - 1 ? 12 : 6 }} sx={{ p: 1 }}>
                                <Typography variant="body1">
                                    <code>
                                        <b>{func.name}</b>
                                        <b>(</b>
                                        {func.params.map((param, index) => {
                                            return (
                                                <span key={param.id}>
                                                    <i>{param.name}</i>: {param.type}
                                                    {index < func.params.length - 1 && ', '}
                                                </span>
                                            );
                                        })}
                                        <b>): </b>
                                        {func.returnType}
                                    </code>
                                    <br />
                                    {func.description}
                                    <br />
                                    <code style={{ fontStyle: 'italic' }}>{func.example}</code>
                                </Typography>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
}
