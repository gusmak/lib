import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import moment from 'moment';
import CronTab from './CronTab';
import { CronTabType } from './constants';
import { DEFAULT_SCHEDULE_PERMISSION } from './constants';

jest.mock('./DayInterval', () => (props: any) => {
    return (
        <div>
            <button onClick={props.onChange}>btnDayInterval</button>
        </div>
    );
});

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Select: (props: any) => {
        return (
            <>
                <button
                    data-testid="selected-change-value"
                    onClick={(e) => {
                        props.onChange({ target: { value: [2, 3] } });
                    }}
                >
                    btnSelectedChangeValue
                </button>
                <div>{props.children}</div>
            </>
        );
    },
}));

describe('CronTab', () => {
    const mockOnChange = jest.fn();
    it('should render the component', () => {
        const { getByText } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab onChange={mockOnChange} schedulePermissions={DEFAULT_SCHEDULE_PERMISSION} />
            </LocalizationProvider>
        );
        expect(getByText('CronTab.Type.Label')).toBeInTheDocument();
    });

    it('should update the value when the type changes', () => {
        const { getAllByTestId } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab
                    value={{
                        type: CronTabType.WEEKLY as any,
                        daysOfWeek: [1],
                        dayInterval: {
                            type: '0',
                            from: moment(),
                            to: moment(),
                        },
                    }}
                    onChange={mockOnChange}
                    schedulePermissions={{
                        scheduleType: true,
                        scheduleSummary: true,
                        scheduleIntervalDaysOfWeek: true,
                        scheduleIntervalDaysOfMonth: true,
                        scheduleIntervalFromTime: true,
                        scheduleIntervalEndTime: true,
                        scheduleStartDate: true,
                        scheduleIntervalInMinutes: true,
                        scheduleToDate: true,
                        scheduleExpression: true,
                    }}
                />
            </LocalizationProvider>
        );

        const btnInput = getAllByTestId('selected-change-value')[1];
        fireEvent.click(btnInput);
    });

    it('should update the value when the type changes with Weekly', () => {
        const { getAllByTestId } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab onChange={mockOnChange} schedulePermissions={DEFAULT_SCHEDULE_PERMISSION} />
            </LocalizationProvider>
        );
        const typeSelect = getAllByTestId('selected-change-value')[0];

        fireEvent.click(typeSelect, { target: { value: 'WEEKLY' } });
        expect(mockOnChange).toBeCalled();
    });

    it('should update the value when the type changes with monthly', () => {
        const { getAllByTestId } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab onChange={mockOnChange} schedulePermissions={DEFAULT_SCHEDULE_PERMISSION} />
            </LocalizationProvider>
        );

        const typeSelect = getAllByTestId('selected-change-value')[0];

        fireEvent.click(typeSelect, { target: { value: 'MONTHLY' } });

        expect(mockOnChange).toBeCalled();
    });

    it('should update the value when the type changes with avanced', () => {
        const { getAllByTestId } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab onChange={mockOnChange} schedulePermissions={DEFAULT_SCHEDULE_PERMISSION} />
            </LocalizationProvider>
        );
        const typeSelect = getAllByTestId('selected-change-value')[0];

        fireEvent.click(typeSelect, { target: { value: 'ADVANCED' } });
        expect(mockOnChange).toBeCalled();
    });

    it('should update the value when the cron expression changes', () => {
        const { getByRole } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab
                    initValue={{ type: CronTabType.ADVANCED as any }}
                    onChange={mockOnChange}
                    schedulePermissions={DEFAULT_SCHEDULE_PERMISSION}
                />
            </LocalizationProvider>
        );
        fireEvent.change(getByRole('textbox', { name: 'CronTab.CronExpression' }), {
            target: { value: '* * * * * *' },
        });
        expect(mockOnChange).toHaveBeenCalledWith({ cronExpression: '* * * * * *', type: CronTabType.ADVANCED }, expect.any(Boolean));
    });

    it('should render DayInterval component when type is DAILY', () => {
        const { getByText } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab
                    initValue={{ type: CronTabType.DAILY as any, dayInterval: { type: '0', from: moment(), to: moment() } }}
                    onChange={mockOnChange}
                    schedulePermissions={DEFAULT_SCHEDULE_PERMISSION}
                />
            </LocalizationProvider>
        );
        expect(getByText('btnDayInterval')).toBeInTheDocument();
    });

    it('should render DayInterval component when type is WEEKLY', () => {
        const { getByText } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab
                    initValue={{ type: CronTabType.WEEKLY as any }}
                    onChange={mockOnChange}
                    schedulePermissions={DEFAULT_SCHEDULE_PERMISSION}
                />
            </LocalizationProvider>
        );
        expect(getByText('btnDayInterval')).toBeInTheDocument();
    });

    it('should render DayInterval component when type is MONTHLY', async () => {
        const { getAllByTestId } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab
                    initValue={{
                        type: CronTabType.MONTHLY as any,
                        daysOfMonth: [1],
                        dayInterval: {
                            type: '0',
                            from: moment(),
                            to: moment(),
                        },
                    }}
                    onChange={mockOnChange}
                    schedulePermissions={{
                        scheduleType: true,
                        scheduleSummary: true,
                        scheduleIntervalDaysOfWeek: true,
                        scheduleIntervalDaysOfMonth: true,
                        scheduleIntervalFromTime: true,
                        scheduleIntervalEndTime: true,
                        scheduleStartDate: true,
                        scheduleIntervalInMinutes: true,
                        scheduleToDate: true,
                        scheduleExpression: true,
                    }}
                />
            </LocalizationProvider>
        );

        await waitFor(() => {
            const btnInput = getAllByTestId('selected-change-value')[1];
            fireEvent.click(btnInput);
        });
    });

    it('should not render DayInterval component when type is ADVANCED', () => {
        const { queryByText } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab
                    initValue={{ type: CronTabType.ADVANCED as any }}
                    onChange={mockOnChange}
                    schedulePermissions={DEFAULT_SCHEDULE_PERMISSION}
                />
            </LocalizationProvider>
        );
        expect(queryByText('mockDayInterval')).toBeNull();
    });

    it('should update the value when the cron expression changes', async () => {
        const { getAllByTestId } = render(
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <CronTab
                    value={{
                        type: CronTabType.DAILY as any,
                        dayInterval: {
                            type: '0',
                            from: moment(),
                            to: moment(),
                        },
                    }}
                    onChange={mockOnChange}
                    schedulePermissions={{
                        scheduleType: true,
                        scheduleSummary: true,
                        scheduleIntervalDaysOfWeek: true,
                        scheduleIntervalDaysOfMonth: true,
                        scheduleIntervalFromTime: true,
                        scheduleIntervalEndTime: true,
                        scheduleStartDate: true,
                        scheduleIntervalInMinutes: true,
                        scheduleToDate: true,
                        scheduleExpression: true,
                    }}
                />
            </LocalizationProvider>
        );

        const typeSelect = getAllByTestId('selected-change-value')[0];

        fireEvent.change(typeSelect, {
            target: { value: 'WEEKLY' },
        });

        const btnDayInterval = screen.getByRole('button', { name: 'btnDayInterval' });
        fireEvent.click(btnDayInterval);
    });
});
