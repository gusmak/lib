/* eslint-disable array-callback-return */
import { write, utils, WorkBook, WorkSheet, Range, ColInfo } from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

export interface DataSet {
    columns: string[];
    data: any[];
    /** How many cells to skips from left */
    xSteps?: number;
    /** How many rows to skips from last data */
    ySteps?: number;
}

export const download = (fileName: string, workbook: WorkBook) => {
    const wbout = write(workbook, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'binary',
    });

    saveAs(
        new Blob([strToArrBuffer(wbout)], {
            type: 'application/octet-stream',
            //type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }),
        `${fileName}.xlsx`
    );
};

const strToArrBuffer = (s: string) => {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);

    for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff;
    }

    return buf;
};

export const downloadWithDataSet = (fileName: string, dataSet: DataSet[], mergeConfigs: any = []) => {
    const wb: WorkBook = {
        SheetNames: ['Sheet1'],
        Sheets: {},
    };

    wb.Sheets['Sheet1'] = excelSheetFromDataSet(dataSet, mergeConfigs);
    download(fileName, wb);
};

const excelSheetFromDataSet = (dataSet: DataSet[], mergeConfigs: Range[]) => {
    /*
    Assuming the structure of dataset
    {
        xSteps?: number; //How many cells to skips from left
        ySteps?: number; //How many rows to skips from last data
        columns: [array | string]
        data: [array_of_array | string|boolean|number | CellObject]
        fill, font, numFmt, alignment, and border
    }
     */
    if (dataSet === undefined || dataSet.length === 0) {
        return {};
    }

    var ws: WorkSheet = {};
    var range: Range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    var rowCount = 0;

    dataSet.forEach((dataSetItem) => {
        var columns = dataSetItem.columns;
        var xSteps = typeof dataSetItem.xSteps === 'number' ? dataSetItem.xSteps : 0;
        var ySteps = typeof dataSetItem.ySteps === 'number' ? dataSetItem.ySteps : 0;
        var data = dataSetItem.data;
        if (dataSet === undefined || dataSet.length === 0) {
            return;
        }

        rowCount += ySteps;

        if (columns.length >= 0) {
            columns.forEach((col, index) => {
                var cellRef = utils.encode_cell({
                    c: xSteps + index,
                    r: rowCount,
                });
                fixRange(range, 0, 0, rowCount, xSteps, ySteps);
                getCell(col, cellRef, ws);
            });

            rowCount += 1;
        }

        for (var R = 0; R !== data.length; ++R, rowCount++) {
            for (var C = 0; C !== data[R].length; ++C) {
                var cellRef = utils.encode_cell({ c: C + xSteps, r: rowCount });
                fixRange(range, R, C, rowCount, xSteps, ySteps);
                getCell(data[R][C], cellRef, ws);
            }
        }
    });

    if (range.s.c < 10000000) {
        ws['!ref'] = utils.encode_range(range);
    }

    // set column width
    ws['!cols'] = setColumnWidth(dataSet);
    ws['!merges'] = mergeConfigs;

    return ws;
};

/**
 * set column width
 */
function setColumnWidth(dataSet: DataSet[]) {
    let columnWidths: ColInfo[] = [];

    // set colum width
    if (dataSet) {
        for (var i = 0; i < dataSet.length; i++) {
            const data = dataSet[i];
            const columns = data.columns;

            if (columns) {
                for (var j = 0; j < columns.length; j++) {
                    // const column = columns[j];

                    // if (column.widthPx) {
                    //     columnWidths.push({
                    //         wpx: column.widthPx,
                    //     });
                    //     continue;
                    // }

                    // if (column.widthCh) {
                    //     columnWidths.push({
                    //         wpx: column.widthCh,
                    //     });
                    //     continue;
                    // }

                    columnWidths.push({
                        wpx: 64, // 64px is default column width in excel
                    });
                }
            }
        }
    }

    return columnWidths;
}

function getCell(v: any, cellRef: string, ws: WorkSheet) {
    if (v === null) {
        return;
    }
    if (typeof v === 'number') {
        ws[cellRef] = {
            v: v,
            t: 'n',
        };
    } else if (typeof v === 'boolean') {
        ws[cellRef] = {
            v: v,
            t: 'b',
        };
    } else if (v instanceof Date) {
        ws[cellRef] = {
            v: v,
            t: 'd',
        };
    } else if (typeof v === 'object') {
        ws[cellRef] = {
            v: v.value,
            t: 'n',
            s: v.style,
        };
    } else {
        ws[cellRef] = {
            v: v,
            t: 's',
        };
    }
}

function fixRange(range: Range, R: number, C: number, rowCount: number, xSteps: number, _ySteps: number) {
    if (range.s.r > R + rowCount) {
        range.s.r = R + rowCount;
    }

    if (range.s.c > C + xSteps) {
        range.s.c = C + xSteps;
    }

    if (range.e.r < R + rowCount) {
        range.e.r = R + rowCount;
    }

    if (range.e.c < C + xSteps) {
        range.e.c = C + xSteps;
    }
}

export interface DataExportEntity {
    multipleSheet?: boolean;
    fileName?: string;
    sheetsData?: {};
    rowHeader?: ({ key: string; header: { id: string; label: string }[] } | undefined)[];
}

export const handleExportExcel = (dataExport: DataExportEntity | undefined) => {
    const workbook = new ExcelJS.Workbook();
    dataExport?.rowHeader?.map((sheetItem: any, _sheetIndex: any) => {
        const worksheet = workbook.addWorksheet(`Sheet ${sheetItem?.key}`);
        const headerRows: any = [];
        sheetItem?.header?.map((column: any) => {
            headerRows.push(column.label as string);
        });
        worksheet.addRow(headerRows);
        // @ts-ignore
        const objKey = Object.keys(dataExport?.sheetsData).find((key) => key === sheetItem?.key);
        // @ts-ignore
        dataExport?.sheetsData[objKey]?.map((data: any, index: number) => {
            const row: any = [];
            sheetItem?.header?.map((headCellItem: any) => {
                if (data?.[headCellItem?.id] === null) row.push('Không xác định');
                else row.push(data?.[headCellItem?.id]);
            });
            worksheet.addRow(row);
        });
    });
    workbook.xlsx.writeBuffer().then((xls64) => {
        const a = document.createElement('a');
        const data = new Blob([xls64], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(data);
        a.href = url;
        a.download = `${dataExport?.fileName}`;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    });
};
