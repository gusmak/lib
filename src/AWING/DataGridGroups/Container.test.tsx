import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Container from './Container';
import { initializeAtoms } from './Atoms';

// import { cellsState, fieldNamesState, groupFieldsState, pageListState } from './Atoms';

const getRender = (props?: any) => {
    render(<Container {...props} />);
};

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'),
    useAtom: jest.fn(),
    useAtomValue: jest.fn(),
    useSetAtom: jest.fn(),
}));

jest.mock('AWING', () => ({
    CircularProgress: () => {
        return <div data-testid="CircularProgress" />;
    },
}));

jest.mock('./TableCollaped', () => ({
    __esModule: true,
    default: ({ onFilter, totalCount }: any) => {
        return (
            <div>
                <p data-testid="totalCount">{totalCount}</p>
                <button onClick={onFilter} data-testid="TableCollaped-onFilter" />
            </div>
        );
    },
}));

jest.mock('./PanelGroup', () => ({
    __esModule: true,
    default: ({ onFilter }: any) => {
        return (
            <div>
                <p data-testid="PanelGroup" />
                <button onClick={onFilter} data-testid="PanelGroup-onFilter" />
            </div>
        );
    },
}));

describe('Render', () => {
    const atomInit = initializeAtoms<any>();
    beforeEach(() => {
        (useAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === atomInit.cells)
                return [
                    [
                        {
                            fieldName: 'campaign',
                            label: 'Campaign',
                            colWidth: '200px',
                            draggable: true,
                        },
                        {
                            fieldName: 'place',
                            colWidth: '200px',
                            draggable: true,
                        },
                        {
                            fieldName: 'date',
                            colWidth: '200px',
                            draggable: true,
                        },
                    ],
                    jest.fn(),
                ];
            if (atom === atomInit.groupFields) return [['campaign'], jest.fn()];
        });
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === atomInit.pageList) return { page: 1, pageSize: 10 };
        });
        (useSetAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === atomInit.fieldNames) return jest.fn();
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with title', () => {
        getRender({
            cells: [],
        });

        expect(screen.getByTestId('PanelGroup')).toBeInTheDocument();
    });

    it('should render CircularProgress', () => {
        getRender({
            cells: [],
            onFilter: jest.fn().mockResolvedValue({ items: [], totalCount: 0 }),
        });

        waitFor(() => {
            expect(screen.getByTestId('CircularProgress')).toBeInTheDocument();
        });
    });

    it('should render TableCollaped', () => {
        getRender({
            defaultFieldGroups: ['campaign'],
            cells: [
                {
                    fieldName: 'campaign',
                    label: 'Campaign',
                    colWidth: '200px',
                    draggable: true,
                },
                {
                    fieldName: 'place',
                    label: 'Place',
                    colWidth: '200px',
                    draggable: true,
                },
                {
                    fieldName: 'date',
                    colWidth: '200px',
                    draggable: true,
                },
            ],
            onFilter: jest.fn().mockResolvedValue({
                items: [
                    {
                        campaign: 'campaign',
                        place: 'place',
                        date: 'date',
                    },
                ],
                totalCount: 0,
            }),
        });

        waitFor(() => {
            expect(screen.getByTestId('TableCollaped')).toBeInTheDocument();
        });
    });
});

describe('Actions', () => {
    const atomInit = initializeAtoms<any>();

    beforeEach(() => {
        (useAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === atomInit.cells)
                return [
                    [
                        {
                            fieldName: 'campaign',
                            label: 'Campaign',
                            colWidth: '200px',
                            draggable: true,
                        },
                        {
                            fieldName: 'place',
                            colWidth: '200px',
                            draggable: true,
                        },
                        {
                            fieldName: 'date',
                            colWidth: '200px',
                            draggable: true,
                        },
                    ],
                    jest.fn(),
                ];
            if (atom === atomInit.groupFields) return [['campaign'], jest.fn()];
        });
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === atomInit.pageList) return { page: 1, pageSize: 10 };
        });
        (useSetAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === atomInit.fieldNames) return jest.fn();
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render TableCollaped', () => {
        const mockOnFilter = jest.fn().mockResolvedValue({
            items: [
                {
                    campaign: 'campaign',
                    place: 'place',
                    date: 'date',
                },
            ],
            totalCount: 0,
        });
        getRender({
            defaultFieldGroups: ['campaign'],
            cells: [
                {
                    fieldName: 'campaign',
                    label: 'Campaign',
                    colWidth: '200px',
                    draggable: true,
                },
                {
                    fieldName: 'place',
                    label: 'Place',
                    colWidth: '200px',
                    draggable: true,
                },
                {
                    fieldName: 'date',
                    colWidth: '200px',
                    draggable: true,
                },
            ],
            onFilter: mockOnFilter,
        });

        waitFor(() => {
            expect(screen.getByTestId('TableCollaped')).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('TableCollaped-onFilter'));
            expect(mockOnFilter).toHaveBeenCalled();
        });
    });

    it('should render TableCollaped', () => {
        const mockOnFilter = jest.fn().mockResolvedValue({
            items: [
                {
                    campaign: 'campaign',
                    place: 'place',
                    date: 'date',
                },
            ],
            totalCount: 0,
        });
        getRender({
            defaultFieldGroups: ['campaign'],
            cells: [
                {
                    fieldName: 'campaign',
                    label: 'Campaign',
                    colWidth: '200px',
                    draggable: true,
                },
                {
                    fieldName: 'place',
                    label: 'Place',
                    colWidth: '200px',
                    draggable: true,
                },
                {
                    fieldName: 'date',
                    colWidth: '200px',
                    draggable: true,
                },
            ],
            onFilter: mockOnFilter,
        });

        waitFor(() => {
            fireEvent.click(screen.getByTestId('PanelGroup-onFilter'));
            expect(mockOnFilter).toHaveBeenCalled();
        });
    });
});
