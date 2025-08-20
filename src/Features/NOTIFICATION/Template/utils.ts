import { DataObject } from 'Features/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RefObject } from 'react';


export const containsHtmlTags = (str: string): boolean => {
    const htmlTagPattern = /<\/?[^>]+>|[<>]/;
    return htmlTagPattern.test(str);
};

export const convertHtmlStringToElement = (htmlString: string): HTMLElement => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const wrapper = document.createElement('div');
    wrapper.innerHTML = doc.documentElement.outerHTML;

    return wrapper;
};

export const previewTemplate = async (htmlString: string, previewElementRef: RefObject<HTMLIFrameElement | null>) => {
    const element = convertHtmlStringToElement(htmlString);
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '1024px';

    try {
        document.body.appendChild(tempContainer);
        tempContainer.appendChild(element);

        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 6;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const contentWidth = pageWidth - 2 * margin;
        const contentHeight = pageHeight - 2 * margin;
        let currentY = margin;
        let isFirstElement = true;

        const processElement = async (element: HTMLElement) => {
            const tagName = element.tagName.toLowerCase();

            if (tagName === 'style') {
                return;
            }

            if (tagName === 'tbody') {
                const trElements = Array.from(element.children).filter(
                    (child) => child instanceof HTMLElement && child.tagName.toLowerCase() === 'tr'
                ) as HTMLElement[];

                for (const tr of trElements) {
                    const trCanvas = await html2canvas(tr, {
                        logging: false,
                    });

                    const trHeight = tr.offsetHeight * (contentWidth / tr.offsetWidth);

                    if (!isFirstElement && currentY + trHeight >= contentHeight) {
                        pdf.addPage();
                        currentY = margin;
                    }
                    isFirstElement = false;

                    const imgData = trCanvas.toDataURL('image/png');

                    pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, trHeight);

                    currentY += trHeight;
                }
                return;
            }

            const children = Array.from(element.children);
            for (const child of children) {
                if (child instanceof HTMLElement) {
                    await processElement(child);
                }
            }
        };

        await processElement(element);

        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        if (previewElementRef && previewElementRef.current) {
            previewElementRef.current.src = url;
        }
    } catch (error) {
        console.error('Error processing PDF:', error);
    } finally {
        document.body.removeChild(tempContainer);
    }
};

export const checkValid = (currentObjectFilterInput: DataObject | null) => {
    if (currentObjectFilterInput) {
        const isEmailChannelType = Object.entries(currentObjectFilterInput).some(
            ([key, value]) => key === 'channelType' && value === 'EMAIL'
        );

        const filteredEntries = isEmailChannelType
            ? Object.entries(currentObjectFilterInput)
            : Object.entries(currentObjectFilterInput).filter(([key]) => key !== 'title');

        return filteredEntries.every(([_key, value]) => value);
    }
    return false;
};
