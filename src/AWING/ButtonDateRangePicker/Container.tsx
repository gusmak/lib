import { useState, useRef, useEffect, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Paper, Popper, Grow, Box, ClickAwayListener, Button } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import DateRangePicker from '../DateRangePicker';
import { type ButtonDateRangePickerProps } from './Types';

export const ButtonDateRangePicker = (props: ButtonDateRangePickerProps) => {
    const { t } = useTranslation();
    const { dateValue, onChangeDate, isOutsideRange, isDayBlocked, isShowCalendarInfo, ...other } = props;

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const [value, setValue] = useState<ButtonDateRangePickerProps['dateValue']>(dateValue);

    useEffect(() => {
        setValue(dateValue ?? [null, null]);
    }, [dateValue]);

    const handleClose = (event: Event | SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        if (value && value[0] && value[1] && moment(value[0]).isValid() && moment(value[1]).isValid()) {
            if (onChangeDate) onChangeDate(value);
        } else {
            setValue([null, null]);
        }
        setOpen(false);
    };

    return (
        <>
            <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    textTransform: 'none',
                    color: (theme) => theme.palette.text.primary,
                    fontWeight: 'normal',
                }}
                {...other}
            />
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom"
                transition
                disablePortal
                style={{ zIndex: 1 }}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >
                        <Paper elevation={8}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box style={{ minWidth: '320px' }}>
                                    <div
                                        style={{
                                            borderBottom: '1px solid #e1e4e8',
                                            padding: '8px 10px',
                                            background: '#fafafa',
                                        }}
                                    >
                                        {t('Common.SelectDateRange')}
                                    </div>
                                    <div
                                        style={{
                                            padding: '18px 18px 30px 18px',
                                        }}
                                    >
                                        <DateRangePicker
                                            label={`${t('Common.StartDate')} - ${t('Common.EndDate')}`}
                                            onChange={(dateRange) => {
                                                setValue([moment(dateRange.startDate), moment(dateRange.endDate)]);
                                            }}
                                            value={
                                                value[0] && value[1]
                                                    ? {
                                                          startDate: value[0].toDate(),
                                                          endDate: value[1].toDate(),
                                                      }
                                                    : undefined
                                            }
                                            options={{
                                                hideOutsideMonthDays: !isOutsideRange,
                                                hideDefaultRanges: !isShowCalendarInfo,
                                            }}
                                        />
                                        {/* <DateRangePicker
                                            label={`${t('Common.StartDate')} - ${t('Common.EndDate')}`}
                                            initialStartDate={value[0]}
                                            initialEndDate={value[1]}
                                            textFieldProps={{ fullWidth: true }}
                                            callback={(dateRange: any) => {
                                                setValue([dateRange.startDate, dateRange.endDate]);
                                            }}
                                            isOutsideRange={isOutsideRange}
                                            isDayBlocked={isDayBlocked}
                                            isShowCalendarInfo={isShowCalendarInfo}
                                        /> */}
                                    </div>
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};

export default ButtonDateRangePicker;
export * from './Types';
