import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Container, { type OwnProps } from '..';

const initProps: OwnProps = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    permission: {
        permission: 1,
    },
    index: 0,
};
const getRender = (props?: Partial<OwnProps>) => {
    return render(<Container {...initProps} {...props} />);
};

// #region Mocks
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    TableRow: (props: any) => (
        <div>
            <p data-testid="TableRow-header">TableRow</p>
            <p data-testid={`TableRow-theme`}>{props?.sx({ spacing: () => '8px' }).padding}</p>
            <button data-testid="TableRow-onClick" onClick={props?.onClick} />
            {props?.children}
        </div>
    ),
}));

jest.mock('@mui/icons-material', () => ({
    ...jest.requireActual('@mui/icons-material'),
    Close: (props: any) => (
        <div>
            <p data-testid="Icon-Close" />
            <button data-testid="Icon-Close-onClick" onClick={(e: any) => props?.onClick(e, e.target.permisison)} />
        </div>
    ),
    Person: () => <p data-testid="Icon-Person" />,
    People: () => <p data-testid="Icon-People" />,
    ManageAccounts: () => <p data-testid="Icon-ManageAccounts" />,
    CallSplit: (props: any) => (
        <div>
            <p data-testid="Icon-CallSplit" />,
            <button data-testid="Icon-CallSplit-onClick" onClick={props?.onClick} />
        </div>
    ),
    ArrowRightAlt: () => <p data-testid="Icon-ArrowRightAlt" />,
}));

jest.mock('../Styled', () => ({
    StyledTableCell: (props: any) => (
        <div>
            <p data-testid="StyledTableCell-header">StyledTableCell</p>
            {props?.children}
        </div>
    ),
    StyledCheck: () => (
        <div>
            <p data-testid="StyledCheck-header">StyledCheck</p>
        </div>
    ),
}));
// #endregion

describe('render', () => {
    it('should render', () => {
        getRender();
        expect(screen.getByTestId('TableRow-header'));
    });

    it('should render icon authen USER', () => {
        getRender({
            permission: {
                permission: 1,
                authenType: 'USER',
            },
        });
        expect(screen.getByTestId('Icon-Person'));
    });

    it('should render icon authen GROUP', () => {
        getRender({
            permission: {
                permission: 1,
                authenType: 'GROUP',
            },
        });
        expect(screen.getByTestId('Icon-People'));
    });

    it('should render icon authen GROUP', () => {
        getRender({
            permission: {
                permission: 1,
                authenType: 'ROLE',
            },
        });
        expect(screen.getByTestId('Icon-ManageAccounts'));
    });

    it('should render permission CONTROL', () => {
        getRender({
            permission: {
                permission: 31,
            },
        });
        expect(screen.getAllByTestId('StyledCheck-header'));
    });

    it('should render permission canDelete', () => {
        getRender({
            permission: {
                permission: 31,
                canDelete: true,
            },
        });
        expect(screen.getByTestId('Icon-Close'));
    });

    it('should render permission matrices ', () => {
        getRender({
            permission: {
                matrices: [
                    {
                        id: 2,
                        stateStart: '100',
                    },
                ],
                permission: 31,
            },
        });
        expect(screen.getByTestId('Icon-CallSplit'));
    });
});

describe('Actions', () => {
    it('should call onClick', () => {
        const mockOnEdit = jest.fn();
        getRender({
            onEdit: mockOnEdit,
        });
        fireEvent.click(screen.getByTestId('TableRow-onClick'));
        expect(mockOnEdit).toHaveBeenCalled();
    });

    it('should call stopPropagation with permission matrices', () => {
        const mockStopPropagation = jest.fn();
        getRender({
            permission: {
                matrices: [
                    {
                        id: 2,
                        stateStart: '100',
                    },
                ],
                permission: 31,
            },
        });
        fireEvent.click(screen.getByTestId('Icon-CallSplit-onClick'), {
            stopPropagation: mockStopPropagation,
        });
        waitFor(() => {
            expect(mockStopPropagation).toHaveBeenCalled();
        });
    });

    it('should render permission canDelete', () => {
        const mockStopPropagation = jest.fn();
        getRender({
            permission: {
                permission: 31,
                canDelete: true,
                matrices: [
                    {
                        id: 2,
                        stateStart: '100',
                    },
                ],
            },
        });

        fireEvent.click(screen.getByTestId('Icon-Close-onClick'), {
            target: { permisison: { permission: 1 } },
            stopPropagation: mockStopPropagation,
        });
        waitFor(() => {
            expect(mockStopPropagation).toHaveBeenCalled();
        });
    });
});
