import { FormControl, InputLabel, MenuItem, Select, TextField, Grid } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DayIntervalPicker from './DayInterval';
import { CronTabType, DayIntervalType, WeekDays } from './constants';
import type { CronTabProps, CronTabValue, DayInterval } from './interface';
import { ScheduleType } from 'Features/NOTIFICATION/SubscriptionConfig/enums';
import moment from 'moment';

export default function CronTab(props: CronTabProps) {
    const { t } = useTranslation();
    const { value, initValue, onChange, schedulePermissions } = props;
    const [uncontrolValue, setUncontrolValue] = useState<CronTabValue | undefined>(initValue);

    const cronValue = value || uncontrolValue;

    const updateValue = (newValue: CronTabValue) => {
        setUncontrolValue(newValue);
        onChange(newValue, checkValid(newValue));
    };

    const checkDaily = (cValue: CronTabValue) => {
        return !!(
            cValue?.dayInterval &&
            cValue?.dayInterval?.type &&
            cValue?.dayInterval?.from &&
            cValue?.dayInterval?.from?.isValid() &&
            cValue?.dayInterval?.to &&
            cValue?.dayInterval?.to?.isValid() &&
            cValue?.dayInterval?.from?.isSameOrBefore(cValue?.dayInterval?.to)
        );
    };

    const checkWeekly = (cValue: CronTabValue) => {
        return !!(checkDaily(cValue) && cValue?.daysOfWeek && cValue?.daysOfWeek?.length > 0);
    };

    const checkMonthly = (cValue: CronTabValue) => {
        return !!(checkDaily(cValue) && cValue?.daysOfMonth && cValue?.daysOfMonth?.length > 0);
    };

    const checkAdvanced = (cValue: CronTabValue) => {
        return !!cValue?.cronExpression;
    };

    const checkValid = (cValue: CronTabValue) => {
        switch (cValue.type) {
            case CronTabType.DAILY:
                return checkDaily(cValue);
            case CronTabType.WEEKLY:
                return checkWeekly(cValue);
            case CronTabType.MONTHLY:
                return checkMonthly(cValue);
            case CronTabType.ADVANCED:
                return checkAdvanced(cValue);
            default:
                return false;
        }
    };

    const handleChange = (newValue: any, fieldName: string) => {
        const temp: CronTabValue = { ...cronValue, type: (cronValue?.type as ScheduleType) || CronTabType.DAILY };
        temp[fieldName as keyof CronTabValue] = newValue;
        updateValue(temp);
    };

    const getDaysOfMonthOptions = () => {
        return Array.from({ length: 31 }, (_, i) => i + 1).map((day) => ({
            label: day.toString(),
            value: day,
        }));
    };

    return (
        <Grid container>
            <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="standard" required>
                    <InputLabel>{t('CronTab.Type.Label')}</InputLabel>
                    <Select
                        value={cronValue?.type || ''}
                        onChange={(e) => updateValue({ type: e.target.value || '' } as CronTabValue)}
                        inputProps={{
                            'data-testid': 'cron-type-select',
                        }}
                        readOnly={!schedulePermissions?.scheduleType}
                    >
                        {Object.entries(CronTabType).map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                                {t(`CronTab.Type.${key}`)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            {cronValue?.type === CronTabType.ADVANCED && (
                <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        variant="standard"
                        label={t('CronTab.CronExpression')}
                        value={cronValue?.cronExpression || ''}
                        onChange={(e) => handleChange(e.target.value, 'cronExpression')}
                        slotProps={{
                            htmlInput: {
                                readOnly: !schedulePermissions.scheduleExpression,
                            },
                        }}
                    />
                </Grid>
            )}
            {(cronValue?.type === CronTabType.DAILY || cronValue?.type === CronTabType.WEEKLY) && (
                <DayIntervalPicker
                    dayInterval={cronValue?.dayInterval}
                    onChange={(newValue: DayInterval) => handleChange(newValue, 'dayInterval')}
                    dayIntervalPermission={{
                        from: schedulePermissions.scheduleIntervalFromTime,
                        end: schedulePermissions.scheduleIntervalEndTime,
                        to: schedulePermissions.scheduleToDate,
                        summary: schedulePermissions.scheduleSummary,
                    }}
                />
            )}
            {cronValue?.type === CronTabType.WEEKLY && (
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                    <FormControl fullWidth variant="standard" required>
                        <InputLabel>{t('CronTab.DaysOfWeek')}</InputLabel>
                        <Select
                            multiple
                            value={cronValue?.daysOfWeek || []}
                            onChange={(e) => handleChange(e.target.value, 'daysOfWeek')}
                            readOnly={!schedulePermissions.scheduleIntervalDaysOfWeek}
                            inputProps={{
                                'data-testid': 'cron-days-of-week-select',
                            }}
                        >
                            {Object.entries(WeekDays).map(([key, value]) => (
                                <MenuItem key={key} value={value}>
                                    {t(`CronTab.WeekDays.${key}`)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            )}
            {cronValue?.type === CronTabType.MONTHLY && (
                <>
                    <Grid size={{ xs: 6 }} sx={{ mt: 2, pr: 1 }}>
                        <FormControl fullWidth variant="standard" required>
                            <InputLabel>{t('CronTab.DayOfMonth')}</InputLabel>
                            <Select
                                multiple
                                value={cronValue?.daysOfMonth || []}
                                onChange={(e) => handleChange(e.target.value, 'daysOfMonth')}
                                readOnly={!schedulePermissions.scheduleIntervalDaysOfMonth}
                                inputProps={{
                                    'data-testid': 'cron-days-of-month-select',
                                }}
                            >
                                {getDaysOfMonthOptions().map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 6 }} sx={{ mt: 2, pl: 2 }}>
                        <TimePicker
                            views={['hours', 'minutes']}
                            slotProps={{
                                textField: {
                                    required: true,
                                    fullWidth: true,
                                    variant: 'standard',
                                },
                            }}
                            label={t('CronTab.DayInterval.At')}
                            value={cronValue?.dayInterval?.from || null}
                            onChange={(newValue) => {
                                const temp: CronTabValue = { ...cronValue };
                                const dayInterval = {
                                    type: DayIntervalType.ONE_PER_DAY,
                                    from: moment.isMoment(newValue) ? moment(newValue) : undefined,
                                    to: moment.isMoment(newValue) ? moment(newValue) : undefined,
                                };
                                temp.dayInterval = dayInterval;
                                updateValue(temp);
                            }}
                            readOnly={!schedulePermissions.scheduleIntervalDaysOfMonth}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );
}
