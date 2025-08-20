import { Paper, Grid, Typography } from '@mui/material';
import moment from 'moment';
import { chunks, getDaysInMonth, isStartOfRange, isEndOfRange, inDateRange, isRangeSameDay } from './utils';
import Header from './Header';
import Day from './Day';

import { NavigationAction, DateRange } from '../types';

interface MonthProps {
    value: Date;
    marker: symbol;
    dateRange: DateRange;
    minDate: Date;
    maxDate: Date;
    navState: [boolean, boolean];
    setValue: (date: Date) => void;
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
    hideOutsideMonthDays?: boolean;
}

const Month: React.FunctionComponent<MonthProps> = (props: MonthProps) => {
    const {
        helpers,
        handlers,
        value: date,
        dateRange,
        marker,
        setValue: setDate,
        minDate,
        maxDate,
        locale,
        hideOutsideMonthDays,
    } = props;

    // Nếu cần dùng locale với moment, có thể thêm: moment.locale(locale?.code)
    const weekStartsOn = locale?.options?.weekStartsOn || 0;
    const WEEK_DAYS =
        typeof locale !== 'undefined'
            ? [...Array(7).keys()].map((d) =>
                  moment()
                      .day((d + weekStartsOn) % 7)
                      .format('dd')
              )
            : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const [back, forward] = props.navState;

    return (
        <Paper square elevation={0} sx={{ width: 290 }}>
            <Grid container>
                <Header
                    date={date}
                    setDate={setDate}
                    nextDisabled={!forward}
                    prevDisabled={!back}
                    onClickPrevious={() => handlers.onMonthNavigate(marker, NavigationAction.Previous)}
                    onClickNext={() => handlers.onMonthNavigate(marker, NavigationAction.Next)}
                    locale={locale}
                />

                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                        marginTop: '10px',
                        paddingLeft: '30px',
                        paddingRight: '30px',
                        width: '100%',
                    }}
                >
                    {WEEK_DAYS.map((day, index) => (
                        <Typography color="textSecondary" key={index} variant="caption">
                            {day}
                        </Typography>
                    ))}
                </Grid>

                <Grid
                    container
                    direction="column"
                    justifyContent="space-between"
                    sx={{
                        paddingLeft: '15px',
                        paddingRight: '15px',
                        marginTop: '15px',
                        marginBottom: '20px',
                    }}
                >
                    {chunks(getDaysInMonth(date, locale), 7).map((week, idx) => (
                        <Grid key={idx} container direction="row" justifyContent="center" marginY={'2px'}>
                            {week.map((day, dayIndex) => {
                                const momentDay = moment(day);
                                const isStart = isStartOfRange(dateRange, day);
                                const isEnd = isEndOfRange(dateRange, day);
                                const isRangeOneDay = isRangeSameDay(dateRange);
                                const highlighted = inDateRange(dateRange, day) || helpers.inHoverRange(day);
                                const isFirstDayOfWeek = dayIndex === 0;
                                const isLastDayOfWeek = dayIndex === 6;

                                return (
                                    <Day
                                        key={momentDay.format('DD-MM-YYYY')}
                                        filled={isStart || isEnd}
                                        outlined={momentDay.isSame(moment(), 'day')}
                                        highlighted={highlighted && !isRangeOneDay}
                                        hovered={helpers.inHoverRange(day) && !isRangeOneDay}
                                        disabled={
                                            !moment(date).isSame(day, 'month') ||
                                            !moment(day).isBetween(minDate, maxDate, 'day', '[]')
                                        }
                                        startOfRange={isStart && !isRangeOneDay}
                                        endOfRange={isEnd && !isRangeOneDay}
                                        isFirstDayOfWeek={isFirstDayOfWeek}
                                        isLastDayOfWeek={isLastDayOfWeek}
                                        onClick={() => handlers.onDayClick(day)}
                                        onHover={() => handlers.onDayHover(day)}
                                        value={momentDay.date()}
                                        hidden={!moment(date).isSame(day, 'month')}
                                        hideOutsideMonthDays={hideOutsideMonthDays}
                                    />
                                );
                            })}
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Month;
