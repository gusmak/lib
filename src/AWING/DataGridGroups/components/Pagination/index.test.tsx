import { fireEvent, render, screen } from '@testing-library/react';
import Pagination from './index';

const getRender = (props?: any) => {
    render(<Pagination {...props} />);
};

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    TablePagination: ({ onPageChange, onRowsPerPageChange }: any) => {
        return (
            <div>
                <p data-testid="TablePagination">TablePagination</p>
                <button onClick={(e: any) => onPageChange(e.target.newPage)} data-testid="TablePagination-onPageChange" />
                <button onClick={(e: any) => onRowsPerPageChange(e)} data-testid="TablePagination-onRowsPerPageChange" />
            </div>
        );
    },
}));

describe('Render and Actions', () => {
    it('should render with title', () => {
        getRender();

        expect(screen.getByTestId('TablePagination')).toBeInTheDocument();
    });

    it('should call onPageChange', () => {
        const mockhandleChangePage = jest.fn();

        getRender({
            handleChangePage: mockhandleChangePage,
        });

        fireEvent.click(screen.getByTestId('TablePagination-onPageChange'));
        expect(mockhandleChangePage).toHaveBeenCalled();
    });

    it('should call mockhandleChangeRowsPerPage', () => {
        const mockhandleChangeRowsPerPage = jest.fn();

        getRender({
            handleChangeRowsPerPage: mockhandleChangeRowsPerPage,
        });

        fireEvent.click(screen.getByTestId('TablePagination-onRowsPerPageChange'));
        expect(mockhandleChangeRowsPerPage).toHaveBeenCalled();
    });
});
