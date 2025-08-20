import { IChartJsContainer } from '../Types';
import BarLineComponent from './component';

const BarLineChart = (props: IChartJsContainer) => {
    return <BarLineComponent {...props} />;
};

export default BarLineChart;
