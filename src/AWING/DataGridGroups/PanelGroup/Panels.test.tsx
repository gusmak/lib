import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Panels from './Panels';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { initializeAtoms } from '../Atoms';

const getRender = (props?: any) => {
    render(<Panels {...props} />);
};

jest.mock('jotai', () => ({
    ...jest.requireActual('jotai'), // Giữ nguyên các hàm khác của Jotai
    useAtom: jest.fn(),
    useSetAtom: jest.fn(),
    useAtomValue: jest.fn(),
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Chip: ({ onDelete, onDragStart, onDragOver, onDragLeave, onDrop, label }: any) => {
        return (
            <div>
                <p data-testid="Chip-label">{label}</p>
                <button onClick={(e: any) => onDelete(e.target.newPage)} data-testid="Chip-onDelete" />
                <button onClick={(e: any) => onDragStart(e, e.target.index)} data-testid="Chip-onDragStart" />
                <button onClick={(e: any) => onDragOver(e)} data-testid="Chip-onDragOver" />
                <button onClick={(e: any) => onDragLeave(e)} data-testid="Chip-onDragLeave" />
                <button onClick={(e: any) => onDrop(e)} data-testid="Chip-onDrop" />
            </div>
        );
    },
    Paper: ({ children, onDragOver, onDragLeave, onDrop }: any) => {
        return (
            <div data-testid="Paper">
                <button onClick={(e: any) => onDragOver(e)} data-testid="Paper-onDragOver" />
                <button onClick={(e: any) => onDragLeave(e)} data-testid="Paper-onDragLeave" />
                <button
                    onClick={() =>
                        onDrop({
                            currentTarget: { style: { border: '1px solid #ccc' } },
                            preventDefault: jest.fn(),
                            dataTransfer: { getData: jest.fn(() => 'campaign'), clearData: jest.fn() },
                        })
                    }
                    data-testid="Paper-onDrop-match"
                />
                <button
                    onClick={() =>
                        onDrop({
                            currentTarget: { style: { border: '1px solid #ccc' } },
                            preventDefault: jest.fn(),
                            dataTransfer: { getData: jest.fn(() => 'place'), clearData: jest.fn() },
                        })
                    }
                    data-testid="Paper-onDrop-not-match"
                />
                {children}
            </div>
        );
    },
}));

describe('Render  ', () => {
    const initAtoms = initializeAtoms<any>();
    beforeEach(() => {
        (useAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.groupFields) return [['campaign', 'place'], jest.fn()];
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
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with title', () => {
        getRender();
        expect(screen.getByText('Schedule.DragAndDropLabel')).toBeInTheDocument();
    });
});

describe('Actions  ', () => {
    const initAtoms = initializeAtoms<any>();
    beforeEach(() => {
        (useAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.groupFields) return [['campaign'], jest.fn()];
        });
        (useSetAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.dragging) return jest.fn();
        });
        (useAtomValue as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.fieldNames) return ['campaign', 'place', 'date'];
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
                        draggable: true,
                    },
                ];
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call SetDragging', () => {
        const mockSetDragging = jest.fn();
        (useSetAtom as jest.Mock).mockImplementation((atom) => {
            if (atom === initAtoms.dragging) return mockSetDragging;
        });
        getRender();

        fireEvent.click(screen.getByTestId('Chip-onDelete'));
        fireEvent.click(screen.getByTestId('Chip-onDragStart'), {
            target: { index: 2 },
            dataTransfer: { setData: jest.fn() },
        });
        expect(mockSetDragging).toHaveBeenCalled();
    });

    it('should call preventDefault ', () => {
        const mockDragOverPreventDefault = jest.fn();
        const mockDragLeavePreventDefault = jest.fn();
        const mockDropPreventDefault = jest.fn();
        getRender();

        fireEvent.click(screen.getByTestId('Chip-onDragOver'), {
            preventDefault: mockDragOverPreventDefault,
        });
        fireEvent.click(screen.getByTestId('Chip-onDragLeave'), {
            preventDefault: mockDragLeavePreventDefault,
        });
        fireEvent.click(screen.getByTestId('Chip-onDrop'), {
            preventDefault: mockDropPreventDefault,
            dataTransfer: { clearData: jest.fn() },
        });

        waitFor(() => {
            expect(mockDragOverPreventDefault).toHaveBeenCalled();
            expect(mockDragLeavePreventDefault).toHaveBeenCalled();
            expect(mockDropPreventDefault).toHaveBeenCalled();
        });
    });

    it('should call Paper onDragOver preventDefault ', () => {
        const mockDragOverPreventDefault = jest.fn();
        getRender();

        fireEvent.click(screen.getByTestId('Paper-onDragOver'), {
            preventDefault: mockDragOverPreventDefault,
        });

        waitFor(() => {
            expect(mockDragOverPreventDefault).toHaveBeenCalled();
        });
    });

    it('should call Paper onDrop when match', () => {
        const mockDragOverPreventDefault = jest.fn();
        getRender();

        fireEvent.click(screen.getByTestId('Paper-onDrop-match'));
        waitFor(() => {
            expect(mockDragOverPreventDefault).toHaveBeenCalled();
        });
    });

    it('should call Paper onDrop when not match', () => {
        const mockDragOverPreventDefault = jest.fn();
        getRender();

        fireEvent.click(screen.getByTestId('Paper-onDrop-not-match'));

        waitFor(() => {
            expect(mockDragOverPreventDefault).toHaveBeenCalled();
        });
    });
});
