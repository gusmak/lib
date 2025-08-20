import { render, screen, fireEvent } from '@testing-library/react';
import ScheduleSettings from '../ScheduleSettings';
import { CronTabProps } from 'AWING';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { ScheduleType } from '../enums';

const renderComponent = (props: CronTabProps) => {
    return render(
        <I18nextProvider i18n={i18n}>
            <ScheduleSettings {...props} />
        </I18nextProvider>
    );
};

describe('ScheduleSettings', () => {
    const defaultProps: CronTabProps = {
        value: { type: ScheduleType.Advanced },
        onChange: jest.fn(),
        schedulePermissions: {
            scheduleType: false,
            scheduleSummary: false,
            scheduleIntervalDaysOfWeek: false,
            scheduleIntervalDaysOfMonth: false,
            scheduleIntervalEndTime: false,
            scheduleStartDate: false,
            scheduleIntervalFromTime: false,
            scheduleIntervalInMinutes: false,
            scheduleToDate: false,
            scheduleExpression: false,
        },
    };

    it('should render without crashing', () => {
        renderComponent(defaultProps);
        expect(screen.getByText('SubscriptionConfig.ScheduleSettings')).toBeInTheDocument();
    });

    it('should display the correct text in Typography', () => {
        renderComponent(defaultProps);
        expect(screen.getByText('SubscriptionConfig.ScheduleSettings')).toBeInTheDocument();
    });

    it('should call onChange when CronTab value changes', () => {
        renderComponent(defaultProps);
        const cronTab = screen.getByRole('textbox'); // Assuming CronTab renders an input element
        fireEvent.change(cronTab, { target: { value: 'new value' } });
        expect(defaultProps.onChange).toHaveBeenCalled();
    });
});
