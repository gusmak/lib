import moment, { type Moment } from 'moment';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
    CustomDateRangePicker_panel: {
        display: 'flex',
        boxSizing: 'border-box',
        flexDirection: 'column',
        padding: '0 8px 11px 22px',
        marginTop: '18px',
    },

    CustomDateRangePicker_button: {
        border: '1px solid',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(117, 117, 117)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgb(228, 231, 231)',
        borderImage: 'initial',
        borderRadius: '3px',
        padding: '6px',
        marginBottom: '13px',
        '&:active': {
            outline: 'none',
            borderColor: '#ed1d25',
        },
        '&:focus': {
            outline: '0',
        },
    },

    CustomDateRangePicker_button__selected: {
        color: 'rgb(255, 255, 255)',
        background: '#ed1d25',
    },

    CustomPickerSelected: {
        '& .CalendarDay__selected_span': {
            background: 'rgb(240, 74, 80) !important',
            border: '1px double rgb(240, 74, 80) !important',
            color: 'rgb(255, 255, 255) !important',
        },
        '& .CalendarDay__selected': {
            background: 'rgb(237, 29, 37) !important',
            border: '1px double rgb(237, 29, 37) !important',
            color: 'rgb(255, 255, 255)!important',
        },
        '& .CalendarDay__selected:hover': {
            background: 'rgb(237, 29, 37) !important',
            color: '#ffffff',
        },
        '& .CalendarDay__hovered_span:hover,.CalendarDay__hovered_span': {
            background: 'rgb(240, 74, 80) !important',
            border: '1px double rgb(240, 74, 80) !important',
            color: '#ffffff',
        },
    },
});

export const getFormatByLanguage = (i18n: any) => {
    let format = 'DD/MM/YYYY';
    switch (i18n?.language) {
        case 'en':
            format = 'MM/DD/YYYY';
            break;

        case 'id':
            format = 'DD/MM/YYYY';
            break;

        case 'vi':
            format = 'DD/MM/YYYY';
            break;
    }

    return format;
};

export const useFormatDateByLanguage = (date: Moment | null, i18n: any) => {
    let format = getFormatByLanguage(i18n);

    return moment(date).format(format);
};
