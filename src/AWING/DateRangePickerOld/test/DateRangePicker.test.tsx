import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { driver } from './DateRangePicker.driver';
import Container from '../container';
import moment from 'moment';

const initData = {
    autoFocus: false,
    autoFocusEndDate: false,
    initialStartDate: null,
    initialEndDate: null,
    callback: () => {},
    disabled: false,
    isDayBlocked: (day) => false,
    isOutsideRange: (day) => false,
    isShowCalendarInfo: false,
    handleValid: () => {},
    handleDateRangePopover: () => {},
};

describe('Render', () => {
    it('should render input mask', () => {
        const { container } = render(<Container {...initData} />);
        const inputmask = container.querySelector(driver.inputmask);

        expect(inputmask).toBeInTheDocument();
    });

    it('should show popper when clicked inputmask', () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        const { container } = render(<Container {...initData} />);
        const inputmask = container.querySelector(driver.inputmask);

        inputmask && fireEvent.click(inputmask);

        jest.advanceTimersByTime(1000);
    });

    it('should show popper when clicked inputmask', () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        const { container } = render(
            <Container
                {...initData}
                value={{
                    startDate: moment('2021-10-20'),
                    endDate: moment('2021-10-25'),
                }}
            />
        );
        const inputmaskInput = container.querySelector(driver.inputmaskInput);

        expect(inputmaskInput).toHaveValue('20/10/2021 - 25/10/2021');
    });
});

describe('init', () => {
    it('should autofocus', () => {
        jest.mock('react-dates/constants', () => ({
            START_DATE: 'startDate',
            END_DATE: 'endDate',
        }));
        const autoFocus = true;
        const autoFocusEndDate = false;

        render(<Container {...initData} autoFocus={autoFocus} autoFocusEndDate={autoFocusEndDate} />);

        let initialFocusedInput: string | null = null;
        if (autoFocus) {
            initialFocusedInput = 'startDate';
        } else if (autoFocusEndDate) {
            initialFocusedInput = 'endDate';
        }

        // expect(initialFocusedInput).toHaveValue('startDate')
    });

    it('should autoFocusEndDate', () => {
        jest.mock('react-dates/constants', () => ({
            START_DATE: 'startDate',
            END_DATE: 'endDate',
        }));
        const autoFocus = false;
        const autoFocusEndDate = true;

        render(<Container {...initData} autoFocusEndDate={autoFocusEndDate} />);

        let initialFocusedInput: string | null = null;
        if (autoFocus) {
            initialFocusedInput = 'startDate';
        } else if (autoFocusEndDate) {
            initialFocusedInput = 'endDate';
        }
    });
});

describe('action', () => {
    it('should autoFocus', () => {
        const autoFocus = true;
        const autoFocusEndDate = false;
        const { container } = render(<Container {...initData} autoFocus={autoFocus} />);
        const inputmaskButton = container.querySelector(driver.inputmaskButton);

        inputmaskButton && fireEvent.click(inputmaskButton);
        expect(inputmaskButton).toHaveBeenCalled();
    });
});
