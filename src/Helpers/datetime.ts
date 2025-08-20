/**
 * Quản lý và xử lý thời gian, ngày tháng một cách tiện lợi và nhất quán.
 * Giảm thiểu lỗi khi thao tác với định dạng ngày giờ.
 */

import { groupBy, orderBy, sumBy, xor } from 'lodash';
import moment from 'moment';
import { TIMELINE_TYPE } from '../Commons/Enums';
import { Timestamp } from '../Commons/Types';

export function dateToString(date: moment.MomentInput) {
    return moment(date).format('L');
}

export function calculatorDirectoryIdRoot(directoriesTree: any) {
    let directoryId = 0;
    let minLevel = Number.POSITIVE_INFINITY;
    directoriesTree.forEach((directory: any) => {
        if (directory.level < minLevel) {
            minLevel = directory.level;
            directoryId = directory.directoryId;
        }
    });
    return directoryId;
}

export const convertTimeLine = (value: number) => {
    let dateTime = '';

    const hour = value.toString().substring(8, 10);
    if (hour) {
        dateTime += `${hour}h `;
    }
    const day = value.toString().substring(6, 8);
    if (day) {
        dateTime += `${day}-`;
    }
    const month = value.toString().substring(4, 6);
    if (month) {
        dateTime += `${month}-`;
    }
    const year = value.toString().substring(0, 4);
    if (year) {
        dateTime += `${year}`;
    }
    //  `${year}-${month}-${day}T${hour}`
    // return moment(dateTime).format("DD-MM").toString()
    return dateTime;
};

export const convertDateTimeToTimestamp = (date: Date): Timestamp => {
    return {
        seconds: date.getTime() / 1000,
        nanos: 0,
    };
};

export const convertTimestampToDateTime = (timestamp: Timestamp) => {
    return moment.unix(Number(timestamp.seconds)).toDate();
};

export const dateTimeToString = (dateTime: Date, format: string) => {
    return moment(dateTime).format(format);
};

export const convertTimelineToDateTime = (timeline: string, timelineType: TIMELINE_TYPE) => {
    let day = Number(timeline.toString().substring(6, 8));
    let month = Number(timeline.toString().substring(4, 6));
    let year = Number(timeline.toString().substring(0, 4));

    if (timelineType === TIMELINE_TYPE.HOUR) {
        let hours = Number(timeline.toString().substring(8, 10));
        return new Date(year, month - 1, day, hours);
    } else return new Date(year, month - 1, day);
};

// format: 'DD/MM/YYYY' => 07/02/2020
export function dateToStringDDMMYYYY(date: any) {
    if (!date) return null;
    const _date = new Date(date);
    // const _language = i18next.language || 'vi';
    const _language = 'en-GB';
    let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return _date.toLocaleDateString(`${_language}`, options as Intl.DateTimeFormatOptions);
}

// format: 'DD/MM/YYYY' => 07/02/2020
export function timestampToStringDDMMYYYY(date?: Timestamp) {
    if (!date) return null;
    // const _date = new Date(date.seconds * 1000);
    return dateToStringDDMMYYYY(new Date(date.seconds * 1000));
}

export const getStartOfDay = (dateTime: Date) => {
    let date = dateTime.getDate();
    let month = dateTime.getMonth();
    let year = dateTime.getFullYear();
    return new Date(year, month, date);
};

export const getToday = () => {
    let result = new Date();
    result.setHours(0);
    result.setMinutes(0);
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
};

export function fillMissingDates(
    data: Array<{ x: string; y: number }>,
    startDate: string | Date | number = '',
    endDate: string | Date | number = '',
    format: string | 'YYYYMMDD' | 'YYYYMMDDHH' = 'YYYYMMDD'
) {
    const result = data.concat();
    // Parse the start and end dates
    const start = moment(isNaN(Number(startDate)) ? startDate : String(startDate)).startOf('day');
    const end = moment(isNaN(Number(endDate)) ? endDate : String(endDate)).endOf('day');
    if (start.isAfter(end)) throw new Error('Start date must be before end date');
    // Array to hold the complete range of dates
    let dates = [];
    // Iterate through the date range
    for (let m = moment(start); m.isSameOrBefore(end); m.add(1, format === 'YYYYMMDD' ? 'days' : 'hours')) {
        dates.push(m.format(format));
    }
    xor(
        data.map((d) => d.x),
        dates
    ).forEach((x) => {
        result.push({ x, y: 0 });
    });

    return orderBy(
        Object.entries(groupBy(result, 'x')).map(([key, value]) => ({
            x: key,
            y: sumBy(value, 'y'),
        })),
        ['x'],
        ['asc']
    );
}

export function parseJSON(str: string) {
    try {
        return JSON.parse(str || '{}');
    } catch (e) {
        return str;
    }
}
