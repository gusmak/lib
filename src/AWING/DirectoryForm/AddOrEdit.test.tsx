import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router';
import { AppProvider } from 'Utils';
import AddOrEdit from './AddOrEdit';
import { DirectoryProps } from '.';

const mockGetDirectoryById = jest.fn();
const mockCreateDirectory = jest.fn();
const mockUpdateDirectory = jest.fn();

const initProps: DirectoryProps = {
    getDirectoryById: mockGetDirectoryById,
    createDirectory: mockCreateDirectory,
    updateDirectory: mockUpdateDirectory,
    isCreate: true,
    onUpdateDirectories: () => {},
    onDrawerClose: () => {},
};
const Component = (props?: DirectoryProps) => {
    return (
        <AppProvider>
            <AddOrEdit {...initProps} {...props} />
        </AppProvider>
    );
};

const getRender = (props?: DirectoryProps) => {
    render(<Component {...initProps} {...props} />);
};

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));

// #region mock DataForm
const mockDataFormOnUpdate = jest.fn();
jest.mock('AWING', () => ({
    CircularProgress: () => <p data-testid="CircularProgress-header">CircularProgress</p>,
    DataForm: (props: any) => {
        const { onUpdate = mockDataFormOnUpdate } = props;
        return (
            <div>
                <p data-testid="DataForm-header">DataForm</p>
                <p data-testid="DataForm-fields">
                    {props.fields.map((f: any) => (
                        <p data-testid={`DataForm-field-${f?.fieldName}`}>{f?.value}</p>
                    ))}
                </p>
                <p data-testid="DataForm-oldValue-name">{props.oldValue?.name}</p>
                <textarea data-testid="DataForm-fields">{JSON.stringify(props.fields)}</textarea>
                <button
                    data-testid="DataForm-onUpdate"
                    onClick={(e: any) => onUpdate(e.target.obj, e.target.valid, e.target.fieldUpdate)}
                />
            </div>
        );
    },
}));
// #endregion

// #region mock ClassicDrawer
jest.mock('Commons/Components', () => ({
    ClassicDrawer: (props: any) => {
        return (
            <div>
                <p data-testid="ClassicDrawer-header">ClassicDrawer</p>
                <p data-testid="ClassicDrawer-title">{props.title}</p>
                <p data-testid="ClassicDrawer-disableButtonSubmit">{props.disableButtonSubmit ? 'disabled' : 'non-disable'}</p>
                <button data-testid="ClassicDrawer-onSubmit" onClick={props.onSubmit} />
                <button data-testid="ClassicDrawer-onClose" onClick={props.onClose} />
                {props.children}
            </div>
        );
    },
}));
// #endregion

beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });
    (mockGetDirectoryById as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Root Directory',
        description: 'This is root directory',
        directoryPath: '',
        isSystem: false,
        level: 1,
        order: 1,
        parentObjectId: 0,
    });
    (mockCreateDirectory as jest.Mock).mockResolvedValue({});
    (mockUpdateDirectory as jest.Mock).mockResolvedValue({});
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Render', () => {
    it('should show CircularProgress', () => {
        getRender();
        expect(screen.getByText('CircularProgress')).toBeInTheDocument();
    });

    it('should show create title', () => {
        getRender();
        expect(screen.getByText('DirectoryManagement.CreateDirectory')).toBeInTheDocument();
    });

    it('should show edit title', async () => {
        getRender({
            ...initProps,
            isCreate: false,
        });
        expect(screen.getByText('DirectoryManagement.EditDirectory')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByTestId('DataForm-oldValue-name')).toHaveTextContent('Root Directory');
        });
    });

    it('should show default value', async () => {
        (mockGetDirectoryById as jest.Mock).mockResolvedValue({
            id: 1,
            name: undefined,
            description: undefined,
            directoryPath: '',
            isSystem: false,
            level: 1,
            order: undefined,
            parentObjectId: 0,
        });
        getRender({
            ...initProps,
            isCreate: false,
        });

        await waitFor(() => {
            expect(screen.getByTestId('DataForm-field-name')).toHaveTextContent('');
        });
    });
});

describe('Actions', () => {
    it('should call ClassicDrawer onClose', () => {
        const mockOnDrawerClose = jest.fn();
        getRender({
            ...initProps,
            onDrawerClose: mockOnDrawerClose,
        });

        fireEvent.click(screen.getByTestId('ClassicDrawer-onClose'));

        expect(mockOnDrawerClose).toHaveBeenCalled();
    });

    it('should call ClassicDrawer create onSubmit', () => {
        getRender();
        screen.getByTestId('ClassicDrawer-onSubmit').click();
        expect(mockCreateDirectory).toHaveBeenCalled();
    });

    it('should call ClassicDrawer edit onSubmit', () => {
        getRender({
            ...initProps,
            isCreate: false,
        });
        screen.getByTestId('ClassicDrawer-onSubmit').click();
        expect(mockUpdateDirectory).toHaveBeenCalled();
    });

    it('should check disableButtonSubmit when DataForm onUpdate of Create ', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        getRender();

        await waitFor(() => {
            fireEvent.click(screen.getByTestId('DataForm-onUpdate'), {
                target: {
                    obj: {
                        name: 'Test',
                        description: 'Test description',
                        order: 1,
                    },
                    valid: true,
                    fieldUpdate: {},
                },
            });
            expect(screen.getByTestId('ClassicDrawer-disableButtonSubmit')).toHaveTextContent('non-disable');
        });
    });

    it('should check disableButtonSubmit when DataForm onUpdate of Edit', async () => {
        (useParams as jest.Mock).mockReturnValue({ id: '1' });
        getRender({
            ...initProps,
            isCreate: false,
        });

        await waitFor(() => {
            fireEvent.click(screen.getByTestId('DataForm-onUpdate'), {
                target: {
                    obj: {
                        name: 'Test',
                        description: 'Test description',
                        order: 1,
                    },
                    valid: true,
                    fieldUpdate: {},
                },
            });
            expect(screen.getByTestId('ClassicDrawer-disableButtonSubmit')).toHaveTextContent('disable');
        });
    });
});
