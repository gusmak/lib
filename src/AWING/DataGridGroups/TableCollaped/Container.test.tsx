import { fireEvent, render, screen } from '@testing-library/react';
import Container from './Container';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { initializeAtoms } from '../Atoms';

const getRender = (props?: any) => {
    render(<Container {...props} />);
};

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'), // Giữ nguyên các hàm khác của Jotai
    useAtom: jest.fn(),
    useSetAtom: jest.fn(),
    useAtomValue: jest.fn(),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    TableCell: ({ children, onDragStart, onDragOver, onDrop }: any) => {
        return (
            <td>
                {children}
                <button onClick={(e: any) => onDragStart(e)} data-testid="TableCell-onDragStart" />
                <button onClick={(e: any) => onDragOver(e)} data-testid="TableCell-onDragOver" />
                <button onClick={(e: any) => onDrop(e)} data-testid="TableCell-onDrop" />
            </td>
        );
    },
}));

jest.mock('../components/Pagination', () => ({
    __esModule: true,
    default: () => {
        return (
            <div>
                <p data-testid="Pagination">Pagination</p>
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

jest.mock('./RowAdvance', () => ({
    __esModule: true,
    default: () => {
        return (
            <div>
                <p data-testid="RowAdvance">RowAdvance</p>
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

describe('Render', () => {
    const initAtoms = initializeAtoms<any>();
    beforeEach(() => {
        (useAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.pageList) return [{ pageIndex: 0, pageSize: 10 }, jest.fn()];
            if (atom === initAtoms.groupFields) return [['campaign', 'palce'], jest.fn()];
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
                        label: 'Place',
                        colWidth: '200px',
                        draggable: true,
                    },
                    {
                        label: 'Date',
                        colWidth: '200px',
                        draggable: true,
                    },
                ];
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with empty', () => {
        getRender({
            rows: [],
            totalCount: 0,
        });

        expect(screen.getByText('#')).toBeInTheDocument();
        expect(screen.getByTestId('NoDataTable')).toBeInTheDocument();
    });

    it('should render with children', () => {
        getRender({
            rows: [
                {
                    groupKeyId: '1',
                    campaign: 'Demo campaign',
                },
            ],
            totalCount: 0,
        });

        expect(screen.getByTestId('RowAdvance')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    const initAtoms = initializeAtoms<any>();
    beforeEach(() => {
        (useAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.pageList) return [{ pageIndex: 0, pageSize: 10 }, jest.fn()];
            if (atom === initAtoms.groupFields) return [['campaign', 'palce'], jest.fn()];
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
                        label: 'Place',
                        colWidth: '200px',
                        draggable: true,
                    },
                    {
                        fieldName: 'date',
                        label: 'Date',
                        colWidth: '200px',
                        draggable: false,
                    },
                ];
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call Pagination changed', () => {
        getRender({
            rows: [],
            totalCount: 0,
        });

        fireEvent.click(screen.getByTestId('Pagination-handleChangePage'));
        fireEvent.click(screen.getByTestId('Pagination-handleChangeRowsPerPage'));
        expect(screen.getByTestId('Pagination-colSpan')).toHaveTextContent('4');
    });

    it('should call TableCell onDragStart', () => {
        const mockSetDragging = jest.fn();
        (useSetAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.dragging) return mockSetDragging;
        });

        getRender({
            rows: [],
            totalCount: 0,
        });

        fireEvent.click(screen.getAllByTestId('TableCell-onDragStart')[2], {
            target: {
                id: 'date',
            },
        });
        fireEvent.click(screen.getAllByTestId('TableCell-onDragStart')[2], {
            target: {
                id: 'place',
            },
        });
        expect(mockSetDragging).toHaveBeenCalled();
    });

    it('should call TableCell onDragStart', () => {
        const mockPreventDefault = jest.fn();

        getRender({
            rows: [],
            totalCount: 0,
        });

        fireEvent.click(screen.getAllByTestId('TableCell-onDragOver')[2], {
            preventDefault: mockPreventDefault(),
        });
        expect(mockPreventDefault).toHaveBeenCalled();
    });

    it('should call TableCell onDrop', () => {
        const mockSetDragging = jest.fn();
        (useSetAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.dragging) return mockSetDragging;
        });
        const mockPreventDefault = jest.fn();

        getRender({
            rows: [],
            totalCount: 0,
        });

        fireEvent.click(screen.getAllByTestId('TableCell-onDrop')[2], {
            preventDefault: mockPreventDefault(),
            dataTransfer: {
                getData: jest.fn(),
            },
        });
        expect(mockPreventDefault).toHaveBeenCalled();
    });
});
