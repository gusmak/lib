import { render, screen } from '@testing-library/react';
import DirectoryChildRow, { type OwnProps } from './DirectoryChildRow';

const getRender = (props?: Partial<OwnProps>) => {
    render(<DirectoryChildRow directory={{ id: 1, name: 'demo 1', isFile: false }} {...props} />);
};

// Mock
jest.mock('react-router', () => ({
    Link: (props: any) => <a>{props?.children}</a>,
}));

jest.mock('@mui/icons-material', () => ({
    FolderOpen: () => <div data-testid="Icon-FolderOpen" />,
    InsertDriveFile: () => <div data-testid="Icon-InsertDriveFile" />,
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    TableRow: (props: any) => (
        <div data-testid="TableRow">
            <button onClick={() => props?.onMouseEnter()} />
            <button onClick={() => props?.onMouseLeave()} />
        </div>
    ),
    TableCell: (props: any) => (
        <div data-testid="TableCell">
            {/* {props?.sx({ padding: { spacing: '3' } })} */}
            {props?.sx({ spacing: () => '8px' }).padding}
            {/* <p data-testid={`TableRow-theme`}>{props?.sx({ spacing: () => '8px' }).padding}</p> */}
            {props?.children}
        </div>
    ),
}));

jest.mock('../../components/DirectoryAction', () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="DirectoryAction">
            <button onClick={() => props?.deleteDirectory()} />
        </div>
    ),
}));

describe('Render', () => {
    test('should render', () => {
        getRender();
        expect(screen.getByTestId('TableRow')).toBeInTheDocument();
    });
});
