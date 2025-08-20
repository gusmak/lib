import ImageIcon from '@mui/icons-material/Image';
import MenuIcon from '@mui/icons-material/Menu';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Box, Button } from '@mui/material';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartTypeRegistry,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    Plugin,
    PointElement,
    TimeScale,
    Tooltip,
} from 'chart.js';
import { AnyObject } from 'chart.js/dist/types/basic';
import 'chartjs-adapter-moment';
import { updateObjectFields } from 'Helpers/collection';
import { roundDecimalNumber } from 'Helpers/number';
import { useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { TimelineType } from '../Enums';
import { IChartJsContainer } from '../Types';
import { styledBar, styledLine, styledLineFill } from '../Styles';
import { htmlLegendPlugin } from './constants';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import { exportToExcel, exportToPDF, exportToPNG, labelCallback, titleCallback } from './utils';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    TimeScale
);

const BarLineComponent = (props: IChartJsContainer) => {
    const { optionsDefault, dataExportExcel } = props;
    const { t } = useTranslation();
    const chartRef = useRef<ChartJS<keyof ChartTypeRegistry>>(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const {
        width = 'auto',
        height = 350,
        timeline = TimelineType.Day,
        optionCustom = {},
        dataChart,
        type,
        enableExport = {
            png: true,
            pdf: true,
            excel: true,
            nameFile: '',
        },
        options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                },
                tooltip: {
                    mode: 'index',
                    position: 'nearest',
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    borderColor: '#e3e3e3',
                    borderWidth: 1,
                    intersect: false,
                    bodyColor: '#263238',
                    bodySpacing: 8,
                    callbacks: {
                        title: titleCallback,
                        label: labelCallback,
                    },
                    titleColor: '#212121',
                    bodyFont: {
                        size: 14,
                        family: "'Roboto', sans-serif",
                        lineHeight: 1.5,
                    },
                },
                htmlLegend: {
                    // ID of the container to put the legend in
                    containerID: 'legend-container',
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        // pointStyle: 'circle',
                        boxHeight: 12,
                        boxWidth: 12,
                        padding: 30,
                        boxPadding: 50,
                        font: {
                            size: 15,
                            family: "'Roboto', sans-serif",
                            lineHeight: 1.5,
                        },
                    },
                    display: false,
                },
            },
            scales: {
                x: optionsDefault
                    ? {}
                    : {
                          type: 'time',
                          display: true,
                          grid: { display: false },
                          time: {
                              parser: timeline === TimelineType.Day ? 'YYYYMMDD' : 'YYYYMMDDHH',
                              unit: timeline === TimelineType.Day ? 'day' : 'hour',
                              displayFormats: {
                                  day: 'DD/MM',
                                  hour: 'HH:mm',
                              },
                          },
                          offset: true,
                          ticks: {
                              maxTicksLimit: 10,
                              autoSkipPadding: 16,
                              maxRotation: 0,
                          },
                          title: {
                              font: {
                                  size: 14,
                                  family: "'Roboto', sans-serif",
                              },
                          },
                      },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { display: false },
                    ticks: {
                        minRotation: 0,
                        stepSize: 10,
                        maxTicksLimit: 6,
                        callback(tickValue) {
                            return roundDecimalNumber(tickValue);
                        },
                    },
                    title: {
                        display: true,
                        text: t('Statistic.View'),
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: "'Roboto', sans-serif",
                        },
                    },
                },
                yAxis: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { display: true },
                    ticks: {
                        minRotation: 0,
                        maxTicksLimit: 6,
                    },
                    title: {
                        display: true,
                        text: t('Statistic.CTR'),
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: "'Roboto', sans-serif",
                        },
                    },
                },
            },
        },
    } = props;

    const chartData = {
        datasets: dataChart?.map((item) => {
            switch (item.type) {
                case 'line':
                    return {
                        ...styledLine(item, item.variant, item?.color),
                        data: item.data,
                    };
                case 'bar':
                    return { ...styledBar(item, item.variant), data: item.data };
                case 'line-fill':
                    return {
                        ...styledLineFill(item, item.variant),
                        data: item.data,
                    };
                default:
                    return { ...item, data: item.data };
            }
        }),
    };

    const StyledMenu = styled((props: MenuProps) => (
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: theme.spacing(1),
            minWidth: 180,
            color: 'rgb(55, 65, 81)',
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    color: theme.palette.text.secondary,
                    marginRight: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
                },
            },
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[300],
            }),
        },
    }));

    return (
        <Box
            sx={{
                width: width,
                height: height,
                position: 'relative',
                marginBottom: '80px',
                '.point': {
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '-5px',
                        right: '-5px',
                        height: '2px',
                        backgroundColor: 'inherit',
                        transform: 'translateY(-50%)',
                    },
                },
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '22px',
                    right: '5%',
                    zIndex: 1,
                }}
            >
                <Button
                    id="demo-customized-button"
                    aria-controls={open ? 'demo-customized-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    color="primary"
                    style={{ minWidth: '32px', transform: 'scale(0.75)', transformOrigin: 'top left', backgroundColor: '#aba8a8' }}
                >
                    <MenuIcon />
                </Button>
                <StyledMenu
                    id="demo-customized-menu"
                    slotProps={{
                        list: { 'aria-labelledby': 'demo-customized-button' },
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    {enableExport?.png && (
                        <MenuItem onClick={() => chartRef.current && exportToPNG(chartRef.current, enableExport?.nameFile)} disableRipple>
                            <ImageIcon />
                            PNG
                        </MenuItem>
                    )}
                    {enableExport?.pdf && (
                        <MenuItem onClick={() => chartRef.current && exportToPDF(chartRef.current, enableExport?.nameFile)} disableRipple>
                            <PictureAsPdfIcon />
                            PDF
                        </MenuItem>
                    )}
                    {enableExport?.excel && (
                        <MenuItem onClick={() => chartRef.current && exportToExcel(dataExportExcel!, enableExport?.nameFile)} disableRipple>
                            <DocumentScannerOutlinedIcon />
                            EXCEL
                        </MenuItem>
                    )}
                </StyledMenu>
            </div>
            <Chart
                ref={chartRef}
                data={chartData}
                type={type}
                options={updateObjectFields(options, optionCustom)}
                plugins={[htmlLegendPlugin as unknown as Plugin<keyof ChartTypeRegistry, AnyObject>]}
            />
            <Box
                id="legend-container"
                sx={{
                    marginTop: '35px',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            ></Box>
        </Box>
    );
};

export default BarLineComponent;
