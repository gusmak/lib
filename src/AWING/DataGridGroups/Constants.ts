import moment from 'moment';

export const initDate = {
    startDate: {
        nanos: 0,
        seconds: moment().startOf('month').unix(),
    },
    endDate: {
        nanos: 0,
        seconds: moment().startOf('month').unix(),
    },
};

export const ParentGroupKeyRoot = 'root';

/* Pagination default */
export const initPage = { pageSize: 10, pageIndex: 0 };
/* Transfer key */
export const DATA_TRANSFER_DRAG_DROP = 'drag_drop_able';
