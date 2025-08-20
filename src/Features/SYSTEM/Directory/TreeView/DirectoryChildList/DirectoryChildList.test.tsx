import { render, screen } from '@testing-library/react';
import DirectoryChildList, { OwnProps } from './DirectoryChildList';

const initProps: OwnProps = {
    directoriesQuery: {
        items: [],
        totalCount: 0,
    },
    handleChangePage: jest.fn(),
    handleChangeRowsPerPage: jest.fn(),
    pageSize: 10,
    pageIndex: 0,
};
const getRender = (props?: Partial<OwnProps>) => {
    render(<DirectoryChildList {...initProps} {...props} />);
};

// Mock
jest.mock('react-router', () => ({
    Link: (props: any) => <a>{props?.children}</a>,
}));

jest.mock('@mui/icons-material', () => ({
    FolderOpen: () => <div data-testid="Icon-FolderOpen">FolderOpen</div>,
    InsertDriveFile: () => <div data-testid="Icon-InsertDriveFile">InsertDriveFile</div>,
    Settings: () => <div data-testid="Icon-Settings">Settings</div>,
}));

jest.mock('AWING', () => ({
    NoData: () => <div data-testid="AWING-NoData">NoData</div>,
    Pagination: () => <div data-testid="AWING-Pagination">Pagination</div>,
}));

jest.mock('../../components/PaperTemplate', () => ({
    __esModule: true,
    default: (props: any) => (
        <div>
            <p data-testid="PaperTemplate-header">PaperTemplate</p>
            {props?.children}
        </div>
    ),
}));

describe('Render', () => {
    test('should show notice when item is empty', () => {
        getRender();
        expect(screen.getByText('NoData')).toBeInTheDocument();
    });

    test('should render', () => {
        getRender({
            directoriesQuery: {
                items: [
                    {
                        id: 1,
                        name: 'demo 1',
                        isFile: false,
                    },
                    {
                        id: 2,
                        name: 'demo 2',
                        isFile: true,
                    },
                ],
                totalCount: 1,
            },
        });
        expect(screen.getByText('demo 1')).toBeInTheDocument();
        expect(screen.getByText('demo 2')).toBeInTheDocument();
    });
});
