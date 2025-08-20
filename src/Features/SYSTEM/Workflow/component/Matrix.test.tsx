import { render, fireEvent, cleanup } from '@testing-library/react';
import { StateType, WorkflowMatrix, WorkflowState } from '../types';
import Matrix from './Matrix';

jest.mock('@mui/material', () => {
    return {
        ...jest.requireActual('@mui/material'),
        TextField: (props: any) => <input role="input" onChange={props.onChange} />,
    };
});

describe('Matrix', () => {
    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    const defaultWorkflowMatrices: StateType<WorkflowMatrix>[] = [{ stateStart: '1', stateEnd: '2', priority: 1 }];
    const defaultWorkflowStates: WorkflowState[] = [
        {
            id: '1',
            name: 'State 1',
            priority: 0,
            level: 0,
            value: 0,
            inverseParent: [],
        },
        {
            id: '2',
            name: 'State 2',
            priority: 0,
            level: 0,
            value: 0,
            inverseParent: [],
        },
    ];
    const mockOnChanged = jest.fn();
    test('should render correctly', () => {
        const { getAllByTestId } = render(
            <Matrix workflowMatrices={defaultWorkflowMatrices} selectableStates={defaultWorkflowStates} onChanged={mockOnChanged} />
        );
        const matrixRows = getAllByTestId('matrix-row');
        expect(matrixRows).toHaveLength(1);
    });

    test("should update the matrix when the 'State Start' field is changed", () => {
        const { getAllByRole } = render(
            <Matrix workflowMatrices={defaultWorkflowMatrices} selectableStates={defaultWorkflowStates} onChanged={mockOnChanged} />
        );

        const input = getAllByRole('input');
        expect(input).toHaveLength(3);

        fireEvent.change(input[0], { target: { value: '2' } });

        expect(mockOnChanged.mock.calls.length).toEqual(1);
    });

    test("should update the matrix when the 'State End' field is changed", () => {
        const { getAllByRole } = render(
            <Matrix workflowMatrices={defaultWorkflowMatrices} selectableStates={defaultWorkflowStates} onChanged={mockOnChanged} />
        );
        const input = getAllByRole('input');
        expect(input).toHaveLength(3);

        fireEvent.change(input[1], { target: { value: '2' } });

        expect(mockOnChanged.mock.calls.length).toEqual(1);
    });

    test("should create a new matrix row when the 'Create' button is clicked", () => {
        const { getByRole } = render(<Matrix workflowMatrices={[]} selectableStates={defaultWorkflowStates} onChanged={mockOnChanged} />);

        const createButton = getByRole('button', { name: /create/i });
        fireEvent.click(createButton);
        expect(mockOnChanged.mock.calls.length).toEqual(1);
        expect(mockOnChanged.mock.calls[0][0]).toEqual([{}]);
    });

    test("should update the matrix when the 'Priority' field is changed", () => {
        const { getAllByRole } = render(
            <Matrix workflowMatrices={defaultWorkflowMatrices} selectableStates={defaultWorkflowStates} onChanged={mockOnChanged} />
        );

        const input = getAllByRole('input');
        expect(input).toHaveLength(3);

        fireEvent.change(input[2], { target: { value: '2' } });

        expect(mockOnChanged.mock.calls.length).toEqual(1);
        expect(mockOnChanged.mock.calls[0][0][0].priority).toEqual('2');
    });

    test("should delete a matrix row when the 'Delete' button is clicked", () => {
        const { getAllByTestId } = render(
            <Matrix workflowMatrices={defaultWorkflowMatrices} selectableStates={defaultWorkflowStates} onChanged={mockOnChanged} />
        );

        const deleteButtons = getAllByTestId('ClearIcon');
        fireEvent.click(deleteButtons[0]);
        expect(mockOnChanged.mock.calls.length).toEqual(1);
        expect(mockOnChanged.mock.calls[0][0]).toEqual([]);
    });
});
