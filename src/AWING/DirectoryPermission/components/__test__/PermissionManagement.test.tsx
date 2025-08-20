import { render, screen } from '@testing-library/react';
import PermissionManagement, { type OwnProps } from '../PermissionManagement';

// #region Render
const initProps: OwnProps = {
    headCells: [],
    isLoading: false,
    onDeletePermission: jest.fn(),
    openEditPermission: jest.fn(),
    permissions: [],
};
const getRender = (props?: Partial<OwnProps>) => {
    render(<PermissionManagement {...initProps} {...props} />);
};
// #endregion

// #region Mock
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Table: (props: any) => (
        <div>
            <p data-testid="Material-Table-header">Material Table</p>
            <p data-testid={`Table-theme`}>
                {props?.sx({ palette: { background: { default: 'gray' } }, spacing: () => '18px' }).paddingLeft}
            </p>
            {props?.children}
        </div>
    ),
}));

jest.mock('AWING', () => ({
    CircularProgress: () => <p data-testid="CircularProgress-header">CircularProgress</p>,
    NoData: () => <p data-testid="NoData-header">NoData</p>,
}));

jest.mock('../ViewPermission', () => ({
    __esModule: true,
    default: (props: any) => {
        return (
            <div>
                <p data-testid={`ViewPermission-header-${props?.permission?.permission}`}>ViewPermission</p>
                <button data-testid={`ViewPermission-onEdit-${props?.permission?.permission}`} onClick={props?.onEdit} />
                <button data-testid={`ViewPermission-onDelete-${props?.permission?.permission}`} onClick={props?.onDelete} />
            </div>
        );
    },
}));
// #endregion

describe('render', () => {
    it('should render', () => {
        getRender();

        expect(screen.getByTestId('Material-Table-header')).toBeInTheDocument();
    });

    it('should render nodata', () => {
        getRender();
        expect(screen.getByTestId('NoData-header')).toBeInTheDocument();
    });

    it('should render nodata', () => {
        getRender({
            isLoading: true,
        });
        expect(screen.getByTestId('CircularProgress-header')).toBeInTheDocument();
    });

    it('should render ViewPermission', () => {
        getRender({
            isLoading: false,
            permissions: [
                {
                    permission: 1,
                },
                {
                    permission: 2,
                },
            ],
        });
        expect(screen.getByTestId('ViewPermission-header-1')).toBeInTheDocument();
    });
});
