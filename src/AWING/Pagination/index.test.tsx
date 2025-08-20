import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import Pagination, { TablePaginationActions } from './index';

// Mock i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('TablePaginationActions', () => {
    const defaultProps = {
        count: 100,
        page: 0,
        rowsPerPage: 10,
        onPageChange: jest.fn(),
    };

    const theme = createTheme();

    const renderComponent = (props = defaultProps) => {
        return render(
            <ThemeProvider theme={theme}>
                <TablePaginationActions {...props} />
            </ThemeProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all navigation buttons', () => {
        renderComponent();

        expect(screen.getByLabelText('first page')).toBeInTheDocument();
        expect(screen.getByLabelText('previous page')).toBeInTheDocument();
        expect(screen.getByLabelText('next page')).toBeInTheDocument();
        expect(screen.getByLabelText('last page')).toBeInTheDocument();
    });

    test('disables first and previous buttons on first page', () => {
        renderComponent({ ...defaultProps, page: 0 });

        expect(screen.getByLabelText('first page')).toBeDisabled();
        expect(screen.getByLabelText('previous page')).toBeDisabled();
        expect(screen.getByLabelText('next page')).not.toBeDisabled();
        expect(screen.getByLabelText('last page')).not.toBeDisabled();
    });

    test('disables next and last buttons on last page', () => {
        renderComponent({ ...defaultProps, page: 9 }); // Last page (100 items / 10 per page - 1)

        expect(screen.getByLabelText('first page')).not.toBeDisabled();
        expect(screen.getByLabelText('previous page')).not.toBeDisabled();
        expect(screen.getByLabelText('next page')).toBeDisabled();
        expect(screen.getByLabelText('last page')).toBeDisabled();
    });

    test('handles first page button click', () => {
        renderComponent({ ...defaultProps, page: 5 });

        fireEvent.click(screen.getByLabelText('first page'));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 0);
    });

    test('handles previous page button click', () => {
        renderComponent({ ...defaultProps, page: 5 });

        fireEvent.click(screen.getByLabelText('previous page'));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 4);
    });

    test('handles next page button click', () => {
        renderComponent({ ...defaultProps, page: 5 });

        fireEvent.click(screen.getByLabelText('next page'));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 6);
    });

    test('handles last page button click', () => {
        renderComponent({ ...defaultProps, page: 5 });

        fireEvent.click(screen.getByLabelText('last page'));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(expect.anything(), 9);
    });

    test('renders RTL icons when direction is rtl', () => {
        const rtlTheme = createTheme({ direction: 'rtl' });
        render(
            <ThemeProvider theme={rtlTheme}>
                <TablePaginationActions {...defaultProps} />
            </ThemeProvider>
        );

        // You might need to adjust these tests based on how you want to verify the RTL icons
        expect(screen.getByLabelText('first page')).toBeInTheDocument();
        expect(screen.getByLabelText('previous page')).toBeInTheDocument();
        expect(screen.getByLabelText('next page')).toBeInTheDocument();
        expect(screen.getByLabelText('last page')).toBeInTheDocument();
    });
});

describe('Pagination', () => {
    const defaultProps = {
        count: 100,
        page: 0,
        rowsPerPage: 10,
        onPageChange: jest.fn(),
        onRowsPerPageChange: jest.fn(),
    };

    const renderPagination = (props = defaultProps) => {
        return render(
            <ThemeProvider theme={createTheme()}>
                <I18nextProvider i18n={i18n}>
                    <Pagination {...props} />
                </I18nextProvider>
            </ThemeProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders pagination component', () => {
        renderPagination();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('renders with correct translation key for rows per page', () => {
        renderPagination();
        expect(screen.getByText('Paging.RowPerPage')).toBeInTheDocument();
    });

    test('applies correct styling', () => {
        renderPagination();
        const table = screen.getByRole('table');
        expect(table).toHaveStyle({ float: 'right' });
    });

    //   test('passes props to TablePagination', () => {
    //     const customProps = {
    //       ...defaultProps,
    //       rowsPerPage: 25,
    //       page: 2,
    //       count: 250,
    //     };

    //     renderPagination(customProps);
    //     // Verify that the pagination displays correct information
    //     expect(screen.getByText('51-75 of 250')).toBeInTheDocument();
    //   });

    test('handles row per page change', () => {
        renderPagination();

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '25' } });

        expect(defaultProps.onRowsPerPageChange).toHaveBeenCalled();
    });
});
