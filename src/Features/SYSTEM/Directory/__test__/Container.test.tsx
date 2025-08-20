import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import { MemoryRouter } from 'react-router';
import Container from '../Container';
import { useAppHelper } from 'Context';
import { useGetDirectoryContext } from '../context';
import { OwnProps as TreeViewProps } from '../TreeView/Container';
import { DirectoryProps } from 'AWING/DirectoryForm/types';
import { OwnProps as DirectoryChildListProps } from '../TreeView/DirectoryChildList';

jest.mock('Context');
jest.mock('../context');

jest.mock('../TreeView', () => ({
    __esModule: true,
    default: (props: TreeViewProps) => {
        return (
            <div>
                <textarea data-testid="TreeView-loading">{props.loading ? 'loading' : ''}</textarea>
                <button
                    data-testid="TreeView-onDirectoryOpen"
                    onClick={() => {
                        if (props.onDirectoryOpen) props.onDirectoryOpen(1);
                    }}
                />
                <button
                    data-testid="TreeView-onTreeItemClick"
                    onClick={() => {
                        props.onTreeItemClick(1);
                    }}
                />
                <button
                    data-testid="TreeView-deleteDirectory"
                    onClick={() => {
                        if (props.deleteDirectory) props.deleteDirectory({ id: 1 });
                    }}
                />
                <div>{props.childDirectories}</div>
            </div>
        );
    },
}));

jest.mock('../TreeView/DirectoryChildList', () => ({
    __esModule: true,
    default: (props: DirectoryChildListProps) => {
        return (
            <div>
                <textarea data-testid="TreeView-pageSize">{props.pageSize}</textarea>
                <textarea data-testid="TreeView-pageIndex">{props.pageIndex}</textarea>
                <button data-testid="TreeView-handleChangePage" onClick={(e) => props.handleChangePage(e, 1)} />
                <input data-testid="TreeView-handleChangeRowsPerPage" onChange={(e) => props.handleChangeRowsPerPage(e)} />
            </div>
        );
    },
}));

jest.mock('AWING', () => ({
    __esModule: true,
    Directory: (props: DirectoryProps) => {
        return (
            <div>
                <textarea data-testid="Directory-isCreate">{props.isCreate ? 'isCreate' : ''}</textarea>
                <button data-testid="Directory-createDirectory" onClick={() => props.createDirectory({ input: {} })} />
                <button data-testid="Directory-getDirectoryById" onClick={() => props.getDirectoryById({ id: 1 })} />
                <button data-testid="Directory-updateDirectory" onClick={() => props.updateDirectory({ id: 1, input: {} })} />
                <button data-testid="Directory-onUpdateDirectories" onClick={() => props.onUpdateDirectories(1)} />
            </div>
        );
    },
    CircularProgress: () => <textarea data-testid="CircularProgress" />,
}));

const mockUseAppHelper = useAppHelper as jest.MockedFunction<typeof useAppHelper>;
const mockUseGetDirectoryContext = useGetDirectoryContext as jest.MockedFunction<typeof useGetDirectoryContext>;

describe('Container', () => {
    beforeEach(() => {
        mockUseAppHelper.mockReturnValue({
            confirm: jest.fn(
                (okFunction?: () => void, _cancelFunction?: () => void, _message?: string, _title?: string) => okFunction && okFunction()
            ),
            snackbar: jest.fn(),
            alert: jest.fn(),
        });

        mockUseGetDirectoryContext.mockReturnValue({
            currentWorkspace: { id: 1 },
            services: {
                getDirectories: jest.fn().mockResolvedValue({
                    items: [],
                    total: 0,
                }),
                deleteDirectory: jest.fn().mockResolvedValue({}),
                createDirectory: jest.fn(),
                getDirectoryById: jest.fn(),
                updateDirectory: jest.fn(),

                deleteDirectoryPermission: jest.fn(),
                addDirectoryPermission: jest.fn(),
                getUsers: jest.fn(),
                getRoles: jest.fn(),
                getGroups: jest.fn(),
                getObjectDefinitions: jest.fn(),
                getSchemas: jest.fn(),
                getSchemaById: jest.fn(),
                createSchema: jest.fn(),
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <Provider>
                <MemoryRouter>
                    <Container />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('fetches directories on workspace change', async () => {
        render(
            <Provider>
                <MemoryRouter>
                    <Container />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(mockUseGetDirectoryContext().services?.getDirectories).toHaveBeenCalled();
        });
    });

    it('handles directory open', async () => {
        render(
            <Provider>
                <MemoryRouter>
                    <Container />
                </MemoryRouter>
            </Provider>
        );

        const directoryTreeView = screen.getByTestId('TreeView-onDirectoryOpen');
        fireEvent.click(directoryTreeView);

        await waitFor(() => {
            expect(mockUseGetDirectoryContext().services?.getDirectories).toHaveBeenCalled();
        });
    });

    it('handles delete directory', async () => {
        render(
            <Provider>
                <MemoryRouter>
                    <Container />
                </MemoryRouter>
            </Provider>
        );

        const deleteButton = screen.getByTestId('TreeView-deleteDirectory');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockUseGetDirectoryContext().services?.deleteDirectory).toHaveBeenCalled();
            expect(mockUseAppHelper().snackbar).toHaveBeenCalledWith('success');
        });
    });

    it('handles tree item click', async () => {
        render(
            <Provider>
                <MemoryRouter>
                    <Container />
                </MemoryRouter>
            </Provider>
        );

        const treeItem = screen.getByTestId('TreeView-onTreeItemClick');
        fireEvent.click(treeItem);

        await waitFor(() => {
            expect(mockUseGetDirectoryContext().services?.getDirectories).toHaveBeenCalled();
        });
    });

    it('handles page change', async () => {
        render(
            <Provider>
                <MemoryRouter>
                    <Container />
                </MemoryRouter>
            </Provider>
        );

        const changePageButton = screen.getByTestId('TreeView-handleChangePage');
        fireEvent.click(changePageButton);

        await waitFor(() => {
            expect(mockUseGetDirectoryContext().services?.getDirectories).toHaveBeenCalled();
        });
    });

    it('handles rows per page change', async () => {
        render(
            <Provider>
                <MemoryRouter>
                    <Container />
                </MemoryRouter>
            </Provider>
        );

        const rowsPerPageInput = screen.getByTestId('TreeView-handleChangeRowsPerPage');
        fireEvent.change(rowsPerPageInput, { target: { value: '10' } });

        await waitFor(() => {
            expect(mockUseGetDirectoryContext().services?.getDirectories).toHaveBeenCalled();
        });
    });
});
