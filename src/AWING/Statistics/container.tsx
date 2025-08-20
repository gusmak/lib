import { Grid, Paper } from '@mui/material';
import BarLineComponent from '../Chart/BarLine';
import ContentHeader from '../ContentHeader';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { CircularProgress } from '../../AWING';
import { TYPE_CHART } from './Enums';
import { ChartContentProps, IStatisticsProps } from './interface';
import ControlPanels from '../ControlPanels';

const ChartContent = <F,>({ dataChart, configChart, timeline, dataExportExcel, enableExport }: ChartContentProps<F>) => {
    if (configChart?.type === TYPE_CHART.BAR_LINE) {
        return (
            <BarLineComponent
                type="bar"
                dataChart={dataChart}
                optionCustom={configChart?.options}
                timeline={timeline}
                dataExportExcel={dataExportExcel}
                enableExport={enableExport}
            />
        );
    } else {
        //todo: implement PieComponent
        // <PieComponent type={'pie'} data={dataChart} />;
        return <></>;
    }
};

export default function StatisticsContainer<F>({
    title,
    dataChart,
    onChangeQueryInput,
    isLoadings,
    initialFilters,
    configChart,
    timeline,
    children,
    disableView,
    dataExportExcel,
    enableExport
}: IStatisticsProps<F>) {
    return (
        <>
            {title && (
                <>
                    <HelmetProvider>
                        <Helmet>
                            <title>{title}</title>
                        </Helmet>
                    </HelmetProvider>
                    <ContentHeader title={title} />
                </>
            )}

            <Paper sx={{ padding: '1rem' }}>
                <ControlPanels
                    onChangeQueryInput={onChangeQueryInput}
                    initialFilters={initialFilters}
                    isLoadings={isLoadings}
                    disableView={disableView}
                />
                <Grid
                    container
                    size={{ xs: 12 }}
                    justifyContent="center"
                    sx={{
                        marginTop: '1.5rem',
                        width: '100%',
                    }}
                >
                    <Grid size={{ xs: 12 }} className="chart-region">
                        {dataChart?.length > 0 && isLoadings === false ? (
                            <ChartContent
                                dataChart={dataChart}
                                configChart={configChart}
                                timeline={timeline!}
                                dataExportExcel={dataExportExcel}
                                enableExport={enableExport}
                            />
                        ) : (
                            <CircularProgress />
                        )}
                    </Grid>
                    {children && <Grid size={{ xs: 12 }}>{children}</Grid>}
                </Grid>
            </Paper>
        </>
    );
}
