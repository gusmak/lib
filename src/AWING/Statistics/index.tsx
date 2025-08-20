import { Provider } from 'jotai';
import StatisticsContainer from './container';
import { IStatisticsProps } from './interface';

const StatisticsCommon = <F extends object = object>(props: IStatisticsProps<F>) => {
    return (
        <Provider>
            <StatisticsContainer {...props} />
        </Provider>
    );
};

export default StatisticsCommon;
export * from './Enums';
export * from './interface';
