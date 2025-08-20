import { ChartTypeAfterUpdate } from './types';
import { getOrCreateLegendList } from './utils';

export const htmlLegendPlugin = {
    id: 'htmlLegend',
    afterUpdate(chart: ChartTypeAfterUpdate, _args: unknown, options: { containerID: string }) {
        const ul = getOrCreateLegendList(options.containerID);

        // Remove old legend items
        while (ul.firstChild) {
            ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart?.options?.plugins?.legend?.labels?.generateLabels(chart);

        items.forEach((item) => {
            const li = document.createElement('li');
            li.style.alignItems = 'center';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.flexDirection = 'row';
            li.style.marginLeft = '10px';

            li.onclick = () => {
                const { type } = chart.config;
                if (type === 'pie' || type === 'doughnut') {
                    // Pie and doughnut charts only have a single dataset and visibility is per item
                    chart.toggleDataVisibility(item.index);
                } else {
                    chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                }
                chart.update();
            };

            // Color box
            const boxSpan = document.createElement('div');
            boxSpan.style.background = item.fillStyle;
            boxSpan.style.borderColor = item.strokeStyle;
            boxSpan.style.borderWidth = item.lineWidth + 'px';
            boxSpan.style.display = 'inline-block';
            boxSpan.style.flexShrink = '0';
            boxSpan.style.height = '15px';
            boxSpan.style.marginRight = '15px';
            boxSpan.style.width = '15px';
            if (item?.lineWidth) {
                boxSpan.setAttribute('class', 'point');
            }
            if (item?.pointStyle === 'circle') {
                boxSpan.style.borderRadius = '20px';
            }

            // Text
            const textContainer = document.createElement('p');
            textContainer.style.color = item.fontColor;
            textContainer.style.margin = '0';
            textContainer.style.padding = '0';
            textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

            const text = document.createTextNode(item.text);
            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            ul.appendChild(li);
        });
    },
};
