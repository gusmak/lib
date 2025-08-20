import { IPieContainer } from '../Types';
import PieComponent from './component';

const PieChart = (props: IPieContainer) => {
    return <PieComponent {...props} />;
};

export default PieChart;
