import { render, screen, fireEvent } from '@testing-library/react';
import State from './State';

describe('State component', () => {
    // Mock workflow states
    const workflowStates = [
        {
            value: 1,
            name: 'State 1',
            priority: 0,
            inverseParent: [{ value: 2, name: 'Child State 1', priority: 0 }],
        },
        {
            value: 2,
            name: 'State 2',
            priority: 0,
        },
    ];

    // Mock onChanged callback
    const onChangedMock = jest.fn();

    beforeEach(() => {
        render(<State workflowStates={workflowStates} onChanged={onChangedMock} />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('change input calls handleRowChange function', () => {
        const stateRows = screen.getAllByTestId('row-input-value');
        expect(stateRows.length).toBe(3);

        fireEvent.change(stateRows[0], { target: { value: '3' } });

        expect(onChangedMock.mock.calls[0][0]).toEqual([
            {
                inverseParent: [{ name: 'Child State 1', priority: 0, value: 2 }],
                name: 'State 1',
                priority: 0,
                value: 3,
            },
            { name: 'State 2', priority: 0, value: 2 },
        ]);
    });

    test('clicking "Add new" button calls onChanged function', () => {
        const addButton = screen.getByTestId('btn-add-state');
        fireEvent.click(addButton);

        expect(onChangedMock.mock.calls[0][0]).toEqual([
            {
                inverseParent: [{ name: 'Child State 1', priority: 0, value: 2 }],
                name: 'State 1',
                priority: 0,
                value: 1,
            },
            { name: 'State 2', priority: 0, value: 2 },
            {},
        ]);
    });

    test('clicking "Remove" button', () => {
        const removeButtons = screen.getAllByTestId('ClearIcon');

        fireEvent.click(removeButtons[0]);

        // Check if onChangedMock is called with the expected arguments
        expect(onChangedMock.mock.calls[0][0]).toEqual([{ name: 'State 2', priority: 0, value: 2 }]);
    });
});
