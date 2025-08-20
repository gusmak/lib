/**
 * Xử lý dữ liệu dạng mảng hoặc object một cách đơn giản và hiệu quả.
 * Tăng cường khả năng thao tác với danh sách dữ liệu.
 */

import { set } from 'lodash';
import moment from 'moment';
import { formatNumberWithLanguage } from '../AWING/helper';
import { AnalyticDataProviderModel } from '../Commons/Types';
import i18next from '../translate/i18n';

export function convertArrayToObject(array: any, keyName: string) {
    return array?.reduce((obj: any, item: any, _index: number) => {
        return {
            ...obj,
            [item[keyName]]: { ...item },
        };
    }, {});
}

export const convertDataSetPattern = (data: AnalyticDataProviderModel[]) => {
    const ctr = data?.map((item) => item.ctr) as number[];
    const numberOfConnections = data?.map((item) => item.click) as number[];
    const impressions = data?.map((item) => item.view) as number[];
    return [
        {
            data: ctr,
            label: i18next.t('Statistics.CTR'),
            type: 'bar',
            color: 'rgb(128, 176, 255)',
        },
        {
            data: numberOfConnections,
            label: i18next.t('Statistics.NumberOfConnections'),
            type: 'line',
            color: 'rgb(0, 85, 184)',
        },
        {
            data: impressions,
            label: i18next.t('Statistics.Impressions'),
            type: 'line',
            color: 'rgb(221, 4, 12)',
        },
    ];
};

export const updateObjectFields = (originalObj: any, changedValues: any) => {
    // Create a copy of the original object
    const updatedObject = { ...originalObj };

    // Recursive function to update nested fields
    const updateNestedFields = (obj: any, changes: any) => {
        for (const [key, value] of Object.entries(changes)) {
            // Check if the field exists in the original object
            if (obj.hasOwnProperty(key)) {
                // If the field is an object, recursively update nested fields
                if (typeof obj[key] === 'object' && typeof value === 'object') {
                    updateNestedFields(obj[key], value);
                } else {
                    // Otherwise, update the field value
                    obj[key] = value;
                }
            } else {
                obj[key] = value;
            }
        }
    };

    // Update nested fields
    updateNestedFields(updatedObject, changedValues);

    return updatedObject;
};

export function formatChartNumber(val: any, language: string) {
    if (!val) return '0';
    if (val === '-') {
        return '-';
    }
    const temp = Math.round(Number(val) * 100) / 100;
    let formatValue = formatNumberWithLanguage(temp as bigint | number | undefined, language);
    return formatValue;
}

export const setObject = <O extends {}>(obj: O, arrKey: Array<keyof O>, value: unknown) => {
    set(
        obj,
        arrKey.reduce((acc, val: any) => acc + '[' + val + ']', ''),
        value
    );
};

//AWING_[NAME FEATURE]_[OBJECT_NAME]_[SUB_TITLE]_[DATEFORMAT yyyy-MM-DD]
export function nameExportStandard(nameFeature?: string, objectName?: string, subTitle?: string): string {
    const currentTime = moment().format('YYYY-MM-DD');
    const parts = [nameFeature, objectName, subTitle, currentTime].filter(Boolean);
    return `AWING_${parts.join('_').toUpperCase()}`;
}

export const formatJSON = (val: string) => {
    try {
        const res = JSON.parse(val);
        return JSON.stringify(res, null, 2);
    } catch {
        return val;
    }
};
