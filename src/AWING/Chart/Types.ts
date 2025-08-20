import { ChartProps } from 'react-chartjs-2';
import { ChartOptions, ChartType } from 'chart.js';
import { TimelineType } from './Enums';
import { DataSet } from 'Utils/exportFile';

export interface IChartJsContainer extends Omit<ChartProps, 'data'> {
    width?: number;
    height?: number;
    timeline?: TimelineType;
    optionCustom?: ChartOptions<ChartType>;
    dataChart: any[];
    optionsDefault?: boolean;
    enableExport?: {
        png?: boolean;
        pdf?: boolean;
        excel?: boolean;
        nameFile?: string
    };
    dataExportExcel?: DataSet[];
}

export interface IPieContainer extends Omit<ChartProps, 'type'> {
    widthChart?: number;
    heightChart?: number;
    optionCustom?: ChartOptions<ChartType>;
}
