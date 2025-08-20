import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DayIntervalType } from './constants';
import type { DayInterval, DayIntervalPickerProps } from './interface';

export default function DayIntervalPicker(props: DayIntervalPickerProps) {
    const { t } = useTranslation();
    const { dayInterval, onChange, dayIntervalPermission } = props;

    const handleChange = (newValue: moment.Moment | Dayjs | null, fieldName: string) => {
        const temp: DayInterval = { ...dayInterval, type: dayInterval?.type || '' };
        if (fieldName === 'from' || fieldName === 'to') {
            if (moment.isMoment(newValue)) {
                temp[fieldName] = moment(newValue) ?? undefined;
            } else {
                const day = dayjs(newValue).format('HH:mm');
                const momentValue = moment(day, 'HH:mm');
                temp[fieldName] = moment(momentValue) ?? undefined;
            }
        }
        onChange(temp);
    };

    return (
        <>
            <Grid size={{ xs: 4 }} sx={{ mt: 2 }}>
                <FormControl fullWidth variant="standard" required>
                    <InputLabel>{t('CronTab.DayInterval.Type.Label')}</InputLabel>
                    <Select
                        value={dayInterval?.type || ''}
                        onChange={(e) => onChange({ type: e.target.value || '' })}
                        readOnly={!dayIntervalPermission.summary}
                    >
                        {Object.entries(DayIntervalType).map(([key, value]) => (
                            <MenuItem key={key} value={value}>
                                {t(`CronTab.DayInterval.Type.${key}`)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            {dayInterval?.type === DayIntervalType.ONE_PER_DAY ? (
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
                        value={dayInterval?.from || null}
                        onChange={(newValue) => {
                            const temp: DayInterval = { ...dayInterval };
                            // Convert Dayjs to Moment if necessary
                            const momentValue =
                                newValue && 'isSame' in newValue && typeof (newValue as any).toDate === 'function'
                                    ? (window as any).moment((newValue as any).toDate())
                                    : (newValue ?? undefined);
                            temp.from = momentValue ?? undefined;
                            temp.to = momentValue ?? undefined;
                            onChange(temp);
                        }}
                        readOnly={!dayIntervalPermission.from}
                    />
                </Grid>
            ) : (
                <>
                    <Grid size={{ xs: 4 }} sx={{ mt: 2, pl: 2 }}>
                        <TimePicker
                            views={['hours', 'minutes']}
                            slotProps={{
                                textField: {
                                    required: true,
                                    fullWidth: true,
                                    variant: 'standard',
                                    error:
                                        dayInterval?.from &&
                                        dayInterval?.to &&
                                        dayInterval?.from?.isAfter(dayInterval?.to),
                                },
                            }}
                            label={t('CronTab.DayInterval.From')}
                            value={dayInterval?.from || null}
                            onChange={(newValue) => handleChange(newValue, 'from')}
                            readOnly={!dayIntervalPermission.from}
                        />
                    </Grid>
                    <Grid size={{ xs: 4 }} sx={{ mt: 2, pl: 2 }}>
                        <TimePicker
                            views={['hours', 'minutes']}
                            slotProps={{
                                textField: {
                                    required: true,
                                    fullWidth: true,
                                    variant: 'standard',
                                    error:
                                        dayInterval?.from &&
                                        dayInterval?.to &&
                                        dayInterval?.from?.isAfter(dayInterval?.to),
                                },
                            }}
                            label={t('CronTab.DayInterval.To')}
                            value={dayInterval?.to || null}
                            onChange={(newValue) => handleChange(newValue, 'to')}
                            readOnly={!dayIntervalPermission.to}
                        />
                    </Grid>
                </>
            )}
        </>
    );
}
