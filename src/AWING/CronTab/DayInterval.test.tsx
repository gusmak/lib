import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fireEvent, render, screen } from '@testing-library/react';
import moment from 'moment';
import DayIntervalPicker from './DayInterval';
import { DayIntervalType } from './constants';
import { DEFAULT_DAYINTERVAL_PERMISSION } from './constants';

describe('DayIntervalPicker', () => {
    it('renders a select input for the day interval type', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DayIntervalPicker onChange={() => {}} dayIntervalPermission={DEFAULT_DAYINTERVAL_PERMISSION} />
            </LocalizationProvider>
        );
        const selectElement = screen.getByText('CronTab.DayInterval.Type.Label');
        expect(selectElement).toBeInTheDocument();
    });

    it('renders a time picker when the day interval type is ONE_PER_DAY', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DayIntervalPicker
                    dayInterval={{ type: DayIntervalType.ONE_PER_DAY }}
                    onChange={() => {}}
                    dayIntervalPermission={DEFAULT_DAYINTERVAL_PERMISSION}
                />
            </LocalizationProvider>
        );
        const timePickerElement = screen.getByText('CronTab.DayInterval.At');
        expect(timePickerElement).toBeInTheDocument();
    });

    it('renders two time pickers when the day interval type is not ONE_PER_DAY', () => {
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DayIntervalPicker
                    dayInterval={{ type: DayIntervalType.EVERY_3_HOURS }}
                    onChange={() => {}}
                    dayIntervalPermission={DEFAULT_DAYINTERVAL_PERMISSION}
                />
            </LocalizationProvider>
        );
        const fromTimePickerElement = screen.getByText('CronTab.DayInterval.From');
        const toTimePickerElement = screen.getByText('CronTab.DayInterval.To');
        expect(fromTimePickerElement).toBeInTheDocument();
        expect(toTimePickerElement).toBeInTheDocument();
    });

    it('calls the onChange function when the from time is changed', async () => {
        const onChangeMock = jest.fn();
        render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DayIntervalPicker
                    dayInterval={{ type: DayIntervalType.EVERY_3_HOURS, from: moment(), to: undefined }}
                    onChange={onChangeMock}
                    dayIntervalPermission={{
                        from: true,
                        end: false,
                        to: true,
                        summary: true,
                    }}
                />
            </LocalizationProvider>
        );

        const fromTimePicker = screen.getByRole('textbox', { name: 'CronTab.DayInterval.From' });
        fireEvent.focus(fromTimePicker);
        fireEvent.change(fromTimePicker, {
            target: { value: '12:00' },
        });

        expect(onChangeMock).toHaveBeenCalled();
    });

    it('calls the onChange function when the time is changed', () => {
        const onChangeMock = jest.fn();
        const { getByRole } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DayIntervalPicker
                    dayInterval={{ type: DayIntervalType.ONE_PER_DAY, from: moment(), to: undefined }}
                    onChange={onChangeMock}
                    dayIntervalPermission={{
                        from: true,
                        end: true,
                        to: true,
                        summary: true,
                    }}
                />
            </LocalizationProvider>
        );
        const timePickerElement = getByRole('textbox', {
            name: 'CronTab.DayInterval.At',
        });
        fireEvent.change(timePickerElement, {
            target: { value: '12:00' },
        });
        expect(onChangeMock).toHaveBeenCalled();
    });

    it('calls the onChange function when the time is changed with to', () => {
        const onChangeMock = jest.fn();
        const { getByRole } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DayIntervalPicker
                    dayInterval={{ type: DayIntervalType.EVERY_HOUR, from: moment(), to: moment() }}
                    onChange={onChangeMock}
                    dayIntervalPermission={{
                        from: true,
                        end: true,
                        to: true,
                        summary: true,
                    }}
                />
            </LocalizationProvider>
        );

        const timePickerElementFrom = getByRole('textbox', {
            name: 'CronTab.DayInterval.From',
        });
        fireEvent.change(timePickerElementFrom, {
            target: { value: '12:00' },
        });

        const timePickerElementTo = getByRole('textbox', {
            name: 'CronTab.DayInterval.To',
        });
        fireEvent.change(timePickerElementTo, {
            target: { value: '12:00' },
        });
        expect(onChangeMock).toHaveBeenCalled();
    });
});
