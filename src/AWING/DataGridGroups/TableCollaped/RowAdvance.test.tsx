import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RowContainer from './RowAdvance';
import { useAtom, useAtomValue } from 'jotai';
import { initializeAtoms } from '../Atoms';

const getRender = (props?: any) => {
    render(<RowContainer {...props} />);
};

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'), // Giữ nguyên các hàm khác của Jotai
    useAtom: jest.fn(),
    useSetAtom: jest.fn(),
    useAtomValue: jest.fn(),
}));

jest.mock('@mui/icons-material', () => ({
    ...jest.requireActual('@mui/icons-material'),
    KeyboardArrowDown: () => {
        return <button data-testid="KeyboardArrowDownIcon" />;
    },
    KeyboardArrowUp: () => {
        return <button data-testid="KeyboardArrowUpIcon" />;
    },
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    IconButton: ({ onClick, children, id }: any) => {
        return (
            <div>
                {children}
                <button onClick={(e: any) => onClick()} data-testid={`${id}-IconButton-onClick`} />;
            </div>
        );
    },
}));

jest.mock('../components/NoDataTable', () => ({
    __esModule: true,
    default: () => {
        return (
            <div>
                <p data-testid="NoDataTable">NoDataTable</p>
            </div>
        );
    },
}));

jest.mock('../components/Pagination', () => ({
    __esModule: true,
    default: ({ handleChangePage, handleChangeRowsPerPage, colSpan }: any) => {
        return (
            <div>
                <p data-testid="Pagination">Pagination</p>
                <p data-testid="Pagination-colSpan">{colSpan}</p>
                <button onClick={(e: any) => handleChangePage(e.target.newPage)} data-testid="Pagination-handleChangePage" />
                <button onClick={(e: any) => handleChangeRowsPerPage(e)} data-testid="Pagination-handleChangeRowsPerPage" />
            </div>
        );
    },
}));

jest.mock('AWING', () => ({
    CircularProgress: () => <p data-testid="CircularProgress">CircularProgress</p>,
}));

describe('Render', () => {
    const initAtoms = initializeAtoms<any>();

    beforeEach(() => {
        (useAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.rootFilters) return [[{ key: '', id: '' }], jest.fn()];
        });
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.cells)
                return [
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
                ];

            if (atom === initAtoms.groupFields) return ['campaign'];
            if (atom === initAtoms.fieldNames) return ['campaign', 'place', 'date'];
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with title', () => {
        getRender({
            row: { groupKeyId: '1', campaign: 'Demo campaign' },
            level: 0,
            stt: 1,
        });

        expect(screen.getByTestId('KeyboardArrowDownIcon')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    const initAtoms = initializeAtoms<any>();

    beforeEach(() => {
        (useAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.rootFilters) return [[{ key: '', id: '' }], jest.fn()];
        });
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.cells)
                return [
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
                ];

            if (atom === initAtoms.groupFields) return ['campaign'];
            if (atom === initAtoms.fieldNames) return ['campaign', 'place', 'date'];
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render CircularProgress', () => {
        getRender({
            row: { groupKeyId: '100', campaign: 'Demo campaign' },
            level: 0,
            stt: 1,
        });

        fireEvent.click(screen.getByTestId('100-IconButton-onClick'));
        expect(screen.getByTestId('CircularProgress')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('100-IconButton-onClick'));
    });

    it('should render with children is NoDataTable', async () => {
        getRender({
            row: { groupKeyId: '100', campaign: 'Demo campaign' },
            level: 0,
            stt: 1,
            onFilter: jest.fn().mockResolvedValue({
                items: [],
                totalCount: 0,
            }),
        });

        fireEvent.click(screen.getByTestId('100-IconButton-onClick'));

        await waitFor(() => {
            expect(screen.getByTestId('Pagination')).toBeInTheDocument();

            fireEvent.click(screen.getByTestId('Pagination-handleChangePage'), {
                target: { newPage: 2 },
            });
            fireEvent.click(screen.getByTestId('Pagination-handleChangeRowsPerPage'), {
                target: { value: 3 },
            });
            expect(screen.getByTestId('NoDataTable')).toBeInTheDocument();
        });
    });

    it('should render with children Recursive', async () => {
        getRender({
            row: { groupKeyId: '100', campaign: 'Demo campaign' },
            level: 0,
            stt: 1,
            onFilter: jest.fn().mockResolvedValue({
                items: [
                    {
                        date: '2025-03-17',
                    },
                ],
                totalCount: 0,
            }),
        });

        fireEvent.click(screen.getByTestId('100-IconButton-onClick'));

        await waitFor(() => {
            expect(screen.getByTestId('Pagination')).toBeInTheDocument();
            expect(screen.getByText('2025-03-17')).toBeInTheDocument();
        });
    });
});
