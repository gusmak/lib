import { TimelineType } from '../Chart/Enums';
import { ChartOptions, ChartType } from 'chart.js';
import { ReactNode } from 'react';
import { IControlPanel } from '../ControlPanels';
import { TYPE_CHART } from './Enums';
import { DataSet } from 'Utils/exportFile';
import { IChartJsContainer } from 'AWING/Chart';

export interface IStatisticsProps<F> extends IControlPanel<F> {
    dataChart: {
        label?: string;
        type?: string;
        data: {
            x: string;
            y: number | string;
        }[];
        fill?: boolean;
        pointStyle?: string;
        yAxisID?: string;
        variant?: string;
    }[];
    configChart: IConfigChart;
    title?: string;
    children?: ReactNode;
    timeline?: TimelineType;
    dataExportExcel?: DataSet[];
    enableExport?: {
        png?: boolean;
        pdf?: boolean;
        excel?: boolean;
        nameFile?: string;
    };
}

export interface IConfigChart {
    type: TYPE_CHART;
    options?: ChartOptions<ChartType>;
}

export interface ChartContentProps<F>
    extends Pick<IStatisticsProps<F>, 'dataChart' | 'configChart' | 'dataExportExcel'>,
        Pick<IChartJsContainer, 'enableExport'> {
    timeline: TimelineType;
}
