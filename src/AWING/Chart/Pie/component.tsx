import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    ArcElement,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    TimeScale,
    Tooltip,
} from 'chart.js';

import { updateObjectFields } from 'Helpers/collection';
import { Pie } from 'react-chartjs-2';
import { IPieContainer } from '../Types';
import { labelCallback, titleCallback } from './utils';
import { chartColorDefaults } from './constants';

ChartJS.register(
    LinearScale,
    ArcElement,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    TimeScale
);

const PieComponent = ({
    data,
    widthChart = 300,
    heightChart = 300,
    optionCustom = {},
    options = {
        responsive: true,
        elements: {
            arc: {
                borderWidth: 0,
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 14,
                        family: "'Roboto', sans-serif",
                        lineHeight: 1.5,
                    },
                },
            },
            tooltip: {
                mode: 'index',
                position: 'nearest',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                borderColor: '#e3e3e3',
                borderWidth: 1,
                bodyColor: '#263238',
                padding: 12,
                bodySpacing: 8,
                bodyFont: {
                    size: 14,
                    family: "'Roboto', sans-serif",
                    lineHeight: 1.5,
                },
                callbacks: {
                    label: labelCallback,
                    title: titleCallback,
                },
            },
        },
    },
}: IPieContainer) => {
    const dataConvert = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: chartColorDefaults.slice(0, data?.datasets[0]?.data?.length),
                borderColor: 'white',
                borderWidth: 2,
            },
        ],
    };
    return (
        <Pie
            data={updateObjectFields(dataConvert, data)}
            width={widthChart}
            height={heightChart}
            options={updateObjectFields(options, optionCustom)}
        />
    );
};

export default PieComponent;
