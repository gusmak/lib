import { fireEvent, render, screen } from '@testing-library/react';
import AddOrEditHeader from '../AddOrEditHeader';

const getRender = (props?: any) => {
    return render(<AddOrEditHeader {...props} />);
};

// #region Mock
jest.mock('react-router', () => ({
    Link: (props: any) => <a>{props?.children}</a>,
}));

jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    Button: (props: any) => (
        <div>
            <button data-testid="Button-onClick" onClick={props?.onClick} />
            <p data-testid={`Button-theme`}>
                {props?.sx({ palette: { action: { hover: 'green' }, secondary: { main: 'red' }, text: { primary: 'blue' } } }).paddingLeft}
            </p>
            {props?.children}
        </div>
    ),
    Chip: (props: any) => (
        <div>
            <p data-testid="Chip-header">Chip</p>
            <button data-testid="Chip-onDelete" onClick={props?.onDelete} />
            <p data-testid={`Chip-theme`}>{props?.sx({ palette: { action: { hover: 'green' } } }).paddingLeft}</p>
            {props?.children}
        </div>
    ),
}));
// #endregion

describe('render', () => {
    it('should render', () => {
        getRender({
            authenPermissions: [{ authenType: 'USER', authenValue: 1, name: 'demo' }],
        });
        expect(screen.getByText('DirectoryManagement.Edit.USER')).toBeInTheDocument();
    });

    it('should render isCreate', () => {
        getRender({
            isCreate: true,
        });
        expect(screen.getByText('DirectoryManagement.AddAuthen')).toBeInTheDocument();
    });

    it('should render Chip', () => {
        getRender({
            isCreate: true,
            authenPermissions: [{ authenType: 'USER', authenValue: 1, name: 'demo' }],
        });
        expect(screen.getByTestId('Chip-header')).toBeInTheDocument();
    });
});

describe('Actions', () => {
    it('should call Button onClick', () => {
        const mockOnDrawerLevelChange = jest.fn();
        getRender({
            isCreate: true,
            onDrawerLevelChange: mockOnDrawerLevelChange,
        });
        fireEvent.click(screen.getByTestId('Button-onClick'));
        expect(mockOnDrawerLevelChange).toHaveBeenCalled();
    });

    it('should call Chip onDelete', () => {
        const mockOnDeleteAuthen = jest.fn();
        render(
            <AddOrEditHeader
                isCreate
                authenPermissions={[{ authenType: 'USER', authenValue: 1, name: 'demo' }]}
                onDeleteAuthen={mockOnDeleteAuthen}
            />
        );
        getRender({
            isCreate: true,
            authenPermissions: [{ authenType: 'USER', authenValue: 1, name: 'demo' }],
            onDrawerLevelChange: mockOnDeleteAuthen,
        });

        fireEvent.click(screen.getAllByTestId('Chip-onDelete')[0]);
        expect(mockOnDeleteAuthen).toHaveBeenCalled();
    });
});
