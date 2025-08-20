import { FormControl, Grid, IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import moment from 'moment';

interface HeaderProps {
    date: Date;
    setDate: (date: Date) => void;
    nextDisabled: boolean;
    prevDisabled: boolean;
    onClickNext: () => void;
    onClickPrevious: () => void;
    // eslint-disable-next-line
    locale?: any;
}

const generateYears = (relativeTo: Date, count: number) => {
    const half = Math.floor(count / 2);
    const momentDate = moment(relativeTo);
    return Array(count)
        .fill(0)
        .map((_y, i) => momentDate.year() - half + i);
};

const Header: React.FunctionComponent<HeaderProps> = ({
    date,
    setDate,
    nextDisabled,
    prevDisabled,
    onClickNext,
    onClickPrevious,
    locale,
}: HeaderProps) => {
    const momentDate = moment(date);

    // Nếu bạn muốn hỗ trợ locale với moment, bạn cần import locale tương ứng
    // Ví dụ: import 'moment/locale/vi'; rồi moment.locale('vi');
    const MONTHS =
        typeof locale !== 'undefined'
            ? [...Array(12).keys()].map((d) => moment().month(d).format('MMM'))
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const handleMonthChange = (event: SelectChangeEvent<number>) => {
        const temp = event.target.value;
        const newDate = moment(date)
            .month(parseInt(`${temp}`, 10))
            .toDate();
        setDate(newDate);
    };

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        const temp = event.target.value;
        const newDate = moment(date)
            .year(parseInt(`${temp}`, 10))
            .toDate();
        setDate(newDate);
    };

    return (
        <Grid container justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
            <Grid sx={{ padding: '5px' }}>
                <IconButton
                    sx={{
                        padding: '10px',
                        '&:hover': {
                            background: 'none',
                        },
                    }}
                    disabled={prevDisabled}
                    onClick={onClickPrevious}
                >
                    <ChevronLeft color={prevDisabled ? 'disabled' : 'action'} />
                </IconButton>
            </Grid>
            <Grid>
                <FormControl variant="standard">
                    <Select value={momentDate.month()} onChange={handleMonthChange} MenuProps={{ disablePortal: true }}>
                        {MONTHS.map((month, idx) => (
                            <MenuItem key={month} value={idx}>
                                {month}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid>
                <FormControl variant="standard">
                    <Select value={momentDate.year()} onChange={handleYearChange} MenuProps={{ disablePortal: true }}>
                        {generateYears(date, 30).map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid sx={{ padding: '5px' }}>
                <IconButton
                    sx={{
                        padding: '10px',
                        '&:hover': {
                            background: 'none',
                        },
                    }}
                    disabled={nextDisabled}
                    onClick={onClickNext}
                >
                    <ChevronRight color={nextDisabled ? 'disabled' : 'action'} />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default Header;
