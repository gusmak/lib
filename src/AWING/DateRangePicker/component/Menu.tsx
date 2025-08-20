import { Button, Divider, Grid, Paper, Typography } from '@mui/material';
import moment from 'moment';
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import Month from './Month';
import DefinedRanges from './DefinedRanges';
import { DateRange, DefinedRange, Setter, NavigationAction } from '../types';
import { MARKERS } from './Markers';
import { ModalCustomProps } from '../types/utils';

interface MenuProps {
    dateRange: DateRange;
    ranges: DefinedRange[];
    minDate: Date;
    maxDate: Date;
    firstMonth: Date;
    secondMonth: Date;
    setFirstMonth: Setter<Date>;
    setSecondMonth: Setter<Date>;
    setDateRange: Setter<DateRange>;
    helpers: {
        inHoverRange: (day: Date) => boolean;
    };
    handlers: {
        onDayClick: (day: Date) => void;
        onDayHover: (day: Date) => void;
        onMonthNavigate: (marker: symbol, action: NavigationAction) => void;
    };
    // eslint-disable-next-line
    locale?: any;
    customProps?: ModalCustomProps;
    hideOutsideMonthDays?: boolean;
    hideDefaultRanges?: boolean;
}

const Menu: React.FunctionComponent<MenuProps> = (props: MenuProps) => {
    const {
        ranges,
        dateRange,
        minDate,
        maxDate,
        firstMonth,
        setFirstMonth,
        secondMonth,
        setSecondMonth,
        setDateRange,
        helpers,
        handlers,
        locale,
        customProps,
        hideDefaultRanges,
        hideOutsideMonthDays,
    } = props;

    // Nếu cần locale với moment: moment.locale(locale?.code)
    const { startDate, endDate } = dateRange;
    const canNavigateCloser = moment(secondMonth).diff(moment(firstMonth), 'months') >= 2;
    const commonProps = {
        dateRange,
        minDate,
        maxDate,
        helpers,
        handlers,
    };

    return (
        <Paper elevation={5} square>
            <Grid container direction="row" wrap="nowrap">
                {hideDefaultRanges ? null : (
                    <Grid>
                        <DefinedRanges selectedRange={dateRange} ranges={ranges} setRange={setDateRange} />
                    </Grid>
                )}
                <Divider orientation="vertical" flexItem />
                <Grid>
                    <Grid container sx={{ padding: '20px 70px' }} alignItems="center">
                        <Grid sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography variant="subtitle1">
                                {startDate ? moment(startDate).format('DD MMMM YYYY') : 'Start Date'}
                            </Typography>
                        </Grid>
                        <Grid sx={{ flex: 1, textAlign: 'center' }}>
                            <ArrowRightAlt color="action" />
                        </Grid>
                        <Grid sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography variant="subtitle1">{endDate ? moment(endDate).format('DD MMMM YYYY') : 'End Date'}</Typography>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container direction="row" justifyContent="center" wrap="nowrap">
                        <Month
                            {...commonProps}
                            value={firstMonth}
                            setValue={setFirstMonth}
                            navState={[true, canNavigateCloser]}
                            marker={MARKERS.FIRST_MONTH}
                            locale={locale}
                            hideOutsideMonthDays={hideOutsideMonthDays}
                        />
                        <Divider orientation="vertical" flexItem />
                        <Month
                            {...commonProps}
                            value={secondMonth}
                            setValue={setSecondMonth}
                            navState={[canNavigateCloser, true]}
                            marker={MARKERS.SECOND_MONTH}
                            locale={locale}
                            hideOutsideMonthDays={hideOutsideMonthDays}
                        />
                    </Grid>
                    <Divider />
                    {customProps ? (
                        <Grid container sx={{ padding: '20px 70px' }} alignItems="center">
                            <Grid sx={{ flex: 1, textAlign: 'center' }}>
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        if (customProps?.onCloseCallback) customProps.onCloseCallback();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button variant="outlined">Apply</Button>
                            </Grid>
                        </Grid>
                    ) : null}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Menu;
