import { render, cleanup, fireEvent } from '@testing-library/react';
import Container from './container';
import { Workflow } from './types';
import { PagingQueryInput, PagingType } from '../types';

jest.mock('Context', () => ({
    ...jest.requireActual('Context'),
    useAppHelper: () => ({
        confirm: jest.fn(),
        snackbar: jest.fn(),
    }),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => jest.fn(),
}));

jest.mock('AWING', () => {
    return {
        ...jest.requireActual('AWING'),
        PageManagement: (props: any) => (
            <input
                role="input"
                onClick={() => props.onDelete(3)}
                onBlur={() => props.onChangeQueryInput({})}
                onAbort={() => props.showNotificationSuccess()}
                onCopy={() => props.onCreateButtonClick({})}
                onPaste={() => props.onRowClick({})}
            />
        ),
    };
});

describe('Container component', () => {
    afterEach(() => {
        jest.resetAllMocks();
        cleanup();
    });

    it('should render', () => {
        const mockGetPaging = jest.fn((queryInput: PagingQueryInput<Workflow>) => {
            return new Promise<PagingType<Workflow>>((resolve, reject) => {
                resolve({
                    items: [
                        {
                            id: 1,
                            name: 'string',
                            objectTypeCode: 'string;',
                            stateFieldName: 'string;',
                            description: 'string;',
                            workflowMatrices: [],
                            workflowStates: [],
                        },
                        {
                            id: 2,
                            name: 'string',
                            objectTypeCode: 'string;',
                            stateFieldName: 'string;',
                            description: 'string;',
                            workflowMatrices: [],
                            workflowStates: [],
                        },
                        {
                            id: 3,
                            name: 'string',
                            objectTypeCode: 'string;',
                            stateFieldName: 'string;',
                            description: 'string;',
                            workflowMatrices: [],
                            workflowStates: [],
                        },
                    ],
                    totalCount: 43,
                });
            });
        });

        const mockRemove = jest.fn();

        const { getAllByRole } = render(<Container getPaging={mockGetPaging} remove={mockRemove} />);

        const input = getAllByRole('input');
        expect(input).toHaveLength(1);

        fireEvent.blur(input[0]);
        expect(mockGetPaging.mock.calls.length).toEqual(1);

        fireEvent.click(input[0]);

        fireEvent.abort(input[0]);
        fireEvent.copy(input[0]);
        fireEvent.paste(input[0]);

        expect(mockRemove.mock.calls.length).toEqual(1);
        expect(mockRemove).toHaveBeenCalledWith(3);
    });
});
