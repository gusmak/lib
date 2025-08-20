export interface ChartTypeAfterUpdate {
    options: {
        plugins: {
            legend: {
                labels: {
                    generateLabels: (chart: ChartTypeAfterUpdate) => {
                        text: string;
                        fillStyle: string;
                        strokeStyle: string;
                        lineWidth: number;
                        hidden: boolean;
                        index: number;
                        datasetIndex: number;
                        type: string;
                        pointStyle: string;
                        fontColor: string;
                        dataset: { label: string };
                    }[];
                };
            };
        };
    };
    config: {
        type: string;
    };
    toggleDataVisibility: (index: number) => void;
    setDatasetVisibility: (datasetIndex: number, visible: boolean) => void;
    isDatasetVisible: (datasetIndex: number) => boolean;
    update: () => void;
}
