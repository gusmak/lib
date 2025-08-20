import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import CreateOrEdit from './CreateOrEdit';
import { Workflow } from './types';

jest.mock('Context', () => ({
    ...jest.requireActual('Context'),
    useAppHelper: () => ({
        confirm: jest.fn(),
        snackbar: jest.fn(),
    }),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

jest.mock('./component/Information', () => (props: any) => (
    <input
        role="input1"
        onClick={() => props.onUpdateFormValid(props.formData, true, 'true')}
        onBlur={() =>
            props.onUpdateFormValid(
                {
                    name: 'string',
                    objectTypeCode: 'string',
                    stateFieldName: 'string',
                    workflowMatrices: [],
                    workflowStates: [],
                },
                true,
                'true'
            )
        }
    />
));
jest.mock('./component/State', () => (props: any) => (
    <input
        role="input2"
        onClick={() => props.onChanged(props.workflowStates)}
        onBlur={() =>
            props.onChanged([
                {
                    id: '1',
                    level: 0,
                    value: 1,
                    name: 'State 1',
                    priority: 0,
                    inverseParent: [{ id: '3', level: 1, value: 2, name: 'Child State 1', priority: 0, inverseParent: [] }],
                },
                {
                    id: '2',
                    level: 0,
                    value: 2,
                    name: 'State 2',
                    priority: 0,
                    inverseParent: [],
                },
            ])
        }
    />
));
jest.mock('./component/Matrix', () => (props: any) => <input role="input3" onClick={() => props.onChanged(props.workflowMatrices)} />);

describe('CreateOrEdit component', () => {
    beforeEach(() => {
        (useTranslation as jest.Mock).mockReturnValue({ t: (key: string) => key });
        (useParams as jest.Mock).mockReturnValue({ id: undefined });
    });

    afterEach(() => {
        jest.resetAllMocks();
        cleanup();
    });

    it('calls create when submitting a new workflow', async () => {
        const mockGetById = jest.fn();
        const mockCreate = jest.fn();
        const mockUpdate = jest.fn();

        const { getAllByRole, getByRole } = render(
            <BrowserRouter>
                <CreateOrEdit
                    getById={mockGetById}
                    create={mockCreate}
                    update={mockUpdate}
                    objectTypeCodeMap={[{ value: 'string', label: 'l' }]}
                />
            </BrowserRouter>
        );

        const tabs = getAllByRole('tab');
        expect(tabs).toHaveLength(2);

        const button = getAllByRole('button');
        expect(button[1]).toBeDisabled();

        // change information
        const input1 = getByRole('input1');
        fireEvent.blur(input1);

        // change state
        fireEvent.click(tabs[1]);
        const input2 = getByRole('input2');
        fireEvent.blur(input2);

        fireEvent.click(button[1]); //Nút save là nút thứ hai sau nút close
        expect(button[1]).not.toBeDisabled();

        await waitFor(() => {
            expect(mockCreate).toHaveBeenCalledWith({
                name: 'string',
                objectTypeCode: 'string',
                stateFieldName: 'string',
                workflowStates: expect.any(Array),
                workflowMatrices: [],
            });
        });
    });

    it('calls getById when id is provided then update', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        const mockWorkflow: Workflow = {
            id: 1,
            name: 'string',
            objectTypeCode: 'string',
            stateFieldName: 'string',
            description: 'string',
            workflowMatrices: [
                {
                    id: 1,
                    priority: 0,
                    stateStart: '1',
                    stateStartNavigation: {
                        id: '1',
                        level: 0,
                        value: 1,
                        name: 'State 1',
                        priority: 0,
                        inverseParent: [{ id: '3', level: 2, value: 2, name: 'Child State 1', priority: 0, inverseParent: [] }],
                    },
                    stateEnd: '2',
                    stateEndNavigation: {
                        id: '2',
                        level: 0,
                        value: 2,
                        name: 'State 2',
                        priority: 0,
                        inverseParent: [],
                    },
                },
            ],
            workflowStates: [
                {
                    id: '1',
                    level: 0,
                    value: 1,
                    name: 'State 1',
                    priority: 0,
                    inverseParent: [{ id: '3', level: 1, value: 2, name: 'Child State 1', priority: 0, inverseParent: [] }],
                },
                {
                    id: '2',
                    level: 0,
                    value: 2,
                    name: 'State 2',
                    priority: 0,
                    inverseParent: [],
                },
            ],
        };

        const mockGetById = jest.fn((id: number) => {
            return new Promise<Workflow>((resolve, reject) => {
                resolve(mockWorkflow);
            });
        });

        const mockCreate = jest.fn();
        const mockUpdate = jest.fn();

        const { getAllByRole, getByRole } = render(
            <BrowserRouter>
                <CreateOrEdit
                    getById={mockGetById}
                    create={mockCreate}
                    update={mockUpdate}
                    objectTypeCodeMap={[{ value: 'string', label: 'l' }]}
                />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockGetById).toHaveBeenCalledWith(1);
        });

        const tabs = getAllByRole('tab');
        expect(tabs).toHaveLength(3);

        const button = getAllByRole('button');
        expect(button[1]).toBeDisabled();

        // change state
        fireEvent.click(tabs[1]);
        const input2 = getByRole('input2');
        fireEvent.click(input2);

        // change information
        fireEvent.click(tabs[0]);
        const input1 = getByRole('input1');
        fireEvent.click(input1);

        // change matrix
        fireEvent.click(tabs[2]);
        const input3 = getByRole('input3');
        fireEvent.click(input3);

        fireEvent.click(button[1]); //Nút save là nút thứ hai sau nút close
        expect(button[1]).not.toBeDisabled();

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(1, {
                name: 'string',
                objectTypeCode: 'string',
                stateFieldName: 'string',
                description: 'string',
                workflowStates: expect.any(Array),
                workflowMatrices: expect.any(Array),
            });
        });
    });
});
