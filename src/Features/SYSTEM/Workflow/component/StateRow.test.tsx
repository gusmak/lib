import { render, screen, fireEvent } from '@testing-library/react';
import StateRow from './StateRow';

describe('StateRow component', () => {
    const mockOnRemove = jest.fn();
    const mockOnRowChange = jest.fn();

    const mockProps = {
        level: 0,
        stateIndex: 0,
        state: {
            value: 10,
            name: 'Test State',
            priority: 5,
            inverseParent: [
                { value: 20, name: 'Child State 1', priority: 3 },
                { value: 30, name: 'Child State 2', priority: 2 },
            ],
        },
        onRemove: mockOnRemove,
        onRowChange: mockOnRowChange,
    };

    beforeEach(() => {
        render(<StateRow {...mockProps} />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders input fields correctly', () => {
        const nameInput = screen.getAllByTestId('row-input-name');
        const valueInput = screen.getAllByTestId('row-input-value');
        const priorityInput = screen.getAllByTestId('row-input-priority');

        expect(nameInput.length).toEqual(3);
        expect(valueInput.length).toEqual(3);
        expect(priorityInput.length).toEqual(3);

        expect(nameInput[0]).toHaveValue('Test State');
        expect(valueInput[0]).toHaveValue('10');
        expect(priorityInput[0]).toHaveValue(5);
    });

    test('calls onRowChange when the value changed', () => {
        const valueInput = screen.getAllByTestId('row-input-value');

        fireEvent.change(valueInput[0], { target: { value: 15 } });
        expect(mockOnRowChange.mock.calls[0][1]).toEqual({
            value: 15,
            name: 'Test State',
            priority: 5,
            inverseParent: [
                { value: 20, name: 'Child State 1', priority: 3 },
                { value: 30, name: 'Child State 2', priority: 2 },
            ],
        });
    });

    test('calls onRowChange when the name changed', () => {
        const nameInput = screen.getAllByTestId('row-input-name');

        fireEvent.change(nameInput[0], { target: { value: '' } });
        fireEvent.change(nameInput[1], { target: { value: 'New Child State 1' } });
        expect(mockOnRowChange.mock.calls[0][1]).toEqual({
            value: 10,
            name: '',
            priority: 5,
            inverseParent: [
                { value: 20, name: 'New Child State 1', priority: 3 },
                { value: 30, name: 'Child State 2', priority: 2 },
            ],
        });
    });

    test('calls onRowChange when the priority changed', () => {
        const priorityInput = screen.getAllByTestId('row-input-priority');

        fireEvent.change(priorityInput[0], { target: { value: 10 } });
        fireEvent.change(priorityInput[1], { target: { value: 1 } });
        expect(mockOnRowChange.mock.calls[0][1]).toEqual({
            value: 10,
            name: 'Test State',
            priority: 10,
            inverseParent: [
                { value: 20, name: 'New Child State 1', priority: 1 },
                { value: 30, name: 'Child State 2', priority: 2 },
            ],
        });
    });

    test('calls onRowChange when add button is clicked', () => {
        const addButton = screen.getAllByTestId('AddIcon');
        fireEvent.click(addButton[0]);
        expect(mockOnRowChange.mock.calls[0][1]).toEqual({
            value: 10,
            name: 'Test State',
            priority: 5,
            inverseParent: [{ value: 20, name: 'New Child State 1', priority: 1 }, { value: 30, name: 'Child State 2', priority: 2 }, {}],
        });
    });

    test('remove child', () => {
        const removeButton = screen.getAllByTestId('ClearIcon');
        fireEvent.click(removeButton[1]);

        expect(mockOnRowChange.mock.calls[0][1]).toEqual({
            value: 10,
            name: 'Test State',
            priority: 5,
            inverseParent: [{ value: 30, name: 'Child State 2', priority: 2 }],
        });
    });

    test('calls onRemove when remove button is clicked', () => {
        const removeButton = screen.getAllByTestId('ClearIcon');
        fireEvent.click(removeButton[0]);
        expect(mockOnRemove.mock.calls.length).toEqual(1);
    });
});
