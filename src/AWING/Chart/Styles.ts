import { makeStyles } from '@mui/styles';

export const styledLine = (defaultStyle: any, variant: string, color?: string) => {
    switch (variant) {
        case 'primary':
            return {
                ...defaultStyle,
                ...dataSetCommonStyled.lineStyle.primary,
            };
        case 'secondary':
            return {
                ...defaultStyle,
                ...dataSetCommonStyled.lineStyle.secondary,
            };
        default:
            return getStyle(defaultStyle, 'line', getColorByVariant(variant, color));
    }
};

export const styledBar = (defaultStyle: any, variant: string) => {
    switch (variant) {
        case 'primary':
            return {
                ...defaultStyle,
                ...dataSetCommonStyled.barStyle.primary,
            };
        case 'secondary':
            return {
                ...defaultStyle,
                ...dataSetCommonStyled.barStyle.secondary,
            };
        default:
            return getStyle(defaultStyle, 'bar', getColorByVariant(variant));
    }
};

export const styledLineFill = (defaultStyle: any, variant: string) => {
    switch (variant) {
        case 'primary':
            return {
                ...defaultStyle,
                ...dataSetCommonStyled.lineFillStyle.primary,
            };
        case 'secondary':
            return {
                ...defaultStyle,
                ...dataSetCommonStyled.lineFillStyle.secondary,
            };
        default:
            return getStyle(defaultStyle, 'line-fill', getColorByVariant(variant));
    }
};
// Click: 004b95
// Impression: d10717
// Engagement: 0082ed
// ER: 8bc1f7
// CTR: 518be9
// Các đường phụ
// ef9234, 5752d1, 38812f
function getColorByVariant(variant: string, color?: string) {
    if (color) {
        return color;
    }
    switch (String(variant).toLowerCase()) {
        case '0':
        case 'impression':
        case 'view':
            return '#d10717';
        case '1':
        case 'click':
        case 'authenticationsuccess':
            return '#004b95';
        case '2':
        case 'engagement':
        case 'authentication':
            return '#0082ed';
        case '3':
        case 'spot':
        case 'er':
            return '#8bc1f7';
        case '4':
        case 'ctr':
        case 'ar':
            return '#518be9';
        case '5':
        case 'other':
            return '#ef9234';
        case '6':
        case 'other1':
            return '#5752d1';
        case '7':
        case 'other2':
            return '#38812f';
        default:
            return '#38812f';
    }
}

export const getStyle = (defaultStyle: any, type: string, color: string) => {
    switch (type) {
        case 'line':
            return {
                ...defaultStyle,
                borderColor: color,
                backgroundColor: color,
                pointBackgroundColor: color,
                pointHoverBackgroundColor: color,
                pointHoverBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                lineTension: 0,
            };
        case 'bar':
            return {
                ...defaultStyle,
                backgroundColor: color,
            };
        case 'line-fill':
            return {
                ...defaultStyle,
            };
        default:
            return {
                ...defaultStyle,
                backgroundColor: color,
            };
    }
};

export const dataSetCommonStyled = {
    barStyle: {
        primary: {
            backgroundColor: '#0055b8',
        },
        secondary: {
            backgroundColor: '#dd040c',
        },
        default: {
            backgroundColor: '#80b0ff',
        },
    },
    lineStyle: {
        primary: {
            borderColor: '#0055b8',
            backgroundColor: '#0055b8',
            pointBackgroundColor: '#0055b8',
            pointHoverBackgroundColor: '#0055b8',
            pointHoverBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            lineTension: 0,
        },
        secondary: {
            borderColor: '#dd040c',
            backgroundColor: '#dd040c',
            pointBackgroundColor: '#dd040c',
            pointHoverBackgroundColor: '#dd040c',
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 2,
            lineTension: 0,
        },
        default: {},
    },
    lineFillStyle: {
        primary: {
            type: 'line',
            borderColor: '#0055b8',
            backgroundColor: '#80b0ff',
            pointBackgroundColor: '#0055b8',
            pointHoverBackgroundColor: '#0055b8',
            pointHoverBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            lineTension: 0,
        },
        secondary: {
            type: 'line',
            borderColor: '#dd040c',
            backgroundColor: '#ed5163',
            pointBackgroundColor: '#dd040c',
            pointHoverBackgroundColor: '#dd040c',
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 2,
            lineTension: 0,
        },
        default: {
            type: 'line',
        },
    },
};

const useStyles = makeStyles((_theme) => ({
    chartContainter: {
        position: 'relative',
    },
    legendWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '0.5rem',
        flexWrap: 'wrap',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        margin: '0.5rem',
        cursor: 'pointer',
        width: '240px',
    },
    legendIcon: {
        borderRadius: '10px',
        // display: 'inline-block',
        height: '16px',
        marginRight: '4px',
        width: '16px',
    },
    legendItemText: {
        // display: 'inline-block'
    },
    legendItemHidden: {
        textDecoration: 'line-through',
    },
}));

export default useStyles;
