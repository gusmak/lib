import { ChartTypeRegistry, TooltipItem } from 'chart.js';

export const labelCallback = (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) => {
    return ' ' + tooltipItem?.label + ': ' + tooltipItem?.parsed;
};
export const titleCallback = (_tooltipItems: TooltipItem<keyof ChartTypeRegistry>[]) => {
    return '';
};
