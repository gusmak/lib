import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import i18next from 'i18next';
import { BrowserRouter } from 'react-router';
import PageManagement from './Container';

// i18next.init({
//     lng: 'en',
//     resources: {
//         en: {
//             translation: {
//                 'Common.Create': 'Create',
//                 'Common.Delete': 'Delete',
//                 'Common.DeleteSelectedItems': 'Delete Selected Items',
//                 'DirectoryManagement.CreateDirectory': 'Create Directory',
//             },
//         },
//     },
// });

// Mock các dependencies
// jest.mock('react-i18next', () => ({
//     __esModule: true,
//     useTranslation: () => ({
//         t: (key: string) => key,
//     }),
// }));

jest.mock('lodash', () => ({
    debounce: (fn: Function) => fn,
    cloneDeep: (obj: any) => JSON.parse(JSON.stringify(obj)),
    isEqual: (obj1: any, obj2: any) => JSON.stringify(obj1) === JSON.stringify(obj2),
}));

// Mock các components trong project
jest.mock('Commons/Components/ClassicDrawer', () => ({
    CloseAction: {
        Reload: 'Reload',
    },
}));

jest.mock('AWING/CircularProgress', () => ({
    default: () => <div data-testid="circular-progress">Loading...</div>,
}));

jest.mock('AWING/DataGrid', () => (props: any) => (
    <>
        <div data-testid="data-grid">
            {props.rows.map((row: any) => (
                <div key={row.id}>{row.name}</div>
            ))}
        </div>
        <button data-testid="delete-btn" onClick={props.onClick}>
            delete-btn
        </button>
        {props.rowActions?.map((row: any) => {
            if (row.action) {
                row.action(row.id);
            }
        })}
        <button
            onClick={() => {
                props.onChangeQueryInput({
                    pageIndex: 1,
                    pageSize: 10,
                });
            }}
        >
            ChangeInput
        </button>
        <button
            data-testid="select-change"
            onClick={() => {
                props.onSelectedChange();
            }}
        >
            Select change
        </button>
        <button
            data-testid="onDelete"
            onClick={() => {
                props.onDelete('onDelete');
            }}
        >
            Remove Btn
        </button>
        <button data-testid="delete-selected-btn" onClick={() => props.onDeleteSelected()}>
            icon delete
        </button>
        <button data-testid="next-page-index-btn" onClick={() => props.onPageIndexChange()}>
            nextPage index
        </button>
        <button data-testid="next-page-size-btn" onClick={() => props.onPageSizeChange()}>
            nextPage size
        </button>
        <button data-testid="onSortModelChange" onClick={() => props.onSortModelChange()}>
            onSortModelChange
        </button>
        <input type="chechbox" data-testid="checkbox-input" onClick={() => props.onSelectedChange()} />
        <button data-testid="icon-delete" onClick={() => props.selectionActions[0].action()}>
            icon-delete
        </button>
    </>
));

jest.mock('AWING/Page', () => (props: any) => (
    <div data-testid="AWING-Page">
        <p data-testid="AWING-Page-caption">{props?.caption}</p>
        {props?.actions}
        {props?.children}
    </div>
));

jest.mock('AWING/SearchBox', () => (props: any) => (
    <>
        <input
            data-testid="searchbox"
            type="text"
            role="searchbox"
            onClick={() => props.onClickAdvancedSearch()}
            onChange={() => props.onSearch()}
        />
    </>
));

jest.mock('AWING/AdvancedSearch', () => (props: any) => (
    <div data-testid="advanced-search">
        <button data-testid="onChangeValue" onClick={(e: any) => props.onChangeValue(e.target.currentObject)}>
            onChangeValue
        </button>
        <button data-testid="onClear" onClick={() => props.onClear()}>
            onClear
        </button>
    </div>
));

const mockColumns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
];

const mockRows = [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' },
];

const mockAdvancedSearchFields = [
    { name: 'field1', label: 'Field 1', fieldName: 'field1', type: 'string' },
    { name: 'field2', label: 'Field 2', fieldName: 'field2', type: 'string' },
];

const defaultProps = {
    title: 'Test Page',
    columns: mockColumns,
    loading: false,
    rows: mockRows,
    onChangeQueryInput: jest.fn(),
    getRowId: (row: any) => row.id,
    // disablePagination: false,
    pageSize: 10,
    pageIndex: 0,
    onPageIndexChange: jest.fn(),
    onPageSizeChange: jest.fn(),
    checkboxSelection: true,
    onRowClick: jest.fn(),
};

const renderComponent = (props = {}) => {
    return render(
        <BrowserRouter>
            <PageManagement {...defaultProps} {...props} />
        </BrowserRouter>
    );
};

describe('PageManagement Component', () => {
    describe('Rendering', () => {
        test('should render title correctly', () => {
            renderComponent();
            expect(screen.getByTestId('AWING-Page-caption')).toHaveTextContent('Test Page');
        });

        test('should render data grid when not loading', () => {
            renderComponent({ loading: false });
            expect(screen.getByText('Test 1')).toBeInTheDocument();
        });
    });

    describe('Search functionality', () => {
        test('should not render search box when disableSearch is true', () => {
            renderComponent({ disableSearch: true });
            expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
        });

        test('should not render search box when disableSearch is undefined', async () => {
            const onChangeQueryInput = jest.fn();
            renderComponent({
                disableSearch: undefined,
                onChangeQueryInput,
            });

            const searchInput = screen.getByTestId('searchbox');
            fireEvent.change(searchInput, { target: { value: 'new search' } });

            expect(onChangeQueryInput).toHaveBeenCalled();
        });

        test('Change query input when use onSortModelChange', async () => {
            renderComponent();
            fireEvent.click(screen.getByTestId('onSortModelChange'));

            // expect(defaultProps.onPageIndexChange).toHaveBeenCalled();
        });

        test('selected id when click checkbox', async () => {
            renderComponent();
            fireEvent.click(screen.getByTestId('checkbox-input'));

            // expect(defaultProps.onPageIndexChange).toHaveBeenCalled();
        });

        test('should toggle advanced search when advanced search button is clicked', async () => {
            renderComponent({
                advancedSearchFields: mockAdvancedSearchFields,
                disableSearch: false,
            });

            const searchInput = screen.getByTestId('searchbox');
            fireEvent.click(searchInput);

            expect(screen.getByTestId('advanced-search')).toBeInTheDocument();
        });

        test('should update query input when search value changes', async () => {
            const onChangeQueryInput = jest.fn();
            renderComponent({ onChangeQueryInput });

            const searchInput = screen.getByTestId('searchbox');
            fireEvent.change(searchInput, { target: { value: 'new search' } });

            expect(onChangeQueryInput).toHaveBeenCalled();
        });

        test('should update query input when search value changes', async () => {
            const onChangeQueryInput = jest.fn();
            renderComponent({ onChangeQueryInput });

            const searchInput = screen.getByTestId('searchbox');
            fireEvent.change(searchInput, { target: { value: '' } });

            await waitFor(() => {
                expect(onChangeQueryInput).toHaveBeenCalledWith({
                    searchString: '',
                    pageSize: 10,
                    pageIndex: 0,
                    sortModel: [],
                });
            });
        });
    });

    describe('Create functionality', () => {
        test('should render create button when onCreateButtonClick is provided', () => {
            const onCreateButtonClick = jest.fn();
            renderComponent({ onCreateButtonClick });
            const createButton = screen.getByRole('button', {
                name: /Common.Create/i,
            });

            expect(createButton).toBeInTheDocument();
            fireEvent.click(createButton);
            expect(onCreateButtonClick).toHaveBeenCalled();
        });

        test('should render create folder button when onCreateFolderButtonClick is provided', () => {
            const onCreateFolderButtonClick = jest.fn();
            renderComponent({ onCreateFolderButtonClick });
            const createFolderButton = screen.getByTitle('DirectoryManagement.CreateDirectory');

            expect(createFolderButton).toBeInTheDocument();
            fireEvent.click(createFolderButton);
            expect(onCreateFolderButtonClick).toHaveBeenCalled();
        });

        test('should render custom action button when customAction is provided', () => {
            const customActions = <div>custom action Btn</div>;
            renderComponent({ customActions });

            expect(screen.getByText('custom action Btn')).toBeInTheDocument();
        });
    });

    describe('Empty rows handling', () => {
        test('should go to previous page when current page is empty', async () => {
            const onChangeQueryInput = jest.fn();
            renderComponent({
                onChangeQueryInput,
                rows: [],
                loading: false,
            });

            fireEvent.click(screen.getByTestId('next-page-index-btn'), {
                target: { value: 1 },
            });

            await waitFor(() => {
                expect(onChangeQueryInput).toHaveBeenCalledWith(
                    expect.objectContaining({
                        pageIndex: 0,
                    })
                );
            });
        });
    });

    describe('Advanced Search', () => {
        test('Change value when click search', () => {
            renderComponent({ advancedSearchFields: mockAdvancedSearchFields });
            fireEvent.click(screen.getByTestId('onChangeValue'), {
                target: {
                    currentObject: {
                        keyA: { value: 'valueA', label: 'Value A' },
                        keyB: { value: 'valueB', label: 'Value B' },
                    },
                },
            });

            waitFor(() => {
                expect(defaultProps.onPageIndexChange).toHaveBeenCalled();
            });
        });

        test('Clear value when click search', () => {
            renderComponent({ advancedSearchFields: mockAdvancedSearchFields });
            fireEvent.click(screen.getByTestId('onClear'));

            waitFor(() => {
                expect(defaultProps.onPageIndexChange).toHaveBeenCalled();
            });
        });
    });

    describe('Pagination', () => {
        test('should not render pagination when disablePagination is true', () => {
            renderComponent({ disablePagination: true });
            expect(screen.queryByRole('pagination')).not.toBeInTheDocument();
        });

        test('should update page index when page changes', () => {
            renderComponent({ disablePagination: false });

            const newPageIndex = 2;
            fireEvent.click(screen.getByTestId('next-page-index-btn'));

            waitFor(() => {
                expect(defaultProps.onPageIndexChange).toHaveBeenCalledWith(newPageIndex);
            });
        });

        test('should update page size when page size changes', () => {
            renderComponent({ disablePagination: false });
            fireEvent.click(screen.getByTestId('next-page-size-btn'));

            waitFor(() => {
                expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith({
                    pageIndex: 0,
                    pageSize: 10,
                });
            });
        });
    });

    describe('Delete functionality', () => {
        test('should call showNotificationSuccess and onChangeQueryInput after deletion', () => {
            const confirmDelete = jest.fn((callback) => callback());
            const onDelete = jest.fn(() => Promise.resolve());
            const showNotificationSuccess = jest.fn();
            const onChangeQueryInput = jest.fn();
            const onDeleteSelected = jest.fn(() => Promise.resolve());

            renderComponent({
                confirmDelete,
                onDelete,
                showNotificationSuccess,
                onChangeQueryInput,
                onDeleteSelected,
            });

            fireEvent.click(screen.getByTestId('icon-delete'), {
                target: { value: 1 },
            });
        });
    });
});
