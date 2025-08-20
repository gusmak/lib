import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import PizZip from 'pizzip';

import { Chart as ChartJS, ChartTypeRegistry, TooltipItem } from 'chart.js';
import { DataSet, downloadWithDataSet } from 'Utils/exportFile';

export const getOrCreateLegendList = (id: string) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer?.querySelector('ul');

    if (!listContainer) {
        listContainer = document.createElement('ul');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'row';
        listContainer.style.margin = '0';
        listContainer.style.padding = '0';

        legendContainer?.appendChild(listContainer);
    }

    return listContainer;
};

export const titleCallback = (tooltipItems: TooltipItem<keyof ChartTypeRegistry>[]) => {
    const timeFormat = (tooltipItems[0].raw as { x: string })?.x;
    const isTimelineHour = timeFormat?.length > 8;
    if (isTimelineHour) {
        const timeText = moment(timeFormat, 'YYYYMMDDHH').format('HH[h] DD-MM-YYYY');
        return 'Hour: ' + timeText;
    } else {
        const timeText = moment(timeFormat, 'YYYYMMDD').format('DD-MM-YYYY');
        return 'Day: ' + timeText;
    }
};

export const labelCallback = (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) => {
    let labels = tooltipItem.dataset.label || '';
    if (labels) {
        labels = labels.split(' ').slice(0, -1).join(' ');
    }
    labels += ': ' + tooltipItem.formattedValue;
    return ' ' + labels;
};

// Hàm xuất file PNG
export const exportToPNG = (chartRef: ChartJS<keyof ChartTypeRegistry>, nameFile?: string) => {
    const chartElement = chartRef?.canvas;
    html2canvas(chartElement!).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${nameFile}.png`;
        link.href = imgData;
        link.click();
    });
};

// Hàm xuất file JPG
export const exportToJPG = (chartRef: ChartJS<keyof ChartTypeRegistry>, nameFile?: string) => {
    const chartElement = chartRef?.canvas;
    if (!chartElement) return;
    html2canvas(chartElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        link.download = `${nameFile}.jpg`;
        link.href = imgData;
        link.click();
    });
};

// Hàm xuất file PDF với tỉ lệ chính xác
export const exportToPDF = (chartRef: ChartJS<keyof ChartTypeRegistry>, nameFile?: string) => {
    const chartElement = chartRef?.canvas;
    html2canvas(chartElement!, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Tạo PDF khổ A4, đơn vị mm

        // Lấy kích thước thực tế của canvas
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Kích thước trang A4 (mm)
        const pageWidth = 210; // Chiều rộng A4
        const pageHeight = 297; // Chiều cao A4
        const margin = 10; // Margin hai bên

        // Tính tỉ lệ để giữ nguyên aspect ratio
        const maxWidth = pageWidth - 2 * margin;
        const maxHeight = pageHeight - 2 * margin;
        let width = imgWidth;
        let height = imgHeight;

        // Điều chỉnh tỉ lệ
        const aspectRatio = imgWidth / imgHeight;
        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }

        // Tính vị trí để căn giữa
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        // Thêm ảnh vào PDF với kích thước đã tính toán
        pdf.addImage(imgData, 'PNG', x, y, width, height);
        pdf.save(`${nameFile}.pdf`);
    });
};

// Hàm xuất file Word
export const exportToWord = async (chartRef: ChartJS<keyof ChartTypeRegistry>) => {
    const chartElement = chartRef?.canvas;

    // Chuyển biểu đồ thành hình ảnh
    const canvas = await html2canvas(chartElement!);
    const imgData = canvas.toDataURL('image/png').split(',')[1]; // Lấy phần base64 thuần

    // Tạo cấu trúc file .docx hợp lệ
    const zip = new PizZip();

    // 1. Thêm [Content_Types].xml
    const contentTypes = `
  <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Default Extension="png" ContentType="image/png"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  </Types>
`;
    zip.file('[Content_Types].xml', contentTypes);

    // 2. Thêm _rels/.rels
    const rels = `
  <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  </Relationships>
`;
    zip.file('_rels/.rels', rels);

    // 3. Thêm word/document.xml
    const document = `
  <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
              xmlns:v="urn:schemas-microsoft-com:vml"
              xmlns:o="urn:schemas-microsoft-com:office:office">
    <w:body>
      <w:p>
        <w:r>
          <w:t>Biểu đồ Doanh thu</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:pict>
            <v:shape style="width:500pt;height:300pt">
              <v:imagedata src="data:image/png;base64,${imgData}"/>
            </v:shape>
          </w:pict>
        </w:r>
      </w:p>
     
    </w:body>
  </w:document>
`;
    zip.file('word/document.xml', document);

    // Tạo file .docx
    const buffer = zip.generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    saveAs(buffer, 'chart_document.docx');
};

// Hàm xuất file Excel
export const exportToExcel = (dataExport: DataSet[], nameFile?: string) => {
    if (dataExport && dataExport?.length > 0) {
        let excelName = `${nameFile}_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
        downloadWithDataSet(excelName, dataExport);
    } else {
        // snackbar('error', 'Không có dữ liệu để xuất file Excel');
    }
};
